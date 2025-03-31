<template>
  <div class="mx-auto w-full p-8">
    <div
      class="container-fixed-size bg-white bg-slate-50 p-6 font-sans flex flex-col rounded-xl space-y-6 h-[600px]"
    >
      <div
        class="memory-app relative w-full flex-1 bg-gray-50 overflow-hidden shadow-lg"
      >
        <!-- Bouton retour en haut à droite -->
        <router-link
          to="/album"
          class="absolute top-4 right-4 z-20 bg-white rounded-full p-4 shadow-lg hover:bg-gray-100 transition"
          aria-label="Fermer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8 text-gray-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </router-link>

        <!-- Image principale -->
        <div class="relative w-full h-full">
          <img :src="image" alt="Souvenir" class="w-full h-full object-cover" />

          <!-- Bandeau texte + audio -->
          <div
            class="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 backdrop-blur-sm px-8 py-6 min-h-[10rem]"
          >
            <div class="flex justify-between items-center">
              <div class="flex-1">
                <h2 class="font-medium text-gray-800 text-4xl break-words">
                  {{ shortHistory }}
                </h2>
                <p class="pt-2 text-gray-600 text-4xl">{{ date }}</p>
              </div>

              <div class="flex items-center space-x-6 ml-6 mr-6">
                <!-- BOUTON PLAY -->
                <button
                  v-if="!isPlaying"
                  @click="playAudio"
                  class="w-20 h-20 bg-green-500/60 rounded-xl flex items-center justify-center shadow-lg"
                >
                  <span
                    class="text-white text-5xl font-bold transform rotate-90 opacity-100"
                  >
                    ▲
                  </span>
                </button>

                <!-- BOUTON STOP -->
                <button
                  v-else
                  @click="stopAudio"
                  class="w-20 h-20 bg-red-500/40 rounded-xl flex items-center justify-center shadow-lg"
                >
                  <span class="text-white text-4xl font-bold opacity-100">
                    &#9632;
                  </span>
                </button>

                <!-- Audio tag -->
                <audio ref="audioRef" :src="audioHistory" preload="auto" />

                <!-- Animation bars -->
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = withDefaults(
  defineProps<{
    image?: string;
    shortHistory?: string;
    date?: string;
    audioHistory?: string;
  }>(),
  {
    image: "photo_mariage_Thibault.png",
    shortHistory: "Votre petit-fils s'est marié… et vous y étiez !",
    date: "17 juin 2022",
    audioHistory: "../public/event2.mp3",
  }
);

const isPlaying = ref(false);
const audioRef = ref<HTMLAudioElement | null>(null);

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
