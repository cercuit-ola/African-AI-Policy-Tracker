
CREATE TABLE public.policies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  country TEXT NOT NULL,
  flag TEXT,
  region TEXT,
  type TEXT CHECK (type IN ('legislation','regulation','framework','policy','treaty')),
  status TEXT CHECK (status IN ('enacted','review','draft','proposed','withdrawn')),
  summary TEXT,
  source_url TEXT,
  published_at DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view policies" ON public.policies FOR SELECT USING (true);

CREATE INDEX idx_policies_type ON public.policies(type);
CREATE INDEX idx_policies_status ON public.policies(status);
CREATE INDEX idx_policies_country ON public.policies(country);
CREATE INDEX idx_policies_date ON public.policies(published_at DESC);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_policies_updated_at
  BEFORE UPDATE ON public.policies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
