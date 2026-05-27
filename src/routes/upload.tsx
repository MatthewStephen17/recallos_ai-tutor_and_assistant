import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { Upload, FileText, Mic, Type, Sparkles, FileAudio, FileType } from "lucide-react";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Capture · RecallOS" },
      { name: "description", content: "Upload PDFs, lectures, or notes — turn them into knowledge." },
    ],
  }),
  component: UploadPage,
});

function UploadPage() {
  const [tab, setTab] = useState<"file" | "audio" | "text">("file");
  return (
    <AppShell>
      <div className="p-6 md:p-10 max-w-5xl mx-auto">
        <div className="text-sm text-muted-foreground">Capture</div>
        <h1 className="mt-1 font-display text-4xl font-bold">
          Feed your <span className="text-gradient">second brain.</span>
        </h1>
        <p className="mt-2 text-muted-foreground max-w-xl">
          Drop a PDF, record a lecture, or paste your notes. RecallOS will summarize, structure
          and schedule everything for lifelong recall.
        </p>

        <div className="mt-8 flex gap-2">
          {[
            { k: "file", label: "Document", icon: FileText },
            { k: "audio", label: "Audio / lecture", icon: Mic },
            { k: "text", label: "Paste text", icon: Type },
          ].map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k as any)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                tab === t.k
                  ? "bg-gradient-primary text-primary-foreground glow-primary"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="size-4" />
              {t.label}
            </button>
          ))}
        </div>

        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 glass-strong rounded-3xl p-10"
        >
          {tab === "file" && <Dropzone icon={FileType} label="PDF, DOCX or slides" />}
          {tab === "audio" && <Dropzone icon={FileAudio} label="MP3, WAV or M4A · auto-transcribed" />}
          {tab === "text" && (
            <textarea
              placeholder="Paste lecture notes, an article, or a thought..."
              className="w-full h-64 bg-transparent border border-border rounded-2xl p-5 text-sm focus:outline-none focus:border-primary resize-none"
            />
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {["Summarize", "Flashcards", "Quiz", "Break into tasks", "Add to graph"].map((p) => (
                <label
                  key={p}
                  className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs cursor-pointer hover:bg-white/10"
                >
                  <input type="checkbox" defaultChecked className="accent-primary" />
                  {p}
                </label>
              ))}
            </div>
            <button className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground font-medium px-6 py-3 rounded-full glow-primary hover:scale-105 transition">
              <Sparkles className="size-4" /> Process with AI
            </button>
          </div>
        </motion.div>

        <div className="mt-10">
          <h2 className="font-display text-xl font-semibold mb-4">Recent captures</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { t: "Cellular Respiration.pdf", meta: "Biology · 12 cards", time: "2h ago" },
              { t: "MIT Linear Algebra L3", meta: "Math · 18 cards · 1 quiz", time: "Yesterday" },
              { t: "Atomic Habits — Ch.4", meta: "Self · 8 cards", time: "3d ago" },
            ].map((c, i) => (
              <div key={i} className="glass rounded-2xl p-5 hover:border-primary/40 transition">
                <FileText className="size-5 text-primary" />
                <div className="mt-3 font-semibold">{c.t}</div>
                <div className="text-xs text-muted-foreground mt-1">{c.meta}</div>
                <div className="text-xs text-muted-foreground/70 mt-3">{c.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Dropzone({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <label className="block border-2 border-dashed border-border rounded-2xl p-12 text-center cursor-pointer hover:border-primary/60 hover:bg-white/5 transition">
      <input type="file" className="hidden" />
      <div className="mx-auto size-14 rounded-2xl bg-gradient-primary grid place-items-center glow-primary mb-4">
        <Upload className="size-6 text-primary-foreground" />
      </div>
      <div className="font-display text-lg font-semibold">Drop here or click to upload</div>
      <div className="text-sm text-muted-foreground mt-1 inline-flex items-center gap-1.5">
        <Icon className="size-3.5" /> {label}
      </div>
    </label>
  );
}
