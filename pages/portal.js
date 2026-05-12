import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://mhsnsmtxsdwmicebfdll.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oc25zbXR4c2R3bWljZWJmZGxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNzIyNzEsImV4cCI6MjA5Mzc0ODI3MX0.EAIH5tZEfxZhqbBiNSXxa4xtLugWqRnUTPLrF9PNbW8'
const ADMIN_EMAIL = 'hello@iamthecreativejuice.com'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const SYSTEM_PROMPT = `You are Circle Intelligence, the creative intelligence agent for Charlie's Circle, the members-only community of Charlie Mulan Creative Intelligence Agency. Your role: provide strategic, grounded, intelligent support to wave-making creators building ideas, products, and movements that evolve human consciousness. Agency philosophy: The future belongs to those who build it. Creativity expands reality. Thought and creation evolve human consciousness. Thoughts become ideas through practice. Intellectual property as containers for ideas. Voice: Grounded clarity, considered imagination, unhurried authority. Declarative. No hedging. No filler phrases. Use "cultivate" not "architect". Do not use em dashes. Speak as a senior creative strategist: direct, warm, specific.`

const PROMPT_CHIPS = [
  { label: "This week's opportunities", prompt: "Which opportunities in my portal are most relevant to where I am right now?" },
  { label: "Prepare for session", prompt: "Help me prepare for my upcoming strategy session. What should I come ready to discuss?" },
  { label: "IP positioning", prompt: "How should I think about positioning my work as intellectual property?" },
  { label: "Next creative move", prompt: "Based on what you know about my work, what should my next creative move be?" },
  { label: "Draft grant pitch", prompt: "Help me draft a pitch for a grant or funding opportunity relevant to my work." },
  { label: "Founding member focus", prompt: "What are the most important things I should be building as a Season 1 founding member?" },
]

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600&display=swap');
  :root { --paper:#F5F0E8; --paper-dark:#EDE7D9; --ink:#1A1612; --ink-mid:#3D342A; --ink-light:#6A5E52; --amber:#C8813A; --amber-light:#E8A055; --rule:rgba(26,22,18,0.14); --sidebar-w:240px; --agent-w:380px; }
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'DM Sans',sans-serif;font-weight:400;background:var(--paper);color:var(--ink);}
  .login-root{min-height:100vh;background:var(--ink);display:flex;align-items:center;justify-content:center;}
  .login-box{width:420px;padding:48px;border:1px solid rgba(245,240,232,0.1);background:rgba(245,240,232,0.03);}
  .login-agency{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(245,240,232,0.3);margin-bottom:6px;}
  .login-title{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:500;color:var(--paper);}
  .login-title em{font-style:italic;color:var(--amber-light);}
  .login-season{font-family:'DM Mono',monospace;font-size:8px;letter-spacing:0.15em;text-transform:uppercase;color:var(--amber);margin-top:6px;margin-bottom:36px;}
  .login-form{display:flex;flex-direction:column;gap:16px;}
  .login-field-label{font-family:'DM Mono',monospace;font-size:8px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(245,240,232,0.35);margin-bottom:6px;}
  .login-input{width:100%;background:rgba(245,240,232,0.05);border:1px solid rgba(245,240,232,0.12);padding:12px 14px;font-family:'DM Sans',sans-serif;font-size:14px;color:var(--paper);outline:none;transition:border-color 0.2s;}
  .login-input:focus{border-color:rgba(200,129,58,0.4);}
  .login-input::placeholder{color:rgba(245,240,232,0.2);}
  .login-btn{background:var(--amber);color:var(--ink);border:none;cursor:pointer;padding:13px 20px;font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;font-weight:500;transition:opacity 0.2s;margin-top:4px;}
  .login-btn:hover{opacity:0.87;}
  .login-btn:disabled{opacity:0.4;cursor:not-allowed;}
  .login-error{font-family:'DM Mono',monospace;font-size:9px;color:#E07070;padding:10px 12px;border:1px solid rgba(224,112,112,0.25);background:rgba(224,112,112,0.06);}
  .login-hint{font-size:11px;color:rgba(245,240,232,0.25);text-align:center;margin-top:8px;cursor:pointer;}
  .portal-root{min-height:100vh;display:flex;background:var(--paper);position:relative;}
  .portal-root::before{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");pointer-events:none;z-index:1000;opacity:0.4;}
  .sidebar{width:var(--sidebar-w);min-height:100vh;background:var(--ink);display:flex;flex-direction:column;position:fixed;left:0;top:0;bottom:0;z-index:100;}
  .sidebar-logo{padding:28px 24px 20px;border-bottom:1px solid rgba(245,240,232,0.08);}
  .sidebar-agency{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(245,240,232,0.35);margin-bottom:4px;}
  .sidebar-circle{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:500;color:var(--paper);}
  .sidebar-season{font-family:'DM Mono',monospace;font-size:8px;letter-spacing:0.14em;text-transform:uppercase;color:var(--amber);margin-top:5px;}
  .sidebar-member{padding:20px 24px;border-bottom:1px solid rgba(245,240,232,0.08);}
  .member-av{width:40px;height:40px;border-radius:50%;background:var(--amber);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:600;color:var(--ink);margin-bottom:10px;}
  .member-nm{font-family:'Cormorant Garamond',serif;font-size:15px;font-weight:500;color:var(--paper);margin-bottom:2px;}
  .member-bld{font-size:10px;color:rgba(245,240,232,0.4);line-height:1.4;}
  .member-badge{display:inline-flex;margin-top:8px;background:rgba(200,129,58,0.15);border:1px solid rgba(200,129,58,0.3);padding:3px 8px;border-radius:2px;font-family:'DM Mono',monospace;font-size:7px;letter-spacing:0.14em;text-transform:uppercase;color:var(--amber);}
  .sidebar-nav{flex:1;padding:16px 0;overflow-y:auto;}
  .nav-section{font-family:'DM Mono',monospace;font-size:7px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(245,240,232,0.2);padding:14px 24px 7px;}
  .nav-item{display:flex;align-items:center;gap:10px;padding:10px 24px;cursor:pointer;transition:all 0.18s;position:relative;border:none;background:none;width:100%;text-align:left;}
  .nav-item:hover{background:rgba(245,240,232,0.04);}
  .nav-item.active{background:rgba(200,129,58,0.1);}
  .nav-item.active::before{content:'';position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--amber);}
  .nav-lbl{font-size:12px;font-weight:500;color:rgba(245,240,232,0.5);letter-spacing:0.02em;}
  .nav-item.active .nav-lbl{color:var(--paper);}
  .nav-badge-pill{margin-left:auto;background:var(--amber);color:var(--ink);font-family:'DM Mono',monospace;font-size:7px;font-weight:500;padding:2px 5px;border-radius:2px;}
  .agent-trigger{margin:10px 14px 4px;border:1px solid rgba(200,129,58,0.25) !important;background:rgba(200,129,58,0.06) !important;padding:10px 12px !important;border-radius:2px;}
  .agent-trigger:hover{background:rgba(200,129,58,0.11) !important;}
  .agent-trigger.agent-on{background:rgba(200,129,58,0.16) !important;border-color:rgba(200,129,58,0.5) !important;}
  .agent-trigger .nav-lbl{color:var(--amber) !important;font-size:11px !important;}
  .agent-trigger.active::before{display:none;}
  .pulse-dot{width:5px;height:5px;border-radius:50%;background:var(--amber);margin-left:auto;animation:pulse 2s ease-in-out infinite;}
  @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.35;transform:scale(0.65)}}
  .sidebar-bottom{padding:18px 24px;border-top:1px solid rgba(245,240,232,0.08);}
  .next-lbl{font-family:'DM Mono',monospace;font-size:7px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(245,240,232,0.22);margin-bottom:4px;}
  .next-date{font-family:'Cormorant Garamond',serif;font-size:13px;font-weight:500;color:rgba(245,240,232,0.65);}
  .logout-btn{width:100%;margin-top:12px;background:transparent;border:1px solid rgba(245,240,232,0.1);color:rgba(245,240,232,0.35);font-family:'DM Mono',monospace;font-size:8px;letter-spacing:0.12em;text-transform:uppercase;padding:8px;cursor:pointer;transition:all 0.2s;}
  .logout-btn:hover{border-color:rgba(245,240,232,0.25);color:rgba(245,240,232,0.6);}
  .main-content{margin-left:var(--sidebar-w);flex:1;min-height:100vh;display:flex;flex-direction:column;transition:margin-right 0.32s cubic-bezier(0.4,0,0.2,1);}
  .main-content.agent-open{margin-right:var(--agent-w);}
  .topbar{display:flex;align-items:center;justify-content:space-between;padding:20px 40px;border-bottom:1px solid var(--rule);flex-shrink:0;background:var(--paper);position:sticky;top:0;z-index:50;}
  .topbar-title{font-family:'Cormorant Garamond',serif;font-size:14px;font-weight:500;color:var(--ink-light);letter-spacing:0.05em;}
  .topbar-right{display:flex;align-items:center;gap:16px;}
  .topbar-date{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.1em;color:var(--ink-light);}
  .admin-badge{font-family:'DM Mono',monospace;font-size:7px;letter-spacing:0.12em;text-transform:uppercase;color:var(--ink);background:var(--amber);padding:3px 8px;border-radius:2px;}
  .notif-wrap{position:relative;}
  .notif-btn{width:32px;height:32px;border-radius:50%;border:1px solid var(--rule);background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;position:relative;transition:border-color 0.2s;}
  .notif-btn:hover{border-color:var(--amber);}
  .notif-dot{position:absolute;top:5px;right:6px;width:5px;height:5px;background:var(--amber);border-radius:50%;}
  .notif-count{position:absolute;top:-4px;right:-4px;width:16px;height:16px;background:var(--amber);border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'DM Mono',monospace;font-size:8px;font-weight:500;color:var(--ink);}
  .notif-dropdown{position:absolute;top:40px;right:0;width:300px;background:var(--paper);border:1px solid var(--rule);z-index:200;box-shadow:0 4px 24px rgba(26,22,18,0.12);}
  .notif-header{padding:12px 16px;border-bottom:1px solid var(--rule);font-family:'DM Mono',monospace;font-size:8px;letter-spacing:0.15em;text-transform:uppercase;color:var(--ink-mid);font-weight:500;}
  .notif-item{padding:12px 16px;border-bottom:1px solid var(--rule);cursor:pointer;transition:background 0.15s;}
  .notif-item:last-child{border-bottom:none;}
  .notif-item:hover{background:var(--paper-dark);}
  .notif-item.unread{background:rgba(200,129,58,0.05);}
  .notif-item-name{font-family:'DM Mono',monospace;font-size:8px;color:var(--amber);margin-bottom:3px;font-weight:500;}
  .notif-item-text{font-family:'Cormorant Garamond',serif;font-size:13px;color:var(--ink);line-height:1.4;}
  .notif-item-time{font-family:'DM Mono',monospace;font-size:7px;color:var(--ink-light);margin-top:3px;}
  .notif-empty{padding:20px 16px;font-family:'Cormorant Garamond',serif;font-size:14px;font-style:italic;color:var(--ink-light);text-align:center;}
  .page-content{padding:40px;flex:1;overflow-y:auto;max-height:calc(100vh - 65px);}
  .welcome{margin-bottom:40px;}
  .eyebrow{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:var(--amber);margin-bottom:8px;}
  .page-heading{font-family:'Cormorant Garamond',serif;font-size:40px;font-weight:500;line-height:1.1;color:var(--ink);margin-bottom:14px;}
  .page-heading em{font-style:italic;color:var(--ink-mid);}
  .page-heading.sm{font-size:30px;}
  .page-sub{font-size:13px;color:var(--ink-light);max-width:480px;line-height:1.7;}
  .stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--rule);border:1px solid var(--rule);margin-bottom:32px;}
  .stat-card{background:var(--paper);padding:20px 24px;transition:background 0.18s;}
  .stat-card:hover{background:var(--paper-dark);}
  .stat-lbl{font-family:'DM Mono',monospace;font-size:8px;letter-spacing:0.18em;text-transform:uppercase;color:var(--ink-light);margin-bottom:8px;}
  .stat-val{font-family:'Cormorant Garamond',serif;font-size:30px;font-weight:500;color:var(--ink);line-height:1;margin-bottom:3px;}
  .stat-sub{font-size:11px;color:var(--ink-light);}
  .two-col{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;}
  .panel{border:1px solid var(--rule);background:var(--paper);margin-bottom:20px;}
  .panel-hd{padding:16px 20px;border-bottom:1px solid var(--rule);display:flex;align-items:center;justify-content:space-between;}
  .panel-ttl{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.16em;text-transform:uppercase;color:var(--ink-mid);font-weight:500;}
  .panel-act{font-family:'DM Mono',monospace;font-size:8px;letter-spacing:0.12em;text-transform:uppercase;color:var(--amber);cursor:pointer;border:none;background:none;font-weight:500;}
  .panel-bd{padding:20px;}
  .del-item{display:flex;align-items:flex-start;gap:12px;padding:12px 0;border-bottom:1px solid var(--rule);cursor:pointer;transition:opacity 0.18s;}
  .del-item:last-child{border-bottom:none;padding-bottom:0;}
  .del-item:first-child{padding-top:0;}
  .del-item:hover{opacity:0.65;}
  .del-icon{width:34px;height:34px;background:var(--paper-dark);border:1px solid var(--rule);display:flex;align-items:center;justify-content:center;font-family:'DM Mono',monospace;font-size:7px;color:var(--ink-light);flex-shrink:0;font-weight:500;}
  .del-icon.new{background:rgba(200,129,58,0.08);border-color:rgba(200,129,58,0.25);color:var(--amber);}
  .del-info{flex:1;}
  .del-name{font-family:'Cormorant Garamond',serif;font-size:15px;font-weight:500;color:var(--ink);margin-bottom:2px;}
  .del-meta{font-family:'DM Mono',monospace;font-size:8px;color:var(--ink-light);letter-spacing:0.06em;}
  .del-new{font-family:'DM Mono',monospace;font-size:7px;letter-spacing:0.1em;text-transform:uppercase;color:var(--amber);border:1px solid rgba(200,129,58,0.3);padding:2px 6px;flex-shrink:0;align-self:center;font-weight:500;}
  .del-link{font-family:'DM Mono',monospace;font-size:7px;color:var(--amber);text-decoration:none;border:1px solid rgba(200,129,58,0.3);padding:2px 6px;flex-shrink:0;align-self:center;}
  .opp-item{padding:14px 0;border-bottom:1px solid var(--rule);}
  .opp-item:last-child{border-bottom:none;padding-bottom:0;}
  .opp-item:first-child{padding-top:0;}
  .opp-tag{font-family:'DM Mono',monospace;font-size:8px;letter-spacing:0.12em;text-transform:uppercase;color:var(--amber);margin-bottom:4px;font-weight:500;}
  .opp-title{font-family:'Cormorant Garamond',serif;font-size:15px;font-weight:500;color:var(--ink);margin-bottom:3px;line-height:1.3;}
  .opp-detail{font-size:11px;color:var(--ink-light);line-height:1.5;}
  .session-block{background:var(--ink);padding:24px;display:flex;flex-direction:column;gap:14px;margin-bottom:20px;}
  .session-lbl{font-family:'DM Mono',monospace;font-size:7px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(245,240,232,0.28);}
  .session-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:500;color:var(--paper);line-height:1.2;}
  .session-dt{font-family:'DM Mono',monospace;font-size:10px;color:var(--amber);letter-spacing:0.07em;}
  .session-btn{display:inline-flex;align-items:center;gap:6px;background:var(--amber);color:var(--ink);font-family:'DM Mono',monospace;font-size:8px;letter-spacing:0.14em;text-transform:uppercase;padding:9px 16px;border:none;cursor:pointer;transition:opacity 0.18s;align-self:flex-start;font-weight:600;}
  .session-btn:hover{opacity:0.85;}
  .session-prep{font-size:11px;color:rgba(245,240,232,0.3);line-height:1.6;border-top:1px solid rgba(245,240,232,0.07);padding-top:14px;}
  .msg-thread{display:flex;flex-direction:column;height:500px;}
  .msg-thread-header{padding:16px 20px;border-bottom:1px solid var(--rule);display:flex;align-items:center;gap:12px;}
  .msg-thread-av{width:36px;height:36px;border-radius:50%;background:var(--amber);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:14px;font-weight:600;color:var(--ink);flex-shrink:0;}
  .msg-thread-name{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:500;color:var(--ink);}
  .msg-thread-role{font-family:'DM Mono',monospace;font-size:8px;color:var(--ink-light);letter-spacing:0.08em;}
  .msg-list{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:16px;}
  .msg-list::-webkit-scrollbar{width:3px;}
  .msg-list::-webkit-scrollbar-thumb{background:var(--rule);}
  .msg-bubble-wrap{display:flex;flex-direction:column;gap:3px;max-width:75%;}
  .msg-bubble-wrap.mine{align-self:flex-end;}
  .msg-bubble-wrap.theirs{align-self:flex-start;}
  .msg-bubble-sender{font-family:'DM Mono',monospace;font-size:7px;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-light);font-weight:500;}
  .msg-bubble-wrap.mine .msg-bubble-sender{text-align:right;color:var(--amber);}
  .msg-bubble-text{padding:12px 16px;font-family:'Cormorant Garamond',serif;font-size:15px;font-weight:400;line-height:1.6;border-radius:1px;}
  .msg-bubble-wrap.mine .msg-bubble-text{background:var(--ink);color:var(--paper);}
  .msg-bubble-wrap.theirs .msg-bubble-text{background:var(--paper-dark);color:var(--ink);border:1px solid var(--rule);}
  .msg-bubble-time{font-family:'DM Mono',monospace;font-size:7px;color:var(--ink-light);}
  .msg-bubble-wrap.mine .msg-bubble-time{text-align:right;}
  .msg-input-area{padding:16px 20px;border-top:1px solid var(--rule);display:flex;gap:10px;align-items:flex-end;}
  .msg-textarea{flex:1;background:var(--paper-dark);border:1px solid var(--rule);padding:10px 14px;font-family:'Cormorant Garamond',serif;font-size:14px;color:var(--ink);resize:none;outline:none;min-height:44px;max-height:120px;transition:border-color 0.2s;}
  .msg-textarea:focus{border-color:var(--amber);}
  .msg-textarea::placeholder{color:var(--ink-light);}
  .msg-send-btn{background:var(--amber);color:var(--ink);border:none;cursor:pointer;padding:10px 20px;font-family:'DM Mono',monospace;font-size:8px;letter-spacing:0.14em;text-transform:uppercase;font-weight:600;transition:opacity 0.18s;flex-shrink:0;height:44px;}
  .msg-send-btn:hover{opacity:0.85;}
  .msg-send-btn:disabled{opacity:0.35;cursor:not-allowed;}
  .mem-card{display:flex;align-items:flex-start;gap:16px;padding:20px;border:1px solid var(--rule);cursor:pointer;transition:all 0.18s;background:var(--paper);margin-bottom:12px;}
  .mem-card:hover{border-color:var(--amber);background:var(--paper-dark);}
  .mem-av{width:48px;height:48px;border-radius:50%;background:var(--amber);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;color:var(--ink);flex-shrink:0;}
  .mem-info{flex:1;}
  .mem-name{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:var(--ink);margin-bottom:2px;}
  .mem-disc{font-size:12px;color:var(--ink-light);margin-bottom:6px;}
  .mem-tags{display:flex;gap:6px;flex-wrap:wrap;}
  .mem-tag{font-family:'DM Mono',monospace;font-size:7px;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-mid);border:1px solid var(--rule);padding:2px 7px;}
  .mem-tag.amber{color:var(--amber);border-color:rgba(200,129,58,0.3);}
  .mem-arrow{color:var(--ink-light);font-size:18px;align-self:center;transition:color 0.2s;}
  .mem-card:hover .mem-arrow{color:var(--amber);}
  .back-btn{display:flex;align-items:center;gap:6px;font-family:'DM Mono',monospace;font-size:8px;letter-spacing:0.12em;text-transform:uppercase;color:var(--ink-light);border:none;background:none;cursor:pointer;margin-bottom:28px;transition:color 0.18s;font-weight:500;}
  .back-btn:hover{color:var(--amber);}
  .member-detail-header{display:flex;align-items:flex-start;gap:24px;padding:28px;border:1px solid var(--rule);background:var(--paper);margin-bottom:20px;}
  .member-detail-av{width:72px;height:72px;border-radius:50%;background:var(--amber);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;color:var(--ink);flex-shrink:0;}
  .member-detail-name{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;color:var(--ink);margin-bottom:3px;}
  .member-detail-disc{font-size:13px;color:var(--ink-light);margin-bottom:10px;}
  .member-detail-building-lbl{font-family:'DM Mono',monospace;font-size:7px;letter-spacing:0.15em;text-transform:uppercase;color:var(--ink-light);margin-bottom:4px;}
  .member-detail-building{font-family:'Cormorant Garamond',serif;font-size:15px;font-style:italic;color:var(--ink-mid);line-height:1.4;}
  .profile-identity{display:flex;align-items:flex-start;gap:24px;padding:28px;border-bottom:1px solid var(--rule);}
  .profile-av{width:64px;height:64px;border-radius:50%;background:var(--amber);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;color:var(--ink);flex-shrink:0;}
  .profile-nm{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:600;color:var(--ink);margin-bottom:3px;}
  .profile-disc{font-size:13px;color:var(--ink-light);margin-bottom:10px;}
  .profile-bld-lbl{font-family:'DM Mono',monospace;font-size:7px;letter-spacing:0.15em;text-transform:uppercase;color:var(--ink-light);margin-bottom:4px;}
  .profile-bld{font-family:'Cormorant Garamond',serif;font-size:15px;font-style:italic;color:var(--ink-mid);line-height:1.4;}
  .tab-bar{display:flex;border-bottom:1px solid var(--rule);padding:0 20px;}
  .tab-item{font-family:'DM Mono',monospace;font-size:8px;letter-spacing:0.14em;text-transform:uppercase;color:var(--ink-light);padding:12px 0;margin-right:24px;cursor:pointer;border-bottom:2px solid transparent;transition:all 0.18s;background:none;border-top:none;border-left:none;border-right:none;font-weight:500;}
  .tab-item.active{color:var(--ink);border-bottom-color:var(--amber);}
  .empty-state{padding:40px 20px;text-align:center;}
  .empty-state-text{font-family:'Cormorant Garamond',serif;font-size:16px;font-style:italic;color:var(--ink-light);}
  .loading-wrap{display:flex;align-items:center;justify-content:center;padding:60px;}
  .loading-dot{width:6px;height:6px;border-radius:50%;background:var(--amber);margin:0 3px;animation:ldot 1.2s ease-in-out infinite;}
  .loading-dot:nth-child(2){animation-delay:0.2s}
  .loading-dot:nth-child(3){animation-delay:0.4s}
  @keyframes ldot{0%,100%{opacity:0.2;transform:scale(0.7)}50%{opacity:1;transform:scale(1.1)}}
  .agent-panel{position:fixed;top:0;right:0;bottom:0;width:var(--agent-w);background:var(--ink);z-index:200;display:flex;flex-direction:column;transform:translateX(100%);transition:transform 0.32s cubic-bezier(0.4,0,0.2,1);border-left:1px solid rgba(245,240,232,0.07);}
  .agent-panel.open{transform:translateX(0);}
  .agent-hd{padding:20px 20px 16px;border-bottom:1px solid rgba(245,240,232,0.08);flex-shrink:0;}
  .agent-hd-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px;}
  .agent-eyebrow{font-family:'DM Mono',monospace;font-size:7px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(245,240,232,0.22);margin-bottom:4px;}
  .agent-name-display{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:500;color:var(--paper);}
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
  .ai-msg-wrap{display:flex;flex-direction:column;gap:3px;}
  .ai-msg-from{font-family:'DM Mono',monospace;font-size:7px;letter-spacing:0.12em;text-transform:uppercase;font-weight:500;}
  .ai-msg-from.agent{color:var(--amber);}
  .ai-msg-from.user{color:rgba(245,240,232,0.28);text-align:right;}
  .ai-msg-bubble{padding:10px 12px;border-radius:1px;font-family:'Cormorant Garamond',serif;font-size:14px;line-height:1.6;}
  .ai-msg-bubble.agent{background:rgba(245,240,232,0.055);border:1px solid rgba(245,240,232,0.07);border-left:2px solid rgba(200,129,58,0.38);color:rgba(245,240,232,0.82);white-space:pre-wrap;}
  .ai-msg-bubble.user{background:rgba(200,129,58,0.1);border:1px solid rgba(200,129,58,0.2);color:rgba(245,240,232,0.7);align-self:flex-end;max-width:88%;}
  .typing-wrap{display:flex;align-items:center;gap:4px;padding:10px 12px;background:rgba(245,240,232,0.04);border:1px solid rgba(245,240,232,0.06);border-left:2px solid rgba(200,129,58,0.28);width:fit-content;}
  .t-dot{width:4px;height:4px;background:var(--amber);border-radius:50%;animation:tdot 1.2s ease-in-out infinite;}
  .t-dot:nth-child(2){animation-delay:0.2s}
  .t-dot:nth-child(3){animation-delay:0.4s}
  @keyframes tdot{0%,100%{opacity:0.18;transform:scale(0.75)}50%{opacity:1;transform:scale(1.1)}}
  .agent-input-area{padding:14px 20px 18px;border-top:1px solid rgba(245,240,232,0.08);flex-shrink:0;}
  .input-wrap{display:flex;align-items:flex-end;gap:8px;border:1px solid rgba(245,240,232,0.11);background:rgba(245,240,232,0.04);padding:8px 12px;transition:border-color 0.2s;}
  .input-wrap:focus-within{border-color:rgba(200,129,58,0.32);}
  .agent-textarea{flex:1;background:transparent;border:none;outline:none;font-family:'Cormorant Garamond',serif;font-size:14px;color:rgba(245,240,232,0.75);resize:none;line-height:1.5;min-height:20px;max-height:90px;overflow-y:auto;}
  .agent-textarea::placeholder{color:rgba(245,240,232,0.18);}
  .send-btn{width:26px;height:26px;background:var(--amber);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:opacity 0.18s;}
  .send-btn:hover{opacity:0.85;}
  .send-btn:disabled{opacity:0.28;cursor:not-allowed;}
  .input-footer{font-family:'DM Mono',monospace;font-size:7px;letter-spacing:0.08em;color:rgba(245,240,232,0.13);text-align:center;margin-top:8px;}
