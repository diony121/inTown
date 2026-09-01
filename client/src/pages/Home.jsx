import { useState, useEffect } from "react";
import { getEvents, getCategories } from "../api/events";
import EventCard from "../Components/EventCard";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    async function fetchData() {
      const [eventData, categoryData] = await Promise.all([
        getEvents(),
        getCategories(),
      ]);
      setEvents(eventData);
      setCategories(categoryData);
    }
    fetchData();
  }, []);

  const filteredEvents = selectedCategory
    ? events.filter((event) =>
        event.categories?.includes(selectedCategory)
      )
    : events;

  return (
    <div className="homepage">
      <h2>Welcome to <strong>inTown</strong> events</h2>
      <h3>Because there's always something happening.</h3>

      <div className="category-filter">
        <button
          className={selectedCategory === "" ? "active" : ""}
          onClick={() => setSelectedCategory("")}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={selectedCategory === cat.name ? "active" : ""}
            onClick={() => setSelectedCategory(cat.name)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="events-grid">
        {filteredEvents.length === 0 ? (
          <p>No events found for this category.</p>
        ) : (
          filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))
        )}
      </div>
    </div>
  );
}