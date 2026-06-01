import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { createClient } from "@supabase/supabase-js";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => ((m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry)),
    );
  }
  return serverEntryPromise;
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }

  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }

  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) {
    return false;
  }

  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

// ─── CORS Headers Configuration ─────────────────────────────────────────
const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:8080",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// ─── Main Server Router Export ───────────────────────────────────────────────
export default {
  async fetch(request: Request, env: any, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    // 1. Handle browser security pre-flight checks
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // 2. Intercept and handle custom Groq AI API traffic
    if (url.pathname === "/api/chat" && request.method === "POST") {
      try {
        const body = await request.json();
        const groqMessages = [];
        
        if (body.system) {
          groqMessages.push({ role: "system", content: body.system });
        }
        groqMessages.push(...body.messages);

        // Setup local fallback credentials for the chat handler
        const supabaseUrl = env?.SUPABASE_URL || "https://erfwqsbgqauathruqkop.supabase.co";
        const supabaseAnonKey = env?.SUPABASE_ANON_KEY || "sb_publishable_8RU4lvokOV_cTowWuMqpXw_G2tXFKiZ";

        // Initialize Supabase safely
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        // DB SAVE 1: Extract the user's newest message and log it to Supabase
        const latestUserMessage = body.messages[body.messages.length - 1];
        if (latestUserMessage && latestUserMessage.role === "user") {
          const { error: dbUserError } = await supabase.from("messages").insert([
            { role: "user", content: latestUserMessage.content }
          ]);
          if (dbUserError) {
            console.error("❌ SUPABASE USER SAVE ERROR:", dbUserError.message, dbUserError.details);
          }
        }
        
        // TEMP TEST: Hardcoding the key directly to see if the connection works!
  const apiKey = env.GROQ_API_KEY;

        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`, 
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: groqMessages,
            max_tokens: body.max_tokens || 1000,
          }),
        });

        const data = await groqResponse.json();

        // DB SAVE 2: Extract the Groq AI's response text and log it to Supabase
        const aiResponseContent = data.choices?.[0]?.message?.content;
        if (aiResponseContent) {
          const { error: dbAiError } = await supabase.from("messages").insert([
            { role: "assistant", content: aiResponseContent }
          ]);
          if (dbAiError) {
            console.error("❌ SUPABASE AI SAVE ERROR:", dbAiError.message, dbAiError.details);
          }
        }

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (error: any) {
        console.error("❌ CRITICAL CHAT API ERROR:", error.message || error);
        
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: corsHeaders,
        });
      }
    }

    // 2.5 Intercept and handle fetching historical chat data from Supabase
    if (url.pathname === "/api/messages" && request.method === "GET") {
      try {
        // Fallback strategy: Same credentials as your chat route
        const supabaseUrl = env?.SUPABASE_URL || "https://erfwqsbgqauathruqkop.supabase.co";
        const supabaseAnonKey = env?.SUPABASE_ANON_KEY || "sb_publishable_8RU4lvokOV_cTowWuMqpXw_G2tXFKiZ";

        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        // Fetch the last 50 messages ordered by time
        const { data, error } = await supabase
          .from("messages")
          .select("role, content")
          .order("created_at", { ascending: true })
          .limit(50);

        if (error) {
          console.error("❌ SUPABASE FETCH HISTORY ERROR:", error.message, error.details);
          throw error;
        }

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (error: any) {
        console.error("❌ ERROR FETCHING MESSAGES ROUTE:", error.message || error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: corsHeaders,
        });
      }
    }

    // 3. Fallback to original TanStack Start SSR Engine for everything else
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return brandedErrorResponse();
    }
  },
};