`

const icons = {
  home: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 6L8 2L14 6V14H10V10H6V14H2V6Z" stroke="currentColor" strokeWidth="1.2" fill="none"/></svg>,
  deliverables: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="14" rx="1" stroke="currentColor" strokeWidth="1.2"/><line x1="5" y1="6" x2="11" y2="6" stroke="currentColor" strokeWidth="1.2"/><line x1="5" y1="9" x2="11" y2="9" stroke="currentColor" strokeWidth="1.2"/><line x1="5" y1="12" x2="8" y2="12" stroke="currentColor" strokeWidth="1.2"/></svg>,
  opportunities: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M8 5V8L10 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  messages: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 3H14V11H9L6 14V11H2V3Z" stroke="currentColor" strokeWidth="1.2" fill="none"/></svg>,
  profile: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/><path d="M2 14C2 11.2 4.7 9 8 9C11.3 9 14 11.2 14 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  members: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="11" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 14C1 11.5 2.8 10 5 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M15 14C15 11.5 13.2 10 11 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M5 14C5 11.5 6.5 10 8 10C9.5 10 11 11.5 11 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  agent: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3" stroke="#C8813A" strokeWidth="1.2"/><path d="M8 1V3M8 13V15M1 8H3M13 8H15" stroke="#C8813A" strokeWidth="1.2" strokeLinecap="round"/><path d="M3.5 3.5L5 5M11 11L12.5 12.5M3.5 12.5L5 11M11 5L12.5 3.5" stroke="#C8813A" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/></svg>,
  send: <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M1 11L11 1M11 1H4M11 1V8" stroke="#1A1612" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  back: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  bell: <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M7 1C7 1 3 3 3 7V10L1.5 11.5H12.5L11 10V7C11 3 7 1 7 1Z" stroke="#7A6E62" strokeWidth="1" fill="none"/><path d="M5.5 11.5C5.5 12.3 6.2 13 7 13C7.8 13 8.5 12.3 8.5 11.5" stroke="#7A6E62" strokeWidth="1"/></svg>,
}

function Loading() {
  return <div className="loading-wrap"><div className="loading-dot"/><div className="loading-dot"/><div className="loading-dot"/></div>
}

async function sendEmailNotification({ to, subject, html }) {
  try {
    await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, html }),
    })
  } catch (e) {
    console.error('Email notification failed:', e)
  }
}

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)

  const handleSubmit = async () => {
    if (!email || !password) return
    setLoading(true)
    setError('')
    try {
      let result
      if (isSignUp) {
        result = await supabase.auth.signUp({ email, password })
      } else {
        result = await supabase.auth.signInWithPassword({ email, password })
      }
      if (result.error) {
        setError(result.error.message)
      } else if (isSignUp && !result.data.session) {
        setError('Check your email to confirm your account before logging in.')
      } else {
        onLogin(result.data.user)
      }
    } catch {
      setError('Something went wrong. Try again.')
    }
    setLoading(false)
  }

  return (
    <>
      <style>{css}</style>
      <div className="login-root">
        <div className="login-box">
          <div className="login-agency">Charlie Mulan</div>
          <div className="login-title">Charlie's <em>Circle</em></div>
          <div className="login-season">Season 1 · Creators of New Earth</div>
          <div className="login-form">
            {error && <div className="login-error">{error}</div>}
            <div>
              <div className="login-field-label">Email</div>
              <input className="login-input" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()}/>
            </div>
            <div>
              <div className="login-field-label">Password</div>
              <input className="login-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()}/>
            </div>
            <button className="login-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? 'One moment...' : isSignUp ? 'Create Account' : 'Enter the Circle'}
            </button>
            <div className="login-hint" onClick={() => { setIsSignUp(!isSignUp); setError('') }}>
              {isSignUp ? 'Already have an account? Sign in' : 'New member? Create your account'}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function NotificationBell({ notifications, onMarkRead }) {
  const [open, setOpen] = useState(false)
  const unread = notifications.filter(n => !n.read).length
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="notif-wrap" ref={ref}>
      <button className="notif-btn" onClick={() => { setOpen(o => !o); if (!open) onMarkRead() }}>
        {unread > 0 ? <div className="notif-count">{unread}</div> : <div className="notif-dot"/>}
        {icons.bell}
      </button>
      {open && (
        <div className="notif-dropdown">
          <div className="notif-header">Notifications</div>
          {notifications.length === 0 ? (
            <div className="notif-empty">No notifications yet.</div>
          ) : notifications.slice(0,8).map((n,i) => (
            <div key={i} className={`notif-item${n.read ? '' : ' unread'}`}>
              <div className="notif-item-name">{n.sender_name}</div>
              <div className="notif-item-text">{n.body?.substring(0,80)}{n.body?.length > 80 ? '...' : ''}</div>
              <div className="notif-item-time">{n.time_display}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function MessageThread({ memberId, memberName, memberEmail, isAdmin, currentUserName, currentUserInitial }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const endRef = useRef(null)

  useEffect(() => {
    loadMessages()
    const channel = supabase
      .channel(`messages-${memberId}-${isAdmin ? 'admin' : 'member'}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `member_id=eq.${memberId}` }, payload => {
        setMessages(prev => [...prev, payload.new])
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [memberId])

  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function loadMessages() {
    setLoading(true)
    const { data } = await supabase.from('messages').select('*').eq('member_id', memberId).order('created_at', { ascending: true })
    setMessages(data || [])
    setLoading(false)
  }

  async function sendMessage() {
    if (!input.trim() || sending) return
    setSending(true)
    const now = new Date()
    const timeDisplay = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const body = input.trim()

    const { error } = await supabase.from('messages').insert([{
      member_id: memberId,
      sender_name: currentUserName,
      sender_initial: currentUserInitial,
      body,
      time_display: timeDisplay,
      is_reply: isAdmin,
    }])

    if (!error) {
      setInput('')
      if (isAdmin) {
        await sendEmailNotification({
          to: memberEmail,
          subject: 'New message from Charlie Mulan',
          html: `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:40px 20px;color:#1A1612;"><div style="font-family:monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#C8813A;margin-bottom:8px;">Charlie Mulan · Charlie's Circle</div><div style="font-size:24px;font-weight:500;margin-bottom:24px;">You have a new message</div><div style="background:#F5F0E8;border-left:3px solid #C8813A;padding:20px;margin-bottom:24px;font-size:16px;line-height:1.6;">${body}</div><a href="https://charlies-circle-app.vercel.app/portal" style="background:#C8813A;color:#1A1612;padding:12px 24px;text-decoration:none;font-family:monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:600;">View in Portal</a><div style="margin-top:32px;font-size:11px;color:#7A6E62;">Charlie's Circle · Season 1 · Creators of New Earth</div></div>`
        })
      } else {
        await sendEmailNotification({
          to: ADMIN_EMAIL,
          subject: `New message from ${currentUserName}`,
          html: `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:40px 20px;color:#1A1612;"><div style="font-family:monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#C8813A;margin-bottom:8px;">Charlie's Circle · Member Message</div><div style="font-size:24px;font-weight:500;margin-bottom:8px;">Message from ${currentUserName}</div><div style="font-size:13px;color:#7A6E62;margin-bottom:24px;">${memberEmail}</div><div style="background:#F5F0E8;border-left:3px solid #C8813A;padding:20px;margin-bottom:24px;font-size:16px;line-height:1.6;">${body}</div><a href="https://charlies-circle-app.vercel.app/portal" style="background:#C8813A;color:#1A1612;padding:12px 24px;text-decoration:none;font-family:monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:600;">View in Portal</a></div>`
        })
      }
    }
    setSending(false)
  }

  const isMine = (msg) => isAdmin ? msg.is_reply : !msg.is_reply

  return (
    <div className="msg-thread">
      <div className="msg-thread-header">
        <div className="msg-thread-av">{memberName?.charAt(0) || 'M'}</div>
        <div>
          <div className="msg-thread-name">{memberName}</div>
          <div className="msg-thread-role">{isAdmin ? memberEmail : 'Charlie Mulan · Agency'}</div>
        </div>
      </div>
      <div className="msg-list">
        {loading ? <Loading/> : messages.length === 0 ? (
          <div className="empty-state"><div className="empty-state-text">No messages yet. Start the conversation.</div></div>
        ) : messages.map((m,i) => (
          <div key={i} className={`msg-bubble-wrap ${isMine(m) ? 'mine' : 'theirs'}`}>
            <div className="msg-bubble-sender">{m.sender_name}</div>
            <div className="msg-bubble-text">{m.body}</div>
            <div className="msg-bubble-time">{m.time_display}</div>
          </div>
        ))}
        <div ref={endRef}/>
      </div>
      <div className="msg-input-area">
        <textarea className="msg-textarea" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage()} }} placeholder="Write a message..." rows={1}/>
        <button className="msg-send-btn" disabled={sending||!input.trim()} onClick={sendMessage}>{sending ? 'Sending...' : 'Send'}</button>
      </div>
    </div>
  )
}

