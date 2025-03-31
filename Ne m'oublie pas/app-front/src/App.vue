<template>
  <div class="min-h-screen bg-gray-700 relative">
    <router-link to="/" class="absolute top-4 left-4 w-10 h-10">
      <img src="/icon.png" alt="Icône" class="w-full h-full object-contain" />
    </router-link>

    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>
