<template>
  <div class="container my-5">
    <!-- Loading Indicator -->
    <div v-if="isLoading" class="d-flex justify-content-center">
      <p>Loading, please wait...</p>
    </div>

    <!-- Main Content -->
    <div v-else>
      <div>
        <!-- Login Button -->
        <div v-if="!isLoggedIn" class="d-flex justify-content-center">
          <button
            @click="redirectToMicrosoftLogin"
            class="btn btn-light border"
          >
            Login with Microsoft
          </button>
        </div>

        <!-- Calendar Display -->
        <div v-if="isLoggedIn">
          <!-- View Toggle Buttons -->
          <div class="d-flex justify-content-center mb-3">
            <button
              v-for="view in calendarViews"
              :key="view.value"
              :class="[
                'btn',
                'me-2',
                {
                  'btn-primary': currentView === view.value,
                  'btn-outline-primary': currentView !== view.value,
                },
              ]"
              @click="changeCalendarView(view.value)"
            >
              {{ view.label }}
            </button>
          </div>

          <!-- Calendar Component -->
          <div class="d-flex justify-content-center">
            <div v-if="!isCalendarReady" class="text-center my-3">
              <p>Loading calendar...</p>
            </div>
            <div v-else>
              <client-only>
                <VCalendar
                  :attributes="calendarAttrs"
                  @click-date="showEventDetails"
                />
              </client-only>
            </div>
          </div>
        </div>

        <!-- Add Event Form -->
        <div class="d-flex justify-content-center my-3" v-if="isLoggedIn">
          <div v-if="!showAddEventForm">
            <button @click="toggleAddEventForm" class="btn btn-primary">
              Add New Appointment
            </button>
          </div>
          <div v-if="showAddEventForm">
            <AddAppointmentForm @eventAdded="fetchEvents" />
          </div>
        </div>

        <!-- List of Events -->
        <div v-if="events.length" class="events-max-height overflow-auto">
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

        <!-- Event Details -->
        <div v-if="selectedEvent" class="mt-4">
          <h3>Event Details</h3>
          <p><strong>Subject:</strong> {{ selectedEvent.subject }}</p>
          <p>
            <strong>Start:</strong>
            {{ formatDate(selectedEvent.start.dateTime) }}
          </p>
          <p>
            <strong>End:</strong> {{ formatDate(selectedEvent.end.dateTime) }}
          </p>
          <p>
            <strong>Location:</strong>
            {{ selectedEvent.location?.displayName || "N/A" }}
          </p>
          <p>
            <strong>Description:</strong>
            {{ selectedEvent.body?.content || "N/A" }}
          </p>
        </div>
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
      selectedEvent: null,
      currentView: "month",
      calendarViews: [
        { label: "Day", value: "day" },
        { label: "Week", value: "week" },
        { label: "Month", value: "month" },
      ],
      isLoading: true, // State for initial loading
      isCalendarReady: false, // State for calendar readiness
    };
  },

  methods: {
    async checkIfLoggedIn() {
      this.accessToken = localStorage.getItem("outlookAccessToken");
      if (!this.accessToken) {
        console.error("No access token found, clearing local storage.");
        this.isLoggedIn = false;
        localStorage.removeItem("outlookAccessToken");
        this.isLoading = false; // Stop loading
      } else {
        console.log("Access token found successfully");
        this.isLoggedIn = true;
        try {
          await this.fetchEvents();
        } catch (error) {
          console.error(
            "Error fetching events, clearing token:",
            error.message
          );
          this.isLoggedIn = false;
          localStorage.removeItem("outlookAccessToken");
        } finally {
          this.isLoading = false; // Stop loading
        }
      }
    },

    async fetchEvents() {
      try {
        const response = await axios.get(
          "https://graph.microsoft.com/v1.0/me/events",
          {
            headers: { Authorization: `Bearer ${this.accessToken}` },
          }
        );
        console.log("Raw Events Data:", response.data.value);
        this.events = response.data.value || [];
        this.setCalendarAttributes();
      } catch (error) {
        throw new Error(
          error.response?.data?.error?.message || "Failed to fetch events"
        );
      } finally {
        this.isCalendarReady = true; // Mark calendar as ready
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

    changeCalendarView(view) {
      this.currentView = view;
    },

    showEventDetails({ date }) {
      const event = this.events.find((e) => {
        return (
          new Date(e.start.dateTime).toDateString() === date.toDateString()
        );
      });
      this.selectedEvent = event || null;
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
  },

  async mounted() {
    await this.checkIfLoggedIn();
  },
};
</script>

<style scoped>
.events-max-height {
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 10px;
  box-sizing: border-box;
}
</style>
