<template>
  <div class="d-flex flex-column h-100">
    <v-sheet
      class="bg-surface rounded-lg pa-4 d-flex align-center justify-space-between mb-10"
      ><h1>Artisti</h1>
      <NewArtistForm @appendArtist="appendArtist"
    /></v-sheet>

    <v-data-table
      :items="artists"
      :headers="headers"
      class="h-100 rounded-lg pa-4"
    >
      <template #item.songs="{ item }">
        <div class="d-flex flex-column">
          <div v-for="song in item.songs" :key="song.id">
            {{ song.name }}
          </div>
        </div>
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex align-center justify-end">
          <v-btn
            color="success"
            variant="text"
            icon="mdi-pencil"
            size="x-small"
            class="me-2"
          ></v-btn>
          <v-btn
            @click="deleteArtist(item.id)"
            color="error"
            variant="text"
            icon="mdi-delete"
            size="x-small"
          ></v-btn>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
  const { data: artists, error, pending } = await useFetch("/api/artists");

  const headers = [
    {
      title: "Id",
      key: "id",
    },
    {
      title: "Nume",
      key: "name",
    },
    {
      title: "Melodii",
      key: "songs",
      sortable: false,
    },
    {
      title: "",
      key: "actions",
      sortable: false,
    },
  ];

  const appendArtist = (newArtist) => {
    artists.value = [...artists.value, newArtist];
  };

  const deleteArtist = async (id) => {
    try {
      const response = await $fetch(`/api/artists/${id}`, {
        method: "DELETE",
      });

      artists.value = artists.value.filter((artist) => artist.id !== id);
    } catch (error) {}
  };
</script>
