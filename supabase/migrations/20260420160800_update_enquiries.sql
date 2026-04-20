-- Migration: Update enquiries table with new fields from contact form and status flags
-- Author: Antigravity
-- Date: 2026-04-20

alter table enquiries 
add column if not exists company_name text,
add column if not exists location text,
add column if not exists subject text,
add column if not exists is_contacted boolean not null default false;
