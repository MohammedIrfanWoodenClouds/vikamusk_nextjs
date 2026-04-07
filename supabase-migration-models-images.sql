-- ============================================
-- Migration: Expand product_models table
-- Run this in the Supabase SQL Editor
-- ============================================

-- Add images column (multiple images per model)
ALTER TABLE product_models ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]';

-- Add short description
ALTER TABLE product_models ADD COLUMN IF NOT EXISTS short_description TEXT DEFAULT '';

-- Add features list (JSON array of strings)
ALTER TABLE product_models ADD COLUMN IF NOT EXISTS features TEXT DEFAULT '[]';
