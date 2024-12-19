<template>
  <div class="card p-3">
    <h3>Edit Appointment</h3>
    <form @submit.prevent="submitEvent">
      <!-- Subject Input -->
      <div class="form-group mb-2">
        <label>Subject:</label>
        <input
          type="text"
          v-model="updatedEvent.subject"
          class="form-control"
          required
        />
      </div>

      <!-- Start Date & Time Picker -->
      <div class="form-group mb-2">
        <label>Start Date & Time:</label>
        <client-only>
          <VDatePicker
            v-model="updatedEvent.start.dateTime"
            mode="datetime"
            is-expanded
            class="date-picker"
          />
        </client-only>
      </div>

      <!-- End Date & Time Picker -->
      <div class="form-group mb-2">
        <label>End Date & Time:</label>
        <client-only>
          <VDatePicker
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
          @click="$emit('cancelEdit')"
          class="btn btn-secondary ms-2"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { updateOutlookEvent } from "../utils/outlook";

export default {
  name: "EditAppointmentForm",
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const updatedEvent = ref({ ...props.event });

    const submitEvent = async () => {
      try {
        await updateOutlookEvent(
          localStorage.getItem("outlookAccessToken"),
          updatedEvent.value
        );
        alert("Event updated successfully!");
        emit("eventUpdated");
        emit("cancelEdit");
      } catch (error) {
        console.error("Error updating event:", error);
        alert("Failed to update event.");
      }
    };

    return { updatedEvent, submitEvent };
  },
};
</script>

<style scoped>
.date-picker {
  width: 100%;
  margin-bottom: 1rem;
}
</style>
