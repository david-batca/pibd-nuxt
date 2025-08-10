<template>
  <div class="d-flex flex-column h-100">
    <v-sheet
      class="bg-surface rounded-lg pa-4 d-flex align-center justify-space-between mb-10"
      ><h1>Melodii</h1>
      <SongForm ref="formRef" @saved="onSaved"
    /></v-sheet>

    <v-data-table
      :items="songs"
      :headers="headers"
      class="h-100 rounded-lg pa-4"
    >
      <template #item.artists="{ item }">
        <div class="d-flex flex-column">
          <div v-for="artist in item.artists" :key="artist.id">
            {{ artist.name }}
          </div>
        </div>
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex align-center justify-end">
          <v-btn
            @click="editSong(item.id)"
            color="success"
            variant="text"
            icon="mdi-pencil"
            size="x-small"
            class="me-2"
          ></v-btn>
          <v-btn
            @click="deleteSong(item.id)"
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
  const { data: songs, error, pending } = await useFetch("/api/songs");

  const formRef = ref(null);

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
      title: "Artisti",
      key: "artists",
      sortable: false,
    },
    {
      title: "",
      key: "actions",
      sortable: false,
    },
  ];

  const onSaved = ({ mode, data }) => {
    if (mode === "create") {
      songs.value = [...songs.value, data];
    } else {
      console.log({ mode, data });
      songs.value = songs.value.map((song) =>
        song.id === data.id ? data : song
      );
    }
  };

  const editSong = (id) => {
    formRef.value.openEdit(id);
  };

  const deleteSong = async (id) => {
    try {
      const response = await $fetch(`/api/songs/${id}`, {
        method: "DELETE",
      });

      songs.value = songs.value.filter((song) => song.id !== id);
    } catch (error) {}
  };
</script>
