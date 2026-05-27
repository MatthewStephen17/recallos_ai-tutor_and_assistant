import { useState, useEffect, useRef, useCallback } from "react";

// ─── Sample Pre-Loaded Data ───────────────────────────────────────────────────
const SAMPLE_NOTES = [
  {
    id: 1,
    title: "Introduction to Neural Networks",
    summary:
      "Neural networks are computational systems inspired by biological neural networks in the brain. They consist of layers of interconnected nodes (neurons) that process information using weighted connections. The three core layer types are: input (receives raw data), hidden (extracts abstract features), and output (produces results). Training adjusts weights via backpropagation and gradient descent to minimize prediction error.",
    keyConcepts: ["Neurons", "Activation Functions", "Backpropagation", "Gradient Descent", "Deep Learning", "Weights & Biases"],
    flashcards: [
      { question: "What is backpropagation?", answer: "An algorithm that computes gradients of the loss function with respect to network weights by propagating error signals backward through layers — enabling the network to learn from mistakes.", difficulty: "hard" },
      { question: "What is an activation function?", answer: "A mathematical function that introduces non-linearity into a neural network, allowing it to learn complex patterns. Common examples: ReLU, Sigmoid, Tanh, Softmax.", difficulty: "medium" },
      { question: "Why do we need hidden layers?", answer: "Hidden layers learn hierarchical feature representations — earlier layers detect simple patterns (edges, shapes), deeper layers detect complex abstractions (faces, concepts).", difficulty: "medium" },
      { question: "Define gradient descent", answer: "An iterative optimization algorithm that minimizes the loss function by taking small steps in the direction of the steepest descent (negative gradient).", difficulty: "hard" },
    ],
    tasks: [
      { id: "t1", title: "Read: Deep Learning intro (pages 1–20)", estimatedMinutes: 30, priority: 1, completed: false },
      { id: "t2", title: "Watch: 3Blue1Brown neural network series (Ep 1–2)", estimatedMinutes: 25, priority: 1, completed: true },
      { id: "t3", title: "Implement: Simple perceptron from scratch in Python", estimatedMinutes: 45, priority: 2, completed: false },
      { id: "t4", title: "Quiz yourself on activation functions", estimatedMinutes: 15, priority: 3, completed: false },
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    reviewCount: 3,
  },
  {
    id: 2,
    title: "Calculus: Derivatives & Optimization",
    summary:
      "Derivatives measure the instantaneous rate of change of a function at any point — the slope of the tangent line. Core rules include the Power Rule, Product Rule, Quotient Rule, and Chain Rule (critical for composed functions). Applications span optimization (finding maxima/minima by setting f'(x) = 0), related rates, curve sketching, and understanding motion. Second derivatives reveal concavity and confirm whether critical points are maxima, minima, or saddle points.",
    keyConcepts: ["Limits", "Derivatives", "Chain Rule", "Optimization", "Critical Points", "Concavity", "L'Hôpital's Rule"],
    flashcards: [
      { question: "State the Power Rule", answer: "If f(x) = xⁿ, then f′(x) = n·x^(n-1). Works for all real n.", difficulty: "easy" },
      { question: "What is the Chain Rule?", answer: "If h(x) = f(g(x)), then h′(x) = f′(g(x)) · g′(x). Essential for composed functions and backpropagation in ML.", difficulty: "medium" },
      { question: "How do you find minima/maxima?", answer: "1. Set f′(x) = 0 to find critical points. 2. Apply second derivative test: f″(x) > 0 → minimum; f″(x) < 0 → maximum.", difficulty: "medium" },
    ],
    tasks: [
      { id: "t5", title: "Practice 10 Power Rule problems", estimatedMinutes: 20, priority: 1, completed: true },
      { id: "t6", title: "Chain rule worksheet (textbook p.45–48)", estimatedMinutes: 30, priority: 1, completed: false },
      { id: "t7", title: "Solve 5 optimization word problems", estimatedMinutes: 35, priority: 2, completed: false },
    ],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    reviewCount: 7,
  },
];

// ─── Styles ──────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

*{box-sizing:border-box;margin:0;padding:0;}
.ro{font-family:'Plus Jakarta Sans',sans-serif;background:#060A14;color:#E2EAFF;min-height:100vh;display:flex;overflow:hidden;height:100vh;}
.ro *::-webkit-scrollbar{width:5px;}
.ro *::-webkit-scrollbar-track{background:transparent;}
.ro *::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:3px;}

.ro-side{width:220px;background:#080D1C;border-right:1px solid rgba(255,255,255,0.055);display:flex;flex-direction:column;padding:1.25rem .875rem;gap:2px;flex-shrink:0;overflow:hidden;}
.ro-logo{display:flex;align-items:center;gap:10px;padding:4px 8px;margin-bottom:1.25rem;}
.ro-logo-icon{width:30px;height:30px;background:linear-gradient(135deg,#00DFA2,#0096C7);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;}
.ro-logo-text{font-family:'Outfit',sans-serif;font-size:17px;font-weight:800;color:#F1F5FF;letter-spacing:-0.4px;}

.ro-nav{display:flex;align-items:center;gap:9px;padding:8.5px 11px;border-radius:9px;cursor:pointer;transition:all .15s;color:#556080;font-size:13.5px;font-weight:500;user-select:none;}
.ro-nav:hover{background:rgba(255,255,255,0.035);color:#9AAAC8;}
.ro-nav.active{background:rgba(0,223,162,0.09);color:#00DFA2;}
.ro-nav svg{width:16px;height:16px;flex-shrink:0;stroke-width:2;}
.ro-section-label{font-size:10px;font-weight:600;color:#2E3B58;text-transform:uppercase;letter-spacing:1.1px;padding:6px 11px 4px;margin-top:8px;}

.ro-user{display:flex;align-items:center;gap:9px;padding:10px 11px;border-radius:9px;margin-top:auto;border-top:1px solid rgba(255,255,255,0.05);padding-top:14px;}
.ro-avatar{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#6366F1,#00DFA2);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex-shrink:0;}

.ro-main{flex:1;overflow-y:auto;padding:2rem 2.25rem;display:flex;flex-direction:column;}

.ro-card{background:#0D1526;border:1px solid rgba(255,255,255,0.065);border-radius:14px;padding:1.25rem;}
.ro-page-title{font-family:'Outfit',sans-serif;font-size:24px;font-weight:700;color:#F1F5FF;letter-spacing:-.5px;margin-bottom:3px;}
.ro-page-sub{font-size:13.5px;color:#4A5880;margin-bottom:1.5rem;}
.ro-label{font-size:10.5px;font-weight:600;color:#3D4F72;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;}
.ro-grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:1.25rem;}
.ro-grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.ro-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
.ro-row{display:flex;gap:12px;margin-bottom:1.25rem;}
.ro-divider{border:none;border-top:1px solid rgba(255,255,255,0.055);margin:1.25rem 0;}

.stat-card{background:#0D1526;border:1px solid rgba(255,255,255,0.065);border-radius:12px;padding:1rem 1.1rem;}
.stat-icon{width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;margin-bottom:.75rem;font-size:15px;}
.stat-val{font-family:'Outfit',sans-serif;font-size:26px;font-weight:700;color:#F1F5FF;letter-spacing:-.5px;}
.stat-lbl{font-size:12px;color:#4A5880;margin-top:1px;}
.stat-chg{font-size:11px;font-weight:600;margin-top:4px;}

.streak-ring{display:flex;gap:5px;flex-wrap:wrap;margin-top:8px;}
.s-day{width:26px;height:26px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:9.5px;font-weight:600;}
.s-day.on{background:rgba(0,223,162,0.14);color:#00DFA2;}
.s-day.today{background:#00DFA2;color:#060A14;}
.s-day.off{background:rgba(255,255,255,0.035);color:#2A3550;}

.ro-btn{display:inline-flex;align-items:center;gap:7px;padding:9px 18px;border-radius:9px;border:none;cursor:pointer;font-size:13.5px;font-weight:600;font-family:'Plus Jakarta Sans',sans-serif;transition:all .15s;line-height:1;}
.ro-btn svg{width:15px;height:15px;stroke-width:2.5;}
.ro-btn-primary{background:#00DFA2;color:#060A14;}
.ro-btn-primary:hover{background:#00F0B0;transform:translateY(-1px);}
.ro-btn-primary:disabled{background:#1A3028;color:#3A6050;cursor:not-allowed;transform:none;}
.ro-btn-ghost{background:rgba(255,255,255,0.045);color:#9AAAC8;border:1px solid rgba(255,255,255,0.08);}
.ro-btn-ghost:hover{background:rgba(255,255,255,0.07);}
.ro-btn-success{background:rgba(0,223,162,0.1);color:#00DFA2;border:1px solid rgba(0,223,162,0.2);}
.ro-btn-danger{background:rgba(239,68,68,0.1);color:#F87171;border:1px solid rgba(239,68,68,0.18);}
.ro-btn-ind{background:rgba(99,102,241,0.1);color:#818CF8;border:1px solid rgba(99,102,241,0.2);}
.ro-btn-sm{padding:6px 12px;font-size:12.5px;}

.ro-badge{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:600;}
.ro-badge-green{background:rgba(0,223,162,0.1);color:#00DFA2;border:1px solid rgba(0,223,162,0.18);}
.ro-badge-ind{background:rgba(99,102,241,0.1);color:#818CF8;border:1px solid rgba(99,102,241,0.18);}
.ro-badge-amber{background:rgba(245,158,11,0.1);color:#FBBF24;border:1px solid rgba(245,158,11,0.18);}
.ro-badge-red{background:rgba(239,68,68,0.1);color:#F87171;border:1px solid rgba(239,68,68,0.18);}
.ro-badge-gray{background:rgba(255,255,255,0.05);color:#6B7BA4;border:1px solid rgba(255,255,255,0.08);}

.ro-input{width:100%;background:rgba(255,255,255,0.035);border:1px solid rgba(255,255,255,0.09);border-radius:9px;padding:9.5px 13px;color:#E2EAFF;font-family:'Plus Jakarta Sans',sans-serif;font-size:13.5px;outline:none;transition:border-color .15s;}
.ro-input:focus{border-color:rgba(0,223,162,0.35);}
.ro-input::placeholder{color:#2E3B58;}
.ro-textarea{min-height:150px;resize:vertical;line-height:1.65;}
.ro-select{background:rgba(255,255,255,0.035);border:1px solid rgba(255,255,255,0.09);border-radius:9px;padding:9.5px 13px;color:#E2EAFF;font-family:'Plus Jakarta Sans',sans-serif;font-size:13.5px;outline:none;cursor:pointer;}

.tab-wrap{display:flex;gap:7px;margin-bottom:1.25rem;}
.tab-btn{padding:7px 15px;border-radius:8px;border:1px solid rgba(255,255,255,0.08);background:transparent;color:#556080;font-size:13px;font-weight:500;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .15s;}
.tab-btn.active{background:rgba(0,223,162,0.09);color:#00DFA2;border-color:rgba(0,223,162,0.25);}

.ro-prog{background:rgba(255,255,255,0.055);border-radius:4px;height:5px;overflow:hidden;}
.ro-prog-fill{height:100%;background:linear-gradient(90deg,#00DFA2,#0096C7);border-radius:4px;transition:width .6s ease;}

.proc-step{display:flex;align-items:center;gap:10px;padding:7px 0;font-size:13.5px;color:#6B7BA4;}
.proc-dot{width:8px;height:8px;border-radius:50%;background:#1A2540;flex-shrink:0;transition:background .3s;}
.proc-dot.done{background:#00DFA2;}
.proc-dot.active{background:#6366F1;animation:pulse 1s infinite;}

.fc-wrap{perspective:1100px;width:100%;}
.fc-inner{position:relative;width:100%;height:190px;transition:transform .55s cubic-bezier(.4,0,.2,1);transform-style:preserve-3d;cursor:pointer;}
.fc-inner.flipped{transform:rotateY(180deg);}
.fc-face{position:absolute;width:100%;height:100%;backface-visibility:hidden;border-radius:14px;display:flex;align-items:center;justify-content:center;padding:1.5rem;text-align:center;}
.fc-front{background:#0D1526;border:1px solid rgba(255,255,255,0.08);}
.fc-back{background:linear-gradient(135deg,#081D12,#080E20);border:1px solid rgba(0,223,162,0.2);transform:rotateY(180deg);}

.chat-wrap{display:flex;flex-direction:column;flex:1;min-height:0;}
.chat-msgs{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:14px;padding-bottom:1rem;}
.chat-msg{max-width:78%;padding:11px 15px;border-radius:13px;font-size:13.5px;line-height:1.65;}
.chat-msg.user{align-self:flex-end;background:rgba(0,223,162,0.1);border:1px solid rgba(0,223,162,0.18);color:#E2EAFF;border-bottom-right-radius:4px;}
.chat-msg.assistant{align-self:flex-start;background:#0D1526;border:1px solid rgba(255,255,255,0.065);color:#C8D8F0;border-bottom-left-radius:4px;}
.chat-input-wrap{display:flex;gap:8px;padding-top:1rem;border-top:1px solid rgba(255,255,255,0.055);}

.note-card{background:#0D1526;border:1px solid rgba(255,255,255,0.065);border-radius:14px;padding:1.25rem;cursor:pointer;transition:all .2s;}
.note-card:hover{border-color:rgba(0,223,162,0.22);transform:translateY(-2px);}

.task-row{display:flex;align-items:flex-start;gap:10px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.04);}
.task-row:last-child{border-bottom:none;}
.task-check{width:18px;height:18px;border-radius:5px;border:1.5px solid rgba(255,255,255,0.15);flex-shrink:0;margin-top:1px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;}
.task-check.done{background:rgba(0,223,162,0.12);border-color:#00DFA2;}

.concept-tag{display:inline-block;padding:4px 10px;background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.18);border-radius:20px;font-size:11.5px;color:#818CF8;margin:3px;}

.week-row{display:flex;gap:14px;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.045);}
.week-row:last-child{border-bottom:none;}
.week-num{width:34px;height:34px;border-radius:50%;background:rgba(0,223,162,0.08);border:1px solid rgba(0,223,162,0.2);display:flex;align-items:center;justify-content:center;font-family:'Outfit',sans-serif;font-size:13px;font-weight:700;color:#00DFA2;flex-shrink:0;margin-top:2px;}

.review-row{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);}
.review-row:last-child{border-bottom:none;}
.diff-dots{display:flex;gap:4px;}
.diff-dot{width:6px;height:6px;border-radius:50%;}

.sugg-btn{padding:6px 13px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:8px;color:#8090B4;font-size:12px;cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;transition:all .15s;white-space:nowrap;}
.sugg-btn:hover{background:rgba(255,255,255,0.055);color:#C8D8F0;}

.quick-action{background:#0D1526;border:1px solid rgba(255,255,255,0.065);border-radius:12px;padding:1rem;cursor:pointer;transition:all .15s;text-align:center;display:flex;flex-direction:column;align-items:center;gap:8px;}
.quick-action:hover{border-color:rgba(0,223,162,0.22);transform:translateY(-1px);}
.qa-icon{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:2px;}

@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.35;}}
@keyframes fadeIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
@keyframes spin{to{transform:rotate(360deg);}}
@keyframes glow{0%,100%{box-shadow:0 0 12px rgba(0,223,162,0.15);}50%{box-shadow:0 0 24px rgba(0,223,162,0.3);}}

.ro-fadein{animation:fadeIn .3s ease;}
.ro-spin{animation:spin 1s linear infinite;}
.ro-glow{animation:glow 2.5s ease-in-out infinite;}
`;

// ─── API Helper ───────────────────────────────────────────────────────────────
async function callClaude(messages, systemPrompt = "", maxTokens = 1000) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "x-api-key": "sk-ant-api03-...", // Cleaned up quotes and single comma
      "anthropic-version": "2023-06-01",
      "anthropic-dangerously-allow-browser": "true" 
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      system: systemPrompt,
      messages,
    }),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json();
  return data.content?.[0]?.text || "";
}

// ─── Icons (inline SVG) ───────────────────────────────────────────────────────
const Icon = {
  Brain: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24A2.5 2.5 0 0 0 14.5 2Z"/></svg>,
  Dashboard: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>,
  Upload: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Book: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>,
  Chat: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Map: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>,
  Moon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>,
  Send: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Refresh: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Flame: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
  Trophy: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
  Clock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Star: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Loader: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="ro-spin"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>,
  Zap: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Target: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  Arrow: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Sparkles: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>,
};

// ─── Nav Items ────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "Dashboard" },
  { id: "upload", label: "Upload & Process", icon: "Upload" },
  { id: "knowledge", label: "Knowledge Library", icon: "Book" },
  { id: "tutor", label: "AI Tutor", icon: "Chat" },
  { id: "course", label: "Course Builder", icon: "Map" },
  { id: "reflection", label: "Daily Reflection", icon: "Moon" },
];

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function RecallOS() {
  const [page, setPage] = useState("dashboard");
  const [notes, setNotes] = useState(SAMPLE_NOTES);
  const [isLoading, setIsLoading] = useState(false);

  // Upload state
  const [uploadTab, setUploadTab] = useState("text");
  const [inputText, setInputText] = useState("");
  const [inputTitle, setInputTitle] = useState("");
  const [procStep, setProcStep] = useState("idle");
  const [procProgress, setProcProgress] = useState([false, false, false, false]);
  const [lastProcessed, setLastProcessed] = useState(null);

  // Knowledge state
  const [selNote, setSelNote] = useState(null);
  const [quizMode, setQuizMode] = useState(false);
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState({ c: 0, w: 0 });
  const [noteTaskState, setNoteTaskState] = useState({});

  // Tutor state
  const [chatMsgs, setChatMsgs] = useState([
    { role: "assistant", content: "Hello! I'm your personal AI tutor 🧠 I can explain concepts, quiz you, simplify complex topics, or help build your study plan. What are we working on today?" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef(null);

  // Course state
  const [courseGoal, setCourseGoal] = useState("");
  const [courseDuration, setCourseDuration] = useState("3 months");
  const [courseData, setCourseData] = useState(null);

  // Reflection state
  const [refLearned, setRefLearned] = useState("");
  const [refWeak, setRefWeak] = useState("");
  const [refTomorrow, setRefTomorrow] = useState("");
  const [refInsight, setRefInsight] = useState("");
  const [refDone, setRefDone] = useState(false);

  // Inject CSS
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMsgs]);

  // ── Process Uploaded Content ──────────────────────────────────────────────
  const processContent = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setProcStep("processing");
    setProcProgress([false, false, false, false]);

    const steps = [
      () => setProcProgress([true, false, false, false]),
      () => setProcProgress([true, true, false, false]),
      () => setProcProgress([true, true, true, false]),
      () => setProcProgress([true, true, true, true]),
    ];

    try {
      const system = `You are an expert educational AI. Process the given text and return ONLY a valid JSON object with these exact fields (no markdown, no preamble):
{
  "title": "smart title (max 6 words)",
  "summary": "3-paragraph student-friendly summary (200-250 words)",
  "keyConcepts": ["concept1","concept2","concept3","concept4","concept5","concept6"],
  "flashcards": [
    {"question":"...","answer":"...","difficulty":"easy"|"medium"|"hard"},
    ... (5-8 total)
  ],
  "tasks": [
    {"id":"t_new_1","title":"specific actionable task","estimatedMinutes":20,"priority":1,"completed":false},
    ... (4-6 total, ADHD-friendly tiny steps)
  ]
}`;

      steps[0]();
      await new Promise(r => setTimeout(r, 600));
      steps[1]();

      const raw = await callClaude(
        [{ role: "user", content: `Process this content:\n\n${inputText}` }],
        system,
        1200
      );

      steps[2]();
      await new Promise(r => setTimeout(r, 400));
      steps[3]();
      await new Promise(r => setTimeout(r, 300));

      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);

      const newNote = {
        id: Date.now(),
        title: inputTitle.trim() || parsed.title,
        summary: parsed.summary,
        keyConcepts: parsed.keyConcepts || [],
        flashcards: parsed.flashcards || [],
        tasks: parsed.tasks || [],
        createdAt: new Date(),
        reviewCount: 0,
      };

      setNotes(prev => [newNote, ...prev]);
      setLastProcessed(newNote);
      setProcStep("done");
      setInputText("");
      setInputTitle("");
    } catch (err) {
      setProcStep("idle");
      alert("Error processing content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── AI Tutor ──────────────────────────────────────────────────────────────
  const sendChat = async () => {
    if (!chatInput.trim() || isLoading) return;
    const msg = chatInput.trim();
    setChatInput("");
    const userMsg = { role: "user", content: msg };
    setChatMsgs(prev => [...prev, userMsg]);
    setIsLoading(true);

    const context = notes.length
      ? `The student has studied: ${notes.map(n => n.title).join(", ")}. Their summaries: ${notes.map(n => n.summary.slice(0, 120)).join(" | ")}`
      : "";

    const system = `You are RecallOS — an empathetic, brilliant AI tutor. You adapt to the student's level. Be concise yet thorough. Use analogies, examples, and structured explanations. You know what topics the student has studied. ${context} Respond naturally, not robotically. If asked to quiz, generate 2-3 targeted questions. Use plain text (no markdown headers, minimal formatting).`;

    try {
      const history = [...chatMsgs, userMsg].map(m => ({ role: m.role, content: m.content }));
      const reply = await callClaude(history, system, 600);
      setChatMsgs(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setChatMsgs(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an issue. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Course Builder ────────────────────────────────────────────────────────
  const buildCourse = async () => {
    if (!courseGoal.trim()) return;
    setIsLoading(true);
    setCourseData(null);

    const system = `You are an expert learning coach. Create a structured study roadmap. Return ONLY valid JSON (no markdown):
{
  "title": "course title",
  "totalWeeks": 8,
  "overview": "2-sentence overview",
  "weeks": [
    {
      "week": 1,
      "theme": "Theme name",
      "topics": ["topic1","topic2","topic3"],
      "dailyTask": "specific 30-min daily task",
      "milestone": "what student can do by week end",
      "difficulty": "beginner"|"intermediate"|"advanced"
    }
  ]
}
Limit to 8 weeks max. Make tasks ADHD-friendly (concrete, small steps).`;

    try {
      const raw = await callClaude(
        [{ role: "user", content: `Goal: ${courseGoal}\nDuration: ${courseDuration}` }],
        system,
        1200
      );
      const clean = raw.replace(/```json|```/g, "").trim();
      setCourseData(JSON.parse(clean));
    } catch {
      alert("Error building roadmap. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Reflection ────────────────────────────────────────────────────────────
  const submitReflection = async () => {
    if (!refLearned.trim()) return;
    setIsLoading(true);

    const system = `You are a learning coach. Analyze the student's daily reflection and give 2-3 sentences of personalized, encouraging insight. Be specific. Reference what they learned. Suggest one concrete action for tomorrow. Keep it under 80 words.`;

    try {
      const prompt = `Learned today: ${refLearned}\nWeak areas: ${refWeak || "none mentioned"}\nTomorrow's goal: ${refTomorrow || "not specified"}`;
      const insight = await callClaude([{ role: "user", content: prompt }], system, 200);
      setRefInsight(insight);
      setRefDone(true);
    } catch {
      setRefInsight("Great job reflecting today! Consistency is the key to long-term retention. Keep showing up tomorrow.");
      setRefDone(true);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Toggle Task ───────────────────────────────────────────────────────────
  const toggleTask = (noteId, taskId) => {
    setNotes(prev =>
      prev.map(n =>
        n.id === noteId
          ? { ...n, tasks: n.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t) }
          : n
      )
    );
    if (selNote?.id === noteId) {
      setSelNote(prev => ({ ...prev, tasks: prev.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t) }));
    }
  };

  // ─── PAGES ────────────────────────────────────────────────────────────────

  const PageDashboard = () => {
    const days = ["M", "T", "W", "T", "F", "S", "S"];
    const streak = [true, true, true, false, true, true, "today"];
    const totalFlashcards = notes.reduce((s, n) => s + n.flashcards.length, 0);
    const totalTasks = notes.reduce((s, n) => s + n.tasks.length, 0);
    const doneTasks = notes.reduce((s, n) => s + n.tasks.filter(t => t.completed).length, 0);

    return (
      <div className="ro-fadein">
        <p className="ro-page-title">Good morning, Scholar 👋</p>
        <p className="ro-page-sub">You're on a 5-day streak. Keep the momentum going.</p>

        <div className="ro-grid4" style={{ marginBottom: "1.25rem" }}>
          {[
            { label: "Topics Saved", val: notes.length, icon: "Book", color: "#6366F1", bg: "rgba(99,102,241,0.1)" },
            { label: "Flashcards Ready", val: totalFlashcards, icon: "Zap", color: "#00DFA2", bg: "rgba(0,223,162,0.1)" },
            { label: "Tasks Completed", val: `${doneTasks}/${totalTasks}`, icon: "Check", color: "#FBBF24", bg: "rgba(245,158,11,0.1)" },
            { label: "Study Streak", val: "5 days 🔥", icon: "Flame", color: "#F87171", bg: "rgba(239,68,68,0.1)" },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-icon" style={{ background: s.bg }}>
                <span style={{ color: s.color, display: "flex" }}>{Icon[s.icon]()}</span>
              </div>
              <div className="stat-val">{s.val}</div>
              <div className="stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="ro-grid2">
          {/* Streak card */}
          <div className="ro-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".75rem" }}>
              <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 600, color: "#F1F5FF" }}>Weekly Streak</span>
              <span className="ro-badge ro-badge-amber">🔥 5 days</span>
            </div>
            <div className="streak-ring">
              {days.map((d, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div className={`s-day ${streak[i] === "today" ? "today" : streak[i] ? "on" : "off"}`}>
                    {streak[i] === "today" ? "★" : streak[i] ? "✓" : "·"}
                  </div>
                  <div style={{ fontSize: 9, color: "#2E3B58", marginTop: 3 }}>{d}</div>
                </div>
              ))}
            </div>
            <hr className="ro-divider" />
            <p style={{ fontSize: 13, color: "#4A5880" }}>Your longest streak: <span style={{ color: "#FBBF24", fontWeight: 600 }}>12 days</span>. You're halfway there!</p>
          </div>

          {/* Today's Review */}
          <div className="ro-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".75rem" }}>
              <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 600, color: "#F1F5FF" }}>Today's Review Queue</span>
              <span className="ro-badge ro-badge-ind">{notes.length} topics</span>
            </div>
            {notes.slice(0, 2).map(n => (
              <div key={n.id} className="review-row">
                <div className="diff-dots">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="diff-dot" style={{ background: i < 2 ? "#FBBF24" : "rgba(255,255,255,0.08)" }} />
                  ))}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, color: "#C8D8F0", fontWeight: 500 }}>{n.title}</div>
                  <div style={{ fontSize: 11.5, color: "#3D4F72" }}>{n.flashcards.length} cards • {n.reviewCount} reviews</div>
                </div>
                <button className="ro-btn ro-btn-ghost ro-btn-sm" onClick={() => { setSelNote(n); setQuizMode(true); setCardIdx(0); setFlipped(false); setScore({ c: 0, w: 0 }); setPage("knowledge"); }}>
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>

        <hr className="ro-divider" />

        {/* Quick Actions */}
        <p className="ro-label">Quick Actions</p>
        <div className="ro-grid3">
          {[
            { label: "Upload New Content", sub: "PDF, audio, or text", icon: "Upload", color: "#6366F1", bg: "rgba(99,102,241,0.1)", page: "upload" },
            { label: "Chat with AI Tutor", sub: "Ask anything, quiz yourself", icon: "Chat", color: "#00DFA2", bg: "rgba(0,223,162,0.1)", page: "tutor" },
            { label: "Build a Course", sub: "Set a goal, get a roadmap", icon: "Map", color: "#FBBF24", bg: "rgba(245,158,11,0.1)", page: "course" },
          ].map(a => (
            <div key={a.label} className="quick-action" onClick={() => setPage(a.page)}>
              <div className="qa-icon" style={{ background: a.bg }}>
                <span style={{ color: a.color, display: "flex", width: 18, height: 18 }}>{Icon[a.icon]()}</span>
              </div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, color: "#E2EAFF" }}>{a.label}</div>
              <div style={{ fontSize: 12, color: "#3D4F72" }}>{a.sub}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const PageUpload = () => {
    const STEPS = ["Parsing content", "Generating summary", "Creating flashcards", "Building ADHD tasks"];

    return (
      <div className="ro-fadein">
        <p className="ro-page-title">Upload & Process</p>
        <p className="ro-page-sub">Paste your notes, lectures, or any text — AI transforms it into organized knowledge.</p>

        {procStep !== "done" ? (
          <div className="ro-grid2">
            <div>
              <div className="tab-wrap">
                {["text", "pdf", "audio"].map(t => (
                  <button key={t} className={`tab-btn ${uploadTab === t ? "active" : ""}`} onClick={() => setUploadTab(t)}>
                    {t === "text" ? "📝 Text" : t === "pdf" ? "📄 PDF" : "🎙️ Audio"}
                  </button>
                ))}
              </div>

              <div style={{ marginBottom: ".875rem" }}>
                <p className="ro-label">Title (optional)</p>
                <input className="ro-input" placeholder="e.g. Biology Chapter 5 — Cell Division" value={inputTitle} onChange={e => setInputTitle(e.target.value)} />
              </div>

              {uploadTab === "text" ? (
                <div>
                  <p className="ro-label">Paste Your Content</p>
                  <textarea className="ro-input ro-textarea" placeholder="Paste your lecture notes, textbook content, article, or any study material here…" value={inputText} onChange={e => setInputText(e.target.value)} style={{ minHeight: 200 }} />
                </div>
              ) : (
                <div className="ro-card" style={{ textAlign: "center", padding: "2.5rem", cursor: "pointer", border: "2px dashed rgba(255,255,255,0.1)" }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>{uploadTab === "pdf" ? "📄" : "🎙️"}</div>
                  <p style={{ color: "#6B7BA4", fontSize: 14 }}>
                    {uploadTab === "pdf" ? "Drag & drop PDF or click to browse" : "Click to record or upload audio file"}
                  </p>
                  <p style={{ fontSize: 12, color: "#3D4F72", marginTop: 6 }}>Demo: use text tab for live AI processing</p>
                </div>
              )}

              <div style={{ marginTop: "1rem" }}>
                <button
                  className="ro-btn ro-btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                  disabled={isLoading || !inputText.trim()}
                  onClick={processContent}
                >
                  {isLoading ? <><Icon.Loader /> Processing…</> : <><Icon.Sparkles /> Process with AI</>}
                </button>
              </div>
            </div>

            <div>
              <div className="ro-card" style={{ marginBottom: 14 }}>
                <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 600, color: "#F1F5FF", marginBottom: ".875rem" }}>What AI will generate</p>
                {[
                  { icon: "📝", label: "Smart Summary", desc: "Student-friendly, structured overview" },
                  { icon: "⚡", label: "Flashcards", desc: "Spaced-repetition ready Q&A cards" },
                  { icon: "🧩", label: "Key Concepts", desc: "Extracted topic tags for quick review" },
                  { icon: "✅", label: "ADHD Tasks", desc: "Bite-sized executable study steps" },
                ].map(f => (
                  <div key={f.label} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <span style={{ fontSize: 18 }}>{f.icon}</span>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 500, color: "#C8D8F0" }}>{f.label}</div>
                      <div style={{ fontSize: 12, color: "#3D4F72" }}>{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {procStep === "processing" && (
                <div className="ro-card ro-fadein">
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#6366F1", marginBottom: ".875rem", display: "flex", alignItems: "center", gap: 7 }}>
                    <Icon.Loader /> Analyzing content…
                  </p>
                  {STEPS.map((s, i) => (
                    <div key={s} className="proc-step">
                      <div className={`proc-dot ${procProgress[i] ? "done" : i === procProgress.filter(Boolean).length ? "active" : ""}`} />
                      <span style={{ color: procProgress[i] ? "#00DFA2" : "#3D4F72" }}>{s}</span>
                    </div>
                  ))}
                  <div className="ro-prog" style={{ marginTop: 12 }}>
                    <div className="ro-prog-fill" style={{ width: `${(procProgress.filter(Boolean).length / 4) * 100}%` }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="ro-fadein">
            <div className="ro-card" style={{ marginBottom: 14, border: "1px solid rgba(0,223,162,0.2)", textAlign: "center", padding: "1.5rem" }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 18, fontWeight: 700, color: "#F1F5FF", marginBottom: 4 }}>Content Processed!</p>
              <p style={{ fontSize: 13.5, color: "#6B7BA4", marginBottom: "1rem" }}>
                {lastProcessed?.flashcards?.length || 0} flashcards • {lastProcessed?.tasks?.length || 0} tasks • {lastProcessed?.keyConcepts?.length || 0} key concepts generated
              </p>
              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                <button className="ro-btn ro-btn-primary" onClick={() => { setSelNote(lastProcessed); setPage("knowledge"); setProcStep("idle"); }}>
                  <Icon.Book /> View in Library
                </button>
                <button className="ro-btn ro-btn-ghost" onClick={() => setProcStep("idle")}>
                  Upload Another
                </button>
              </div>
            </div>
            {lastProcessed && (
              <div className="ro-card">
                <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 600, color: "#F1F5FF", marginBottom: ".5rem" }}>{lastProcessed.title}</p>
                <div style={{ marginBottom: ".875rem" }}>
                  {lastProcessed.keyConcepts?.map(c => <span key={c} className="concept-tag">{c}</span>)}
                </div>
                <p style={{ fontSize: 13.5, color: "#8090B4", lineHeight: 1.65 }}>{lastProcessed.summary?.slice(0, 280)}…</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const PageKnowledge = () => {
    if (quizMode && selNote) {
      const cards = selNote.flashcards;
      const card = cards[cardIdx];
      const done = cardIdx >= cards.length;

     if (done) return (
  <div className="ro-fadein" style={{ textAlign: "center", padding: "3rem 1rem" }}>
    <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
    <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 22, fontWeight: 700, color: "#F1F5FF", marginBottom: 6 }}>Session Complete!</p>
    <p style={{ color: "#6B7BA4", fontSize: 14, marginBottom: "1.5rem" }}>
      {score.c} correct · {score.w} wrong · {Math.round((score.c / cards.length) * 100)}% accuracy
    </p>
    {/* FIXED: Removed duplicate display key conflict here */}
    <div style={{ width: 80, height: 80, borderRadius: "50%", border: `3px solid ${score.c / cards.length > 0.7 ? "#00DFA2" : "#F87171"}`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", margin: "0 auto 1.5rem" }}>
      <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 22, fontWeight: 700, color: "#F1F5FF" }}>{score.c}/{cards.length}</span>
    </div>
    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
      <button className="ro-btn ro-btn-primary" onClick={() => { setCardIdx(0); setFlipped(false); setScore({ c: 0, w: 0 }); }}>
        <Icon.Refresh /> Retry
      </button>
      <button className="ro-btn ro-btn-ghost" onClick={() => { setQuizMode(false); }}>
        Back to Library
      </button>
    </div>
  </div>
);

      return (
        <div className="ro-fadein">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem" }}>
            <button className="ro-btn ro-btn-ghost ro-btn-sm" onClick={() => setQuizMode(false)}>← Back</button>
            <span style={{ fontSize: 13.5, color: "#6B7BA4" }}>{selNote.title}</span>
            <span className="ro-badge ro-badge-gray" style={{ marginLeft: "auto" }}>{cardIdx + 1} / {cards.length}</span>
            <span className="ro-badge ro-badge-green">✓ {score.c}</span>
            <span className="ro-badge ro-badge-red">✗ {score.w}</span>
          </div>

          <div className="ro-prog" style={{ marginBottom: "1.5rem" }}>
            <div className="ro-prog-fill" style={{ width: `${(cardIdx / cards.length) * 100}%` }} />
          </div>

          <div className="fc-wrap" onClick={() => setFlipped(f => !f)} style={{ marginBottom: "1rem", userSelect: "none" }}>
            <div className={`fc-inner ${flipped ? "flipped" : ""}`}>
              <div className="fc-face fc-front" style={{ flexDirection: "column", gap: 10 }}>
                <span style={{ fontSize: 11, color: "#3D4F72", textTransform: "uppercase", letterSpacing: 1 }}>Question</span>
                <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 17, fontWeight: 600, color: "#F1F5FF", lineHeight: 1.5 }}>{card.question}</p>
                <span style={{ fontSize: 12, color: "#2E3B58", marginTop: 6 }}>Tap to reveal answer</span>
              </div>
              <div className="fc-face fc-back" style={{ flexDirection: "column", gap: 10 }}>
                <span style={{ fontSize: 11, color: "#3D4F72", textTransform: "uppercase", letterSpacing: 1 }}>Answer</span>
                <p style={{ fontSize: 14.5, color: "#C8D8F0", lineHeight: 1.6 }}>{card.answer}</p>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button className="ro-btn ro-btn-danger" style={{ flex: 1, justifyContent: "center" }}
              onClick={() => { setScore(s => ({ ...s, w: s.w + 1 })); setCardIdx(i => i + 1); setFlipped(false); }}>
              <Icon.X /> Got it wrong
            </button>
            <button className="ro-btn ro-btn-success" style={{ flex: 1, justifyContent: "center" }}
              onClick={() => { setScore(s => ({ ...s, c: s.c + 1 })); setCardIdx(i => i + 1); setFlipped(false); }}>
              <Icon.Check /> Got it right
            </button>
          </div>
          <p style={{ textAlign: "center", fontSize: 12, color: "#2E3B58", marginTop: 10 }}>
            Difficulty: <span style={{ color: card.difficulty === "easy" ? "#00DFA2" : card.difficulty === "medium" ? "#FBBF24" : "#F87171" }}>{card.difficulty}</span>
          </p>
        </div>
      );
    }

    if (selNote) return (
      <div className="ro-fadein">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem" }}>
          <button className="ro-btn ro-btn-ghost ro-btn-sm" onClick={() => setSelNote(null)}>← Back</button>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 18, fontWeight: 700, color: "#F1F5FF", flex: 1 }}>{selNote.title}</span>
          <button className="ro-btn ro-btn-primary ro-btn-sm" onClick={() => { setQuizMode(true); setCardIdx(0); setFlipped(false); setScore({ c: 0, w: 0 }); }}>
            <Icon.Zap /> Start Quiz
          </button>
        </div>

        <div style={{ marginBottom: ".875rem" }}>
          {selNote.keyConcepts?.map(c => <span key={c} className="concept-tag">{c}</span>)}
        </div>

        <div className="ro-grid2" style={{ marginBottom: "1rem" }}>
          <div className="ro-card">
            <p className="ro-label">Summary</p>
            <p style={{ fontSize: 13.5, color: "#9AAAC8", lineHeight: 1.7 }}>{selNote.summary}</p>
          </div>
          <div>
            <div className="ro-card" style={{ marginBottom: 12 }}>
              <p className="ro-label">Study Tasks (ADHD-Friendly)</p>
              {selNote.tasks?.map(t => (
                <div key={t.id} className="task-row">
                  <div className={`task-check ${t.completed ? "done" : ""}`} onClick={() => toggleTask(selNote.id, t.id)}>
                    {t.completed && <span style={{ color: "#00DFA2", fontSize: 10, display: "flex" }}><Icon.Check /></span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 13.5, color: t.completed ? "#3D4F72" : "#C8D8F0", textDecoration: t.completed ? "line-through" : "none" }}>{t.title}</span>
                    <span style={{ fontSize: 11.5, color: "#2E3B58", display: "block" }}>{t.estimatedMinutes} min · Priority {t.priority}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="ro-card">
              <p className="ro-label">Flashcards ({selNote.flashcards?.length})</p>
              {selNote.flashcards?.slice(0, 3).map((f, i) => (
                <div key={i} style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 13 }}>
                  <span style={{ color: "#8090B4" }}>Q: </span>
                  <span style={{ color: "#C8D8F0" }}>{f.question}</span>
                </div>
              ))}
              {selNote.flashcards?.length > 3 && (
                <p style={{ fontSize: 12, color: "#3D4F72", marginTop: 6 }}>+{selNote.flashcards.length - 3} more cards in quiz mode</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div className="ro-fadein">
        <p className="ro-page-title">Knowledge Library</p>
        <p className="ro-page-sub">{notes.length} topics saved · Click any card to study, or start a quiz.</p>
        {notes.length === 0 ? (
          <div className="ro-card" style={{ textAlign: "center", padding: "3rem" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>📚</div>
            <p style={{ color: "#6B7BA4" }}>No knowledge saved yet. Upload your first piece of content!</p>
            <button className="ro-btn ro-btn-primary" style={{ marginTop: "1rem" }} onClick={() => setPage("upload")}>
              <Icon.Upload /> Upload Content
            </button>
          </div>
        ) : (
          <div className="ro-grid2">
            {notes.map(n => (
              <div key={n.id} className="note-card" onClick={() => setSelNote(n)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: ".5rem" }}>
                  <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15.5, fontWeight: 700, color: "#F1F5FF", flex: 1, lineHeight: 1.35 }}>{n.title}</p>
                  <span className="ro-badge ro-badge-green" style={{ marginLeft: 8, flexShrink: 0 }}>{n.flashcards.length} cards</span>
                </div>
                <div style={{ marginBottom: ".625rem" }}>
                  {n.keyConcepts?.slice(0, 3).map(c => <span key={c} className="concept-tag" style={{ fontSize: 11 }}>{c}</span>)}
                </div>
                <p style={{ fontSize: 13, color: "#4A5880", lineHeight: 1.55 }}>{n.summary?.slice(0, 130)}…</p>
                <hr className="ro-divider" />
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="ro-btn ro-btn-ind ro-btn-sm" onClick={e => { e.stopPropagation(); setSelNote(n); setQuizMode(true); setCardIdx(0); setFlipped(false); setScore({ c: 0, w: 0 }); }}>
                    <Icon.Zap /> Quiz
                  </button>
                  <span style={{ fontSize: 12, color: "#2E3B58", marginLeft: "auto", alignSelf: "center" }}>
                    {n.tasks?.filter(t => t.completed).length}/{n.tasks?.length} tasks done
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const PageTutor = () => {
    const suggestions = [
      "Explain like I'm 12 🧒",
      "Quiz me on my recent topics",
      "Simplify backpropagation",
      "Create a study plan for tomorrow",
      "What should I review today?",
    ];

    return (
      <div className="ro-fadein" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 100px)" }}>
        <p className="ro-page-title">AI Tutor</p>
        <p className="ro-page-sub">Your personal adaptive tutor — explains, quizzes, and guides you.</p>

        <div style={{ display: "flex", gap: 8, marginBottom: "1rem", flexWrap: "wrap" }}>
          {suggestions.map(s => (
            <button key={s} className="sugg-btn" onClick={() => { setChatInput(s); }}>
              {s}
            </button>
          ))}
        </div>

        <div className="chat-msgs" style={{ flex: 1, overflowY: "auto" }}>
          {chatMsgs.map((m, i) => (
            <div key={i} className={`chat-msg ${m.role}`}>
              {m.role === "assistant" && <span style={{ fontSize: 11, color: "#3D4F72", display: "block", marginBottom: 4 }}>RecallOS AI</span>}
              {m.content}
            </div>
          ))}
          {isLoading && (
            <div className="chat-msg assistant" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon.Loader />
              <span style={{ color: "#3D4F72" }}>Thinking…</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="chat-input-wrap">
          <input
            className="ro-input"
            placeholder="Ask anything — explain, quiz me, simplify, create study plan…"
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendChat()}
            disabled={isLoading}
          />
          <button className="ro-btn ro-btn-primary" onClick={sendChat} disabled={isLoading || !chatInput.trim()} style={{ flexShrink: 0 }}>
            <Icon.Send />
          </button>
        </div>
      </div>
    );
  };

  const PageCourse = () => (
    <div className="ro-fadein">
      <p className="ro-page-title">Course Builder</p>
      <p className="ro-page-sub">Set a learning goal — AI creates a structured roadmap with weekly milestones.</p>

      {!courseData ? (
        <div className="ro-grid2">
          <div>
            <div className="ro-card">
              <p className="ro-label">Your Learning Goal</p>
              <textarea
                className="ro-input ro-textarea"
                style={{ minHeight: 100, marginBottom: ".875rem" }}
                placeholder="e.g. Learn machine learning from scratch&#10;e.g. Master calculus in 2 months&#10;e.g. Understand cybersecurity fundamentals"
                value={courseGoal}
                onChange={e => setCourseGoal(e.target.value)}
              />
              <p className="ro-label">Timeframe</p>
              <select className="ro-select" style={{ width: "100%", marginBottom: "1rem" }} value={courseDuration} onChange={e => setCourseDuration(e.target.value)}>
                {["2 weeks", "1 month", "2 months", "3 months", "6 months"].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <button className="ro-btn ro-btn-primary" style={{ width: "100%", justifyContent: "center" }}
                onClick={buildCourse} disabled={isLoading || !courseGoal.trim()}>
                {isLoading ? <><Icon.Loader /> Building roadmap…</> : <><Icon.Sparkles /> Generate Roadmap</>}
              </button>
            </div>
          </div>
          <div>
            <div className="ro-card">
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14.5, fontWeight: 600, color: "#F1F5FF", marginBottom: ".875rem" }}>What you'll get</p>
              {[
                { icon: "🗓️", t: "Weekly themes", d: "Structured progression, topic by topic" },
                { icon: "📌", t: "Daily micro-tasks", d: "ADHD-friendly 30-min daily actions" },
                { icon: "🏁", t: "Milestones", d: "Clear checkpoints to track progress" },
                { icon: "📚", t: "Topic roadmap", d: "Curated topics in optimal learning order" },
              ].map(f => (
                <div key={f.t} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ fontSize: 20 }}>{f.icon}</span>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: "#C8D8F0" }}>{f.t}</div>
                    <div style={{ fontSize: 12, color: "#3D4F72" }}>{f.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="ro-fadein">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 20, fontWeight: 700, color: "#F1F5FF" }}>{courseData.title}</p>
              <p style={{ fontSize: 13.5, color: "#4A5880" }}>{courseData.overview}</p>
            </div>
            <button className="ro-btn ro-btn-ghost ro-btn-sm" onClick={() => { setCourseData(null); setCourseGoal(""); }}>
              <Icon.Refresh /> Rebuild
            </button>
          </div>
          <div className="ro-grid4" style={{ marginBottom: "1.25rem" }}>
            {[
              { label: "Total Weeks", val: courseData.totalWeeks },
              { label: "Daily Commitment", val: "~30 min" },
              { label: "Topics Covered", val: courseData.weeks?.reduce((s, w) => s + w.topics.length, 0) },
              { label: "Milestones", val: courseData.weeks?.length },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div className="stat-val" style={{ fontSize: 22 }}>{s.val}</div>
                <div className="stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="ro-card">
            <p className="ro-label">Weekly Roadmap</p>
            {courseData.weeks?.map((w, i) => (
              <div key={i} className="week-row">
                <div className="week-num">W{w.week}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14.5, fontWeight: 600, color: "#E2EAFF" }}>{w.theme}</span>
                    <span className={`ro-badge ${w.difficulty === "beginner" ? "ro-badge-green" : w.difficulty === "intermediate" ? "ro-badge-amber" : "ro-badge-red"}`}>
                      {w.difficulty}
                    </span>
                  </div>
                  <div style={{ marginBottom: 4 }}>
                    {w.topics?.map(t => <span key={t} className="concept-tag" style={{ fontSize: 11 }}>{t}</span>)}
                  </div>
                  <div style={{ fontSize: 12.5, color: "#4A5880" }}>
                    <span style={{ color: "#6366F1" }}>Daily: </span>{w.dailyTask}
                  </div>
                  <div style={{ fontSize: 12.5, color: "#4A5880", marginTop: 2 }}>
                    <span style={{ color: "#00DFA2" }}>Milestone: </span>{w.milestone}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const PageReflection = () => (
    <div className="ro-fadein">
      <p className="ro-page-title">Daily Reflection</p>
      <p className="ro-page-sub">End your study session with a reflection. AI gives you personalized insights.</p>

      {!refDone ? (
        <div className="ro-grid2">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="ro-card">
              <p className="ro-label">What did you learn today? ✨</p>
              <textarea className="ro-input ro-textarea" style={{ minHeight: 100 }}
                placeholder="Describe what you studied, key insights, aha moments…"
                value={refLearned} onChange={e => setRefLearned(e.target.value)} />
            </div>
            <div className="ro-card">
              <p className="ro-label">What felt difficult or confusing? 🤔</p>
              <textarea className="ro-input ro-textarea" style={{ minHeight: 80 }}
                placeholder="Topics that need more review, concepts that weren't clear…"
                value={refWeak} onChange={e => setRefWeak(e.target.value)} />
            </div>
            <div className="ro-card">
              <p className="ro-label">What's your goal for tomorrow? 🎯</p>
              <textarea className="ro-input ro-textarea" style={{ minHeight: 80 }}
                placeholder="What do you want to achieve in your next study session?"
                value={refTomorrow} onChange={e => setRefTomorrow(e.target.value)} />
            </div>
            <button className="ro-btn ro-btn-primary" style={{ justifyContent: "center" }}
              onClick={submitReflection} disabled={isLoading || !refLearned.trim()}>
              {isLoading ? <><Icon.Loader /> Analyzing…</> : <><Icon.Sparkles /> Get AI Insight</>}
            </button>
          </div>
          <div>
            <div className="ro-card" style={{ marginBottom: 14 }}>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14.5, fontWeight: 600, color: "#F1F5FF", marginBottom: ".75rem" }}>Why reflect?</p>
              {[
                { icon: "🧠", t: "Consolidates memory", d: "Writing activates deeper encoding in long-term memory" },
                { icon: "🎯", t: "Identifies gaps", d: "Spotting weak areas directs your next study session" },
                { icon: "📈", t: "Builds momentum", d: "Reviewing progress boosts motivation and consistency" },
              ].map(f => (
                <div key={f.t} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ fontSize: 18 }}>{f.icon}</span>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: "#C8D8F0" }}>{f.t}</div>
                    <div style={{ fontSize: 12, color: "#3D4F72" }}>{f.d}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="ro-card">
              <p className="ro-label">Today's topics</p>
              {notes.slice(0, 3).map(n => (
                <div key={n.id} style={{ padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 13.5, color: "#8090B4" }}>
                  📖 {n.title}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="ro-fadein" style={{ maxWidth: 600 }}>
          <div className="ro-card" style={{ border: "1px solid rgba(0,223,162,0.2)", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: ".75rem" }}>
              <span style={{ fontSize: 24 }}>🤖</span>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, fontWeight: 600, color: "#F1F5FF" }}>RecallOS AI Insight</p>
            </div>
            <p style={{ fontSize: 14, color: "#9AAAC8", lineHeight: 1.7 }}>{refInsight}</p>
          </div>
          <div className="ro-card" style={{ marginBottom: 14 }}>
            <p className="ro-label">Your reflection</p>
            <p style={{ fontSize: 13.5, color: "#8090B4", lineHeight: 1.65, marginBottom: ".75rem" }}><strong style={{ color: "#6366F1" }}>Learned:</strong> {refLearned}</p>
            {refWeak && <p style={{ fontSize: 13.5, color: "#8090B4", lineHeight: 1.65, marginBottom: ".75rem" }}><strong style={{ color: "#FBBF24" }}>Weak areas:</strong> {refWeak}</p>}
            {refTomorrow && <p style={{ fontSize: 13.5, color: "#8090B4", lineHeight: 1.65 }}><strong style={{ color: "#00DFA2" }}>Tomorrow:</strong> {refTomorrow}</p>}
          </div>
          <button className="ro-btn ro-btn-ghost" onClick={() => { setRefDone(false); setRefLearned(""); setRefWeak(""); setRefTomorrow(""); setRefInsight(""); }}>
            + New Reflection
          </button>
        </div>
      )}
    </div>
  );

  const PAGES = { dashboard: PageDashboard, upload: PageUpload, knowledge: PageKnowledge, tutor: PageTutor, course: PageCourse, reflection: PageReflection };
  const ActivePage = PAGES[page] || PageDashboard;

  return (
    <div className="ro">
      {/* Sidebar */}
      <div className="ro-side">
        <div className="ro-logo">
          <div className="ro-logo-icon">🧠</div>
          <span className="ro-logo-text">RecallOS</span>
        </div>

        <p className="ro-section-label">Main</p>
        {NAV.slice(0, 3).map(n => (
          <div key={n.id} className={`ro-nav ${page === n.id ? "active" : ""}`} onClick={() => { setPage(n.id); if (n.id === "knowledge") { setSelNote(null); setQuizMode(false); } }}>
            <span style={{ display: "flex" }}>{Icon[n.icon]()}</span>
            {n.label}
          </div>
        ))}

        <p className="ro-section-label">AI Features</p>
        {NAV.slice(3).map(n => (
          <div key={n.id} className={`ro-nav ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
            <span style={{ display: "flex" }}>{Icon[n.icon]()}</span>
            {n.label}
          </div>
        ))}

        <div className="ro-user">
          <div className="ro-avatar">S</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#C8D8F0" }}>Scholar</div>
            <div style={{ fontSize: 11, color: "#3D4F72" }}>5 day streak 🔥</div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="ro-main">
        <ActivePage />
      </div>
    </div>
  );
}
