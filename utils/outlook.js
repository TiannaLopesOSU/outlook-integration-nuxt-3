import axios from "axios";

export async function fetchOutlookEvents(accessToken) {
  try {
    const response = await axios.get(
      "https://graph.microsoft.com/v1.0/me/events",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.value;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}
