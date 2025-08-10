<template>
  <div class="d-flex flex-column h-100">
    <v-sheet
      class="bg-surface rounded-lg pa-4 d-flex align-center justify-space-between mb-10"
      ><h1>Artisti</h1>
      <v-btn @click="formRef.openCreate()" color="green-darken-4"
        >Adauga un artist nou</v-btn
      >
    </v-sheet>

    <ArtistForm ref="formRef" @saved="onSaved" />

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
            @click="formRef.openEdit(item.id)"
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

  const onSaved = ({ mode, data }) => {
    if (mode === "create") {
      artists.value = [...artists.value, data];
    } else {
      artists.value = artists.value.map((artist) =>
        artist.id === data.id ? data : artist
      );
    }
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
