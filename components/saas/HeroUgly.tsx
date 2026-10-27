"use client";

import { useState } from "react";
import type { FormEvent } from "react";

// Put the two logo PNGs in /public (or import them from src/assets and swap these paths).
const logoLight = "/tech-engi-logo-light.png"; // dark-on-gold logo, used in client mode
const logoDark = "/tech-engi-logo-dark.png"; // light-on-navy logo, used in engineer mode

export type HeroMode = "client" | "engineer";

export interface HeroProps {
  /** Which side of the toggle shows first. */
  defaultMode?: HeroMode;
  /** Fires when the search form is submitted. Wire this to your post / leads flow. */
  onSubmit?: (payload: { mode: HeroMode; query: string }) => void;
  /** Fires when the client/engineer toggle changes. */
  onModeChange?: (mode: HeroMode) => void;
}

const css = `@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800;900&family=IBM+Plex+Mono:wght@500&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
.te-root a{color:inherit}
.te-btn{transition:transform .15s ease,box-shadow .15s ease}
.te-btn:hover{transform:translateY(-2px)}
.te-btn:active{transform:translateY(0)}
.te-btn .te-arrow{transition:transform .15s ease}
.te-btn:hover .te-arrow{transform:translateX(4px)}
.te-chip{transition:background .15s ease,border-color .15s ease,transform .15s ease}
.te-chip:hover{transform:translateY(-2px)}
.te-light .te-chip:hover{background:#FFFFFF;border-color:#050A30}
.te-dark .te-chip:hover{background:#141D5E;border-color:#F0B31E}
.te-link:hover{opacity:.75}
.te-dark :focus-visible{outline:3px solid #F0B31E;outline-offset:3px}
.te-light :focus-visible{outline:3px solid #050A30;outline-offset:3px}
.te-light input::placeholder{color:#6E6440}
.te-dark input::placeholder{color:#8F95C2}
.te-root input:focus{outline:none}
.te-light .te-field:focus-within{box-shadow:0 0 0 3px #050A30,0 18px 40px rgba(5,10,48,.18)}
.te-dark .te-field:focus-within{box-shadow:0 0 0 3px #F0B31E,0 18px 40px rgba(0,0,0,.4)}
.te-menu{display:none!important}
@media (max-width:1100px){
  .te-nav{display:none!important}
  .te-menu{display:flex!important}
  .te-root{min-height:0!important}
  .te-main{padding:20px 32px 64px!important;gap:40px!important}
}
@media (max-width:600px){
  .te-hdr{padding:14px 20px!important}
  .te-login,.te-hdr-cta{display:none!important}
  .te-logo{height:30px!important}
  .te-main{padding:12px 20px 48px!important;gap:32px!important}
  .te-seg{align-self:stretch!important}
  .te-seg button{flex:1;padding:0 10px!important}
  .te-sub{font-size:17px!important}
  .te-field{flex-wrap:wrap}
  .te-field input{flex:1 1 60%!important}
  .te-go{flex:1 1 100%;justify-content:center}
  .te-chip{flex:1 1 100%}
  .te-big{font-size:54px!important}
  .te-strength{padding:22px!important}
}
@media (prefers-reduced-motion:reduce){.te-btn,.te-chip,.te-arrow{transition:none}}`;

