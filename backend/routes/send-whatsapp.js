import express from "express";
import twilio from "twilio";

const router = express.Router();

// Twilio client setup
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

router.post("/send-whatsapp", async (req, res) => {
  try {
    const { recipient, amount } = req.body;

    // Message body
    const body = `💸 *Payment Request*\n\nSend ₹${amount} to ${recipient}.\nScan the attached QR to complete payment.`;

    // ✅ Replace this URL with your actual deployed image URL
    const qrUrl = "https://ibb.co/hFkGjK1G";

    // Send WhatsApp message
    const message = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER, // Twilio Sandbox number
      to: process.env.MY_WHATSAPP_NUMBER, // Your WhatsApp
      body,
      mediaUrl: [qrUrl],
    });

    console.log("✅ WhatsApp Message SID:", message.sid);
    res.json({ success: true, sid: message.sid });
  } catch (error) {
    console.error("❌ WhatsApp Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
