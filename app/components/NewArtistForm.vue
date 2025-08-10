<template>
  <v-dialog v-model="isActive" :width="600" persistent>
    <template #activator="{ props }">
      <v-btn v-bind="props" color="green-darken-4">Adauga un artist nou</v-btn>
    </template>

    <v-card>
      <v-toolbar>
        <v-toolbar-title>Adauga un artist nou</v-toolbar-title>
        <v-btn icon="mdi-close" @click="isActive = false"></v-btn>
      </v-toolbar>

      <v-card-text class="px-4">
        <v-text-field
          v-model="name"
          placeholder="Introduceti numele"
          color="success"
          variant="outlined"
          clearable
          hide-details
          class="mb-10"
          ><template #label
            ><span>Nume <em class="text-error">*</em></span></template
          ></v-text-field
        >

        <v-autocomplete
          v-model="songs"
          :items="songsOptions"
          item-title="name"
          item-value="id"
          label="Melodii"
          placeholder="Selectati melodiie artistului"
          color="success"
          variant="outlined"
          multiple
          clearable
          chips
          hide-details
          class="mb-10"
        ></v-autocomplete>

        <div v-if="errorMessage" class="text-error">{{ errorMessage }}</div>
      </v-card-text>

      <v-card-actions>
        <v-btn @click="addArtist" color="green-darken-4" variant="flat"
          >Salveaza</v-btn
        >
        <v-btn @click="isActive = false" color="red-darken-4" variant="flat"
          >Anuleaza</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  const emit = defineEmits(["appendArtist"]);
  const isActive = ref(false);
  const name = ref(null);
  const songs = ref([]);
  const errorMessage = ref(null);

  const {
    data: songsOptions,
    error,
    pending,
  } = await useFetch("/api/songs/options");

  const addArtist = async () => {
    errorMessage.value = null;

    try {
      const response = await $fetch("/api/artists", {
        method: "POST",
        body: {
          name: name.value,
          songs: songs.value,
        },
      });

      isActive.value = false;
      name.value = null;
      songs.value = [];

      emit("appendArtist", response);
    } catch (error) {
      errorMessage.value = error.statusMessage;
    }
  };
</script>
