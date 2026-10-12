import "dotenv/config";
import express from "express";
import multer from "multer";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = process.env.GEMINI_MODEL;

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/generate-text", async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });

        res.status(200).json({ result: response.text });
    } catch (error) {
        console.log("Error generating text:", error);
        res.status(500).json({ message: error.message });
    }
});

app.post("/generate-image", upload.single("image"), async (req, res) => {
    const { prompt } = req.body;
    const base64Image = req.file.buffer.toString("base64");

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: [{ text: prompt, type: "text" }, { inlineData: { data: base64Image, mimeType: req.file.mimetype } }],
        });

        res.status(200).json({ result: response.text });
    } catch (error) {
        console.log("Error generating image:", error);
        res.status(500).json({ message: error.message });
    }
});

app.post("/generate-from-document", upload.single("document"), async (req, res) => {
    const { prompt } = req.body;
    const base64Document = req.file.buffer.toString("base64");

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: [{ text: prompt ?? "buatkan ringkasan dari dokumen berikut.", type: "text" }, { inlineData: { data: base64Document, mimeType: req.file.mimetype } }],
        });
        res.status(200).json({ result: response.text });
    } catch (error) {
        console.log("Error generating content from document:", error);
        res.status(500).json({ message: error.message });
    }
});

app.post("/generate-from-audio", upload.single("audio"), async (req, res) => {
    const { prompt } = req.body;
    const base64Audio = req.file.buffer.toString("base64");

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: [{ text: prompt ?? "buatkan transkrip dari rekaman berikut.", type: "text" }, { inlineData: { data: base64Audio, mimeType: req.file.mimetype } }],
        });

        res.status(200).json({ result: response.text });
    } catch (error) {
        console.log("Error generating content from audio:", error);
        res.status(500).json({ message: error.message });
    }
});

app.post("/api/chat", async (req, res) => {
    const { conversation } = req.body;

    try {
        if (!Array.isArray(conversation)) throw new Error("Conversation must be an array of messages.");

        const contents = conversation.map(({ role, text }) => ({
            role,
            parts: [{ text }],
        }));

        const response = await ai.models.generateContent({
            model: model,
            contents,
            config: {
                temperature: 0.7,
                systemInstruction: `Kamu adalah Aruna, pemandu wisata dan budaya virtual untuk platform "Jelajah Nusantara". Tugasmu membantu wisatawan merencanakan perjalanan, mengeksplorasi destinasi alam, memahami tradisi lokal, dan menikmati kuliner autentik di 38 provinsi Indonesia.

1. TONE & GAYA:
   - Ramah, hangat, sopan, dan mencerminkan keramahan khas Indonesia (Indonesian hospitality).
   - Gunakan Bahasa Indonesia yang luwes dan komunikatif. Kamu boleh menyapa dengan salam kedaerahan yang relevan saat membahas daerah tertentu (misal: "Sampurasun", "Horas", "Tabik Pun", "Om Swastyastu").

2. FORMAT JAWABAN:
   - Gunakan format Markdown yang rapi (**tebal** untuk nama tempat/kuliner penting, bullet points, dan paragraf pendek).
   - Untuk rencana perjalanan (itinerary), susun terstruktur per hari dengan alur waktu yang jelas (Pagi, Siang, Sore/Malam).
   - Selalu sertakan bagian "💡 Tips Lokal / Etika Budaya" jika relevan (misal: pakaian yang pantas di tempat sakral, waktu terbaik berkunjung, atau tips keselamatan).
   - Tutup dengan 1 pertanyaan lanjutan yang membantu dan ramah untuk melanjutkan eksplorasi.

3. BATASAN & DOMAIN GUARDRAILS:
   - Fokus HANYA pada pariwisata, kebudayaan, kuliner, geografi, dan sejarah Indonesia.
   - Jika pengguna bertanya di luar topik (misal: coding, matematika, politik praktis, kripto), tolak secara sopan dan ajak kembali menjelajahi Nusantara.
   - Jika pertanyaan ambigu, minta klarifikasi preferensi wisata pengguna (durasi, kota/wilayah, atau jenis wisata).
   - Untuk informasi yang rentan berubah seperti harga tiket dan jadwal transportasi, berikan kisaran umum/estimasi dan sarankan mengecek informasi resmi pengelola. Jangan mengarang data presisi.`,
            },
        });

        res.status(200).json({ result: response.text });
    } catch (error) {
        console.log("Error generating chat response:", error);
        res.status(500).json({ message: error.message });
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});