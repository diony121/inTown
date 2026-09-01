DROP TABLE IF EXISTS
  orders,
  ticket_types,
  event_categories,
  events,
  categories,
  locations,
  users
CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE locations (
    id SERIAL PRIMARY KEY, 
    name TEXT NOT NULL,
    address TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip INT NOT NULL
);

CREATE TABLE events (
id SERIAL PRIMARY KEY,
title VARCHAR(150) NOT NULL,
description TEXT NOT NULL,
event_date DATE NOT NULL,
event_time TIME NOT NULL,
location_id INTEGER NOT NULL REFERENCES locations(id) ON DELETE SET NULL,
image_url TEXT,
organizer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
is_free BOOLEAN DEFAULT FALSE,
previous_event_date DATE,
previous_event_time TIME,
is_rescheduled BOOLEAN DEFAULT FALSE
);

CREATE TABLE categories (
id SERIAL PRIMARY KEY,
name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE event_categories (
event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
PRIMARY KEY (event_id, category_id)
);

CREATE TABLE ticket_types (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES events(id) on DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  quantity INTEGER CHECK (quantity >= 0),
  UNIQUE(event_id, name)
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  ticket_types_id INTEGER NOT NULL REFERENCES ticket_types(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK(quantity >= 0),
  total_price DECIMAL(10,2) NOT NULL CHECK(total_price >= 0),
  order_status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
