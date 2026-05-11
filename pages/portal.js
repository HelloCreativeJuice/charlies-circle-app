import { useState, useRef, useEffect } from "react";

const MEMBER = {
  name: "Nia Okafor",
  initials: "N",
  discipline: "Music Creative · Consultant · Founder",
  building: "A creative consultancy for independent musicians — helping artists develop their IP, position their work, and build sustainable creative careers.",
  season: "Season 1 — Creators of New Earth",
  memberSince: "April 2026",
  location: "Atlanta, GA",
  deliverables: [
    { type: "PDF", name: "Brand Strategy Brief · May 2026", meta: "Strategy · Uploaded May 05, 2026", isNew: true },
    { type: "DOC", name: "Session Notes · April 30, 2026", meta: "Session Notes · Uploaded May 01, 2026", isNew: true },
    { type: "PDF", name: "IP Mapping Framework · Your Work", meta: "Framework · Uploaded April 20, 2026", isNew: false },
    { type: "DOC", name: "Session Notes · April 14, 2026", meta: "Session Notes · Uploaded April 15, 2026", isNew: false },
  ],
  opportunities: [
    { tag: "Grant · Music", title: "NMAAHC Music Innovation Fund", detail: "Open to independent musicians building culturally significant projects. Awards up to $25,000. Deadline June 1, 2026." },
    { tag: "Residency", title: "Creatives Rebuild NY — Artist Employment Program", detail: "Salaried positions for working artists embedded in partner organizations across New York. Rolling applications." },
    { tag: "Speaking · Industry", title: "A3C Festival Speaker Submissions", detail: "Annual conference for independent music industry professionals. Speaker applications open through May 20." },
    { tag: "Publishing", title: "Pitchfork — Contributor Call", detail: "Open call for music criticism and long-form cultural writing. Aligned with your IP development work." },
    { tag: "Fellowship", title: "Sundance Institute · Creative Producing Fellowship", detail: "For independent creative producers building original work. Application opens May 15." },
  ],
  roomMembers: [
    { initial: "M", name: "Maya Reeves", work: "Licensing her creative IP across fashion + music", online: true, bg: "#D4C5B0" },
    { initial: "D", name: "Dana Kim", work: "Building an independent publishing imprint", online: true, bg: "#B5C9C0" },
    { initial: "J", name: "Jordan Ellis", work: "Developing a cultural documentary series", online: false, bg: "#C4B5A0" },
    { initial: "N", name: "Nia Okafor", work: "Creative consultancy for independent musicians", online: true, bg: "#C8813A" },
  ],
  messages: [
    { initial: "CM", name: "Charlie Mulan · Agency", text: "Your Brand Strategy Brief is ready. I've uploaded it to your deliverables. Let me know if you'd like to walk through it before our session.", time: "May 5", bg: "#C8813A" },
    { initial: "M", name: "Maya Reeves", text: "Hey — saw you're also working in music. Would love to compare notes on the licensing side.", time: "May 4", bg: "#D4C5B0" },
    { initial: "D", name: "Dana Kim", text: "Thank you for the introduction to the publishing contact. Already in conversation.", time: "April 30", bg: "#B5C9C0" },
  ],
  roomMessages: [
    { initial: "M", name: "Maya R.", text: "Anyone else working on positioning their IP for licensing? Would love to connect on this.", time: "2h ago", bg: "#D4C5B0" },
    { initial: "D", name: "Dana K.", text: "Just submitted the proposal we worked on in session. Fingers crossed.", time: "Yesterday", bg: "#B5C9C0" },
    { initial: "CM", name: "Charlie Mulan", text: "This week's opportunities digest is live. Five resources curated specifically for your work.", time: "May 5", bg: "#C8813A" },
  ],
};

const SYSTEM_PROMPT = `You are Circle Intelligence, the creative intelligence agent for Charlie's Circle — the members-only community of Charlie Mulan Creative Intelligence Agency.

Your role: provide strategic, grounded, intelligent support to wave-making creators who are building ideas, products, and movements that evolve human consciousness.

The member you are speaking with:
- Name: Nia Okafor
- Discipline: Music Creative · Consultant · Founder
- Currently building: A creative consultancy for independent musicians — helping artists develop their IP, position their work, and build sustainable creative careers.
- Season: Season 1 — Creators of New Earth
- Member since: April 2026
- Location: Atlanta, GA
- Upcoming session: May 14, 2026 · 2:00 PM EST — Monthly Strategy + Project Management
- Recent deliverables: Brand Strategy Brief (May 2026); Session Notes (April 30); IP Mapping Framework; Session Notes (April 14)
- Current opportunities: NMAAHC Music Innovation Fund (grant up to $25k, deadline June 1); Creatives Rebuild NY Artist Employment (rolling); A3C Festival Speaker Submissions (deadline May 20); Pitchfork Contributor Call; Sundance Institute Creative Producing Fellowship (opens May 15)
- Fellow Season 1 members: Maya Reeves (licensing IP across fashion + music); Dana Kim (independent publishing imprint); Jordan Ellis (cultural documentary series)

Agency philosophy:
1. The future belongs to those who build it
2. Creativity expands reality
3. Thought and creation evolve human consciousness
4. Thoughts become ideas through practice
5. Intellectual property as containers for ideas

Voice and tone:
- Grounded clarity, considered imagination, unhurried authority
- Declarative. No hedging. No filler phrases like "great question" or "certainly"
- Use "cultivate" not "architect", "work" or "transmission" not "content"
- Speak as a senior creative strategist: direct, warm, specific
- Do not use em dashes. Use colons or full stops instead.
- Responses should feel like guidance from someone who knows this member's work deeply

You can help with: strategic thinking, session preparation, IP development, opportunity evaluation, creative direction, positioning, next-step clarity, grant/pitch drafting, and anything that serves the member's creative and professional growth.

Keep responses focused and useful. Reference specific deliverables and opportunities when relevant. Be specific. Be grounded.`;

