import axios from "axios";

// GET
export async function fetchOutlookEvents(accessToken) {
  try {
    const response = await axios.get(
      "https://graph.microsoft.com/v1.0/me/events",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data.value;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

// POST
export async function createOutlookEvent(accessToken, event) {
  try {
    const response = await axios.post(
      "https://graph.microsoft.com/v1.0/me/events",
      event,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}

// DELETE
export async function deleteOutlookEvent(accessToken, eventId) {
  try {
    await axios.delete(
      `https://graph.microsoft.com/v1.0/me/events/${eventId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
}

// PATCH
export async function updateOutlookEvent(accessToken, event) {
  try {
    await axios.patch(
      `https://graph.microsoft.com/v1.0/me/events/${event.id}`,
      {
        subject: event.subject,
        start: {
          dateTime: new Date(event.start.dateTime).toISOString(),
          timeZone: "UTC",
        },
        end: {
          dateTime: new Date(event.end.dateTime).toISOString(),
          timeZone: "UTC",
        },
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
}
