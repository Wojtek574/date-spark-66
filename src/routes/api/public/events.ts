import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { classifyTraffic } from '@/lib/stats-model';

const inputSchema = z.object({ id: z.string().uuid(), visit: z.string().uuid(), event: z.enum(['page_view','cta_view','cta_click','age_group_selected','scroll_50','scroll_90','affiliate_outbound_click','engagement']), variant: z.string().regex(/^(control|headline-[012]|cta-[01]|profile-[01]|order-[01]|extra-[01])$/), source: z.string().max(64), medium: z.string().regex(/^[a-zA-Z0-9_-]{1,64}$/).nullable(), campaign: z.string().regex(/^[a-zA-Z0-9_-]{1,64}$/).nullable(), placement: z.string().regex(/^(?:[a-zA-Z0-9_-]{1,40}|18–29|30–44|45\+)$/).nullable(), active: z.number().int().min(0).max(7200000), webdriver: z.boolean(), token: z.string().max(3000).optional() });
type Claims = { visit: string; variant: string; source: string; medium: string | null; campaign: string | null; quality: string; device: string; browser: string; os: string; started: number };
async function sign(value: string, secret: string) { const key = await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{ name:'HMAC',hash:'SHA-256' },false,['sign']); return Array.from(new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(value)))).map(b=>b.toString(16).padStart(2,'0')).join(''); }
function same(a: string,b: string) { if(a.length!==b.length) return false; let d=0; for(let i=0;i<a.length;i++) d |= a.charCodeAt(i)^b.charCodeAt(i); return d===0; }
export const Route = createFileRoute('/api/public/events')({ server: { handlers: { POST: async ({ request }) => {
  const response = (body: object,status=200) => Response.json(body,{ status, headers:{ 'Cache-Control':'no-store' } });
  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin || Number(request.headers.get('content-length') ?? 0)>5000) return response({ ok:false },403);
  const text = await request.text(); if(text.length>5000) return response({ok:false},413);
  let json: unknown; try { json=JSON.parse(text); } catch { return response({ok:false},400); }
  const parsed=inputSchema.safeParse(json); if(!parsed.success) return response({ok:false},400);
  const d=parsed.data, secret=process.env['STATS_PASSWORD']; if(!secret) return response({ok:false},503);
  const ua=request.headers.get('user-agent') ?? '';
  let claims: Claims; let token=d.token;
  if(d.event==='page_view' && !token) {
    claims={ visit:d.visit,variant:d.variant,source:d.source.replace(/[^a-zA-Z0-9_.-]/g,'').slice(0,64)||'direct',medium:d.medium,campaign:d.campaign,quality:classifyTraffic(ua,new URL(origin).hostname,d.webdriver),device:/ipad|tablet/i.test(ua)?'tablet':/mobile|android|iphone/i.test(ua)?'mobile':'desktop',browser:/Edg\//.test(ua)?'Edge':/Firefox\//.test(ua)?'Firefox':/Chrome\//.test(ua)?'Chrome':/Safari\//.test(ua)?'Safari':'Inna',os:/Android/i.test(ua)?'Android':/iPhone|iPad/i.test(ua)?'iOS':/Windows/i.test(ua)?'Windows':/Macintosh/i.test(ua)?'macOS':/Linux/i.test(ua)?'Linux':'Inny',started:Date.now() };
    const body=btoa(JSON.stringify(claims)); token=`${body}.${await sign(body,secret)}`;
  } else {
    if(!token) return response({ok:false},403);
    const [body,signature]=token.split('.'); if(!body || !signature || !same(await sign(body,secret),signature)) return response({ok:false},403);
    try { claims=JSON.parse(atob(body)) as Claims; } catch { return response({ok:false},403); }
    if(claims.visit!==d.visit || Date.now()-claims.started>7200000 || Date.now()<claims.started) return response({ok:false},403);
  }
  if(d.active> Date.now()-claims.started+2000) return response({ok:false},400);
  const { supabaseAdmin }=await import('@/integrations/supabase/client.server');
  const { count,error:countError }=await supabaseAdmin.from('quality_page_events').select('id',{ count:'exact',head:true }).eq('visit_id',claims.visit);
  if(countError) return response({ok:false},503);
  if((count ?? 0)>=600) return response({ok:false},429);
  const { error }=await supabaseAdmin.from('quality_page_events').insert({ id:d.id, visit_id:claims.visit,event:d.event,variant_id:claims.variant,source:claims.source,medium:claims.medium,campaign:claims.campaign,quality:claims.quality,device:claims.device,browser:claims.browser,os:claims.os,placement:d.placement,active_ms:d.active });
  if(error && error.code!=='23505') return response({ok:false},503);
  return response({ok:true,token});
} } } });