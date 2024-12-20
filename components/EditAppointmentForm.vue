<template>
  <div class="card p-3">
    <h3>Edit Appointment</h3>
    <form @submit.prevent="submitEvent">
      <!-- Subject Input -->
      <div class="form-group mb-2">
        <label for="subject">Subject:</label>
        <input
          id="subject"
          type="text"
          v-model="updatedEvent.subject"
          class="form-control"
          required
        />
      </div>

      <!-- Start Date & Time Picker -->
      <div class="form-group mb-2">
        <label for="start-date-time">Start Date & Time:</label>
        <client-only>
          <VDatePicker
            id="start-date-time"
            v-model="updatedEvent.start.dateTime"
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
            v-model="updatedEvent.end.dateTime"
            mode="datetime"
            is-expanded
            class="date-picker"
          />
        </client-only>
      </div>

      <!-- Submit and Cancel Buttons -->
      <div class="text-center">
        <button type="submit" class="btn btn-success">Save Changes</button>
        <button
          type="button"
          @click="cancelEdit"
          class="btn btn-secondary ms-2"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { updateOutlookEvent } from "@/utils/outlook";

export default {
  name: "EditAppointmentForm",

  props: {
    event: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      updatedEvent: { ...this.event },
    };
  },

  methods: {
    async submitEvent() {
      try {
        const accessToken = localStorage.getItem("outlookAccessToken");
        await updateOutlookEvent(accessToken, this.updatedEvent);
        alert("Event updated successfully!");
        this.$emit("eventUpdated");
        this.cancelEdit();
      } catch (error) {
        console.error("Error updating event:", error);
        alert("Failed to update event.");
      }
    },

    cancelEdit() {
      this.$emit("cancelEdit");
    },
  },
};
</script>

<style scoped>
.date-picker {
  width: 100%;
  margin-bottom: 1rem;
}
</style>
