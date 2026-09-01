import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export async function createEvent(eventData, token) {
  const { data } = await axios.post(`${API}/events`, eventData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export const getEvents = async () => {
  const { data } = await axios.get(`${API}/events`);
  return data;
};

export async function getEventById(id) {
  const { data } = await axios.get(`${API}/events/${id}`);
  return data;
}

export async function updateEvent(id, eventData, token) {
  const { data } = await axios.put(`${API}/events/${id}`, eventData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export async function getTicketTypes(eventId) {
  const { data } = await axios.get(`${API}/events/${eventId}/ticket-types`);
  return data;
}

export async function deleteEvent(id, token) {
  await axios.delete(`${API}/events/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export async function getMyEvents(token) {
  const { data } = await axios.get(`${API}/events/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export async function rescheduleEvent(id, eventData, token) {
  const { data } = await axios.put(
    `${API}/events/${id}/reschedule`,
    eventData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
}

export async function getCategories() {
  const { data } = await axios.get(`${API}/categories`);
  return data;
}

