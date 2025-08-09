<template>
  <div class="d-flex flex-column h-100">
    <v-sheet
      class="bg-surface rounded-lg pa-4 d-flex align-center justify-space-between mb-10"
      ><h1>Melodii</h1>
      <NewSongForm
    /></v-sheet>

    <v-data-table :items="songs" class="h-100 rounded-lg"></v-data-table>
  </div>
</template>

<script setup>
  const { data: songs, error, pending } = await useFetch("/api/songs");
</script>
