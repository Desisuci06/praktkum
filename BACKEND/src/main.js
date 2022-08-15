import express from "express";
import { PrismaClient } from "@prisma/client";
const database = new PrismaClient();
const app = express();
app.use(express.json());
const port = 7000;

app.get("/buku", async (req, res) => {
  try {
    const buku = await database.buku.findMany();
    if (!buku) throw new Error("Buku tidak tersedia");
    res.send(buku);
  } catch (err) {
    res.send({ status: 404, message: err.message });
  }
});

app.get("/buku/:id", async (req, res) => {
  try {
    const buku = await database.buku.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });
    if (!buku) throw new Error("Buku tidak tersedia");

    res.send(buku);
  } catch (err) {
    res.send({ status: 404, message: err.message });
  }
});

app.post("/buku/create", async (req, res) => {
  try {
    const buku = await database.buku.create({
      data: {
        judul: req.body.judul,
        penulis: req.body.penulis,
        penerbit: req.body.penerbit,
        tahun: req.body.tahun,
      },
    });
    res.send({ message: "Buku Berhasil ditambahkan", data: buku });
  } catch (err) {}
});

app.delete("/buku/delete", async (req, res) => {
  try {
    const buku = await database.buku.delete({
      where: {
        id: req.body.id,
      },
    });
    if (!buku) throw new Error("Gagal menghapus buku");
    res.send({ message: "Berhasil menghapus buku" });
  } catch (err) {
    res.send({ message: err.message });
  }
});

app.put("/buku/update/", async (req, res) => {
  try {
    const buku = await database.buku.update({
      where: {
        id: req.body.id,
      },
      data: {
        judul: req.body.judul,
        penulis: req.body.penulis,
        penerbit: req.body.penerbit,
        tahun: req.body.tahun,
      },
    });
    res.send({ message: "Buku Berhasil diupdate", data: buku });
  } catch (err) {}
});

app.listen(port, () => {
  console.log(`Aplikasi nya jalan di port ${port}`);
});
