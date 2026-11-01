CREATE TABLE public.quality_page_events (
 id uuid PRIMARY KEY,
 created_at timestamptz NOT NULL DEFAULT now(),
 visit_id uuid NOT NULL,
 event text NOT NULL CHECK (event IN ('page_view','cta_view','cta_click','age_group_selected','scroll_50','scroll_90','affiliate_outbound_click','engagement')),
 variant_id text NOT NULL CHECK (length(variant_id) <= 40),
 device text NOT NULL CHECK (device IN ('mobile','desktop','tablet')),
 source text NOT NULL CHECK (length(source) <= 64),
 medium text CHECK (length(medium) <= 64),
 campaign text CHECK (length(campaign) <= 64),
 browser text NOT NULL CHECK (length(browser) <= 30),
 os text NOT NULL CHECK (length(os) <= 30),
 quality text NOT NULL CHECK (quality IN ('eligible','test','automation')),
 placement text CHECK (length(placement) <= 40),
 active_ms integer NOT NULL DEFAULT 0 CHECK (active_ms >= 0 AND active_ms <= 7200000)
);
GRANT ALL ON public.quality_page_events TO service_role;
ALTER TABLE public.quality_page_events ENABLE ROW LEVEL SECURITY;
CREATE INDEX quality_page_events_time_idx ON public.quality_page_events (created_at);
CREATE INDEX quality_page_events_visit_idx ON public.quality_page_events (visit_id);
CREATE UNIQUE INDEX quality_page_events_single_view ON public.quality_page_events (visit_id) WHERE event = 'page_view';
COMMENT ON TABLE public.page_events IS 'Legacy unverified analytics. Excluded from quality reports; retained for historical comparison only.';