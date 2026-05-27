import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import {
  Flame, BookOpen, Brain, Target, TrendingUp, Clock, ArrowRight,
  AlertTriangle, CheckCircle2, Upload,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard · RecallOS" },
      { name: "description", content: "Today's tasks, revisions and weak concepts at a glance." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <AppShell>
      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        <Header />
        <Stats />
        <div className="mt-8 grid lg:grid-cols-3 gap-5">
          <TodayTasks />
          <Revisions />
          <WeakConcepts />
        </div>
        <ProgressGraph />
      </div>
    </AppShell>
  );
}

function Header() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-end justify-between gap-4"
    >
      <div>
        <div className="text-sm text-muted-foreground">Good evening, learner</div>
        <h1 className="mt-1 font-display text-4xl font-bold">Your second brain, today.</h1>
      </div>
      <Link
        to="/upload"
        className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground font-medium px-5 py-2.5 rounded-full glow-primary hover:scale-105 transition"
      >
        <Upload className="size-4" /> New capture
      </Link>
    </motion.div>
  );
}

const stats = [
  { icon: Flame, label: "Streak", value: "12 days", tint: "text-orange-300" },
  { icon: Brain, label: "Cards mastered", value: "284", tint: "text-primary" },
  { icon: Target, label: "Today's focus", value: "22 min", tint: "text-accent" },
  { icon: TrendingUp, label: "Recall rate", value: "94%", tint: "text-emerald-300" },
];

function Stats() {
  return (
    <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="glass rounded-2xl p-5"
        >
          <s.icon className={`size-5 ${s.tint}`} />
          <div className="mt-3 text-2xl font-display font-bold">{s.value}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

function Card({
  title, icon: Icon, accent, children,
}: { title: string; icon: any; accent?: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className={`size-4 ${accent ?? "text-primary"}`} />
          <h3 className="font-display font-semibold">{title}</h3>
        </div>
      </div>
      {children}
    </div>
  );
}

function TodayTasks() {
  const tasks = [
    { t: "Read Ch. 5 — Cellular Respiration", time: "12 min", done: true },
    { t: "Flashcards: Organic Chemistry", time: "8 min", done: false },
    { t: "Quiz: Linear Algebra basics", time: "10 min", done: false },
    { t: "Review yesterday's notes", time: "5 min", done: false },
  ];
  return (
    <Card title="Today's tasks" icon={CheckCircle2}>
      <ul className="space-y-2">
        {tasks.map((t, i) => (
          <li
            key={i}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition"
          >
            <div
              className={`size-5 rounded-md grid place-items-center text-xs ${
                t.done ? "bg-gradient-primary text-primary-foreground" : "border-2 border-border"
              }`}
            >
              {t.done ? "✓" : ""}
            </div>
            <span className={`flex-1 text-sm ${t.done ? "line-through text-muted-foreground" : ""}`}>
              {t.t}
            </span>
            <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
              <Clock className="size-3" /> {t.time}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Revisions() {
  const items = [
    { t: "Mitochondria & ATP", in: "in 2h", urgency: "high" },
    { t: "Quadratic Equations", in: "tonight", urgency: "med" },
    { t: "French — passé composé", in: "tomorrow", urgency: "low" },
    { t: "Newton's 3rd Law", in: "in 3 days", urgency: "low" },
  ];
  return (
    <Card title="Spaced revisions" icon={Brain} accent="text-accent">
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
            <span className="text-sm">{it.t}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                it.urgency === "high"
                  ? "bg-primary/20 text-primary"
                  : it.urgency === "med"
                  ? "bg-accent/20 text-accent"
                  : "bg-white/5 text-muted-foreground"
              }`}
            >
              {it.in}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function WeakConcepts() {
  const items = [
    { t: "Trigonometric identities", score: 42 },
    { t: "Krebs cycle steps", score: 55 },
    { t: "Pointers in C", score: 61 },
  ];
  return (
    <Card title="Weak concepts" icon={AlertTriangle} accent="text-orange-300">
      <ul className="space-y-3">
        {items.map((it, i) => (
          <li key={i}>
            <div className="flex justify-between text-sm mb-1.5">
              <span>{it.t}</span>
              <span className="text-muted-foreground">{it.score}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full bg-gradient-primary"
                style={{ width: `${it.score}%` }}
              />
            </div>
          </li>
        ))}
        <Link
          to="/tutor"
          className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
        >
          Practice with AI tutor <ArrowRight className="size-3" />
        </Link>
      </ul>
    </Card>
  );
}

function ProgressGraph() {
  const days = [40, 60, 35, 80, 70, 90, 65, 85, 75, 95, 88, 100, 82, 90];
  return (
    <div className="mt-5 glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display font-semibold flex items-center gap-2">
            <BookOpen className="size-4 text-primary" /> Learning velocity
          </h3>
          <p className="text-xs text-muted-foreground mt-1">Last 14 days · cards reviewed</p>
        </div>
        <div className="text-2xl font-display font-bold text-gradient">+18%</div>
      </div>
      <div className="flex items-end gap-2 h-32">
        {days.map((d, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-md bg-gradient-primary opacity-80 hover:opacity-100 transition"
            style={{ height: `${d}%` }}
          />
        ))}
      </div>
    </div>
  );
}
