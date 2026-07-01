import OpenAI from "openai";
import express from "express";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const app = express();

app.use(express.json());

app.post("/chat", async (req, res) => {
    try {
        const { messages } = req.body;

        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",  // or gpt-4.1 for higher quality
            messages,
        });

        const reply = completion.choices[0].message.content;

        // Return updated messages so the widget keeps context
        res.json({
            reply,
            messages: [...messages, { role: "assistant", content: reply }],
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ reply: "Server error contacting ChatGPT." });
    }
});

app.listen(3000, () => console.log("TARA Assistant running"));
