import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Globe, ChevronDown } from "lucide-react";

const switcherStyles = `
  .lang-switcher { position: relative; display: inline-flex; }
  .lang-btn { display: flex; align-items: center; gap: 7px; padding: 8px 14px; border-radius: 12px; cursor: pointer; font-size: 13px; font-weight: 600; border: none; transition: all 0.2s; font-family: inherit; }
  .lang-btn.dark { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; }
  .lang-btn.dark:hover { background: rgba(255,255,255,0.12); color: #fff; }
  .lang-btn.light { background: #f1f5f9; border: 1px solid #e2e8f0; color: #475569; }
  .lang-btn.light:hover { background: #e2e8f0; color: #0f172a; }
  .lang-chevron { transition: transform 0.2s; opacity: 0.6; }
  .lang-chevron.open { transform: rotate(180deg); }
  .lang-dropdown { position: absolute; top: calc(100% + 8px); right: 0; background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 6px; min-width: 160px; box-shadow: 0 10px 40px rgba(0,0,0,0.12); z-index: 9999; animation: langFadeIn 0.15s ease both; }
  @keyframes langFadeIn { from { opacity:0; transform:translateY(-6px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
  .lang-option { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 10px; cursor: pointer; font-size: 13px; font-weight: 500; color: #374151; transition: 0.15s; border: none; background: none; width: 100%; text-align: left; font-family: inherit; }
  .lang-option:hover { background: #f8fafc; color: #0f172a; }
  .lang-option.active { background: rgba(38,193,201,0.08); color: #26c1c9; font-weight: 700; }
  .lang-option .lang-check { margin-left: auto; color: #26c1c9; }
`;

export default function LanguageSwitcher({ variant = "dark" }) {
  const { lang, changeLang, LANGUAGES } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <style>{switcherStyles}</style>
      <div className="lang-switcher" ref={ref}>
        <button className={`lang-btn ${variant}`} onClick={() => setOpen((o) => !o)}>
          <Globe size={14} />
          <span style={{ fontSize: 16 }}>{current.flag}</span>
          <span style={{ letterSpacing: "0.5px", textTransform: "uppercase" }}>{current.code}</span>
          <ChevronDown size={13} className={`lang-chevron ${open ? "open" : ""}`} />
        </button>
        {open && (
          <div className="lang-dropdown">
            {LANGUAGES.map((l) => (
              <button key={l.code} className={`lang-option ${lang === l.code ? "active" : ""}`} onClick={() => { changeLang(l.code); setOpen(false); }}>
                <span style={{ fontSize: 18 }}>{l.flag}</span>
                <span>{l.label}</span>
                {lang === l.code && <span className="lang-check">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}