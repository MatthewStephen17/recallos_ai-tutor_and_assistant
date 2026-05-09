import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Brain, Sparkles, Network, Calendar, MessageSquare, Mic,
  Zap, Target, ArrowRight, Upload, Moon, BookOpen,
} from "lucide-react";
import heroBrain from "@/assets/hero-brain.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RecallOS — The AI second brain that remembers for life" },
      {
        name: "description",
        content:
          "Capture lectures, notes and ideas. RecallOS organizes, teaches and revives them at the perfect moment so you remember what you learn — for life.",
      },
      { property: "og:title", content: "RecallOS — Your AI Second Brain" },
      { property: "og:description", content: "Remember, organize and apply knowledge for life with adaptive AI." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen overflow-hidden">
      <Nav />
      <Hero />
      <Logos />
      <Features />
      <HowItWorks />
      <ADHDSection />
      <CTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-6 mt-4">
        <nav className="glass rounded-full px-4 md:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-gradient-primary grid place-items-center glow-primary">
              <Brain className="size-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold tracking-tight">RecallOS</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition">Features</a>
            <a href="#how" className="hover:text-foreground transition">How it works</a>
            <a href="#adhd" className="hover:text-foreground transition">ADHD Mode</a>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 bg-gradient-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-full glow-primary hover:scale-105 transition"
          >
            Launch app <ArrowRight className="size-3.5" />
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative pt-40 pb-24 px-6 grid-bg">
      <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs text-muted-foreground mb-6">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            Built for the era of lifelong learning
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.02] tracking-tight">
            Remember what <br />
            you learn — <span className="text-gradient">for life.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
            RecallOS is the AI second brain that captures lectures, notes and ideas — then
            organizes, teaches and resurfaces them at the exact moment you need them.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground font-medium px-6 py-3 rounded-full glow-primary hover:scale-105 transition"
            >
              Open dashboard <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 glass-strong text-foreground font-medium px-6 py-3 rounded-full hover:bg-white/10 transition"
            >
              <Upload className="size-4" /> Upload your first note
            </Link>
          </div>
          <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
            <Stat n="98%" label="memory retention" />
            <Stat n="40+" label="learning modes" />
            <Stat n="∞" label="lifetime recall" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-primary blur-3xl opacity-30 rounded-full" />
          <div className="relative glass-strong rounded-3xl p-3 glow-violet">
            <img
              src={heroBrain}
              alt="Glowing neural network representing the RecallOS second brain"
              width={1536}
              height={1024}
              className="w-full rounded-2xl"
            />
            <div className="absolute -bottom-6 -left-6 glass-strong rounded-2xl p-4 max-w-[220px] hidden md:block">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Zap className="size-3 text-primary" /> Spaced revision
              </div>
              <div className="mt-1 text-sm font-semibold">Mitochondria recall in 3h</div>
            </div>
            <div className="absolute -top-6 -right-6 glass-strong rounded-2xl p-4 max-w-[220px] hidden md:block">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Target className="size-3 text-accent" /> Today's focus
              </div>
              <div className="mt-1 text-sm font-semibold">3 micro-tasks · 22 min</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-display font-bold text-foreground">{n}</div>
      <div>{label}</div>
    </div>
  );
}

