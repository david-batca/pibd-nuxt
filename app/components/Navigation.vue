<template>
  <v-navigation-drawer
    :model-value="navOpen"
    :elevation="0"
    color="green-darken-4"
    floating
    class="pt-4 px-4"
  >
    <v-list class="h-100">
      <v-list-item
        :to="{ name: 'home' }"
        :active="route.name === 'home'"
        class="rounded-pill mb-4"
        >Acasa
      </v-list-item>
      <v-list-item
        :to="{ name: 'artists' }"
        :active="route.name === 'artists'"
        class="rounded-pill mb-4"
        >Artisti
      </v-list-item>
      <v-list-item
        :to="{ name: 'songs' }"
        :active="route.name === 'songs'"
        class="rounded-pill"
        >Melodii
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
  const { navOpen } = defineProps(["navOpen"]);
  const route = useRoute();
</script>
