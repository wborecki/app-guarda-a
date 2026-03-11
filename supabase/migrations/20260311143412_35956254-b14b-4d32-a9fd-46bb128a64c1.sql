
-- The edge function inserts into risk_analyses using service role key, so no RLS policy needed for that.
-- But we need the config.toml entry for the function. This migration is just a placeholder.
-- Actually, let's ensure the risk_analyses insert policy exists for service_role (it bypasses RLS).
-- No migration needed - service role bypasses RLS.
SELECT 1;