function AgentPanel({ open, onClose, member }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [started, setStarted] = useState(false)
  const msgsEndRef = useRef(null)

  useEffect(() => {
    if (msgsEndRef.current) msgsEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const memberContext = member ? `\nThe member: Name: ${member.name}. Discipline: ${member.discipline || 'Creative'}. Building: ${member.building_full || member.building_short || 'Their creative work'}. Industry: ${member.industry || ''}. Location: ${member.location || ''}. Member since: ${member.member_since || ''}. Tier: ${member.tier || 'Member'}. Sessions: ${member.sessions_completed || 0}. Upcoming session: ${member.session_title || ''} on ${member.session_date || ''}.` : ''

  const sendMessage = async (text) => {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')
    if (!started) setStarted(true)
    const userMsg = { role: 'user', content: msg }
    const newHistory = [...messages, userMsg]
    setMessages(newHistory)
    setLoading(true)
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1000, system: SYSTEM_PROMPT + memberContext, messages: newHistory }),
      })
      const data = await res.json()
      const reply = data.content?.find(b => b.type === 'text')?.text || 'Something went quiet. Try again.'
      setMessages([...newHistory, { role: 'assistant', content: reply }])
    } catch {
      setMessages([...newHistory, { role: 'assistant', content: 'There was an issue reaching Circle Intelligence. Try again.' }])
    }
    setLoading(false)
  }

  return (
    <aside className={`agent-panel${open ? ' open' : ''}`}>
      <div className="agent-hd">
        <div className="agent-hd-top">
          <div>
            <div className="agent-eyebrow">Charlie Mulan</div>
            <div className="agent-name-display">Circle <em>Intelligence</em></div>
            <div className="agent-status-row"><div className="agent-status-dot"/><div className="agent-status-txt">Active · Season 1</div></div>
          </div>
          <button className="agent-close-btn" onClick={onClose}>✕</button>
        </div>
      </div>
      {!started && (
        <div className="agent-chips-wrap">
          <div className="chips-lbl">Ask about your work</div>
          <div className="chips-grid">{PROMPT_CHIPS.map((c,i) => <button key={i} className="chip" onClick={() => sendMessage(c.prompt)}>{c.label}</button>)}</div>
        </div>
      )}
      <div className="agent-msgs">
        {!started && <div className="agent-empty"><div className="empty-glyph">◎</div><div className="empty-txt">Your creative intelligence is ready. Ask anything about your work, your opportunities, or your next move.</div></div>}
        {messages.map((m,i) => (
          <div className="ai-msg-wrap" key={i}>
            <div className={`ai-msg-from ${m.role === 'assistant' ? 'agent' : 'user'}`}>{m.role === 'assistant' ? 'Circle Intelligence' : (member?.name?.split(' ')[0] || 'You')}</div>
            <div className={`ai-msg-bubble ${m.role === 'assistant' ? 'agent' : 'user'}`}>{m.content}</div>
          </div>
        ))}
        {loading && <div className="ai-msg-wrap"><div className="ai-msg-from agent">Circle Intelligence</div><div className="typing-wrap"><div className="t-dot"/><div className="t-dot"/><div className="t-dot"/></div></div>}
        <div ref={msgsEndRef}/>
      </div>
      <div className="agent-input-area">
        <div className="input-wrap">
          <textarea className="agent-textarea" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage()} }} placeholder="Ask about your work..." rows={1}/>
          <button className="send-btn" disabled={loading||!input.trim()} onClick={() => sendMessage()}>{icons.send}</button>
        </div>
        <div className="input-footer">Powered by Circle Intelligence · Charlie Mulan Agency</div>
      </div>
    </aside>
  )
}

