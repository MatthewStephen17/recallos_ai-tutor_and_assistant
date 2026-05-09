import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Send, Sparkles, Brain, Lightbulb, HelpCircle, Zap } from "lucide-react";

export const Route = createFileRoute("/tutor")({
  head: () => ({
    meta: [
      { title: "AI Tutor · RecallOS" },
      { name: "description", content: "An adaptive tutor that explains, quizzes and simplifies any concept." },
    ],
  }),
  component: TutorPage,
});

type Msg = { role: "user" | "assistant"; text: string };

function TutorPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Hi — I'm your RecallOS tutor. Ask me to explain a concept, quiz you, or break down a topic. What are we learning today?",
    },
  ]);

  const send = () => {
    if (!input.trim()) return;
    setMessages((m) => [
      ...m,
      { role: "user", text: input },
      {
        role: "assistant",
        text: "Great question. Connect Lovable AI to enable live tutoring — once enabled I'll explain, quiz and adapt to how you learn.",
      },
    ]);
    setInput("");
  };

  const modes = [
    { icon: Lightbulb, label: "Explain like I'm 12" },
    { icon: HelpCircle, label: "Quiz me hard" },
    { icon: Brain, label: "Use analogies" },
    { icon: Zap, label: "1-minute summary" },
  ];

  return (
    <AppShell>
      <div className="flex flex-col h-screen">
        <div className="p-6 md:p-10 pb-4 border-b border-border/40">
          <div className="text-sm text-muted-foreground">AI Tutor</div>
          <h1 className="mt-1 font-display text-3xl font-bold">
            Learn anything, <span className="text-gradient">your way.</span>
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto px-6 md:px-10 py-6">
          <div className="max-w-3xl mx-auto space-y-5">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-gradient-primary text-primary-foreground"
                      : "glass"
                  }`}
                >
                  {m.role === "assistant" && (
                    <div className="flex items-center gap-1.5 text-xs text-primary mb-1.5">
                      <Sparkles className="size-3" /> RecallOS
                    </div>
                  )}
                  {m.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border/40 p-4 md:p-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-3">
              {modes.map((m) => (
                <button
                  key={m.label}
                  onClick={() => setInput(m.label + ": ")}
                  className="inline-flex items-center gap-1.5 glass rounded-full px-3 py-1.5 text-xs hover:bg-white/10 transition"
                >
                  <m.icon className="size-3 text-primary" />
                  {m.label}
                </button>
              ))}
            </div>
            <div className="glass-strong rounded-2xl p-2 flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                rows={1}
                placeholder="Ask anything — concepts, quizzes, breakdowns..."
                className="flex-1 bg-transparent px-3 py-2.5 text-sm focus:outline-none resize-none max-h-32"
              />
              <button
                onClick={send}
                className="size-10 rounded-xl bg-gradient-primary grid place-items-center glow-primary hover:scale-105 transition"
              >
                <Send className="size-4 text-primary-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
