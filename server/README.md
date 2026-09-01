# Server documentation here
Here's the API route documentation for **Local Events Hub**, following the same style as your example. All routes are prefixed with `/api`.

---

# API Routes

The 🔒 lock icon indicates a protected route. A valid JWT token must be sent in the `Authorization` header. If missing or invalid, the server responds with `401 Unauthorized`.

---

## /users router

### POST /users/register
- Sends `400` if the request body is missing any of `name`, `last_name`, `email`, or `password`.
- Hashes the password before storing it in the database.
- Creates a new user and returns the user object along with a JWT token (status `201`).

### POST /users/login
- Sends `400` if the request body is missing `email` or `password`.
- Sends a JWT token if the provided credentials are valid.
- Sends `401` if the email or password is incorrect.

### 🔒 GET /users/me
- Sends the profile of the currently authenticated user (`id`, `name`, `last_name`, `email`).

---

## /events router

### GET /events
- Sends an array of all upcoming events.
- Supports optional query parameters:
  - `category` – filter by category name
  - `date` – filter by event date
  - `is_free` – `true` or `false`
  - `location` – filter by location name or city
  - `search` – search event titles/descriptions
- Each event object includes basic information and its ticket types.

### GET /events/:id
- Sends `404` if the event does not exist.
- Sends the full event details: title, description, date, time, location, image URL, organizer, categories, and all ticket types (with prices and quantities).

### 🔒 POST /events
- Sends `400` if required fields are missing (`title`, `description`, `event_date`, `event_time`, `location_id`, `is_free`).
- Creates a new event with the authenticated user as the organizer.
- The request body may also include `image_url`, `category_ids` (array), and `ticket_types` (array of `{ name, price, quantity }`).
- Returns the created event with all relations (status `201`).

### 🔒 PUT /events/:id
- Sends `404` if the event does not exist.
- Sends `403` if the authenticated user is not the organizer of the event.
- Updates the event with the provided fields (same as create).
- Returns the updated event.

### 🔒 DELETE /events/:id
- Sends `404` if the event does not exist.
- Sends `403` if the authenticated user is not the organizer.
- Deletes the event and all related data (categories, ticket types, orders) via cascade.
- Sends `204 No Content`.

---

## /events/:eventId/ticket-types

### GET /events/:eventId/ticket-types
- Sends `404` if the event does not exist.
- Sends an array of ticket types for the specified event (`id`, `name`, `price`, `quantity`).  
  A `null` quantity means unlimited availability.

---

## /categories router

### GET /categories
- Sends an array of all event categories (`id`, `name`).

---

## /locations router

### GET /locations
- Sends an array of all locations (`id`, `name`, `address`, `city`, `state`, `zip`).

### 🔒 POST /locations
- Sends `400` if the request body is missing `name`, `city`, `state`, or `zip`.
- Creates a new location and returns it (status `201`).

---

## /orders router

### 🔒 POST /orders
- Sends `400` if the request body is missing `ticket_type_id` or `quantity`.
- Validates that enough tickets are available for the requested ticket type (unless quantity is `null`/unlimited).  
  Uses a database transaction to atomically check and deduct.
- Creates an order for the authenticated user, calculates `total_price`, and returns the order with status `201`.

### 🔒 GET /orders
- Sends an array of all orders made by the authenticated user.  
  Each order includes the event title, ticket type name, quantity, total price, status, and creation date.

### 🔒 GET /orders/:id
- Sends `404` if the order does not exist.
- Sends `403` if the authenticated user is not the owner of the order.
- Sends the full order details.