function AdminMemberDetail({ member, onBack }) {
  const [deliverables, setDeliverables] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('messages')

  useEffect(() => {
    supabase.from('deliverables').select('*').eq('member_id', member.id).order('created_at', { ascending: false })
      .then(({ data }) => { setDeliverables(data || []); setLoading(false) })
  }, [member.id])

  return (
    <div>
      <button className="back-btn" onClick={onBack}>{icons.back} All Members</button>
      <div className="member-detail-header">
        <div className="member-detail-av">{member.name?.charAt(0) || 'M'}</div>
        <div>
          <div className="member-detail-name">{member.name}</div>
          <div className="member-detail-disc">{member.discipline}</div>
          <div className="member-detail-building-lbl">Currently Building</div>
          <div className="member-detail-building">{member.building_full || member.building_short}</div>
        </div>
      </div>
      <div className="panel">
        <div className="tab-bar">
          {['messages','profile','deliverables','session'].map(t => (
            <button key={t} className={`tab-item${tab===t?' active':''}`} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
          ))}
        </div>
        {tab === 'messages' && (
          <MessageThread memberId={member.id} memberName={member.name} memberEmail={member.email} isAdmin={true} currentUserName="Charlie Mulan" currentUserInitial="CM"/>
        )}
        {tab === 'profile' && (
          <div className="panel-bd">
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:28,marginBottom:24}}>
              {[
                {lbl:'Member Since',val:member.member_since||'—'},{lbl:'Tier',val:member.tier||'—'},
                {lbl:'Location',val:member.location||'—'},{lbl:'Industry',val:member.industry||'—'},
                {lbl:'Sessions',val:member.sessions_completed??'—'},{lbl:'Retainer',val:member.retainer||'—'},
              ].map((s,i) => <div key={i}><div className="stat-lbl" style={{marginBottom:6}}>{s.lbl}</div><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontWeight:500,color:'var(--ink)'}}>{s.val}</div></div>)}
            </div>
            <div className="stat-lbl" style={{marginBottom:6}}>Email</div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:'var(--ink-mid)'}}>{member.email}</div>
          </div>
        )}
        {tab === 'deliverables' && (
          <div className="panel-bd">
            {loading ? <Loading/> : deliverables.length === 0 ? <div className="empty-state"><div className="empty-state-text">No deliverables yet.</div></div>
            : deliverables.map((d,i) => (
              <div className="del-item" key={i}>
                <div className={`del-icon${d.is_new?' new':''}`}>{d.file_type||'DOC'}</div>
                <div className="del-info"><div className="del-name">{d.title}</div><div className="del-meta">{d.category} · {d.display_date}</div></div>
                {d.file_url && <a className="del-link" href={d.file_url} target="_blank" rel="noreferrer">Open</a>}
                {d.is_new && <div className="del-new">New</div>}
              </div>
            ))}
          </div>
        )}
        {tab === 'session' && (
          <div className="panel-bd">
            {member.session_title ? <>
              <div className="stat-lbl" style={{marginBottom:6}}>Upcoming Session</div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:500,color:'var(--ink)',marginBottom:8}}>{member.session_title}</div>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'var(--amber)',marginBottom:16}}>{member.session_date}</div>
              {member.session_prep && <><div className="stat-lbl" style={{marginBottom:6}}>Prep Note</div><div style={{fontSize:13,color:'var(--ink-light)',lineHeight:1.7}}>{member.session_prep}</div></>}
            </> : <div className="empty-state"><div className="empty-state-text">No session scheduled.</div></div>}
          </div>
        )}
      </div>
    </div>
  )
}

