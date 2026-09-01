import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export async function createLocation(locationData, token) {
  const { data } = await axios.post(
    `${API}/locations`,
    locationData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
}