# 🏝️ Jelajah Nusantara — AI-Powered Indonesian Tourism & Cultural Guide


## 📌 Tentang Proyek

**Jelajah Nusantara** adalah aplikasi web interaktif pemandu wisata dan budaya nusantara bertenaga **Google Gemini AI**. Aplikasi ini menghadirkan **Aruna**, sahabat virtual dengan persona *Indonesian hospitality* yang siap membantu wisatawan merencanakan perjalanan, menemukan *hidden gems*, memahami adat dan tradisi lokal, serta mengeksplorasi kuliner autentik di 38 provinsi Indonesia.

Proyek ini dikembangkan sebagai karya akhir (**Final Project**) dalam program pelatihan **AI Productivity and AI API Integration for Developers by Hacktiv8**, mendemonstrasikan implementasi nyata integrasi *Large Language Model (LLM)* ke dalam arsitektur aplikasi web modern full-stack.

---

## ✨ Fitur Utama

- 🌺 **Aruna (Virtual Cultural & Travel Companion)**: Chatbot AI dengan kepribadian ramah, santun, dan kaya wawasan budaya Nusantara serta batasan domain (*guardrails*) yang terarah pada pariwisata Indonesia.
- 💬 **Multi-Turn Conversation**: Percakapan berkelanjutan dengan memori konteks utuh agar interaksi tanya-jawab terasa alami dan kontekstual.
- 🎯 **Destinasi Unggulan & 1-Click Interactive Prompt**:
  - **Kepulauan Raja Ampat** (Papua Barat Daya) — Surga bahari & spot diving kelas dunia.
  - **Candi Borobudur** (Jawa Tengah) — Warisan budaya dunia & keagungan arsitektur abad ke-8.
  - **Wisata Pulau Sabang** (Aceh) — Pesona bahari Pulau Weh, snorkeling Pulau Rubiah, dan Tugu Nol Kilometer.
  - **Gunung Bromo** (Jawa Timur) — Magisnya kaldera kawah aktif dan lautan pasir berbisik.
- ⚡ **Quick Starter Prompts**: Tombol cepat untuk menjelajahi inspirasi populer (hidden gem di Sumba, kuliner malam Solo, dsb.).
- 📝 **Markdown Rich Rendering**: Jawaban dari AI diformat rapi dengan teks tebal, daftar poin (*bullet/numbered list*), dan pemisahan paragraf yang mudah dibaca.
- 📸 **Kemampuan Multimodal (Backend Ready)**: Endpoint backend siap menangani generasi teks, analisis gambar (*image prompt*), dokumen, hingga transkrip audio.

---

## 📸 Tangkapan Layar (Screenshots)

### 1. Beranda & Asisten Virtual Aruna
Tampilan interaktif dengan statistik nusantara, tombol inspirasi cepat (*quick prompts*), dan antarmuka obrolan pintar Aruna.

![Beranda & Chatbot Aruna](docs/screenshots/01_hero_dan_chatbot.png)

### 2. Destinasi Unggulan Interaktif
Kartu destinasi dengan visual memikat (Raja Ampat, Borobudur, Wisata Pulau Sabang di Aceh, dan Gunung Bromo) serta tombol 1-klik untuk menanyakan informasi ke AI.

![Destinasi Unggulan](docs/screenshots/02_destinasi_unggulan.png)

### 3. Interaksi Obrolan Cerdas (Itinerary & Budaya)
Aruna menyusun rencana perjalanan terstruktur per waktu (pagi, siang, sore/malam) lengkap dengan tips etika budaya dan rekomendasi kuliner lokal.

![Interaksi Chatbot Aruna](docs/screenshots/04_chat_interaktif_aruna.png)

### 4. Fitur Cerdas Kecerdasan Buatan
Rangkuman pilar kecerdasan buatan Aruna: itinerary terpersonalisasi, kurasi kuliner autentik, ensiklopedi adat, dan koneksi real-time.

![Fitur Cerdas AI](docs/screenshots/03_fitur_cerdas_ai.png)

### 5. Tampilan Penuh Aplikasi Web
Tangkapan layar menyeluruh dari header hingga footer.

![Tampilan Penuh Jelajah Nusantara](docs/screenshots/05_tampilan_lengkap.png)