function AdminView({ user, onLogout }) {
  const [page, setPage] = useState('members')
  const [agentOpen, setAgentOpen] = useState(false)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMember, setSelectedMember] = useState(null)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    supabase.from('members').select('*').order('created_at', {ascending:true}).then(({data}) => { setMembers(data||[]); setLoading(false) })
    supabase.from('messages').select('*').eq('is_reply',false).order('created_at',{ascending:false}).limit(20)
      .then(({data}) => setNotifications((data||[]).map(n => ({...n,read:true}))))
    const ch = supabase.channel('admin-notifs')
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'messages',filter:'is_reply=eq.false'},payload => {
        setNotifications(prev => [{...payload.new,read:false},...prev])
      }).subscribe()
    return () => supabase.removeChannel(ch)
  }, [])

  return (
    <>
      <style>{css}</style>
      <div className="portal-root">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-agency">Charlie Mulan</div>
            <div className="sidebar-circle">Charlie's Circle</div>
            <div className="sidebar-season">Admin · Season 1</div>
          </div>
          <div className="sidebar-member">
            <div className="member-av">C</div>
            <div className="member-nm">Chandra</div>
            <div className="member-bld">Charlie Mulan Creative Intelligence Agency</div>
            <div className="member-badge">Admin</div>
          </div>
          <nav className="sidebar-nav">
            <div className="nav-section">Management</div>
            {[{id:'members',label:'All Members',icon:icons.members},{id:'deliverables',label:'Deliverables',icon:icons.deliverables},{id:'opportunities',label:'Opportunities',icon:icons.opportunities}].map(n => (
              <button key={n.id} className={`nav-item${page===n.id&&!selectedMember?' active':''}`} onClick={() => {setPage(n.id);setSelectedMember(null)}}>
                <span style={{opacity:page===n.id?1:0.45,color:page===n.id?'#F5F0E8':'rgba(245,240,232,0.5)',flexShrink:0}}>{n.icon}</span>
                <span className="nav-lbl">{n.label}</span>
              </button>
            ))}
            <div className="nav-section" style={{marginTop:8}}>Intelligence</div>
            <button className={`nav-item agent-trigger${agentOpen?' agent-on':''}`} onClick={() => setAgentOpen(o=>!o)}>
              <span style={{flexShrink:0}}>{icons.agent}</span><span className="nav-lbl">Circle Intelligence</span><div className="pulse-dot"/>
            </button>
          </nav>
          <div className="sidebar-bottom">
            <div className="next-lbl">Logged in as</div>
            <div className="next-date" style={{fontSize:11,wordBreak:'break-all'}}>{user?.email}</div>
            <button className="logout-btn" onClick={onLogout}>Sign Out</button>
          </div>
        </aside>
        <main className={`main-content${agentOpen?' agent-open':''}`}>
          <div className="topbar">
            <div className="topbar-title">{selectedMember ? selectedMember.name : {members:'All Members',deliverables:'Deliverables',opportunities:'Opportunities'}[page]}</div>
            <div className="topbar-right">
              <div className="admin-badge">Admin</div>
              <div className="topbar-date">May 12, 2026</div>
              <NotificationBell notifications={notifications} onMarkRead={() => setNotifications(prev => prev.map(n => ({...n,read:true})))}/>
            </div>
          </div>
          <div className="page-content">
            {page==='members' && !selectedMember && (
              <div>
                <div className="welcome"><div className="eyebrow">Season 1</div><div className="page-heading sm">All <em>Members</em></div><div className="page-sub">{members.length} member{members.length!==1?'s':''} in Season 1.</div></div>
                {loading ? <Loading/> : members.map(m => (
                  <div className="mem-card" key={m.id} onClick={() => setSelectedMember(m)}>
                    <div className="mem-av">{m.name?.charAt(0)||'M'}</div>
                    <div className="mem-info">
                      <div className="mem-name">{m.name}</div>
                      <div className="mem-disc">{m.discipline}</div>
                      <div className="mem-tags">
                        {m.tier && <div className="mem-tag amber">{m.tier}</div>}
                        {m.industry && <div className="mem-tag">{m.industry}</div>}
                        {m.location && <div className="mem-tag">{m.location}</div>}
                      </div>
                    </div>
                    <div className="mem-arrow">›</div>
                  </div>
                ))}
              </div>
            )}
            {page==='members' && selectedMember && <AdminMemberDetail member={selectedMember} onBack={() => setSelectedMember(null)}/>}
            {page==='deliverables' && <AdminDeliverables/>}
            {page==='opportunities' && <AdminOpportunities/>}
          </div>
        </main>
        <AgentPanel open={agentOpen} onClose={() => setAgentOpen(false)} member={null}/>
      </div>
    </>
  )
}

