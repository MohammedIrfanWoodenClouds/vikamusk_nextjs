-- ============================================================
-- Vikamusk Website — Initial Schema
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- ----------------------------
-- main_categories
-- ----------------------------
create table if not exists main_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  image       text,
  sort_order  integer not null default 0,
  created_at  timestamptz default now()
);

-- ----------------------------
-- sub_categories
-- ----------------------------
create table if not exists sub_categories (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  slug             text not null unique,
  description      text,
  main_category_id uuid references main_categories(id) on delete cascade,
  sort_order       integer not null default 0,
  created_at       timestamptz default now()
);

-- ----------------------------
-- products
-- ----------------------------
create table if not exists products (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  slug                text not null unique,
  main_category_id    uuid references main_categories(id) on delete cascade,
  sub_category_id     uuid references sub_categories(id) on delete set null,
  short_description   text,
  full_description    text,
  features            jsonb default '[]',
  specs               jsonb default '{}',
  image               text,
  featured            integer not null default 0,
  sort_order          integer not null default 0,
  created_at          timestamptz default now()
);

-- ----------------------------
-- product_models
-- ----------------------------
create table if not exists product_models (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid references products(id) on delete cascade,
  model_name  text not null,
  specs       jsonb default '[]',
  sort_order  integer not null default 0,
  created_at  timestamptz default now()
);

-- ----------------------------
-- career_postings
-- ----------------------------
create table if not exists career_postings (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  department   text,
  location     text,
  type         text default 'Full-time',
  description  text,
  requirements text,
  benefits     text,
  is_active    integer not null default 1,
  created_at   timestamptz default now()
);

-- ----------------------------
-- enquiries
-- ----------------------------
create table if not exists enquiries (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text,
  product    text,
  message    text,
  is_read    boolean not null default false,
  created_at timestamptz default now()
);

-- ============================================================
-- Row Level Security — disable for server-side anon key access
-- (Admin auth is handled by Next.js JWT, not Supabase Auth)
-- ============================================================
alter table main_categories  disable row level security;
alter table sub_categories   disable row level security;
alter table products         disable row level security;
alter table product_models   disable row level security;
alter table career_postings  disable row level security;
alter table enquiries        disable row level security;

-- Allow full access via anon/publishable key
grant all on main_categories  to anon, authenticated;
grant all on sub_categories   to anon, authenticated;
grant all on products         to anon, authenticated;
grant all on product_models   to anon, authenticated;
grant all on career_postings  to anon, authenticated;
grant all on enquiries        to anon, authenticated;
