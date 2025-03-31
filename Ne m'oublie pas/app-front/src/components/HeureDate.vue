<template>
  <div class="flex items-center justify-center">
    <div class="date-container text-center">
      <h1 class="day-name">{{ dayName }}</h1>
      <p class="date-info">{{ periodOfDay }} - {{ formattedDate }}</p>
      <div class="time-box">
        <span class="time">{{ formattedTime }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const dayName = ref("");
const periodOfDay = ref("");
const formattedDate = ref("");
const formattedTime = ref("");
let timerInterval = null;

const updateDateTime = () => {
  const now = new Date();

  const days = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];
  dayName.value = days[now.getDay()];

  // Determine period of day
  const hour = now.getHours();
  if (hour < 12) {
    periodOfDay.value = "Matin";
  } else if (hour < 18) {
    periodOfDay.value = "Après-midi";
  } else {
    periodOfDay.value = "Soir";
  }

  // Format date in French
  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  formattedDate.value = `${now.getDate()} ${
    months[now.getMonth()]
  } ${now.getFullYear()}`;

  // Format time
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  formattedTime.value = `${hours}:${minutes}`;
};

onMounted(() => {
  updateDateTime();
  timerInterval = setInterval(updateDateTime, 60000);
});

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});
</script>

<style scoped>
.date-container {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center; /* Centrage horizontal */
}

.day-name {
  font-size: 5rem;
  font-weight: 500;
  margin: 6px;
  color: #333;
  font-family: "Segoe Script", "Brush Script MT", cursive;
}

.date-info {
  font-size: 2rem;
  font-weight: 600;
  color: #555;
  margin: 8px 0 10px 0;
}

.time-box {
  background-color: #f0f0f0;
  padding: 10px 20px;
  margin: 20px 0 5% 0;
  border-radius: 8px;
  display: inline-block;
}

.time {
  font-size: 4rem;
  font-weight: 600;
  color: #333;
}
</style>
