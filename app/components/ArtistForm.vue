<template>
  <v-dialog v-model="isActive" :width="600" persistent>
    <v-card>
      <v-toolbar>
        <v-toolbar-title>
          <span v-if="mode === 'create'">Adauga un artist nou</span>
          <span v-else>Modifica un artist</span>
        </v-toolbar-title>
        <v-btn icon="mdi-close" @click="isActive = false"></v-btn>
      </v-toolbar>

      <v-card-text class="px-4">
        <v-text-field
          v-model="formData.name"
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
          v-model="formData.songs"
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
        <v-btn @click="onSave" color="green-darken-4" variant="flat"
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
  const emit = defineEmits(["saved"]);

  const {
    isActive,
    mode,
    formData,
    errorMessage,
    songsOptions,
    openCreate,
    openEdit,
    save,
  } = useArtistForm();

  defineExpose({ openCreate, openEdit });

  const onSave = async () => {
    const result = await save();
    emit("saved", result);
  };
</script>