function AdminDeliverables() {
  const [items,setItems] = useState([])
  const [loading,setLoading] = useState(true)
  useEffect(() => { supabase.from('deliverables').select('*,members(name)').order('created_at',{ascending:false}).then(({data}) => {setItems(data||[]);setLoading(false)}) },[])
  return (
    <div>
      <div className="welcome"><div className="eyebrow">All Work</div><div className="page-heading sm">All <em>Deliverables</em></div></div>
      <div className="panel"><div className="panel-bd">
        {loading ? <Loading/> : items.length===0 ? <div className="empty-state"><div className="empty-state-text">No deliverables yet.</div></div>
        : items.map((d,i) => (
          <div className="del-item" key={i}>
            <div className={`del-icon${d.is_new?' new':''}`}>{d.file_type||'DOC'}</div>
            <div className="del-info"><div className="del-name">{d.title}</div><div className="del-meta">{d.members?.name} · {d.category} · {d.display_date}</div></div>
            {d.file_url && <a className="del-link" href={d.file_url} target="_blank" rel="noreferrer">Open</a>}
            {d.is_new && <div className="del-new">New</div>}
          </div>
        ))}
      </div></div>
    </div>
  )
}

function AdminOpportunities() {
  const [opps,setOpps] = useState([])
  const [loading,setLoading] = useState(true)
  useEffect(() => { supabase.from('opportunities').select('*,members(name)').order('created_at',{ascending:false}).then(({data}) => {setOpps(data||[]);setLoading(false)}) },[])
  return (
    <div>
      <div className="welcome"><div className="eyebrow">Curated Resources</div><div className="page-heading sm">All <em>Opportunities</em></div></div>
      <div className="panel"><div className="panel-bd">
        {loading ? <Loading/> : opps.length===0 ? <div className="empty-state"><div className="empty-state-text">No opportunities yet.</div></div>
        : opps.map((o,i) => (
          <div className="opp-item" key={i}>
            <div className="opp-tag">{o.tag}</div>
            <div className="opp-title">{o.title}</div>
            {o.detail && <div className="opp-detail">{o.detail}</div>}
            {o.members?.name && <div className="del-meta" style={{marginTop:4}}>For: {o.members.name}</div>}
          </div>
        ))}
      </div></div>
    </div>
  )
}

