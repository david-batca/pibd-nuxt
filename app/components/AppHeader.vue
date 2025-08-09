<template>
  <v-app-bar :elevation="0" color="green-darken-4" title="Bazar de muzica">
    <template #prepend>
      <v-app-bar-nav-icon @click="$emit('navChange')"></v-app-bar-nav-icon>
    </template>
  </v-app-bar>
</template>