function Logos() {
  const items = ["Stanford", "MIT Open", "Coursera", "Notion", "Anki", "Khan Academy"];
  return (
    <div className="border-y border-border/40 py-8">
      <div className="mx-auto max-w-7xl px-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-60">
        {items.map((i) => (
          <span key={i} className="text-sm font-display tracking-widest text-muted-foreground">
            {i.toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  );
}

const features = [
  {
    icon: Brain,
    title: "Memory Engine",
    desc: "Adaptive spaced repetition that learns what you forget and revives it before the curve hits.",
  },
  {
    icon: Network,
    title: "Knowledge Graph",
    desc: "Every idea links to every other — see your mind as a living, navigable map.",
  },
  {
    icon: Mic,
    title: "Capture Anything",
    desc: "Lectures, voice notes, PDFs and books — auto-transcribed and structured in seconds.",
  },
  {
    icon: MessageSquare,
    title: "Adaptive AI Tutor",
    desc: "Explains like you're 12 — or quizzes you like a final exam. You choose the mode.",
  },
  {
    icon: Calendar,
    title: "Course Architect",
    desc: "Drop in a goal — get a full roadmap, weekly plan, projects and skill tree.",
  },
  {
    icon: Moon,
    title: "Daily Reflection",
    desc: "Every night, RecallOS reviews your day, your wins, your gaps — and reorganizes tomorrow.",
  },
];

function Features() {
  return (
    <section id="features" className="py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-widest text-primary mb-3">The platform</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
            One adaptive system <br />
            for everything you learn.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Notion stores. Anki drills. ChatGPT chats. RecallOS does all of it — and remembers
            why you cared in the first place.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="glass rounded-2xl p-6 hover:border-primary/40 transition group"
            >
              <div className="size-11 rounded-xl bg-gradient-primary grid place-items-center glow-primary mb-4 group-hover:scale-110 transition">
                <f.icon className="size-5 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "Capture", desc: "Drop a PDF, record a lecture, or speak an idea.", icon: Upload },
    { n: "02", title: "Organize", desc: "AI structures it into a graph of summaries, flashcards & quizzes.", icon: Network },
    { n: "03", title: "Recall", desc: "RecallOS resurfaces the right thing at the right moment — forever.", icon: Sparkles },
  ];
  return (
    <section id="how" className="py-32 px-6 relative">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs uppercase tracking-widest text-accent mb-3">How it works</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold">From input to insight, automatically.</h2>
        </div>
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative glass-strong rounded-3xl p-8"
            >
              <div className="text-7xl font-display font-bold text-gradient opacity-90">{s.n}</div>
              <s.icon className="absolute top-8 right-8 size-6 text-primary" />
              <h3 className="mt-4 text-xl font-display font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ADHDSection() {
  return (
    <section id="adhd" className="py-32 px-6">
      <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="text-xs uppercase tracking-widest text-primary mb-3">ADHD Mode</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
            Big tasks, broken into <span className="text-gradient">tiny wins.</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg">
            "Study Chapter 5" becomes 6 micro-tasks — each under 5 minutes, with built-in
            breaks and dopamine checkpoints. Built for brains that need momentum.
          </p>
        </div>
        <div className="glass-strong rounded-3xl p-6">
          <div className="text-xs text-muted-foreground mb-3">Original task</div>
          <div className="text-lg font-semibold mb-6">📘 Study Chapter 5 — Cellular Respiration</div>
          <div className="space-y-2">
            {[
              "Open PDF & skim headings",
              "Read pages 1–3",
              "Highlight 5 keywords",
              "Watch 4-min explainer",
              "Answer 3 quick questions",
              "2-min stretch break",
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition">
                <div className="size-6 rounded-md border-2 border-primary/50 grid place-items-center text-xs text-primary">
                  {i + 1}
                </div>
                <div className="text-sm flex-1">{t}</div>
                <div className="text-xs text-muted-foreground">{[2, 8, 4, 4, 3, 2][i]}m</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-32 px-6">
      <div className="mx-auto max-w-5xl glass-strong rounded-[2rem] p-12 md:p-16 text-center relative overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[500px] bg-gradient-primary blur-3xl opacity-30 rounded-full" />
        <BookOpen className="relative mx-auto size-10 text-primary mb-6" />
        <h2 className="relative font-display text-4xl md:text-6xl font-bold leading-tight">
          Your mind, <span className="text-gradient">amplified.</span>
        </h2>
        <p className="relative mt-4 text-muted-foreground max-w-xl mx-auto">
          Stop forgetting what matters. Start building a life of compounding knowledge.
        </p>
        <Link
          to="/dashboard"
          className="relative mt-8 inline-flex items-center gap-2 bg-gradient-primary text-primary-foreground font-medium px-8 py-4 rounded-full glow-primary hover:scale-105 transition"
        >
          Enter RecallOS <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/40 py-10 px-6">
      <div className="mx-auto max-w-7xl flex flex-wrap justify-between items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Brain className="size-4 text-primary" />
          <span className="font-display font-semibold text-foreground">RecallOS</span>
          <span>· The second brain for lifelong learners.</span>
        </div>
        <div>© {new Date().getFullYear()} RecallOS</div>
      </div>
    </footer>
  );
}
