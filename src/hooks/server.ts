import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import twilio from "twilio";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER!;

const client = twilio(accountSid, authToken);

app.post("/sendPaymentQR", async (req, res) => {
  const { phone, qrImageUrl, recipient, amount } = req.body;

  if (!phone || !qrImageUrl || !recipient || !amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const message = await client.messages.create({
      from: twilioPhone,
      to: phone,
      body: `Payment QR for ₹${amount} to ${recipient}. Scan the image to complete payment.`,
      mediaUrl: [qrImageUrl],
    });

    console.log("✅ Twilio message sent:", message.sid);
    res.status(200).json({ success: true, sid: message.sid });
  } catch (error: any) {
    console.error("❌ Twilio Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
