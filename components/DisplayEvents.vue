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

      <!-- Calendar Display -->
      <div>
        <div class="d-flex justify-content-center">
          <client-only>
            <VCalendar :attributes="calendarAttrs" />
            <!-- <VDatePicker v-model="date" :attributes="calendarAttrs" /> -->
          </client-only>
        </div>
      </div>

      <!-- Button to Open Add Event Form -->
      <div class="d-flex justify-content-center my-3" v-if="isLoggedIn">
        <div v-if="!showAddEventForm">
          <button @click="toggleAddEventForm" class="btn btn-primary">
            Add New Appointment
          </button>
        </div>
        <!-- Add Event Form Component -->
        <div v-if="showAddEventForm">
          <AddAppointmentForm @eventAdded="fetchEvents" />
        </div>
      </div>

      <!-- List of Events -->
      <div v-if="events.length">
        <h2>Your Events:</h2>
        <ul>
          <li v-for="event in events" :key="event.id">
            <strong>{{ event.subject }}</strong
            ><br />
            Start: {{ formatDate(event.start.dateTime) }}<br />
            End: {{ formatDate(event.end.dateTime) }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import AddAppointmentForm from "./AddAppointmentForm.vue";

export default {
  name: "DisplayEvents",
  components: { AddAppointmentForm },

  data() {
    return {
      date: new Date(),
      calendarAttrs: [],
      isLoggedIn: false,
      accessToken: null,
      events: [],
      showAddEventForm: false,
    };
  },
  methods: {
    checkIfLoggedIn() {
      this.accessToken = localStorage.getItem("outlookAccessToken");
      if (!this.accessToken) {
        console.error("No access token found");
        this.isLoggedIn = false;
        localStorage.removeItem("outlookAccessToken");
      } else {
        console.log("Access token found successfully");
        this.isLoggedIn = true;
        this.fetchEvents();
      }
    },
    toggleAddEventForm() {
      this.showAddEventForm = !this.showAddEventForm;
    },
    redirectToMicrosoftLogin() {
      const clientId = "94ff5836-5336-48e6-909d-5b362d502baa";
      const tenant = "common";
      const redirectUri = `${window.location.origin}/callback`;
      const scope = "Calendars.ReadWrite";
      const state = "random_state";
      const authUrl = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
      window.location.href = authUrl;
    },

    async fetchEvents() {
      try {
        const response = await axios.get(
          "https://graph.microsoft.com/v1.0/me/events",
          {
            headers: { Authorization: `Bearer ${this.accessToken}` },
          }
        );
        this.events = response.data.value;
        console.log("Events fetched successfully:", this.events);
        this.setCalendarAttributes();
      } catch (error) {
        console.error(
          "Error fetching events:",
          error.response || error.message
        );
      }
    },

    setCalendarAttributes() {
      // Convert events to calendar attributes (highlighting start dates)
      this.calendarAttrs = this.events.map((event) => ({
        key: event.id,
        dates: new Date(event.start.dateTime),
        highlight: {
          color: "green",
          fillMode: "solid",
        },
        popover: {
          label: `Event: ${event.subject}\nStart: ${this.formatDate(
            event.start.dateTime
          )}`,
        },
      }));
    },

    formatDate(dateString) {
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
  },
  mounted() {
    this.checkIfLoggedIn();
  },
};
</script>
