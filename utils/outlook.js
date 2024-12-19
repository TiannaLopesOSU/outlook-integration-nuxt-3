import axios from "axios";

const BASE_URL = "https://graph.microsoft.com/v1.0/me/events";

export async function fetchOutlookEvents(accessToken) {
  try {
    const response = await axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.value;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

export async function createOutlookEvent(accessToken, event) {
  try {
    const response = await axios.post(BASE_URL, event, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}

export async function deleteOutlookEvent(accessToken, eventId) {
  try {
    await axios.delete(`${BASE_URL}/${eventId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return true;
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
}
