-- Add description column to images table
ALTER TABLE images
ADD COLUMN description text;

-- Update RLS policies to include description
CREATE POLICY "Users can update their own images"
  ON images
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