---

## 🛠️ Arsitektur & Teknologi

### **Frontend**
- **HTML5 & Semantic Elements** — Struktur bersih, aksesibel, dan ramah SEO.
- **Vanilla CSS3** — Tampilan modern dengan palet warna terkurasi, *glassmorphism*, tipografi Google Fonts (*Plus Jakarta Sans*), serta responsif di berbagai perangkat.
- **Vanilla JavaScript (ES6+)** — Logika interaksi real-time, manajemen state pesan percakapan (*multi-turn*), dan *dynamic DOM rendering*.

### **Backend**
- **Node.js** (ES Modules)
- **Express.js** — REST API framework untuk menangani permintaan web dan routing.
- **`@google/genai` (Google GenAI SDK)** — SDK resmi terbaru dari Google untuk orkestrasi Gemini API.
- **Multer** — Penanganan berkas (*file upload*) untuk fitur multimodal.
- **Dotenv & CORS** — Manajemen variabel lingkungan dan otorisasi *cross-origin*.

---

## 📁 Struktur Direktori

```text
jelajah-nusantara/
├── index.js              # Server backend Express & integrasi Gemini AI API
├── package.json          # Konfigurasi dependensi dan script proyek
├── .env                  # Variabel lingkungan rahasia (API Keys)
├── .env.example          # Contoh template variabel lingkungan
├── .gitignore            # Daftar berkas/folder yang diabaikan git
├── docs/                 # Dokumentasi & tangkapan layar
│   └── screenshots/      # Berkas screenshot antarmuka website
│       ├── 01_hero_dan_chatbot.png
│       ├── 02_destinasi_unggulan.png
│       ├── 03_fitur_cerdas_ai.png
│       ├── 04_chat_interaktif_aruna.png
│       └── 05_tampilan_lengkap.png
├── public/               # Asset statis yang disajikan frontend
│   ├── index.html        # Halaman utama aplikasi
│   ├── style.css         # Styling antarmuka dan desain responsif
│   ├── script.js         # Logika interaksi obrolan & koneksi API
│   └── images/           # Koleksi aset gambar destinasi
│       ├── borobudur.jpg
│       ├── bromo.jpg
│       ├── raja-ampat.jpg
│       └── sabang.jpg
└── README.md             # Dokumentasi proyek
```

---

## 🚀 Panduan Instalasi & Menjalankan Proyek

### 1. Prasyarat Sistem
- **Node.js** versi 18 ke atas
- **npm** (Node Package Manager)
- **Google Gemini API Key** (dapat diperoleh melalui [Google AI Studio](https://aistudio.google.com/))

### 2. Kloning Repositori
```bash
git clone <url-repository-anda>
cd jelajah-nusantara
```

### 3. Instalasi Dependensi
```bash
npm install
```

### 4. Konfigurasi Environment (`.env`)
Salin berkas `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Buka berkas `.env` dan masukkan API Key Google Gemini Anda:
```env
GEMINI_API_KEY=masukkan_api_key_gemini_anda_di_sini
GEMINI_MODEL=gemini-2.5-flash
```

### 5. Jalankan Server
```bash
node index.js
```
Aplikasi akan aktif dan dapat diakses melalui browser pada:
```text
http://localhost:3000
```

---

## 📡 Dokumentasi Endpoint API

| Metode | Endpoint | Deskripsi | Payload |
|---|---|---|---|
| `POST` | `/api/chat` | Percakapan multi-turn bersama Aruna AI | `{ conversation: [{ role, text }] }` |
| `POST` | `/generate-text` | Generasi teks dari prompt tunggal | `{ prompt: "..." }` |
| `POST` | `/generate-image` | Analisis input teks & gambar | Multipart form: `prompt`, `image` |
| `POST` | `/generate-from-document` | Ekstraksi & ringkasan dokumen | Multipart form: `prompt`, `document` |
| `POST` | `/generate-from-audio` | Transkripsi & pemahaman audio | Multipart form: `prompt`, `audio` |


---

## 📄 Lisensi

Proyek ini didistribusikan di bawah lisensi **ISC**. Silakan digunakan dan dikembangkan untuk keperluan edukasi dan eksplorasi teknologi AI.
