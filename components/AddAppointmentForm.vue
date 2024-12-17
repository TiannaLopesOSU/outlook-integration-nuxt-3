<template>
  <div class="card p-3">
    <h3>Add New Appointment</h3>
    <form @submit.prevent="submitEvent">
      <div class="form-group mb-2">
        <label>Subject:</label>
        <input type="text" v-model="subject" class="form-control" required />
      </div>
      <div class="form-group mb-2">
        <label>Start Date & Time:</label>
        <input
          type="datetime-local"
          v-model="startDateTime"
          class="form-control"
          required
        />
      </div>
      <div class="form-group mb-2">
        <label>End Date & Time:</label>
        <input
          type="datetime-local"
          v-model="endDateTime"
          class="form-control"
          required
        />
      </div>
      <button type="submit" class="btn btn-success">Add Appointment</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AddAppointmentForm",
  data() {
    return {
      subject: "",
      startDateTime: "",
      endDateTime: "",
      accessToken: localStorage.getItem("outlookAccessToken"),
    };
  },
  methods: {
    async submitEvent() {
      const newEvent = {
        subject: this.subject,
        start: {
          dateTime: new Date(this.startDateTime).toISOString(),
          timeZone: "UTC",
        },
        end: {
          dateTime: new Date(this.endDateTime).toISOString(),
          timeZone: "UTC",
        },
      };

      try {
        await axios.post(
          "https://graph.microsoft.com/v1.0/me/events",
          newEvent,
          {
            headers: { Authorization: `Bearer ${this.accessToken}` },
          }
        );
        alert("Event added successfully!");
        this.$emit("eventAdded"); // Notify parent to fetch events
      } catch (error) {
        console.error("Error adding event:", error.response || error.message);
        alert("Failed to add event.");
      }
    },
  },
};
</script>
