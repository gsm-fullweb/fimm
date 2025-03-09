/*
  # Create images table for storing image metadata

  1. New Tables
    - `images`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `location` (text, required)
      - `image_url` (text, required)
      - `status` (text, default: 'processing')
      - `created_at` (timestamp with timezone)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on `images` table
    - Add policies for authenticated users to:
      - Insert their own images
      - Read their own images
*/

CREATE TABLE IF NOT EXISTS images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  location text NOT NULL,
  image_url text NOT NULL,
  status text NOT NULL DEFAULT 'processing',
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

ALTER TABLE images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own images"
  ON images
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own images"
  ON images
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);