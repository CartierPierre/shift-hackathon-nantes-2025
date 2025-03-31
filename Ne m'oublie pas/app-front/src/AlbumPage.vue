<template>
  <div class="mx-auto w-full p-8">
    <div
      class="relative container-fixed-size bg-white p-6 rounded-2xl shadow-md"
    >
      <router-link
        to="/"
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
      <!-- Navigation Catégories -->
      <div class="flex justify-center space-x-10 mb-20 mt-8">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="selectCategory(category.id)"
          :class="[
            'text-3xl font-bold px-10 py-5 rounded-2xl transition',
            selectedCategory === category.id
              ? 'bg-blue-600 text-white'
              : 'text-black hover:bg-gray-100',
          ]"
        >
          {{ category.name }}
        </button>
      </div>

      <!-- Liste des personnes -->
      <transition name="fade" mode="out-in">
        <div
          v-if="selectedCategory"
          class="flex flex-wrap justify-center gap-16 mb-20"
        >
          <div
            v-for="person in filteredPeople"
            :key="person.id"
            class="flex flex-col items-center cursor-pointer"
            @click="goToFiche(person.id)"
          >
            <div
              class="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden mb-6 border-4 border-white shadow-xl"
            >
              <img
                :src="person.image"
                :alt="`Photo de ${person.name}`"
                class="w-full h-full object-cover"
              />
            </div>
            <p class="text-3xl font-bold text-gray-800 text-center">
              {{ person.name }}
            </p>
            <p class="text-2xl text-blue-500 text-center">
              {{ person.relation }}
            </p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import people from "./data/people.json";

export default {
  name: "AlbumPage",
  setup() {
    const router = useRouter();

    const categories = [
      { id: "famille", name: "Famille" },
      { id: "amis", name: "Amis" },
      { id: "aidants", name: "Aidants" },
    ];

    const selectedCategory = ref("famille");

    const filteredPeople = computed(() => {
      return people.filter((p) => p.category === selectedCategory.value);
    });

    const selectCategory = (categoryId) => {
      selectedCategory.value = categoryId;
    };

    const goToFiche = (id) => {
      router.push({ name: "FichePage", params: { id } });
    };

    return {
      categories,
      selectedCategory,
      filteredPeople,
      selectCategory,
      goToFiche,
    };
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