const PROMPT_CHIPS = [
  { label: "This week's opportunities", prompt: "Which of the opportunities in my portal are most relevant to where I am right now?" },
  { label: "Prepare for session", prompt: "Help me prepare for my strategy session on May 14. What should I come ready to discuss?" },
  { label: "IP positioning", prompt: "How should I think about positioning my consultancy's IP?" },
  { label: "Next creative move", prompt: "Based on what you know about my work, what should my next creative move be?" },
  { label: "Draft grant pitch", prompt: "Help me draft a pitch for the NMAAHC Music Innovation Fund grant." },
  { label: "Founding member focus", prompt: "What are the most important things I should be building as a Season 1 founding member?" },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');
  :root {
    --paper:#F5F0E8; --paper-dark:#EDE7D9; --ink:#1A1612; --ink-mid:#3D342A;
    --ink-light:#7A6E62; --amber:#C8813A; --amber-light:#E8A055;
    --rule:rgba(26,22,18,0.12); --sidebar-w:240px; --agent-w:380px;
  }
  *{margin:0;padding:0;box-sizing:border-box;}
  .portal-root{font-family:'DM Sans',sans-serif;font-weight:300;background:var(--paper);color:var(--ink);min-height:100vh;display:flex;position:relative;overflow:hidden;}
  .portal-root::before{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");pointer-events:none;z-index:1000;opacity:0.4;}
  .sidebar{width:var(--sidebar-w);min-height:100vh;background:var(--ink);display:flex;flex-direction:column;position:fixed;left:0;top:0;bottom:0;z-index:100;}
  .sidebar-logo{padding:28px 24px 20px;border-bottom:1px solid rgba(245,240,232,0.08);}
  .sidebar-agency{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(245,240,232,0.35);margin-bottom:4px;}
  .sidebar-circle{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:400;color:var(--paper);}
  .sidebar-season{font-family:'DM Mono',monospace;font-size:8px;letter-spacing:0.14em;text-transform:uppercase;color:var(--amber);margin-top:5px;}
  .sidebar-member{padding:20px 24px;border-bottom:1px solid rgba(245,240,232,0.08);}
  .member-av{width:40px;height:40px;border-radius:50%;background:var(--amber);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:500;color:var(--ink);margin-bottom:10px;}
  .member-nm{font-family:'Cormorant Garamond',serif;font-size:15px;color:var(--paper);margin-bottom:2px;}
  .member-bld{font-size:10px;color:rgba(245,240,232,0.4);line-height:1.4;}
  .member-badge{display:inline-flex;margin-top:8px;background:rgba(200,129,58,0.15);border:1px solid rgba(200,129,58,0.3);padding:3px 8px;border-radius:2px;font-family:'DM Mono',monospace;font-size:7px;letter-spacing:0.14em;text-transform:uppercase;color:var(--amber);}
  .sidebar-nav{flex:1;padding:16px 0;overflow-y:auto;}
  .nav-section{font-family:'DM Mono',monospace;font-size:7px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(245,240,232,0.18);padding:14px 24px 7px;}
  .nav-item{display:flex;align-items:center;gap:10px;padding:10px 24px;cursor:pointer;transition:all 0.18s;position:relative;border:none;background:none;width:100%;text-align:left;}
  .nav-item:hover{background:rgba(245,240,232,0.04);}
  .nav-item.active{background:rgba(200,129,58,0.1);}
  .nav-item.active::before{content:'';position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--amber);}
  .nav-lbl{font-size:11px;color:rgba(245,240,232,0.45);letter-spacing:0.02em;}
  .nav-item.active .nav-lbl{color:var(--paper);}
  .nav-badge-pill{margin-left:auto;background:var(--amber);color:var(--ink);font-family:'DM Mono',monospace;font-size:7px;font-weight:500;padding:2px 5px;border-radius:2px;}
  .agent-trigger{margin:10px 14px 4px;border:1px solid rgba(200,129,58,0.25) !important;background:rgba(200,129,58,0.06) !important;padding:10px 12px !important;border-radius:2px;}
  .agent-trigger:hover{background:rgba(200,129,58,0.11) !important;}
  .agent-trigger.agent-on{background:rgba(200,129,58,0.16) !important;border-color:rgba(200,129,58,0.5) !important;}
  .agent-trigger .nav-lbl{color:var(--amber) !important;font-size:10px !important;}
  .agent-trigger.active::before{display:none;}
  .pulse-dot{width:5px;height:5px;border-radius:50%;background:var(--amber);margin-left:auto;animation:pulse 2s ease-in-out infinite;}
  @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.35;transform:scale(0.65)}}
  .sidebar-bottom{padding:18px 24px;border-top:1px solid rgba(245,240,232,0.08);}
  .next-lbl{font-family:'DM Mono',monospace;font-size:7px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(245,240,232,0.22);margin-bottom:4px;}
  .next-date{font-family:'Cormorant Garamond',serif;font-size:13px;color:rgba(245,240,232,0.65);}
  .main-content{margin-left:var(--sidebar-w);flex:1;min-height:100vh;display:flex;flex-direction:column;transition:margin-right 0.32s cubic-bezier(0.4,0,0.2,1);}
  .main-content.agent-open{margin-right:var(--agent-w);}
  .topbar{display:flex;align-items:center;justify-content:space-between;padding:20px 40px;border-bottom:1px solid var(--rule);flex-shrink:0;}
  .topbar-title{font-family:'Cormorant Garamond',serif;font-size:12px;color:var(--ink-light);letter-spacing:0.05em;}
  .topbar-right{display:flex;align-items:center;gap:16px;}
  .topbar-date{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.1em;color:var(--ink-light);}
  .notif-btn{width:30px;height:30px;border-radius:50%;border:1px solid var(--rule);background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;position:relative;transition:border-color 0.2s;}
  .notif-btn:hover{border-color:var(--amber);}
  .notif-dot{position:absolute;top:5px;right:6px;width:5px;height:5px;background:var(--amber);border-radius:50%;}
  .page-content{padding:40px;flex:1;overflow-y:auto;max-height:calc(100vh - 65px);}
  .welcome{margin-bottom:40px;}
  .eyebrow{font-family:'DM Mono',monospace;font-size:8px;letter-spacing:0.2em;text-transform:uppercase;color:var(--amber);margin-bottom:8px;}
  .page-heading{font-family:'Cormorant Garamond',serif;font-size:38px;font-weight:300;line-height:1.1;color:var(--ink);margin-bottom:14px;}
  .page-heading em{font-style:italic;color:var(--ink-mid);}
  .page-sub{font-size:12px;color:var(--ink-light);max-width:480px;line-height:1.7;}
  .stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--rule);border:1px solid var(--rule);margin-bottom:32px;}
  .stat-card{background:var(--paper);padding:20px 24px;transition:background 0.18s;}
  .stat-card:hover{background:var(--paper-dark);}
  .stat-lbl{font-family:'DM Mono',monospace;font-size:7px;letter-spacing:0.18em;text-transform:uppercase;color:var(--ink-light);margin-bottom:8px;}
  .stat-val{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:400;color:var(--ink);line-height:1;margin-bottom:3px;}
  .stat-sub{font-size:10px;color:var(--ink-light);}
  .two-col{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;}
  .panel{border:1px solid var(--rule);background:var(--paper);}
  .panel-hd{padding:16px 20px;border-bottom:1px solid var(--rule);display:flex;align-items:center;justify-content:space-between;}
  .panel-ttl{font-family:'DM Mono',monospace;font-size:8px;letter-spacing:0.16em;text-transform:uppercase;color:var(--ink-mid);}
  .panel-act{font-family:'DM Mono',monospace;font-size:7px;letter-spacing:0.12em;text-transform:uppercase;color:var(--amber);cursor:pointer;border:none;background:none;}
  .panel-bd{padding:20px;}
  .del-item{display:flex;align-items:flex-start;gap:12px;padding:12px 0;border-bottom:1px solid var(--rule);cursor:pointer;transition:opacity 0.18s;}
  .del-item:last-child{border-bottom:none;padding-bottom:0;}
  .del-item:first-child{padding-top:0;}
  .del-item:hover{opacity:0.65;}
  .del-icon{width:32px;height:32px;background:var(--paper-dark);border:1px solid var(--rule);display:flex;align-items:center;justify-content:center;font-family:'DM Mono',monospace;font-size:7px;color:var(--ink-light);flex-shrink:0;}
  .del-icon.new{background:rgba(200,129,58,0.08);border-color:rgba(200,129,58,0.25);color:var(--amber);}
  .del-info{flex:1;}
  .del-name{font-family:'Cormorant Garamond',serif;font-size:14px;color:var(--ink);margin-bottom:2px;}
  .del-meta{font-family:'DM Mono',monospace;font-size:8px;color:var(--ink-light);letter-spacing:0.06em;}
  .del-new{font-family:'DM Mono',monospace;font-size:7px;letter-spacing:0.1em;text-transform:uppercase;color:var(--amber);border:1px solid rgba(200,129,58,0.3);padding:2px 6px;flex-shrink:0;align-self:center;}
  .opp-item{padding:14px 0;border-bottom:1px solid var(--rule);}
  .opp-item:last-child{border-bottom:none;padding-bottom:0;}
  .opp-item:first-child{padding-top:0;}
  .opp-tag{font-family:'DM Mono',monospace;font-size:7px;letter-spacing:0.12em;text-transform:uppercase;color:var(--amber);margin-bottom:4px;}
  .opp-title{font-family:'Cormorant Garamond',serif;font-size:14px;color:var(--ink);margin-bottom:3px;line-height:1.3;}
  .opp-detail{font-size:10px;color:var(--ink-light);line-height:1.5;}
  .session-block{background:var(--ink);padding:24px;display:flex;flex-direction:column;gap:14px;margin-bottom:20px;}
  .session-lbl{font-family:'DM Mono',monospace;font-size:7px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(245,240,232,0.28);}
  .session-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:300;color:var(--paper);line-height:1.2;}
  .session-dt{font-family:'DM Mono',monospace;font-size:10px;color:var(--amber);letter-spacing:0.07em;}
  .session-btn{display:inline-flex;align-items:center;gap:6px;background:var(--amber);color:var(--ink);font-family:'DM Mono',monospace;font-size:8px;letter-spacing:0.14em;text-transform:uppercase;padding:9px 16px;border:none;cursor:pointer;transition:opacity 0.18s;align-self:flex-start;font-weight:500;}
  .session-btn:hover{opacity:0.85;}
  .session-prep{font-size:10px;color:rgba(245,240,232,0.3);line-height:1.6;border-top:1px solid rgba(245,240,232,0.07);padding-top:14px;}
  .chat-item{display:flex;gap:10px;padding:12px 0;border-bottom:1px solid var(--rule);cursor:pointer;transition:opacity 0.18s;}
  .chat-item:last-child{border-bottom:none;padding-bottom:0;}
  .chat-item:first-child{padding-top:0;}
  .chat-item:hover{opacity:0.65;}
  .chat-av{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:11px;font-weight:500;flex-shrink:0;margin-top:1px;}
  .chat-body{flex:1;}
  .chat-nm{font-family:'DM Mono',monospace;font-size:8px;letter-spacing:0.07em;color:var(--ink-mid);margin-bottom:2px;}
  .chat-msg{font-family:'Cormorant Garamond',serif;font-size:13px;color:var(--ink);line-height:1.4;}
  .chat-time{font-family:'DM Mono',monospace;font-size:7px;color:var(--ink-light);flex-shrink:0;margin-top:3px;}
  .mem-item{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--rule);cursor:pointer;transition:opacity 0.18s;}
  .mem-item:last-child{border-bottom:none;}
  .mem-item:first-child{padding-top:0;}
  .mem-item:hover{opacity:0.65;}
  .mem-dot{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:14px;font-weight:500;flex-shrink:0;}
  .mem-info{flex:1;}
  .mem-name{font-family:'Cormorant Garamond',serif;font-size:14px;color:var(--ink);margin-bottom:1px;}
  .mem-work{font-size:10px;color:var(--ink-light);}
  .online-dot{width:6px;height:6px;border-radius:50%;background:#7BAE7F;}
  .offline-dot{width:6px;height:6px;border-radius:50%;background:var(--rule);}
  .profile-identity{display:flex;align-items:flex-start;gap:24px;padding:28px;border-bottom:1px solid var(--rule);}
  .profile-av{width:64px;height:64px;border-radius:50%;background:var(--amber);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:500;color:var(--ink);flex-shrink:0;}
  .profile-nm{font-family:'Cormorant Garamond',serif;font-size:26px;color:var(--ink);margin-bottom:3px;}
  .profile-disc{font-size:12px;color:var(--ink-light);margin-bottom:10px;}
  .profile-bld-lbl{font-family:'DM Mono',monospace;font-size:7px;letter-spacing:0.15em;text-transform:uppercase;color:var(--ink-light);margin-bottom:4px;}
  .profile-bld{font-family:'Cormorant Garamond',serif;font-size:15px;font-style:italic;color:var(--ink-mid);line-height:1.4;}
  .tab-bar{display:flex;border-bottom:1px solid var(--rule);padding:0 20px;}
  .tab-item{font-family:'DM Mono',monospace;font-size:8px;letter-spacing:0.14em;text-transform:uppercase;color:var(--ink-light);padding:12px 0;margin-right:24px;cursor:pointer;border-bottom:2px solid transparent;transition:all 0.18s;background:none;border-top:none;border-left:none;border-right:none;}
  .tab-item.active{color:var(--ink);border-bottom-color:var(--amber);}
  .agent-panel{position:fixed;top:0;right:0;bottom:0;width:var(--agent-w);background:var(--ink);z-index:200;display:flex;flex-direction:column;transform:translateX(100%);transition:transform 0.32s cubic-bezier(0.4,0,0.2,1);border-left:1px solid rgba(245,240,232,0.07);}
  .agent-panel.open{transform:translateX(0);}
  .agent-hd{padding:20px 20px 16px;border-bottom:1px solid rgba(245,240,232,0.08);flex-shrink:0;}
  .agent-hd-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px;}
  .agent-eyebrow{font-family:'DM Mono',monospace;font-size:7px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(245,240,232,0.22);margin-bottom:4px;}
  .agent-name-display{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:300;color:var(--paper);}
  .agent-name-display em{font-style:italic;color:var(--amber-light);}
  .agent-status-row{display:flex;align-items:center;gap:5px;margin-top:4px;}
  .agent-status-dot{width:5px;height:5px;border-radius:50%;background:#7BAE7F;animation:pulse 2.5s ease-in-out infinite;}
  .agent-status-txt{font-family:'DM Mono',monospace;font-size:7px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(245,240,232,0.28);}
  .agent-close-btn{width:26px;height:26px;border:1px solid rgba(245,240,232,0.1);background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:rgba(245,240,232,0.38);font-size:12px;transition:all 0.18s;border-radius:1px;}
  .agent-close-btn:hover{border-color:rgba(245,240,232,0.3);color:var(--paper);}
  .agent-chips-wrap{padding:0 20px;border-bottom:1px solid rgba(245,240,232,0.06);flex-shrink:0;}
  .chips-lbl{font-family:'DM Mono',monospace;font-size:7px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(245,240,232,0.18);padding:14px 0 8px;}
  .chips-grid{display:flex;flex-wrap:wrap;gap:5px;padding-bottom:14px;}
  .chip{font-family:'DM Mono',monospace;font-size:7px;letter-spacing:0.08em;text-transform:uppercase;color:rgba(245,240,232,0.4);border:1px solid rgba(245,240,232,0.09);padding:5px 9px;cursor:pointer;transition:all 0.15s;border-radius:1px;background:transparent;}
  .chip:hover{border-color:rgba(200,129,58,0.4);color:var(--amber);background:rgba(200,129,58,0.05);}
  .agent-msgs{flex:1;overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:14px;scroll-behavior:smooth;}
  .agent-msgs::-webkit-scrollbar{width:3px;}
  .agent-msgs::-webkit-scrollbar-thumb{background:rgba(245,240,232,0.08);}
  .agent-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:32px 20px;gap:10px;}
  .empty-glyph{font-family:'Cormorant Garamond',serif;font-size:44px;color:rgba(200,129,58,0.18);line-height:1;}
  .empty-txt{font-family:'Cormorant Garamond',serif;font-size:15px;font-style:italic;color:rgba(245,240,232,0.25);line-height:1.5;max-width:220px;}
  .msg-wrap{display:flex;flex-direction:column;gap:3px;}
  .msg-from{font-family:'DM Mono',monospace;font-size:7px;letter-spacing:0.12em;text-transform:uppercase;}
  .msg-from.agent{color:var(--amber);}
  .msg-from.user{color:rgba(245,240,232,0.28);text-align:right;}
  .msg-bubble{padding:10px 12px;border-radius:1px;font-family:'Cormorant Garamond',serif;font-size:13px;line-height:1.6;}
  .msg-bubble.agent{background:rgba(245,240,232,0.055);border:1px solid rgba(245,240,232,0.07);border-left:2px solid rgba(200,129,58,0.38);color:rgba(245,240,232,0.82);white-space:pre-wrap;}
  .msg-bubble.user{background:rgba(200,129,58,0.1);border:1px solid rgba(200,129,58,0.2);color:rgba(245,240,232,0.7);align-self:flex-end;max-width:88%;}
  .typing-wrap{display:flex;align-items:center;gap:4px;padding:10px 12px;background:rgba(245,240,232,0.04);border:1px solid rgba(245,240,232,0.06);border-left:2px solid rgba(200,129,58,0.28);width:fit-content;}
  .t-dot{width:4px;height:4px;background:var(--amber);border-radius:50%;animation:tdot 1.2s ease-in-out infinite;}
  .t-dot:nth-child(2){animation-delay:0.2s}
  .t-dot:nth-child(3){animation-delay:0.4s}
  @keyframes tdot{0%,100%{opacity:0.18;transform:scale(0.75)}50%{opacity:1;transform:scale(1.1)}}
  .agent-input-area{padding:14px 20px 18px;border-top:1px solid rgba(245,240,232,0.08);flex-shrink:0;}
  .input-wrap{display:flex;align-items:flex-end;gap:8px;border:1px solid rgba(245,240,232,0.11);background:rgba(245,240,232,0.04);padding:8px 12px;transition:border-color 0.2s;}
  .input-wrap:focus-within{border-color:rgba(200,129,58,0.32);}
  .agent-textarea{flex:1;background:transparent;border:none;outline:none;font-family:'Cormorant Garamond',serif;font-size:13px;color:rgba(245,240,232,0.75);resize:none;line-height:1.5;min-height:20px;max-height:90px;overflow-y:auto;}
  .agent-textarea::placeholder{color:rgba(245,240,232,0.18);}
  .send-btn{width:26px;height:26px;background:var(--amber);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:opacity 0.18s;}
  .send-btn:hover{opacity:0.85;}
  .send-btn:disabled{opacity:0.28;cursor:not-allowed;}
  .input-footer{font-family:'DM Mono',monospace;font-size:7px;letter-spacing:0.08em;color:rgba(245,240,232,0.13);text-align:center;margin-top:8px;line-height:1.5;}
