CREATE TABLE public.experiment_decisions (
  experiment text NOT NULL PRIMARY KEY,
  variant_id text NOT NULL,
  decided_at timestamptz NOT NULL DEFAULT now(),
  evidence jsonb NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT experiment_decisions_variant_check CHECK (variant_id ~ '^(control|ctaplace-[0-3]|headline-[012]|cta-[01]|profile-[01]|order-[01]|extra-[01])$')
);
GRANT ALL ON public.experiment_decisions TO service_role;
ALTER TABLE public.experiment_decisions ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.experiment_variant_stats(since timestamptz)
RETURNS TABLE(variant_id text, visits bigint, outbound bigint)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT e.variant_id,
         count(DISTINCT e.visit_id) FILTER (WHERE e.event = 'page_view') AS visits,
         count(DISTINCT e.visit_id) FILTER (WHERE e.event = 'affiliate_outbound_click') AS outbound
  FROM public.quality_page_events e
  WHERE e.created_at >= since AND e.quality = 'eligible'
  GROUP BY e.variant_id;
$$;
REVOKE ALL ON FUNCTION public.experiment_variant_stats(timestamptz) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.experiment_variant_stats(timestamptz) TO service_role;
GRANT SELECT ON public.quality_page_events TO service_role;