export const useSongForm = () => {
  const isActive = ref(false);
  const mode = ref("create");
  const formData = ref({
    name: null,
    artists: [],
  });
  const errorMessage = ref(null);

  const { data: artistsOptions } = useFetch("/api/artists/options");

  const resetForm = () => {
    formData.value.name = null;
    formData.value.artists = [];
  };

  const openCreate = () => {
    mode.value = "create";
    resetForm();
    isActive.value = true;
  };

  const loadById = async (songId) => {
    const data = await $fetch(`/api/songs/${songId}`);

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
        const data = await $fetch(`/api/songs/${formData.value.id}`, {
          method: "PATCH",
          body: {
            name: formData.value.name,
            artists: formData.value.artists,
          },
        });

        isActive.value = false;
        resetForm();

        return { mode: "edit", data };
      } else {
        const data = await $fetch("/api/songs", {
          method: "POST",
          body: {
            name: formData.value.name,
            artists: formData.value.artists,
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
    artistsOptions,
    openCreate,
    openEdit,
    save,
  };
};
