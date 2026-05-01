-- Add RPC for incrementing view count atomically
CREATE OR REPLACE FUNCTION increment_view_count(inv_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.invitations
  SET view_count = view_count + 1
  WHERE id = inv_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
