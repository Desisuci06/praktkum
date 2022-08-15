const { createApp, ref, onMounted } = Vue;
const app = createApp({
  setup() {
    const url = "http://localhost:7000/buku";
    const buku = ref({
      id: null,
      judul: "",
      penulis: "",
      penerbit: "",
      tahun: "",
      list: [],
      errorMessage: "",
      isError: false,
      isUpdate: false,
    });

    const getBuku = async () => {
      try {
        buku.value.isUpdate = false;
        const resBuku = await axios.get(url);
        if (resBuku.data.length === 0) throw new Error("Buku tidak tersedia");
        buku.value.list = resBuku.data;
        return resBuku.data;
      } catch (err) {
        buku.value.isError = true;
        buku.value.errorMessage = err.message;
        buku.value.isUpdate = false;
      }
    };

    const getBukuById = async (id) => {
      try {
        const resBuku = await axios.get(url + `/${id}`);
        if (resBuku.data.length === 0) throw new Error("Buku tidak tersedia");
        buku.value.isUpdate = true;
        buku.value.id = id;
        buku.value.judul = resBuku.data.judul;
        buku.value.penulis = resBuku.data.penulis;
        buku.value.penerbit = resBuku.data.penerbit;
        buku.value.tahun = resBuku.data.tahun;

        return resBuku.data;
      } catch (err) {
        buku.value.id = "";
        buku.value.judul = "";
        buku.value.penulis = "";
        buku.value.penerbit = "";
        buku.value.tahun = "";
        buku.value.isUpdate = false;
        buku.value.isError = true;
        buku.value.errorMessage = err.message;
      }
    };

    const deleteBuku = async (id) => {
      try {
        buku.value.isUpdate = false;
        const resBuku = await axios.delete(url + "/delete", {
          data: {
            id,
          },
        });
        if (resBuku.data.length === 0) throw new Error("Gagal menghapus buku");
        buku.value.list = resBuku.data;
        await getBuku();
        return resBuku.data;
      } catch (err) {
        buku.value.isError = true;
        buku.value.errorMessage = err.message;
      }
    };
    const submitBuku = async () => {
      try {
        buku.value.isUpdate = false;
        const resBuku = await axios.post(url + "/create", {
          judul: buku.value.judul,
          penulis: buku.value.penulis,
          penerbit: buku.value.penerbit,
          tahun: buku.value.tahun,
        });
        buku.value.isError = false;
        buku.value.judul = "";
        buku.value.penulis = "";
        buku.value.penerbit = "";
        buku.value.tahun = "";
        buku.value.isUpdate = false;
        if (!resBuku) throw new Error("Gagal menambahkan buku");
        await getBuku();
      } catch (err) {
        buku.value.isError = true;
        buku.value.errorMessage = err.message;
      }
    };
    const updateBuku = async () => {
      try {
        buku.value.isUpdate = true;
        const resBuku = await axios.put(url + "/update", {
          id: buku.value.id,
          judul: buku.value.judul,
          penulis: buku.value.penulis,
          penerbit: buku.value.penerbit,
          tahun: buku.value.tahun,
        });
        buku.value.isError = false;
        buku.value.judul = "";
        buku.value.penulis = "";
        buku.value.penerbit = "";
        buku.value.tahun = "";
        buku.value.isUpdate = false;
        buku.value.isError = true;
        if (!resBuku) throw new Error("Gagal mengubah buku");
        await getBuku();
      } catch (err) {
        buku.value.isUpdate = false;
        buku.value.isError = true;
        buku.value.errorMessage = err.message;
      }
    };
    onMounted(async () => {
      await getBuku();
    });

    return {
      buku,
      getBuku,
      deleteBuku,
      getBukuById,
      submitBuku,
      updateBuku,
    };
  },
});

app.mount("#app");
