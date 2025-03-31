<template>
  <section class="relative h-full rounded-xl overflow-hidden shadow-md">
    <img
      :src="currentMemory.image"
      :alt="currentMemory.title"
      class="h-full w-full object-cover"
    />
    <div
      class="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex flex-col justify-end p-6"
    >
      <!-- Ligne avec texte à gauche et bouton à droite -->
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-4xl font-semibold text-white mb-1">
            {{ currentMemory.description }}
          </h3>
          <p class="text-3xl text-white opacity-80">{{ currentMemory.date }}</p>
        </div>
        <!-- Bouton bleu à droite -->
        <button
          class="rounded-full bg-[#0035EB] p-3 hover:bg-[#002bd1] transition ml-06"
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
    </div>
  </section>
</template>

<script>
import { ref } from "vue";

export default {
  name: "SouvenirDuJour",
  setup() {
    const currentMemory = ref({
      title: "Le mariage de ton petit-fils",
      image: "photo_mariage_Thibault.png",
      description: "Le mariage de ton petit-fils... tu y étais !",
      date: "17 juin 2022",
    });

    return {
      currentMemory,
    };
  },
};
</script>
