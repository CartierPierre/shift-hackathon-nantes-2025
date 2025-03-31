<script>
import HeureDate from "./components/HeureDate.vue";
import Agenda from "./components/Agenda.vue";
import SouvenirDuJour from "./components/SouvenirDuJour.vue";

export default {
  name: "Home",
  components: {
    HeureDate,
    Agenda,
    SouvenirDuJour,
  },
};
</script>

<template>
  <div class="mx-auto w-full p-8">
    <div
      class="container-fixed-size bg-white bg-slate-50 p-6 font-sans flex flex-col rounded-xl h-full"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="space-y-8 h-full">
          <HeureDate />
          <Agenda />
        </div>
        <div>
          <div class="h-full">
            <router-link to="/souvenir">
              <SouvenirDuJour />
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
