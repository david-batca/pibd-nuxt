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
          label="Nume"
          placeholder="Introduceti numele"
          color="success"
          variant="outlined"
          clearable
          hide-details
          class="mb-10"
        ></v-text-field>

        <v-autocomplete
          v-model="songs"
          :items="songOptions"
          item-title="name"
          item-value="id"
          label="Melodii"
          placeholder="Selectati melodiie artistului"
          color="success"
          variant="outlined"
          clearable
          chips
          hide-details
        ></v-autocomplete>
      </v-card-text>

      <v-card-actions>
        <v-btn color="green-darken-4" variant="flat">Salveaza</v-btn>
        <v-btn @click="isActive = false" color="red-darken-4" variant="flat"
          >Anuleaza</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  const isActive = ref(false);
  const name = ref(null);
  const songs = ref([]);
  const songOptions = ref([]);
</script>
