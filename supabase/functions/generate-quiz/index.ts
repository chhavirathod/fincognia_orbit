// /supabase/functions/generate-quiz/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ✅ Deno entrypoint
serve(async (req: Request): Promise<Response> => {
  // Handle preflight CORS request
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      status: 200,
    });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set in environment variables.");
    }

    console.log("🧠 Generating fraud detection quiz using Gemini API...");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `
You are a fraud detection expert for fintech.
Generate 5 multiple-choice questions about fraud detection, scam prevention, and fintech security.
Each question should:
- Include realistic scenarios.
- Have 4 options and exactly one correct answer.
Return ONLY valid JSON (no markdown, no code blocks):
{
  "questions": [
    {
      "question": "Question text",
      "options": ["A", "B", "C", "D"],
      "answer": 0
    }
  ]
}`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("Gemini API Error:", response.status, text);
      return new Response(
        JSON.stringify({ error: "Gemini API request failed", details: text }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!content) throw new Error("No response content from Gemini API.");

    const cleaned = content.replace(/```json|```/g, "").trim();
    const quizData = JSON.parse(cleaned);

    console.log(`✅ Generated ${quizData.questions?.length || 0} questions.`);

    return new Response(JSON.stringify(quizData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("❌ Error in generate-quiz function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal Server Error",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
