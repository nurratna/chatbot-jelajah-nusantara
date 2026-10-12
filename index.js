import "dotenv/config";
import express from "express";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";

const upload = multer();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = process.env.GEMINI_MODEL;

const app = express();

app.use(express.json());

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
                temperature: 0.9,
                systemInstruction: "Jawab menggunakan bahasa Indonesia. Jika pertanyaan tidak jelas, minta klarifikasi. Jika pertanyaan tidak dapat dijawab, katakan 'Maaf, saya tidak tahu.'",
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