export default function Hero({
  defaultMode = "client",
  onSubmit,
  onModeChange,
}: HeroProps) {
  const [mode, setModeState] = useState<HeroMode>(defaultMode);
  const [query, setQuery] = useState("");

  const setMode = (next: HeroMode) => {
    setModeState(next);
    onModeChange?.(next);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.({ mode, query: query.trim() });
  };

  return (
    <>
      <style>{css}</style>
      {mode === "client" ? (
        <div
          className="te-light te-root h-screen"
          style={{
            backgroundColor: "#F0B31E",
            backgroundImage:
              "repeating-conic-gradient(from 0deg at 88% -10%, rgba(255,248,230,0.16) 0deg 4deg, transparent 4deg 12deg)",
            color: "#050A30",
            fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
            minHeight: "920px",
          }}
        >
          {/* <header
            className="te-hdr"
            style={{
              maxWidth: "1320px",
              margin: "0 auto",
              padding: "20px 32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <a
              href="#top"
              aria-label="Tech Engi home"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <img
                className="te-logo"
                src={logoLight}
                alt="Tech Engi"
                style={{ height: "38px", width: "auto", display: "block" }}
              />
            </a>
            <nav
              className="te-nav"
              aria-label="Main"
              style={{
                display: "flex",
                gap: "4px",
                fontSize: "15px",
                fontWeight: 500,
              }}
            >
              <a
                className="te-link"
                href="#platform"
                style={{ textDecoration: "none", padding: "10px 14px" }}
              >
                Platform
              </a>
              <a
                className="te-link"
                href="#how"
                style={{ textDecoration: "none", padding: "10px 14px" }}
              >
                How it works
              </a>
              <a
                className="te-link"
                href="#leads"
                style={{ textDecoration: "none", padding: "10px 14px" }}
              >
                Leads
              </a>
              <a
                className="te-link"
                href="#blog"
                style={{ textDecoration: "none", padding: "10px 14px" }}
              >
                Blog
              </a>
              <a
                className="te-link"
                href="#faq"
                style={{ textDecoration: "none", padding: "10px 14px" }}
              >
                FAQ
              </a>
            </nav>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <a
                className="te-link te-login"
                href="#login"
                style={{
                  minHeight: "44px",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 16px",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "15px",
                }}
              >
                Log in
              </a>
              <a
                className="te-btn te-hdr-cta"
                href="#start"
                style={{
                  minHeight: "46px",
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "0 20px",
                  borderRadius: "12px",
                  background: "#050A30",
                  color: "#FFF8E6",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "15px",
                  boxShadow: "0 8px 20px rgba(5,10,48,0.22)",
                }}
              >
                Get started
                <svg
                  className="te-arrow"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
              <button
                type="button"
                className="te-menu"
                aria-label="Open menu"
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "12px",
                  border: "1.5px solid rgba(5,10,48,0.3)",
                  background: "#FFF8E6",
                  color: "#050A30",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </button>
            </div>
          </header> */}
          <main
            className="te-main"
            style={{
              maxWidth: "1320px",
              margin: "0 auto",
              padding: "36px 32px 88px",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(560px, 100%), 1fr))",
              gap: "56px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "26px",
                minWidth: "0",
              }}
            >
              <div
                className="te-seg"
                role="group"
                aria-label="I am a"
                style={{
                  alignSelf: "flex-start",
                  display: "flex",
                  padding: "5px",
                  gap: "4px",
                  borderRadius: "14px",
                  background: "rgba(5,10,48,0.10)",
                  border: "1px solid rgba(5,10,48,0.18)",
                }}
              >
                <button
                  type="button"
                  aria-pressed="true"
                  style={{
                    minHeight: "44px",
                    padding: "0 22px",
                    border: "0",
                    borderRadius: "10px",
                    background: "#050A30",
                    color: "#F0B31E",
                    fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                    fontWeight: 600,
                    fontSize: "15px",
                    cursor: "default",
                    boxShadow: "0 6px 14px rgba(5,10,48,0.25)",
                  }}
                >
                  I&apos;m a client
                </button>
                <button
                  type="button"
                  onClick={() => setMode("engineer")}
                  aria-pressed="false"
                  style={{
                    minHeight: "44px",
                    padding: "0 22px",
                    border: "0",
                    borderRadius: "10px",
                    background: "transparent",
                    color: "#050A30",
                    fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                    fontWeight: 500,
                    fontSize: "15px",
                    cursor: "pointer",
                  }}
                >
                  I&apos;m an engineer
                </button>
              </div>
              <h1
                style={{
                  margin: "0",
                  fontFamily: "'Archivo', system-ui, sans-serif",
                  fontWeight: 900,
                  fontSize: "clamp(44px, 8vw, 92px)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.045em",
                }}
              >
                Get it built.
                <br />
                Get it fixed.
              </h1>
              <p
                className="te-sub"
                style={{
                  margin: "0",
                  fontSize: "20px",
                  lineHeight: 1.5,
                  maxWidth: "540px",
                  color: "#23284F",
                }}
              >
                Describe a bug, a half-built project or an idea in your own
                words. Nashedi AI matches you with a verified engineer who has
                done that work before.
              </p>
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  maxWidth: "640px",
                }}
              >
                <div
                  className="te-field"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "#FFF8E6",
                    borderRadius: "18px",
                    padding: "8px",
                    boxShadow: "0 18px 40px rgba(5,10,48,0.16)",
                  }}
                >
                  <button
                    type="button"
                    aria-label="Attach a file or screenshot"
                    style={{
                      flex: "0 0 48px",
                      height: "48px",
                      border: "0",
                      borderRadius: "12px",
                      background: "#F8E3AE",
                      color: "#050A30",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M21 12.5 12.6 21a5.5 5.5 0 0 1-7.8-7.8l8.5-8.5a3.7 3.7 0 0 1 5.2 5.2l-8.5 8.5a1.8 1.8 0 0 1-2.6-2.6l7.8-7.8" />
                    </svg>
                  </button>
                  <label
                    htmlFor="te-c-q"
                    style={{ position: "absolute", left: "-9999px" }}
                  >
                    What do you need built or fixed?
                  </label>
                  <input
                    id="te-c-q"
                    type="text"
                    placeholder="What do you need built or fixed?"
                    style={{
                      flex: 1,
                      minWidth: "0",
                      border: "0",
                      background: "transparent",
                      fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                      fontSize: "17px",
                      color: "#050A30",
                      padding: "12px 4px",
                    }}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="te-btn te-go"
                    style={{
                      minHeight: "52px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "0 22px",
                      border: "0",
                      borderRadius: "12px",
                      background: "#050A30",
                      color: "#FFF8E6",
                      fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                      fontWeight: 600,
                      fontSize: "16px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Find my engineer
                    <svg
                      className="te-arrow"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#F0B31E"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </button>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  <button
                    type="button"
                    className="te-chip"
                    style={{
                      minHeight: "46px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "0 16px 0 8px",
                      borderRadius: "12px",
                      border: "1px solid rgba(5,10,48,0.22)",
                      background: "rgba(255,248,230,0.55)",
                      color: "#050A30",
                      fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                      fontSize: "15px",
                      fontWeight: 500,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        width: "30px",
                        height: "30px",
                        borderRadius: "8px",
                        background: "#050A30",
                        color: "#F0B31E",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="13" r="5" />
                        <path d="M12 8V5M7 13H4M20 13h-3M8 9 6 7M16 9l2-2M8 17l-2 2M16 17l2 2" />
                      </svg>
                    </span>
                    Fix a bug in my code
                  </button>
                  <button
                    type="button"
                    className="te-chip"
                    style={{
                      minHeight: "46px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "0 16px 0 8px",
                      borderRadius: "12px",
                      border: "1px solid rgba(5,10,48,0.22)",
                      background: "rgba(255,248,230,0.55)",
                      color: "#050A30",
                      fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                      fontSize: "15px",
                      fontWeight: 500,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        width: "30px",
                        height: "30px",
                        borderRadius: "8px",
                        background: "#050A30",
                        color: "#F0B31E",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="8" />
                        <path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" />
                      </svg>
                    </span>
                    Finish my half-built project
                  </button>
                  <button
                    type="button"
                    className="te-chip"
                    style={{
                      minHeight: "46px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "0 16px 0 8px",
                      borderRadius: "12px",
                      border: "1px solid rgba(5,10,48,0.22)",
                      background: "rgba(255,248,230,0.55)",
                      color: "#050A30",
                      fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                      fontSize: "15px",
                      fontWeight: 500,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        width: "30px",
                        height: "30px",
                        borderRadius: "8px",
                        background: "#050A30",
                        color: "#F0B31E",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        aria-hidden="true"
                      >
                        <rect x="3" y="4" width="18" height="12" rx="2" />
                        <path d="M8 20h8" />
                      </svg>
                    </span>
                    Build software for my business
                  </button>
                </div>
              </form>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px 22px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#23284F",
                }}
              >
                <span
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#050A30"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m5 12 5 5L20 7" />
                  </svg>
                  Aadhaar + PAN verified engineers
                </span>
                <span
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#050A30"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m5 12 5 5L20 7" />
                  </svg>
                  Pay 25% to start, rest by milestone
                </span>
                <span
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#050A30"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m5 12 5 5L20 7" />
                  </svg>
                  No bidding
                </span>
              </div>
            </div>
            <div
              aria-hidden="true"
              style={{
                justifySelf: "center",
                width: "100%",
                maxWidth: "500px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              <div
                style={{
                  alignSelf: "flex-end",
                  maxWidth: "380px",
                  background: "#050A30",
                  color: "#FFF8E6",
                  borderRadius: "20px 20px 6px 20px",
                  padding: "16px 20px",
                  fontSize: "17px",
                  lineHeight: 1.45,
                  boxShadow: "0 14px 30px rgba(5,10,48,0.25)",
                }}
              >
                our android app crashes on login after the update. need it fixed
                this week
              </div>
              <div
                style={{
                  background: "#FFF8E6",
                  borderRadius: "22px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                  boxShadow: "0 28px 60px rgba(5,10,48,0.22)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "12px",
                      letterSpacing: "0.12em",
                      color: "#6E6440",
                    }}
                  >
                    NASHEDI · BRIEF
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      padding: "4px 10px",
                      borderRadius: "999px",
                      background: "#050A30",
                      color: "#F0B31E",
                    }}
                  >
                    Ready
                  </span>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "84px minmax(0, 1fr)",
                    gap: "10px 14px",
                    fontSize: "15px",
                  }}
                >
                  <span style={{ color: "#6E6440" }}>Type</span>
                  <span style={{ fontWeight: 600 }}>Bug fix · urgent</span>
                  <span style={{ color: "#6E6440" }}>Stack</span>
                  <span style={{ fontWeight: 600 }}>
                    Android · Kotlin · Firebase Auth
                  </span>
                  <span style={{ color: "#6E6440" }}>Deadline</span>
                  <span style={{ fontWeight: 600 }}>This week</span>
                </div>
                <div
                  style={{ height: "1px", background: "rgba(5,10,48,0.12)" }}
                />
                <div
                  style={{ display: "flex", alignItems: "center", gap: "14px" }}
                >
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      flexShrink: 0,
                      borderRadius: "14px",
                      background: "#F8E3AE",
                      border: "2px dashed rgba(5,10,48,0.3)",
                    }}
                  />
                  <div
                    style={{
                      flex: 1,
                      minWidth: "0",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: "16px" }}>
                      Matched Android engineer
                    </span>
                    <span style={{ fontSize: "13px", color: "#6E6440" }}>
                      Verified · has shipped Android apps before
                    </span>
                  </div>
                  <span
                    style={{
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "#050A30",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#F0B31E"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m5 12 5 5L20 7" />
                    </svg>
                  </span>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <span
                    style={{
                      flex: 1,
                      minHeight: "46px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "12px",
                      background: "#050A30",
                      color: "#FFF8E6",
                      fontWeight: 600,
                      fontSize: "15px",
                    }}
                  >
                    Pay 25% &amp; start
                  </span>
                  <span
                    style={{
                      flex: 1,
                      minHeight: "46px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "12px",
                      border: "1.5px solid rgba(5,10,48,0.25)",
                      fontWeight: 600,
                      fontSize: "15px",
                    }}
                  >
                    Chat first
                  </span>
                </div>
              </div>
            </div>
          </main>
        </div>
      ) : (
        <div
          className="te-dark te-root h-screen"
          style={{
            backgroundColor: "#050A30",
            backgroundImage:
              "repeating-conic-gradient(from 0deg at 88% -10%, rgba(240,179,30,0.05) 0deg 4deg, transparent 4deg 12deg)",
            color: "#FFF8E6",
            fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
            minHeight: "920px",
          }}
        >
          {/* <header
            className="te-hdr"
            style={{
              maxWidth: "1320px",
              margin: "0 auto",
              padding: "20px 32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <a
              href="#top"
              aria-label="Tech Engi home"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <img
                className="te-logo"
                src={logoDark}
                alt="Tech Engi"
                style={{ height: "38px", width: "auto", display: "block" }}
              />
            </a>
            <nav
              className="te-nav"
              aria-label="Main"
              style={{
                display: "flex",
                gap: "4px",
                fontSize: "15px",
                fontWeight: 500,
                color: "#D9DCF0",
              }}
            >
              <a
                className="te-link"
                href="#platform"
                style={{ textDecoration: "none", padding: "10px 14px" }}
              >
                Platform
              </a>
              <a
                className="te-link"
                href="#how"
                style={{ textDecoration: "none", padding: "10px 14px" }}
              >
                How it works
              </a>
              <a
                className="te-link"
                href="#leads"
                style={{ textDecoration: "none", padding: "10px 14px" }}
              >
                Leads
              </a>
              <a
                className="te-link"
                href="#blog"
                style={{ textDecoration: "none", padding: "10px 14px" }}
              >
                Blog
              </a>
              <a
                className="te-link"
                href="#faq"
                style={{ textDecoration: "none", padding: "10px 14px" }}
              >
                FAQ
              </a>
            </nav>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <a
                className="te-link te-login"
                href="#login"
                style={{
                  minHeight: "44px",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 16px",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "15px",
                }}
              >
                Log in
              </a>
              <a
                className="te-btn te-hdr-cta"
                href="#start"
                style={{
                  minHeight: "46px",
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "0 20px",
                  borderRadius: "12px",
                  background: "#F0B31E",
                  color: "#050A30",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "15px",
                  boxShadow: "0 8px 22px rgba(240,179,30,0.25)",
                }}
              >
                Join as an engineer
                <svg
                  className="te-arrow"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
              <button
                type="button"
                className="te-menu"
                aria-label="Open menu"
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "12px",
                  border: "1.5px solid rgba(240,179,30,0.4)",
                  background: "#0B1248",
                  color: "#F0B31E",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </button>
            </div>
          </header> */}
          <main
            className="te-main"
            style={{
              maxWidth: "1320px",
              margin: "0 auto",
              padding: "36px 32px 88px",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(560px, 100%), 1fr))",
              gap: "56px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "26px",
                minWidth: "0",
              }}
            >
              <div
                className="te-seg"
                role="group"
                aria-label="I am a"
                style={{
                  alignSelf: "flex-start",
                  display: "flex",
                  padding: "5px",
                  gap: "4px",
                  borderRadius: "14px",
                  background: "rgba(240,179,30,0.08)",
                  border: "1px solid rgba(240,179,30,0.28)",
                }}
              >
                <button
                  type="button"
                  onClick={() => setMode("client")}
                  aria-pressed="false"
                  style={{
                    minHeight: "44px",
                    padding: "0 22px",
                    border: "0",
                    borderRadius: "10px",
                    background: "transparent",
                    color: "#FFF8E6",
                    fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                    fontWeight: 500,
                    fontSize: "15px",
                    cursor: "pointer",
                  }}
                >
                  I&apos;m a client
                </button>
                <button
                  type="button"
                  aria-pressed="true"
                  style={{
                    minHeight: "44px",
                    padding: "0 22px",
                    border: "0",
                    borderRadius: "10px",
                    background: "#F0B31E",
                    color: "#050A30",
                    fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                    fontWeight: 600,
                    fontSize: "15px",
                    cursor: "default",
                    boxShadow: "0 6px 16px rgba(240,179,30,0.25)",
                  }}
                >
                  I&apos;m an engineer
                </button>
              </div>
              <h1
                className="text-white"
                style={{
                  margin: "0",
                  fontFamily: "'Archivo', system-ui, sans-serif",
                  fontWeight: 900,
                  fontSize: "clamp(44px, 8vw, 92px)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.045em",
                }}
              >
                Get work that fits.
                <br />
                <span style={{ color: "#F0B31E" }}>
                  Finish what you started.
                </span>
              </h1>
              <p
                className="te-sub"
                style={{
                  margin: "0",
                  fontSize: "20px",
                  lineHeight: 1.5,
                  maxWidth: "540px",
                  color: "#C9CDE8",
                }}
              >
                Find leads that match your skills, join a team, or bring in a
                partner to finish your own unfinished build.
              </p>
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  maxWidth: "640px",
                }}
              >
                <div
                  className="te-field"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "#0B1248",
                    border: "1px solid rgba(240,179,30,0.3)",
                    borderRadius: "18px",
                    padding: "8px",
                    boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
                  }}
                >
                  <button
                    type="button"
                    aria-label="Add a skill"
                    style={{
                      flex: "0 0 48px",
                      height: "48px",
                      border: "0",
                      borderRadius: "12px",
                      background: "#141D5E",
                      color: "#F0B31E",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </button>
                  <label
                    htmlFor="te-e-q"
                    style={{ position: "absolute", left: "-9999px" }}
                  >
                    What do you build best?
                  </label>
                  <input
                    id="te-e-q"
                    type="text"
                    placeholder="What do you build best?"
                    style={{
                      flex: 1,
                      minWidth: "0",
                      border: "0",
                      background: "transparent",
                      fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                      fontSize: "17px",
                      color: "#FFF8E6",
                      padding: "12px 4px",
                    }}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="te-btn te-go"
                    style={{
                      minHeight: "52px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "0 22px",
                      border: "0",
                      borderRadius: "12px",
                      background: "#F0B31E",
                      color: "#050A30",
                      fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                      fontWeight: 600,
                      fontSize: "16px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Browse leads
                    <svg
                      className="te-arrow"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </button>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  <button
                    type="button"
                    className="te-chip"
                    style={{
                      minHeight: "46px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "0 16px 0 8px",
                      borderRadius: "12px",
                      border: "1px solid rgba(240,179,30,0.3)",
                      background: "rgba(11,18,72,0.6)",
                      color: "#FFF8E6",
                      fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                      fontSize: "15px",
                      fontWeight: 500,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        width: "30px",
                        height: "30px",
                        borderRadius: "8px",
                        background: "#F0B31E",
                        color: "#050A30",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        aria-hidden="true"
                      >
                        <circle cx="11" cy="11" r="6" />
                        <path d="m20 20-4.5-4.5" />
                      </svg>
                    </span>
                    Help me to Find leads
                  </button>
                  <button
                    type="button"
                    className="te-chip"
                    style={{
                      minHeight: "46px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "0 16px 0 8px",
                      borderRadius: "12px",
                      border: "1px solid rgba(240,179,30,0.3)",
                      background: "rgba(11,18,72,0.6)",
                      color: "#FFF8E6",
                      fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                      fontSize: "15px",
                      fontWeight: 500,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        width: "30px",
                        height: "30px",
                        borderRadius: "8px",
                        background: "#F0B31E",
                        color: "#050A30",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        aria-hidden="true"
                      >
                        <circle cx="9" cy="8" r="3" />
                        <path d="M3 20a6 6 0 0 1 12 0" />
                        <circle cx="17" cy="9" r="2.4" />
                        <path d="M16 14a5 5 0 0 1 5 6" />
                      </svg>
                    </span>
                    Add me to a team on a live project
                  </button>
                  <button
                    type="button"
                    className="te-chip"
                    style={{
                      minHeight: "46px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "0 16px 0 8px",
                      borderRadius: "12px",
                      border: "1px solid rgba(240,179,30,0.3)",
                      background: "rgba(11,18,72,0.6)",
                      color: "#FFF8E6",
                      fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                      fontSize: "15px",
                      fontWeight: 500,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        width: "30px",
                        height: "30px",
                        borderRadius: "8px",
                        background: "#F0B31E",
                        color: "#050A30",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M3 12l4-4 4 2 3-3 7 6M7 16l2 2M10 13l3 3" />
                      </svg>
                    </span>
                    Find a partner to finish my unfinished build
                  </button>
                </div>
              </form>
            </div>
            <div
              style={{
                justifySelf: "center",
                width: "100%",
                maxWidth: "520px",
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "14px",
              }}
            >
              <div
                className="te-strength"
                style={{
                  gridColumn: "1 / -1",
                  background: "#0B1248",
                  border: "1px solid rgba(240,179,30,0.22)",
                  borderRadius: "22px",
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "12px",
                    letterSpacing: "0.12em",
                    color: "#B9BEDD",
                  }}
                >
                  WHAT YOU KEEP
                </span>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <span
                      className="te-big"
                      style={{
                        fontFamily: "'Archivo', system-ui, sans-serif",
                        fontWeight: 900,
                        fontSize: "72px",
                        lineHeight: 0.9,
                        letterSpacing: "-0.05em",
                        color: "#F0B31E",
                      }}
                    >
                      97%
                    </span>
                    <span style={{ fontSize: "15px", color: "#C9CDE8" }}>
                      of your first project
                    </span>
                    <div
                      style={{
                        height: "8px",
                        borderRadius: "4px",
                        background: "#141D5E",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: "97%",
                          height: "100%",
                          background: "#F0B31E",
                        }}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <span
                      className="te-big"
                      style={{
                        fontFamily: "'Archivo', system-ui, sans-serif",
                        fontWeight: 900,
                        fontSize: "72px",
                        lineHeight: 0.9,
                        letterSpacing: "-0.05em",
                        color: "#FFF8E6",
                      }}
                    >
                      95%
                    </span>
                    <span style={{ fontSize: "15px", color: "#C9CDE8" }}>
                      of every project after
                    </span>
                    <div
                      style={{
                        height: "8px",
                        borderRadius: "4px",
                        background: "#141D5E",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: "95%",
                          height: "100%",
                          background: "#FFF8E6",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="te-strength"
                style={{
                  background: "#0B1248",
                  border: "1px solid rgba(240,179,30,0.22)",
                  borderRadius: "22px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Archivo', system-ui, sans-serif",
                    fontWeight: 900,
                    fontSize: "52px",
                    lineHeight: 0.9,
                    letterSpacing: "-0.04em",
                    color: "#F0B31E",
                  }}
                >
                  ₹0
                </span>
                <span style={{ fontSize: "16px", fontWeight: 600 }}>
                  to apply
                </span>
                <span style={{ fontSize: "14px", color: "#B9BEDD" }}>
                  No credits, no bids, no points.
                </span>
              </div>
              <div
                className="te-strength"
                style={{
                  background: "#0B1248",
                  border: "1px solid rgba(240,179,30,0.22)",
                  borderRadius: "22px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <span
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "14px",
                    background: "#F0B31E",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#050A30"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z" />
                    <path d="m8.5 12 2.5 2.5 4.5-5" />
                  </svg>
                </span>
                <span style={{ fontSize: "16px", fontWeight: 600 }}>
                  Your years count
                </span>
                <span style={{ fontSize: "14px", color: "#B9BEDD" }}>
                  Matched on verified work and experience, not star ratings.
                </span>
              </div>
            </div>
          </main>
        </div>
      )}
    </>
  );
}
