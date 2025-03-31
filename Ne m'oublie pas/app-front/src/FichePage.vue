<template>
  <div class="mx-auto w-full p-8">
    <!-- Contenant principal -->
    <div
      class="relative container-fixed-size bg-white bg-slate-50 p-6 font-sans flex flex-col rounded-xl"
    >
      <!-- Bouton retour -->
      <router-link
        to="/album"
        class="absolute top-4 left-4 z-20 bg-[#0035EB] rounded-full p-4 shadow-lg hover:bg-[#002bd1] transition"
        aria-label="Retour"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </router-link>

      <!-- Contenu uniquement si la personne existe -->
      <div
        v-if="person"
        class="flex flex-col space-y-8 mt-6 justify-center items-center"
      >
        <div class="flex flex-wrap md:flex-nowrap space-x-6">
          <!-- Info personne (photo, nom, relation, âge) -->
          <div class="flex items-center space-x-6 mr-8">
            <div
              class="w-48 h-48 md:w-60 md:h-60 rounded-full overflow-hidden border-4 border-blue-200 shadow-lg"
            >
              <img
                :src="person.image"
                :alt="`Photo de ${person.name}`"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="flex flex-col">
              <p class="text-3xl font-bold text-gray-800">
                {{ person.name }}
              </p>
              <p class="text-2xl text-blue-500">
                {{ person.relation }}
              </p>
              <p class="text-xl md:text-2xl text-gray-700">
                {{ person.age }} ans
              </p>
            </div>
          </div>

          <!-- Lecteur audio (en haut à droite sur écrans larges) -->
          <div class="flex items-center space-x-6 mt-6 md:mt-0">
            <!-- Bouton PLAY -->
            <button
              v-if="!isPlaying"
              @click="playAudio"
              class="w-16 h-16 md:w-20 md:h-20 bg-green-500/60 rounded-xl flex items-center justify-center shadow-lg"
            >
              <span
                class="text-white text-4xl md:text-5xl font-bold transform rotate-90 opacity-100"
              >
                ▲
              </span>
            </button>

            <!-- Bouton STOP -->
            <button
              v-else
              @click="stopAudio"
              class="w-16 h-16 md:w-20 md:h-20 bg-red-500/40 rounded-xl flex items-center justify-center shadow-lg"
            >
              <span
                class="text-white text-3xl md:text-4xl font-bold opacity-100"
              >
                &#9632;
              </span>
            </button>

            <!-- Balise audio -->
            <audio
              ref="audioRef"
              :src="person.audiodescription || '../anniversaire.mp3'"
              preload="auto"
            />

            <!-- Barres d'animation -->
            <div class="waveform flex items-center h-8 space-x-1">
              <div
                v-for="i in 5"
                :key="i"
                class="wave-bar bg-blue-500 w-1.5 h-full rounded-full"
                :class="{ active: isPlaying }"
                :style="`animation-delay: ${i * 0.1}s`"
              ></div>
            </div>
          </div>
        </div>

        <!-- Détail fiche (en dessous) -->
        <DetailFiche :person="person" />
      </div>

      <!-- Personne introuvable -->
      <div v-else>
        <p class="text-center text-xl text-gray-700">
          Aucune information disponible pour cette personne.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import people from "./data/people.json";
import DetailFiche from "./components/DetailFiche.vue";

const route = useRoute();
const person = ref(null);
const isPlaying = ref(false);
const audioRef = ref(null);

onMounted(() => {
  const idParam = Number(route.params.id);
  person.value = people.find((p) => p.id === idParam) || null;
});

const playAudio = () => {
  if (audioRef.value) {
    audioRef.value.play();
    isPlaying.value = true;
  }
};

const stopAudio = () => {
  if (audioRef.value) {
    audioRef.value.pause();
    audioRef.value.currentTime = 0;
    isPlaying.value = false;
  }
};
</script>

<style scoped>
.wave-bar {
  height: 20%;
  transition: height 0.3s ease;
}

.wave-bar.active {
  animation: wave 1.2s ease-in-out infinite;
  transform-origin: bottom;
}

@keyframes wave {
  0%,
  100% {
    height: 20%;
  }
  50% {
    height: 100%;
  }
}
</style>
