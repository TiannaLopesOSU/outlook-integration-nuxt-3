<template>
  <div class="container my-5">
    <!-- Loading Indicator -->
    <div v-if="isLoading" class="d-flex justify-content-center">
      <p>Loading, please wait...</p>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Login Button -->
      <div v-if="!isLoggedIn" class="d-flex justify-content-center">
        <button @click="redirectToMicrosoftLogin" class="btn btn-light border">
          Login with Microsoft
        </button>
      </div>

      <!-- Calendar Display -->
      <div v-if="isLoggedIn">
        <div class="d-flex justify-content-center mb-3">
          <button
            v-for="view in calendarViews"
            :key="view.value"
            :class="[
              'btn',
              'me-2',
              currentView === view.value
                ? 'btn-primary'
                : 'btn-outline-primary',
            ]"
            @click="changeCalendarView(view.value)"
          >
            {{ view.label }}
          </button>
        </div>
        <div class="d-flex justify-content-center">
          <div v-if="!isCalendarReady" class="text-center my-3">
            <p>Loading calendar...</p>
          </div>
          <div v-else>
            <client-only>
              <VCalendar
                :attributes="calendarAttrs"
                @click-date="showEventDetails"
                expanded
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
            <strong>{{ event.subject }}</strong>
            <br />
            Start: {{ formatDate(event.start.dateTime) }}
            <br />
            End: {{ formatDate(event.end.dateTime) }}
            <br />
            <button
              @click="deleteEvent(event.id)"
              class="btn btn-danger btn-sm mt-2"
            >
              Delete
            </button>
            <button
              @click="editEvent(event)"
              class="btn btn-primary btn-sm mt-2 ms-2"
            >
              Edit
            </button>
          </li>
        </ul>
      </div>

      <!-- Edit Event Form -->
      <div v-if="showEditEventForm" class="mt-4">
        <EditAppointmentForm
          :key="selectedEvent?.id || 'new-edit'"
          :event="selectedEvent"
          @eventUpdated="fetchEvents"
          @cancelEdit="cancelEditEvent"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {
  fetchOutlookEvents,
  deleteOutlookEvent,
  updateOutlookEvent,
} from "@/utils/outlook";
import AddAppointmentForm from "./AddAppointmentForm.vue";
import EditAppointmentForm from "./EditAppointmentForm.vue";

export default {
  name: "DisplayEvents",

  components: {
    AddAppointmentForm,
    EditAppointmentForm,
  },

  data() {
    return {
      calendarAttrs: [],
      isLoggedIn: false,
      events: [],
      showAddEventForm: false,
      showEditEventForm: false,
      selectedEvent: null,
      currentView: "month",
      calendarViews: [{ label: "Month View", value: "month" }],
      isLoading: true,
      isCalendarReady: false,
      accessToken: null,
    };
  },

  methods: {
    async checkIfLoggedIn() {
      this.accessToken = localStorage.getItem("outlookAccessToken");
      if (!this.accessToken) {
        this.isLoggedIn = false;
        localStorage.removeItem("outlookAccessToken");
        this.isLoading = false;
      } else {
        this.isLoggedIn = true;
        try {
          await this.fetchEvents();
        } catch (error) {
          this.isLoggedIn = false;
          localStorage.removeItem("outlookAccessToken");
        } finally {
          this.isLoading = false;
        }
      }
    },

    async fetchEvents() {
      try {
        this.events = await fetchOutlookEvents(this.accessToken);
        this.sortEvents();
        this.setCalendarAttributes();
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        this.isCalendarReady = true;
      }
    },

    async deleteEvent(eventId) {
      if (!confirm("Are you sure you want to delete this event?")) return;

      try {
        await deleteOutlookEvent(this.accessToken, eventId);
        this.events = this.events.filter((event) => event.id !== eventId);
        this.sortEvents();
        this.setCalendarAttributes();
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    },

    editEvent(event) {
      this.selectedEvent = { ...event };
      this.showEditEventForm = true;
    },

    cancelEditEvent() {
      this.showEditEventForm = false;
      this.selectedEvent = null;
    },

    setCalendarAttributes() {
      this.calendarAttrs = this.events.map((event) => ({
        key: event.id,
        dates: new Date(event.start.dateTime),
        highlight: { color: "green", fillMode: "solid" },
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

    sortEvents() {
      this.events.sort(
        (a, b) => new Date(a.start.dateTime) - new Date(b.start.dateTime)
      );
    },

    changeCalendarView(view) {
      this.currentView = view;
    },

    toggleAddEventForm() {
      this.showAddEventForm = !this.showAddEventForm;
    },

    redirectToMicrosoftLogin() {
      const clientId = "94ff5836-5336-48e6-909d-5b362d502baa";
      const tenant = "common";
      // const redirectUri = "http://localhost:3000/callback";
      const redirectUri =
        "https://tiannalopesosu.github.io/outlook-integration-nuxt-3/callback";
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
  max-height: 400px;
}
</style>
