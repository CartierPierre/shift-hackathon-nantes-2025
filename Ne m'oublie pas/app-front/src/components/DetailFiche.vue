<template>
    <div class="p-5">
      <!-- Description Card -->
      <div class="bg-white rounded-2xl p-6 mb-6 shadow-lg">
        <h3 class="text-3xl font-bold text-blue-900 mb-4">
          Souvenir de {{ person.name }}
        </h3>
        <p class="text-2xl text-gray-700 leading-relaxed bg-white p-2 rounded-xl">
          {{
            person.description ||
            "C'était une personne très importante pour moi. Je garde en mémoire son sourire et sa gentillesse."
          }}
        </p>
      </div>
  
      <!-- Photos Section -->
      <div class="mt-8">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Album photos</h2>
  
        <!-- Grille de 2 colonnes -->
        <div class="grid grid-cols-2 gap-4">
          <!-- Photo 1 -->
          <div class="relative h-96 rounded-xl overflow-hidden shadow-md">
            <img
              src="../../public/Anniv_Pierre_Monique.png"
              alt="Anniversaire 2024"
              class="w-full h-full object-cover"
            />
            <div
              class="absolute bottom-0 left-0 right-0 p-4
                     bg-gradient-to-t from-black to-transparent text-white"
            >
              <h3 class="text-xl font-semibold">Juin 2022</h3>
              <p class="text-lg">Pierre et moi pour ses 80 ans</p>
            </div>
          </div>
  
          <!-- Photo 2 -->
          <div class="relative h-96 rounded-xl overflow-hidden shadow-md">
            <img
              src="../../public/Anniv_Pierre_Seule.webp"
              alt="Group of people smiling"
              class="w-full h-full object-cover"
            />
            <div
              class="absolute bottom-0 left-0 right-0 p-4
                     bg-gradient-to-t from-black to-transparent text-white"
            >
              <h3 class="text-xl font-semibold">Juin 2022</h3>
              <p class="text-lg">Anniverssaire de Pierre</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from "vue";
  
  const props = defineProps({
    person: {
      type: Object,
      required: true,
    },
  });
  </script>
  