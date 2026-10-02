# CodeStep Fantasy: Dungeon of Logic (MVP Level 1)

> **Prototipe Media Pembelajaran Game Edukasi Berbasis Web Menggunakan Phaser dengan Integrasi *Learning Analytics* untuk Melatih Kemampuan Logika Algoritma Siswa SMK**  
> *Pengembangan Tugas Akhir / Skripsi — Program Studi S1 Pendidikan Teknologi Informasi, Universitas Negeri Surabaya*

---

## 📌 Gambaran Proyek
**CodeStep Fantasy** adalah media pembelajaran *game-based learning* berbasis web dengan pendekatan petualangan fantasi labirin (*dungeon grid-based puzzle*). Game ini dirancang untuk mengatasi miskonsepsi model eksekusi program (*notional machine*) dan mengurangi kecemasan koding (*computer anxiety / fear of failure*) pada siswa SMK non-TI kelas X (Fase E).

Melalui mekanisme perencanaan instruksi sebelum eksekusi, siswa melatih kemampuan berpikir komputasional pada materi kontrol alur **Runtunan (*Sequence*)** dan **Percabangan (*Branching / If-Condition*)** secara visual, sementara perilaku penalaran mereka direkam secara otomatis melalui instrumen *in-game telemetry*.

---

## 📸 Tampilan Antarmuka (MVP)

<img width="1077" height="763" alt="MVP CodestepFantasy" src="https://github.com/user-attachments/assets/d2dfffcc-0cdd-4f05-b470-f54119566212" />

---

## 🕹️ Mekanisme Gameplay & Konsep Pembelajaran (Level 1)
1. **Premis Petualangan:**
   * Karakter petualang berada di dalam labirin berpetak dan menghadapi rintangan jebakan paku sebelum mencapai tangga keluar (*exit*).
   * Karena karakter ragu melangkah tanpa rencana, siswa bertindak sebagai pengatur strategi yang menyusun runtunan instruksi di panel logika.
2. **Interaksi Logika Pemrograman:**
   * Siswa menyusun kartu instruksi ke dalam antrean:
     * `MAJU_LANGKAH` : Menggerakkan karakter 1 petak ke depan.
     * `IF (Paku) ➔ TAMENG` : Mengaktifkan pertahanan diri jika petak yang dihadapi memiliki jebakan bahaya.
3. **Eksekusi Per Langkah (*Tracing Visual*):**
   * Saat tombol **Jalankan Rencana** ditekan, antrean perintah dieksekusi satu per satu secara berurutan (*step-by-step*), memberikan representasi konkret tentang bagaimana komputer mengeksekusi baris kode.

---

## 📊 Integrasi Learning Analytics (In-Game Telemetry)
Setiap kali tombol jalankan ditekan, sistem secara otomatis mencatat jejak penalaran kognitif siswa ke dalam payload analitik:
* **`total_attempts`**: Jumlah iterasi percobaan hingga siswa berhasil memecahkan level.
* **`duration_seconds`**: Waktu yang dialokasikan siswa untuk merenung dan menyusun alur rencana.
* **`commands_sequence`**: Urutan dan jenis instruksi yang dipasang siswa.
* **`failed_at_step`**: Deteksi indeks langkah spesifik di mana terjadi kegagalan/miskonsepsi logika.
* **`error_detail`**: Jenis kesalahan logika (misalnya tertusuk paku karena melangkah tanpa proteksi percabangan).

---

## 🛠️ Tech Stack
* **Framework:** Next.js (App Router, TypeScript)
* **Game Engine:** Phaser 3 (Canvas Grid & State Management)
* **Styling:** Tailwind CSS
* **Penyimpanan Telemetri:** Webhook / REST API / Supabase Client
* **Version Control:** Git & GitHub

---
