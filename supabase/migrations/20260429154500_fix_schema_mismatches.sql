-- Migration: Fix schema mismatches for products and models
-- Author: Antigravity
-- Date: 2026-04-29

-- 1. Add featured column to main_categories
alter table main_categories 
add column if not exists featured integer not null default 0;

-- 2. Add brochure_url column to products
alter table products 
add column if not exists brochure_url text;

-- 3. Add missing columns to product_models
alter table product_models 
add column if not exists short_description text,
add column if not exists features jsonb default '[]',
add column if not exists images jsonb default '[]';
