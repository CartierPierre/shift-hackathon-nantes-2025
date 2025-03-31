<template>
  <section class="rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
    <!-- Section : Aujourd'hui (événements de demain) -->
    <div>
      <div class="mb-4 flex items-center justify-between mb-9">
        <h3 class="text-3xl font-semibold text-gray-900">Aujourd'hui</h3>
        <button
          class="rounded-full bg-[#0035EB] p-3 hover:bg-[#002bd1] transition"
          aria-label="Voir plus"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <div
        v-for="(event, index) in tomorrowEvents"
        :key="index"
        class="mb-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <clock-icon class="h-6 w-6 text-gray-800 mr-2" />
            <span class="text-2xl font-medium text-gray-800">{{
              event.time
            }}</span>

            <!-- Trait bleu vertical uniforme -->
            <div class="mx-4 w-[3px] h-10 bg-blue-500"></div>
          </div>
          <!-- Bloc texte (titre et description) -->
          <div class="flex-1 mx-4">
            <div class="mb-1 text-3xl text-slate-800">
              {{ event.title }}
            </div>
            <div class="text-2xl text-slate-600">
              {{ event.description }}
            </div>
          </div>
          <!-- Bloc image à droite -->
          <div v-if="event.image" class="ml-4">
            <img
              :src="event.image"
              alt="Personne"
              class="h-20 w-20 rounded-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, computed } from "vue";
import { Calendar as CalendarIcon, Clock as ClockIcon } from "lucide-vue-next";

export default {
  name: "Agenda",
  components: {
    CalendarIcon,
    ClockIcon,
  },
  setup() {
    // Vérifie si deux dates sont le même jour
    const isSameDay = (d1, d2) => {
      return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
      );
    };

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Tous les événements sont pour demain
    const events = ref([
      {
        date: tomorrow.toISOString(),
        time: "9h00",
        title: "Infirmière",
        description: "Anaïs vient faire les soins",
        color: "green",
        image: "https://randomuser.me/api/portraits/women/28.jpg",
      },
      {
        date: tomorrow.toISOString(),
        time: "16h30",
        title: "Rdv Ophtalmologue",
        description: "Fred, ton petit-fils, va t'accompagner",
        color: "green",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
      },
      {
        date: tomorrow.toISOString(),
        time: "13h30",
        title: "Visite",
        description: "Carole, ta fille, viendra te rendre visite",
        color: "green",
        image: "https://randomuser.me/api/portraits/women/32.jpg",
      },
    ]);

    const tomorrowEvents = computed(() =>
      events.value.filter((e) => isSameDay(new Date(e.date), tomorrow))
    );

    const getColorClass = (color) => {
      switch (color) {
        case "green":
          return "bg-green-100 text-green-600";
        case "blue":
          return "bg-blue-100 text-blue-600";
        case "red":
          return "bg-red-100 text-red-600";
        default:
          return "bg-gray-100 text-gray-600";
      }
    };

    return {
      events,
      tomorrowEvents,
      getColorClass,
    };
  },
};
</script>

<style scoped></style>
