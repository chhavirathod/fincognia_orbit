import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import twilio from "twilio";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// 🧩 Required for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve moksh_upi.jpg publicly
app.use("/uploads", express.static(path.join(__dirname)));

// ✅ Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;
const toNumber = process.env.MY_WHATSAPP_NUMBER;

console.log("🧩 Twilio SID:", accountSid ? "Loaded" : "Missing");
console.log("🧩 Twilio Token:", authToken ? "Loaded" : "Missing");

const client = twilio(accountSid, authToken);

// ✅ WhatsApp route
app.post("/send-whatsapp", async (req, res) => {
  try {
    const { recipient, amount } = req.body;

    if (!recipient || !amount) {
      return res.status(400).json({ error: "Missing recipient or amount" });
    }

    // 🧩 Publicly accessible local image URL
    const imageUrl = "https://ibb.co/hFkGjK1G";

    const message = await client.messages.create({
      from: fromNumber,
      to: toNumber,
      body: `💸 Payment Request\nSend ₹${amount} to ${recipient}.\nScan the QR to complete payment.`,
      mediaUrl: [imageUrl],
    });

    console.log("✅ WhatsApp Message SID:", message.sid);
    res.status(200).json({ success: true, sid: message.sid });
  } catch (error) {
    console.error("❌ WhatsApp Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
