export const useArtistForm = () => {
  const isActive = ref(false);
  const mode = ref("create");
  const formData = ref({
    name: null,
    songs: [],
  });
  const errorMessage = ref(null);

  const { data: songsOptions } = useFetch("/api/songs/options");

  const resetForm = () => {
    formData.value.name = null;
    formData.value.songs = [];
  };

  const openCreate = () => {
    mode.value = "create";
    resetForm();
    isActive.value = true;
  };

  const loadById = async (artistId) => {
    const data = await $fetch(`/api/artists/${artistId}`);

    formData.value = structuredClone(data);
  };

  const openEdit = async (id) => {
    mode.value = "edit";
    resetForm();
    await loadById(id);
    isActive.value = true;
  };

  const save = async () => {
    errorMessage.value = null;
    try {
      if (mode.value === "edit" && formData.value.id) {
        const data = await $fetch(`/api/artists/${formData.value.id}`, {
          method: "PATCH",
          body: {
            name: formData.value.name,
            songs: formData.value.songs,
          },
        });

        isActive.value = false;
        resetForm();

        return { mode: "edit", data };
      } else {
        const data = await $fetch("/api/artists", {
          method: "POST",
          body: {
            name: formData.value.name,
            songs: formData.value.songs,
          },
        });

        isActive.value = false;
        resetForm();

        return { mode: "create", data };
      }
    } catch (error) {
      errorMessage.value = error.statusMessage;
    }
  };

  return {
    isActive,
    mode,
    formData,
    errorMessage,
    songsOptions,
    openCreate,
    openEdit,
    save,
  };
};
