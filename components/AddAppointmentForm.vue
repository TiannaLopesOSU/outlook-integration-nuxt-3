<template>
  <div class="card p-3">
    <h3>Add New Appointment</h3>
    <form @submit.prevent="submitEvent">
      <!-- Subject Input -->
      <div class="form-group mb-2">
        <label for="subject">Subject:</label>
        <input
          id="subject"
          type="text"
          v-model="subject"
          class="form-control"
          placeholder="Event Title"
          required
        />
      </div>

      <!-- Start Date & Time Picker -->
      <div class="form-group mb-2">
        <label for="start-date-time">Start Date & Time:</label>
        <client-only>
          <VDatePicker
            id="start-date-time"
            v-model="startDateTime"
            mode="datetime"
            is-expanded
            class="date-picker"
          />
        </client-only>
      </div>

      <!-- End Date & Time Picker -->
      <div class="form-group mb-2">
        <label for="end-date-time">End Date & Time:</label>
        <client-only>
          <VDatePicker
            id="end-date-time"
            v-model="endDateTime"
            mode="datetime"
            is-expanded
            class="date-picker"
          />
        </client-only>
      </div>

      <!-- Submit Button -->
      <div class="text-center">
        <button type="submit" class="btn btn-success" :disabled="!isValidForm">
          Add Appointment
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { createOutlookEvent } from "@/utils/outlook";

export default {
  name: "AddAppointmentForm",

  data() {
    return {
      subject: "",
      startDateTime: null,
      endDateTime: null,
      accessToken: localStorage.getItem("outlookAccessToken"),
    };
  },

  computed: {
    isValidForm() {
      return (
        this.subject &&
        this.startDateTime &&
        this.endDateTime &&
        new Date(this.startDateTime) < new Date(this.endDateTime)
      );
    },
  },

  methods: {
    async submitEvent() {
      if (!this.isValidForm) {
        alert("Please fill out all fields correctly.");
        return;
      }

      const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const newEvent = {
        subject: this.subject,
        start: {
          dateTime: this.startDateTime.toISOString(),
          timeZone: localTimeZone,
        },
        end: {
          dateTime: this.endDateTime.toISOString(),
          timeZone: localTimeZone,
        },
      };

      try {
        await createOutlookEvent(this.accessToken, newEvent);
        alert("Event added successfully!");
        this.subject = "";
        this.startDateTime = null;
        this.endDateTime = null;
      } catch (error) {
        console.error(error);
        alert("Failed to add event.");
      }
    },
  },
};
</script>

<style scoped></style>