`;

const icons = {
  home: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 6L8 2L14 6V14H10V10H6V14H2V6Z" stroke="currentColor" strokeWidth="1" fill="none"/></svg>,
  deliverables: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="14" rx="1" stroke="currentColor" strokeWidth="1"/><line x1="5" y1="6" x2="11" y2="6" stroke="currentColor" strokeWidth="1"/><line x1="5" y1="9" x2="11" y2="9" stroke="currentColor" strokeWidth="1"/><line x1="5" y1="12" x2="8" y2="12" stroke="currentColor" strokeWidth="1"/></svg>,
  opportunities: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1"/><path d="M8 5V8L10 10" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>,
  community: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1"/><circle cx="11" cy="5" r="2" stroke="currentColor" strokeWidth="1"/><path d="M1 14C1 11.8 3.2 10 6 10C8.8 10 11 11.8 11 14" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/><path d="M11 9C12.7 9 14 10.1 14 14" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>,
  messages: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 3H14V11H9L6 14V11H2V3Z" stroke="currentColor" strokeWidth="1" fill="none"/></svg>,
  profile: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1"/><path d="M2 14C2 11.2 4.7 9 8 9C11.3 9 14 11.2 14 14" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>,
  agent: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3" stroke="#C8813A" strokeWidth="1"/><path d="M8 1V3M8 13V15M1 8H3M13 8H15" stroke="#C8813A" strokeWidth="1" strokeLinecap="round"/><path d="M3.5 3.5L5 5M11 11L12.5 12.5M3.5 12.5L5 11M11 5L12.5 3.5" stroke="#C8813A" strokeWidth="1" strokeLinecap="round" opacity="0.5"/></svg>,
  send: <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M1 11L11 1M11 1H4M11 1V8" stroke="#1A1612" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

export default function Portal() {
  const [page, setPage] = useState("home");
  const [agentOpen, setAgentOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const msgsEndRef = useRef(null);

  useEffect(() => {
    if (msgsEndRef.current) msgsEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    if (!started) setStarted(true);
    const userMsg = { role: "user", content: msg };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setLoading(true);
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newHistory,
        }),
      });
      const data = await res.json();
      const reply = data.content?.find(b => b.type === "text")?.text || "Something went quiet. Try again.";
      setMessages([...newHistory, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...newHistory, { role: "assistant", content: "There was an issue reaching Circle Intelligence. Check your connection and try again." }]);
    }
    setLoading(false);
  };

  const triggerPrompt = (prompt) => {
    if (!agentOpen) setAgentOpen(true);
    setTimeout(() => sendMessage(prompt), agentOpen ? 0 : 350);
  };

  const navItems = [
    { id: "home", label: "Home", icon: icons.home },
    { id: "deliverables", label: "My Deliverables", icon: icons.deliverables, badge: "2" },
    { id: "opportunities", label: "Opportunities", icon: icons.opportunities, badge: "5" },
    { id: "community", label: "The Room", icon: icons.community },
    { id: "messages", label: "Messages", icon: icons.messages, badge: "3" },
  ];

  const pageTitles = { home: "Member Home", deliverables: "My Deliverables", opportunities: "Opportunities", community: "The Room", messages: "Messages", profile: "My Profile" };

  return (
    <>
      <style>{css}</style>
      <div className="portal-root">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-agency">Charlie Mulan</div>
            <div className="sidebar-circle">Charlie's Circle</div>
            <div className="sidebar-season">Season 1 · Creators of New Earth</div>
          </div>
          <div className="sidebar-member">
            <div className="member-av">{MEMBER.initials}</div>
            <div className="member-nm">{MEMBER.name}</div>
            <div className="member-bld">Building a creative consultancy for independent musicians</div>
            <div className="member-badge">Founding Member</div>
          </div>
          <nav className="sidebar-nav">
            <div className="nav-section">My Portal</div>
            {navItems.map(n => (
              <button key={n.id} className={`nav-item${page === n.id ? " active" : ""}`} onClick={() => setPage(n.id)}>
                <span style={{opacity: page === n.id ? 1 : 0.45, color: page === n.id ? "#F5F0E8" : "rgba(245,240,232,0.5)", flexShrink:0}}>{n.icon}</span>
                <span className="nav-lbl">{n.label}</span>
                {n.badge && <span className="nav-badge-pill">{n.badge}</span>}
              </button>
            ))}
            <div className="nav-section" style={{marginTop:8}}>My Work</div>
            <button className={`nav-item${page === "profile" ? " active" : ""}`} onClick={() => setPage("profile")}>
              <span style={{opacity: page === "profile" ? 1 : 0.45, color:"rgba(245,240,232,0.5)", flexShrink:0}}>{icons.profile}</span>
              <span className="nav-lbl">My Profile</span>
            </button>
            <div className="nav-section" style={{marginTop:8}}>Intelligence</div>
            <button className={`nav-item agent-trigger${agentOpen ? " agent-on" : ""}`} onClick={() => setAgentOpen(o => !o)}>
              <span style={{flexShrink:0}}>{icons.agent}</span>
              <span className="nav-lbl">Circle Intelligence</span>
              <div className="pulse-dot"></div>
            </button>
          </nav>
          <div className="sidebar-bottom">
            <div className="next-lbl">Next Session</div>
            <div className="next-date">May 14 · 2:00 PM EST</div>
          </div>
        </aside>

        <main className={`main-content${agentOpen ? " agent-open" : ""}`}>
          <div className="topbar">
            <div className="topbar-title">{pageTitles[page]}</div>
            <div className="topbar-right">
              <div className="topbar-date">May 11, 2026</div>
              <button className="notif-btn">
                <div className="notif-dot"></div>
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1C7 1 3 3 3 7V10L1.5 11.5H12.5L11 10V7C11 3 7 1 7 1Z" stroke="#7A6E62" strokeWidth="1" fill="none"/>
                  <path d="M5.5 11.5C5.5 12.3 6.2 13 7 13C7.8 13 8.5 12.3 8.5 11.5" stroke="#7A6E62" strokeWidth="1"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="page-content">
            {page === "home" && (
              <div>
                <div className="welcome">
                  <div className="eyebrow">Good morning</div>
                  <div className="page-heading">Welcome back,<br/><em>Nia.</em></div>
                  <div className="page-sub">Your creative work is in motion. Here is where it lives, grows, and gets the support it deserves.</div>
                </div>
                <div className="stats-row">
                  {[
                    {lbl:"Member Since",val:"April 2026",sub:"Season 1 · Founding",sm:true},
                    {lbl:"Sessions Completed",val:"2",sub:"Next: May 14"},
                    {lbl:"Deliverables",val:"4",sub:"2 new this week"},
                    {lbl:"Opportunities",val:"5",sub:"Curated this week"},
                  ].map((s,i) => (
                    <div className="stat-card" key={i}>
                      <div className="stat-lbl">{s.lbl}</div>
                      <div className="stat-val" style={s.sm?{fontSize:18,marginTop:4}:{}}>{s.val}</div>
                      <div className="stat-sub">{s.sub}</div>
                    </div>
                  ))}
                </div>
                <div className="two-col">
                  <div>
                    <div className="panel" style={{marginBottom:20}}>
                      <div className="panel-hd">
                        <span className="panel-ttl">Recent Deliverables</span>
                        <button className="panel-act" onClick={() => setPage("deliverables")}>View All</button>
                      </div>
                      <div className="panel-bd">
                        {MEMBER.deliverables.slice(0,3).map((d,i) => (
                          <div className="del-item" key={i}>
                            <div className={`del-icon${d.isNew?" new":""}`}>{d.type}</div>
                            <div className="del-info">
                              <div className="del-name">{d.name}</div>
                              <div className="del-meta">{d.meta}</div>
                            </div>
                            {d.isNew && <div className="del-new">New</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="panel">
                      <div className="panel-hd">
                        <span className="panel-ttl">This Week's Opportunities</span>
                        <button className="panel-act" onClick={() => setPage("opportunities")}>View All</button>
                      </div>
                      <div className="panel-bd">
                        {MEMBER.opportunities.slice(0,2).map((o,i) => (
                          <div className="opp-item" key={i}>
                            <div className="opp-tag">{o.tag}</div>
                            <div className="opp-title">{o.title}</div>
                            <div className="opp-detail">{o.detail}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="session-block">
                      <div className="session-lbl">Next Strategy Session</div>
                      <div className="session-title">Monthly Strategy + Project Management</div>
                      <div className="session-dt">Wednesday, May 14 · 2:00 PM EST · 60 min</div>
                      <div>
                        <button className="session-btn" onClick={() => { setAgentOpen(true); setTimeout(() => sendMessage("Help me prepare for my strategy session on May 14. What should I come ready to discuss?"), 350); }}>
                          Prepare for Session →
                        </button>
                      </div>
                      <div className="session-prep">Come with your current project focus and your most pressing question. The session is yours.</div>
                    </div>
                    <div className="panel">
                      <div className="panel-hd">
                        <span className="panel-ttl">The Room</span>
                        <button className="panel-act" onClick={() => setPage("community")}>View All</button>
                      </div>
                      <div className="panel-bd">
                        {MEMBER.roomMessages.map((m,i) => (
                          <div className="chat-item" key={i}>
                            <div className="chat-av" style={{background:m.bg,color:"#1A1612"}}>{m.initial}</div>
                            <div className="chat-body">
                              <div className="chat-nm">{m.name}</div>
                              <div className="chat-msg">{m.text}</div>
                            </div>
                            <div className="chat-time">{m.time}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {page === "deliverables" && (
              <div>
                <div className="welcome">
                  <div className="eyebrow">Your Archive</div>
                  <div className="page-heading" style={{fontSize:30}}>My <em>Deliverables</em></div>
                  <div className="page-sub">Everything produced for your work, in one place.</div>
                </div>
                <div className="panel">
                  <div className="tab-bar">
                    {["All","Strategy","Session Notes","Frameworks"].map((t,i) => (
                      <button key={t} className={`tab-item${i===0?" active":""}`}>{t}</button>
                    ))}
                  </div>
                  <div className="panel-bd">
                    {MEMBER.deliverables.map((d,i) => (
                      <div className="del-item" key={i}>
                        <div className={`del-icon${d.isNew?" new":""}`}>{d.type}</div>
                        <div className="del-info">
                          <div className="del-name">{d.name}</div>
                          <div className="del-meta">{d.meta}</div>
                        </div>
                        {d.isNew && <div className="del-new">New</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {page === "opportunities" && (
              <div>
                <div className="welcome">
                  <div className="eyebrow">Curated for You</div>
                  <div className="page-heading" style={{fontSize:30}}><em>Opportunities</em></div>
                  <div className="page-sub">Researched weekly. Aligned to your industry and mission.</div>
                </div>
                <div className="panel">
                  <div className="panel-hd"><span className="panel-ttl">Week of May 5, 2026 · 5 Opportunities</span></div>
                  <div className="panel-bd">
                    {MEMBER.opportunities.map((o,i) => (
                      <div className="opp-item" key={i}>
                        <div className="opp-tag">{o.tag}</div>
                        <div className="opp-title">{o.title}</div>
                        <div className="opp-detail">{o.detail}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {page === "community" && (
              <div>
                <div className="welcome">
                  <div className="eyebrow">Season 1</div>
                  <div className="page-heading" style={{fontSize:30}}><em>The Room</em></div>
                  <div className="page-sub">The people building alongside you. This is your network.</div>
                </div>
                <div className="two-col">
                  <div className="panel">
                    <div className="panel-hd"><span className="panel-ttl">Founders · Season 1</span></div>
                    <div className="panel-bd">
                      {MEMBER.roomMembers.map((m,i) => (
                        <div className="mem-item" key={i}>
                          <div className="mem-dot" style={{background:m.bg,color:"#1A1612"}}>{m.initial}</div>
                          <div className="mem-info">
                            <div className="mem-name">{m.name}</div>
                            <div className="mem-work">{m.work}</div>
                          </div>
                          {m.online ? <div className="online-dot"/> : <div className="offline-dot"/>}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="panel">
                    <div className="panel-hd">
                      <span className="panel-ttl">Recent Conversation</span>
                      <button className="panel-act">Open Chat</button>
                    </div>
                    <div className="panel-bd">
                      {MEMBER.roomMessages.map((m,i) => (
                        <div className="chat-item" key={i}>
                          <div className="chat-av" style={{background:m.bg,color:"#1A1612"}}>{m.initial}</div>
                          <div className="chat-body">
                            <div className="chat-nm">{m.name}</div>
                            <div className="chat-msg">{m.text}</div>
                          </div>
                          <div className="chat-time">{m.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {page === "profile" && (
              <div>
                <div className="welcome">
                  <div className="eyebrow">Your Identity</div>
                  <div className="page-heading" style={{fontSize:30}}>My <em>Profile</em></div>
                </div>
                <div className="panel">
                  <div className="profile-identity">
                    <div className="profile-av">{MEMBER.initials}</div>
                    <div>
                      <div className="profile-nm">{MEMBER.name}</div>
                      <div className="profile-disc">{MEMBER.discipline}</div>
                      <div className="profile-bld-lbl">Currently Building</div>
                      <div className="profile-bld">{MEMBER.building}</div>
                    </div>
                  </div>
                  <div className="panel-bd">
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:28}}>
                      {[
                        {lbl:"Member Since",val:"April 2026",sub:"Season 1 · Founding Member"},
                        {lbl:"Industry",val:"Music + Creative"},
                        {lbl:"Location",val:"Atlanta, GA"},
                      ].map((s,i) => (
                        <div key={i}>
                          <div className="stat-lbl" style={{marginBottom:6}}>{s.lbl}</div>
                          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:"var(--ink)"}}>{s.val}</div>
                          {s.sub && <div style={{fontSize:10,color:"var(--ink-light)",marginTop:2}}>{s.sub}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {page === "messages" && (
              <div>
                <div className="welcome">
                  <div className="eyebrow">Direct</div>
                  <div className="page-heading" style={{fontSize:30}}><em>Messages</em></div>
                </div>
                <div className="panel">
                  <div className="panel-bd">
                    {MEMBER.messages.map((m,i) => (
                      <div className="chat-item" key={i}>
                        <div className="chat-av" style={{background:m.bg,color:"#1A1612",width:36,height:36,fontSize:12}}>{m.initial}</div>
                        <div className="chat-body">
                          <div className="chat-nm">{m.name}</div>
                          <div className="chat-msg">{m.text}</div>
                        </div>
                        <div className="chat-time">{m.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        <aside className={`agent-panel${agentOpen ? " open" : ""}`}>
          <div className="agent-hd">
            <div className="agent-hd-top">
              <div>
                <div className="agent-eyebrow">Charlie Mulan</div>
                <div className="agent-name-display">Circle <em>Intelligence</em></div>
                <div className="agent-status-row">
                  <div className="agent-status-dot"></div>
                  <div className="agent-status-txt">Active · Season 1</div>
                </div>
              </div>
              <button className="agent-close-btn" onClick={() => setAgentOpen(false)}>✕</button>
            </div>
          </div>
          {!started && (
            <div className="agent-chips-wrap">
              <div className="chips-lbl">Ask about your work</div>
              <div className="chips-grid">
                {PROMPT_CHIPS.map((c,i) => (
                  <button key={i} className="chip" onClick={() => triggerPrompt(c.prompt)}>{c.label}</button>
                ))}
              </div>
            </div>
          )}
          <div className="agent-msgs">
            {!started && (
              <div className="agent-empty">
                <div className="empty-glyph">◎</div>
                <div className="empty-txt">Your creative intelligence is ready. Ask anything about your work, your opportunities, or your next move.</div>
              </div>
            )}
            {messages.map((m,i) => (
              <div className="msg-wrap" key={i}>
                <div className={`msg-from ${m.role === "assistant" ? "agent" : "user"}`}>
                  {m.role === "assistant" ? "Circle Intelligence" : "Nia"}
                </div>
                <div className={`msg-bubble ${m.role === "assistant" ? "agent" : "user"}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="msg-wrap">
                <div className="msg-from agent">Circle Intelligence</div>
                <div className="typing-wrap">
                  <div className="t-dot"/><div className="t-dot"/><div className="t-dot"/>
                </div>
              </div>
            )}
            <div ref={msgsEndRef}/>
          </div>
          <div className="agent-input-area">
            <div className="input-wrap">
              <textarea
                className="agent-textarea"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage();}}}
                placeholder="Ask about your work, your opportunities, your next move..."
                rows={1}
              />
              <button className="send-btn" disabled={loading||!input.trim()} onClick={() => sendMessage()}>
                {icons.send}
              </button>
            </div>
            <div className="input-footer">Powered by Circle Intelligence · Charlie Mulan Agency</div>
          </div>
        </aside>
      </div>
    </>
  );
}
