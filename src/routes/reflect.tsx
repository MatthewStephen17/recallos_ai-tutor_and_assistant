import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { Moon, Sparkles, TrendingUp, AlertCircle, ArrowRight, Sunrise } from "lucide-react";

export const Route = createFileRoute("/reflect")({
  head: () => ({
    meta: [
      { title: "Daily reflection · RecallOS" },
      { name: "description", content: "Your day, reviewed by AI — wins, gaps and tomorrow's plan." },
    ],
  }),
  component: Reflect,
});

function Reflect() {
  return (
    <AppShell>
      <div className="p-6 md:p-10 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Moon className="size-4" /> Tonight's reflection
        </div>
        <h1 className="mt-2 font-display text-4xl font-bold">
          Today, you grew <span className="text-gradient">a little wiser.</span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 glass-strong rounded-3xl p-8"
        >
          <div className="flex items-center gap-2 text-xs text-primary uppercase tracking-widest">
            <Sparkles className="size-3" /> AI Summary
          </div>
          <p className="mt-4 text-lg leading-relaxed">
            You spent <span className="text-gradient font-semibold">47 minutes</span> deep in
            biology — mastering mitochondria and the electron transport chain. You skipped
            chemistry revision and your trigonometry confidence dropped slightly. You're on a
            <span className="text-primary font-semibold"> 12-day streak</span> — keep the rhythm.
          </p>
        </motion.div>

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <Section title="Wins" icon={TrendingUp} accent="text-emerald-300">
            <ul className="space-y-2 text-sm">
              <li>· Mastered 14 new flashcards</li>
              <li>· Recall on Cellular Respiration: 94%</li>
              <li>· Completed 3 of 4 daily tasks</li>
            </ul>
          </Section>
          <Section title="Gaps" icon={AlertCircle} accent="text-orange-300">
            <ul className="space-y-2 text-sm">
              <li>· Trigonometric identities — needs revisit</li>
              <li>· Skipped chemistry queue (3 cards)</li>
              <li>· Quiz attention dropped after 18 min</li>
            </ul>
          </Section>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-6 glass rounded-3xl p-6"
        >
          <div className="flex items-center gap-2 text-xs text-accent uppercase tracking-widest mb-4">
            <Sunrise className="size-3" /> Tomorrow's plan
          </div>
          <ol className="space-y-3">
            {[
              "Warm-up: 5 trig flashcards (4 min)",
              "Chemistry catch-up — Acid/Base (12 min)",
              "Biology quiz: Cellular Respiration (10 min)",
              "Reflection journal (3 min)",
            ].map((t, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="size-7 rounded-lg bg-gradient-primary grid place-items-center text-xs text-primary-foreground font-semibold glow-primary">
                  {i + 1}
                </div>
                <span className="text-sm">{t}</span>
              </li>
            ))}
          </ol>
          <button className="mt-6 inline-flex items-center gap-2 text-sm text-primary hover:underline">
            Reorganize tomorrow with AI <ArrowRight className="size-3.5" />
          </button>
        </motion.div>
      </div>
    </AppShell>
  );
}

function Section({
  title, icon: Icon, accent, children,
}: { title: string; icon: any; accent: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`size-4 ${accent}`} />
        <h3 className="font-display font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}
