ALTER TABLE t_p13384267_food_delivery_site_1.leads ADD COLUMN IF NOT EXISTS ip text;
CREATE INDEX IF NOT EXISTS leads_ip_created_idx ON t_p13384267_food_delivery_site_1.leads (ip, created_at DESC);