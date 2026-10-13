CREATE TABLE public.page_events (
  id bigserial PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  visit_id text NOT NULL,
  event text NOT NULL,
  variant_id text NOT NULL DEFAULT 'control',
  device text NOT NULL DEFAULT 'desktop',
  source text NOT NULL DEFAULT 'direct',
  placement text,
  CONSTRAINT ev_ok CHECK (event IN ('page_view','cta_click','age_group_selected','scroll_50','scroll_90','affiliate_outbound_click')),
  CONSTRAINT dev_ok CHECK (device IN ('mobile','desktop')),
  CONSTRAINT len_ok CHECK (length(visit_id) <= 40 AND length(variant_id) <= 40 AND length(source) <= 64 AND (placement IS NULL OR length(placement) <= 40))
);
GRANT INSERT ON public.page_events TO anon, authenticated;
GRANT USAGE ON SEQUENCE public.page_events_id_seq TO anon, authenticated;
GRANT ALL ON public.page_events TO service_role;
GRANT ALL ON SEQUENCE public.page_events_id_seq TO service_role;
ALTER TABLE public.page_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can record events" ON public.page_events FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE INDEX page_events_created_idx ON public.page_events (created_at);