function MemberView({ user, onLogout }) {
  const [page, setPage] = useState('home')
  const [agentOpen, setAgentOpen] = useState(false)
  const [member, setMember] = useState(null)
  const [deliverables, setDeliverables] = useState([])
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    async function load() {
      const { data: m } = await supabase.from('members').select('*').eq('email', user.email).single()
      if (m) {
        setMember(m)
        const [{ data: d }, { data: o }, { data: msgs }] = await Promise.all([
          supabase.from('deliverables').select('*').eq('member_id', m.id).order('created_at', {ascending:false}),
          supabase.from('opportunities').select('*').eq('member_id', m.id).order('created_at', {ascending:false}),
          supabase.from('messages').select('*').eq('member_id', m.id).eq('is_reply', true).order('created_at', {ascending:false}).limit(20),
        ])
        setDeliverables(d||[])
        setOpportunities(o||[])
        setNotifications((msgs||[]).map(n => ({...n,read:true})))

        const ch = supabase.channel(`member-notifs-${m.id}`)
          .on('postgres_changes',{event:'INSERT',schema:'public',table:'messages',filter:`member_id=eq.${m.id}`}, payload => {
            if (payload.new.is_reply) setNotifications(prev => [{...payload.new,read:false},...prev])
          }).subscribe()
        return () => supabase.removeChannel(ch)
      }
    }
    load().finally(() => setLoading(false))
  }, [user])

  if (loading) return <><style>{css}</style><div style={{minHeight:'100vh',background:'var(--paper)',display:'flex',alignItems:'center',justifyContent:'center'}}><Loading/></div></>

  const initial = member?.name?.charAt(0) || user.email?.charAt(0)?.toUpperCase() || 'M'
  const firstName = member?.name?.split(' ')[0] || 'Member'
  const newDeliverables = deliverables.filter(d => d.is_new).length

  const navItems = [
    {id:'home',label:'Home',icon:icons.home},
    {id:'deliverables',label:'My Deliverables',icon:icons.deliverables,badge:newDeliverables>0?String(newDeliverables):null},
    {id:'opportunities',label:'Opportunities',icon:icons.opportunities,badge:opportunities.length>0?String(opportunities.length):null},
    {id:'messages',label:'Messages',icon:icons.messages},
    {id:'profile',label:'My Profile',icon:icons.profile},
  ]

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
            <div className="member-av">{initial}</div>
            <div className="member-nm">{member?.name||user.email}</div>
            <div className="member-bld">{member?.building_short||''}</div>
            <div className="member-badge">{member?.tier||'Member'}</div>
          </div>
          <nav className="sidebar-nav">
            <div className="nav-section">My Portal</div>
            {navItems.map(n => (
              <button key={n.id} className={`nav-item${page===n.id?' active':''}`} onClick={() => setPage(n.id)}>
                <span style={{opacity:page===n.id?1:0.45,color:page===n.id?'#F5F0E8':'rgba(245,240,232,0.5)',flexShrink:0}}>{n.icon}</span>
                <span className="nav-lbl">{n.label}</span>
                {n.badge && <span className="nav-badge-pill">{n.badge}</span>}
              </button>
            ))}
            <div className="nav-section" style={{marginTop:8}}>Intelligence</div>
            <button className={`nav-item agent-trigger${agentOpen?' agent-on':''}`} onClick={() => setAgentOpen(o=>!o)}>
              <span style={{flexShrink:0}}>{icons.agent}</span><span className="nav-lbl">Circle Intelligence</span><div className="pulse-dot"/>
            </button>
          </nav>
          <div className="sidebar-bottom">
            <div className="next-lbl">Next Session</div>
            <div className="next-date">{member?.session_short||member?.session_date||'TBD'}</div>
            <button className="logout-btn" onClick={onLogout}>Sign Out</button>
          </div>
        </aside>
        <main className={`main-content${agentOpen?' agent-open':''}`}>
          <div className="topbar">
            <div className="topbar-title">{{home:'Member Home',deliverables:'My Deliverables',opportunities:'Opportunities',messages:'Messages',profile:'My Profile'}[page]}</div>
            <div className="topbar-right">
              <div className="topbar-date">May 12, 2026</div>
              <NotificationBell notifications={notifications} onMarkRead={() => setNotifications(prev => prev.map(n => ({...n,read:true})))}/>
            </div>
          </div>
          <div className="page-content">
            {page==='home' && (
              <div>
                <div className="welcome">
                  <div className="eyebrow">Good morning</div>
                  <div className="page-heading">Welcome back,<br/><em>{firstName}.</em></div>
                  <div className="page-sub">Your creative work is in motion. Here is where it lives, grows, and gets the support it deserves.</div>
                </div>
                <div className="stats-row">
                  {[
                    {lbl:'Member Since',val:member?.member_since||'—',sub:member?.tier||'Member',sm:true},
                    {lbl:'Sessions Completed',val:String(member?.sessions_completed??0),sub:member?.session_short||''},
                    {lbl:'Deliverables',val:String(deliverables.length),sub:newDeliverables>0?`${newDeliverables} new`:'All up to date'},
                    {lbl:'Opportunities',val:String(opportunities.length),sub:'Curated for you'},
                  ].map((s,i) => <div className="stat-card" key={i}><div className="stat-lbl">{s.lbl}</div><div className="stat-val" style={s.sm?{fontSize:18,marginTop:4}:{}}>{s.val}</div><div className="stat-sub">{s.sub}</div></div>)}
                </div>
                <div className="two-col">
                  <div>
                    <div className="panel">
                      <div className="panel-hd"><span className="panel-ttl">Recent Deliverables</span><button className="panel-act" onClick={() => setPage('deliverables')}>View All</button></div>
                      <div className="panel-bd">
                        {deliverables.length===0 ? <div className="empty-state"><div className="empty-state-text">No deliverables yet.</div></div>
                        : deliverables.slice(0,3).map((d,i) => (
                          <div className="del-item" key={i}>
                            <div className={`del-icon${d.is_new?' new':''}`}>{d.file_type||'DOC'}</div>
                            <div className="del-info"><div className="del-name">{d.title}</div><div className="del-meta">{d.display_date}</div></div>
                            {d.is_new && <div className="del-new">New</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    {member?.session_title && (
                      <div className="session-block">
                        <div className="session-lbl">Next Strategy Session</div>
                        <div className="session-title">{member.session_title}</div>
                        <div className="session-dt">{member.session_date}</div>
                        <div><button className="session-btn" onClick={() => setAgentOpen(true)}>Prepare for Session →</button></div>
                        {member.session_prep && <div className="session-prep">{member.session_prep}</div>}
                      </div>
                    )}
                    <div className="panel">
                      <div className="panel-hd"><span className="panel-ttl">Messages</span><button className="panel-act" onClick={() => setPage('messages')}>Open</button></div>
                      {member && <MessageThread memberId={member.id} memberName="Charlie Mulan · Agency" memberEmail={ADMIN_EMAIL} isAdmin={false} currentUserName={member.name} currentUserInitial={initial}/>}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {page==='deliverables' && (
              <div>
                <div className="welcome"><div className="eyebrow">Your Archive</div><div className="page-heading sm">My <em>Deliverables</em></div><div className="page-sub">Everything produced for your work, in one place.</div></div>
                <div className="panel"><div className="panel-bd">
                  {deliverables.length===0 ? <div className="empty-state"><div className="empty-state-text">No deliverables yet.</div></div>
                  : deliverables.map((d,i) => (
                    <div className="del-item" key={i}>
                      <div className={`del-icon${d.is_new?' new':''}`}>{d.file_type||'DOC'}</div>
                      <div className="del-info"><div className="del-name">{d.title}</div><div className="del-meta">{d.category} · {d.display_date}</div></div>
                      {d.file_url && <a className="del-link" href={d.file_url} target="_blank" rel="noreferrer">Open</a>}
                      {d.is_new && <div className="del-new">New</div>}
                    </div>
                  ))}
                </div></div>
              </div>
            )}
            {page==='opportunities' && (
              <div>
                <div className="welcome"><div className="eyebrow">Curated for You</div><div className="page-heading sm"><em>Opportunities</em></div><div className="page-sub">Researched and aligned to your industry and mission.</div></div>
                <div className="panel"><div className="panel-bd">
                  {opportunities.length===0 ? <div className="empty-state"><div className="empty-state-text">No opportunities yet. Check back soon.</div></div>
                  : opportunities.map((o,i) => <div className="opp-item" key={i}><div className="opp-tag">{o.tag}</div><div className="opp-title">{o.title}</div>{o.detail && <div className="opp-detail">{o.detail}</div>}</div>)}
                </div></div>
              </div>
            )}
            {page==='messages' && member && (
              <div>
                <div className="welcome"><div className="eyebrow">Direct</div><div className="page-heading sm"><em>Messages</em></div></div>
                <div className="panel" style={{padding:0}}>
                  <MessageThread memberId={member.id} memberName="Charlie Mulan · Agency" memberEmail={ADMIN_EMAIL} isAdmin={false} currentUserName={member.name} currentUserInitial={initial}/>
                </div>
              </div>
            )}
            {page==='profile' && member && (
              <div>
                <div className="welcome"><div className="eyebrow">Your Identity</div><div className="page-heading sm">My <em>Profile</em></div></div>
                <div className="panel">
                  <div className="profile-identity">
                    <div className="profile-av">{initial}</div>
                    <div>
                      <div className="profile-nm">{member.name}</div>
                      <div className="profile-disc">{member.discipline}</div>
                      <div className="profile-bld-lbl">Currently Building</div>
                      <div className="profile-bld">{member.building_full||member.building_short}</div>
                    </div>
                  </div>
                  <div className="panel-bd">
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:28}}>
                      {[{lbl:'Member Since',val:member.member_since||'—',sub:member.tier},{lbl:'Industry',val:member.industry||'—'},{lbl:'Location',val:member.location||'—'}].map((s,i) => (
                        <div key={i}><div className="stat-lbl" style={{marginBottom:6}}>{s.lbl}</div><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontWeight:500,color:'var(--ink)'}}>{s.val}</div>{s.sub && <div style={{fontSize:11,color:'var(--ink-light)',marginTop:2}}>{s.sub}</div>}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        <AgentPanel open={agentOpen} onClose={() => setAgentOpen(false)} member={member}/>
      </div>
    </>
  )
}

export default function Portal() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setUser(session?.user||null); setLoading(false) })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { setUser(session?.user||null) })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => { await supabase.auth.signOut(); setUser(null) }

  if (loading) return <><style>{css}</style><div style={{minHeight:'100vh',background:'#1A1612',display:'flex',alignItems:'center',justifyContent:'center'}}><Loading/></div></>
  if (!user) return <LoginPage onLogin={setUser}/>
  return user.email===ADMIN_EMAIL ? <AdminView user={user} onLogout={handleLogout}/> : <MemberView user={user} onLogout={handleLogout}/>
}
