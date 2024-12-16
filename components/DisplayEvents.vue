<template>
  <div class="container my-3">
    <div>
      <div class="d-flex justify-content-center">
        <h1>Outlook Calendar Events</h1>
      </div>
      <div class="d-flex justify-content-center" v-if="!isLoggedIn">
        <button @click="redirectToMicrosoftLogin" class="btn btn-light border">
          Login with Microsoft
        </button>
      </div>
      <!--  Calendar Library -->
      <client-only>
        <VCalendar v-model="date" />
        <VDatePicker v-model="date" :attributes="attrs" />
      </client-only>

      <!-- List of Events -->
      <div v-if="events.length">
        <h2>Your Events:</h2>
        <ul>
          <li v-for="event in events" :key="event.id">
            <strong>{{ event.subject }}</strong>
            <br />
            Start: {{ event.start.dateTime }}
            <br />
            End: {{ event.end.dateTime }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "DisplayEvents",
  data() {
    return {
      date: new Date(),
      attrs: {
        key: "today",
        highlight: {
          color: "green",
          fillMode: "solid",
        },
        dates: new Date(),
      },
      isLoggedIn: false,
      accessToken: null,
      events: [],
    };
  },
  methods: {
    checkIfLoggedIn() {
      this.accessToken = localStorage.getItem("outlookAccessToken");
      if (!this.accessToken) {
        console.error("No access token found");
        this.isLoggedIn = false;
        return;
      } else {
        console.log("Access token found successfully");
        this.isLoggedIn = true;
        this.fetchEvents();
      }
    },

    redirectToMicrosoftLogin() {
      const clientId = "94ff5836-5336-48e6-909d-5b362d502baa";
      const tenant = "common"; // Supports both work and personal accounts
      const redirectUri = `${window.location.origin}/callback`;
      const scope = "Calendars.Read";
      const state = "random_state";
      const authUrl = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
      window.location.href = authUrl;
    },
    async fetchEvents() {
      try {
        const response = await axios.get(
          "https://graph.microsoft.com/v1.0/me/events",
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
          }
        );
        this.events = response.data.value;
        console.log("Events fetched successfully:", this.events);
      } catch (error) {
        console.error(
          "Error fetching events:",
          error.response || error.message
        );
      }
    },
  },
  mounted() {
    this.checkIfLoggedIn();
  },
};
</script>
