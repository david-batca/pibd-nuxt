<template>
  <v-app>
    <AppHeader @navChange="navChange" />
    <ClientOnly>
      <Navigation :navOpen="navOpen" />
    </ClientOnly>

    <v-main>
      <div class="bg-green-darken-4 pt-4 ps-4 h-100">
        <div class="pa-8 bg-background rounded-ts-xl h-100">
          <slot />
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
  const navOpen = ref(true);

  const navChange = () => {
    navOpen.value = !navOpen.value;
  };
</script>
