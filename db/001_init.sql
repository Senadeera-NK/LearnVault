create table if not exists users (
    id uuid primary key default gen_random_uuid(),
    email varchar(255) unique not null,
    name varchar(255),
    password_hash varchar(255) not null,
    created_at timestamp with time zone default now()
);