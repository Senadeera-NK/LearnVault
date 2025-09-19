-- Enable Row Level Security (RLS)
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;

-- Drop existing policy (if already created before)
DROP POLICY IF EXISTS "Allow public all" ON "users";

-- Create new policy that allows everything
CREATE POLICY "Allow public all" ON "users"
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);
