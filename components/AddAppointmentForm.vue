<template>
  <div class="card p-3">
    <h3>Add New Appointment</h3>
    <form @submit.prevent="submitEvent">
      <!-- Subject Input -->
      <div class="form-group mb-2">
        <label>Subject:</label>
        <input
          type="text"
          v-model="subject"
          class="form-control"
          placeholder="Event Title"
          required
        />
      </div>

      <!-- Start Date & Time Picker -->
      <div class="form-group mb-2">
        <label>Start Date & Time:</label>
        <client-only>
          <VDatePicker
            v-model="startDateTime"
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
            v-model="endDateTime"
            mode="datetime"
            is-expanded
            class="date-picker"
          />
        </client-only>
      </div>

      <!-- Submit Button -->
      <div class="text-center">
        <button type="submit" class="btn btn-success">Add Appointment</button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "AddAppointmentForm",

  setup() {
    const subject = ref("");
    const startDateTime = ref(null);
    const endDateTime = ref(null);
    const accessToken = ref(localStorage.getItem("outlookAccessToken"));

    const submitEvent = async () => {
      if (!startDateTime.value || !endDateTime.value) {
        alert("Please select valid start and end dates.");
        return;
      }

      const newEvent = {
        subject: subject.value,
        start: {
          dateTime: startDateTime.value.toISOString(),
          timeZone: "UTC",
        },
        end: {
          dateTime: endDateTime.value.toISOString(),
          timeZone: "UTC",
        },
      };

      try {
        const response = await fetch(
          "https://graph.microsoft.com/v1.0/me/events",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken.value}`,
            },
            body: JSON.stringify(newEvent),
          }
        );

        if (response.ok) {
          alert("Event added successfully!");
          subject.value = "";
          startDateTime.value = null;
          endDateTime.value = null;
        } else {
          throw new Error("Failed to add event");
        }
      } catch (error) {
        console.error("Error adding event:", error);
        alert("Failed to add event.");
      }
    };

    return {
      subject,
      startDateTime,
      endDateTime,
      submitEvent,
    };
  },
};
</script>

<style scoped>
.date-picker {
  width: 100%;
  margin-bottom: 1rem;
}
</style>
