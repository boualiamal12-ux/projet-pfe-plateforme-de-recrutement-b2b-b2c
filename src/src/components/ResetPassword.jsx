import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Lock, Eye, EyeOff, ShieldCheck, CheckCircle2, ArrowLeft } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  :root { --bg-dark: #060b13; --primary-cyan: #26c1c9; }
  .rp-root { display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: 'Plus Jakarta Sans', sans-serif; background: var(--bg-dark); position: relative; overflow: hidden; }
  .rp-root::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 30px 30px; pointer-events: none; }
  .rp-lang { position: absolute; top: 24px; right: 24px; z-index: 10; }
  .rp-card { width: 100%; max-width: 440px; background: #fff; border-radius: 28px; padding: 45px; box-shadow: 0 25px 50px rgba(0,0,0,0.3); position: relative; z-index: 1; animation: cardIn 0.5s cubic-bezier(0.22,1,0.36,1) both; }
  @keyframes cardIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  .rp-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 30px; }
  .rp-brand-icon { width: 36px; height: 36px; background: var(--primary-cyan); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; color: var(--bg-dark); }
  .rp-brand-name { font-weight: 800; color: var(--bg-dark); font-size: 18px; }
  .rp-title { font-size: 26px; font-weight: 800; color: var(--bg-dark); margin-bottom: 8px; letter-spacing: -1px; }
  .rp-subtitle { font-size: 14px; color: #64748b; margin-bottom: 30px; line-height: 1.5; }
  .rp-field { margin-bottom: 20px; }
  .rp-label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 8px; }
  .rp-input-wrap { position: relative; }
  .rp-input-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #94a3b8; pointer-events: none; }
  .rp-eye-btn { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #94a3b8; display: flex; transition: 0.2s; }
  .rp-eye-btn:hover { color: var(--primary-cyan); }
  .rp-input { width: 100%; padding: 14px 48px; border: 2px solid #f1f5f9; border-radius: 14px; outline: none; font-size: 15px; font-family: inherit; background: #f8fafc; color: var(--bg-dark); transition: 0.3s; }
  .rp-input:focus { border-color: var(--primary-cyan); background: #fff; box-shadow: 0 0 0 4px rgba(38,193,201,0.1); }
  .rp-strength-wrap { margin-top: 10px; }
  .rp-strength-track { height: 5px; background: #f1f5f9; border-radius: 10px; overflow: hidden; margin-bottom: 6px; }
  .rp-strength-fill { height: 100%; border-radius: 10px; transition: width 0.4s, background 0.4s; }
  .rp-strength-label { font-size: 11px; font-weight: 700; text-transform: uppercase; }
  .rp-reqs { background: #f8fafc; border-radius: 16px; padding: 15px; margin-bottom: 25px; border: 1px solid #f1f5f9; }
  .rp-req { display: flex; align-items: center; gap: 10px; font-size: 13px; margin-bottom: 8px; font-weight: 500; }
  .rp-req:last-child { margin-bottom: 0; }
  .rp-btn { width: 100%; padding: 16px; background: var(--bg-dark); color: white; border: none; border-radius: 14px; font-weight: 700; font-size: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: 0.3s; font-family: inherit; }
  .rp-btn:hover:not(:disabled) { background: #1a2333; transform: translateY(-2px); }
  .rp-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .rp-btn.ready { background: var(--primary-cyan); color: var(--bg-dark); }
  .rp-spinner { width: 18px; height: 18px; border: 3px solid rgba(255,255,255,0.2); border-top-color: currentColor; border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .rp-success-card { text-align: center; }
  .rp-success-icon { width: 64px; height: 64px; background: rgba(38,193,201,0.1); color: var(--primary-cyan); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
  .rp-back { display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; margin-top: 25px; font-size: 14px; color: #64748b; cursor: pointer; background: none; border: none; font-weight: 600; transition: 0.2s; font-family: inherit; }
  .rp-back:hover { color: var(--primary-cyan); }
`;

function ResetPassword({ goLogin }) {
  const { t } = useLanguage();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const token = new URLSearchParams(window.location.search).get("token");

  const reqs = [
    { ok: password.length >= 8, label: t('reset.req1') },
    { ok: /[A-Z]/.test(password), label: t('reset.req2') },
    { ok: /[0-9]/.test(password), label: t('reset.req3') },
    { ok: password === confirm && confirm !== "", label: t('reset.req4') },
  ];
  const allOk = reqs.every((r) => r.ok);

  const getStrength = () => {
    if (!password) return null;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 1) return { label: t('reset.strength1'), color: "#f87171", pct: "25%" };
    if (score === 2) return { label: t('reset.strength2'), color: "#fbbf24", pct: "50%" };
    if (score === 3) return { label: t('reset.strength3'), color: "#22d3ee", pct: "75%" };
    return { label: t('reset.strength4'), color: "#26c1c9", pct: "100%" };
  };
  const strength = getStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!allOk) return;
    if (!token) { toast.error(t('reset.invalid')); return; }
    setLoading(true);
    try {
      await axios.post("http://localhost:8081/api/auth/reset-password", { token, password });
      setDone(true);
      toast.success(t('reset.success'));
      setTimeout(() => goLogin(), 3500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur.");
    } finally { setLoading(false); }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="rp-root">
        <div className="rp-lang"><LanguageSwitcher variant="dark" /></div>
        <div className="rp-card">
          <div className="rp-brand"><div className="rp-brand-icon">R</div><span className="rp-brand-name">RecruitPro</span></div>
          {done ? (
            <div className="rp-success-card">
              <div className="rp-success-icon"><CheckCircle2 size={32} /></div>
              <h2 className="rp-title">{t('reset.doneTitle')}</h2>
              <p className="rp-subtitle">{t('reset.doneDesc')}</p>
              <div className="rp-spinner" style={{margin:'0 auto',color:'#26c1c9'}} />
            </div>
          ) : (
            <>
              <h2 className="rp-title">{t('reset.title')}</h2>
              <p className="rp-subtitle">{t('reset.subtitle')}</p>
              <form onSubmit={handleSubmit}>
                <div className="rp-field">
                  <label className="rp-label">{t('reset.newPwd')}</label>
                  <div className="rp-input-wrap">
                    <Lock className="rp-input-icon" size={18} />
                    <input type={showPwd?"text":"password"} className="rp-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="button" className="rp-eye-btn" onClick={() => setShowPwd(!showPwd)}>{showPwd ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>
                  {strength && (
                    <div className="rp-strength-wrap">
                      <div className="rp-strength-track"><div className="rp-strength-fill" style={{width:strength.pct,background:strength.color}} /></div>
                      <span className="rp-strength-label" style={{color:strength.color}}>{strength.label}</span>
                    </div>
                  )}
                </div>
                <div className="rp-field">
                  <label className="rp-label">{t('reset.confirmPwd')}</label>
                  <div className="rp-input-wrap">
                    <Lock className="rp-input-icon" size={18} />
                    <input type={showPwd?"text":"password"} className="rp-input" placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
                  </div>
                </div>
                <div className="rp-reqs">
                  {reqs.map((r, i) => (
                    <div key={i} className="rp-req" style={{color:r.ok?"#059669":"#94a3b8"}}>
                      <CheckCircle2 size={14} style={{opacity:r.ok?1:0.3}} /> {r.label}
                    </div>
                  ))}
                </div>
                <button type="submit" className={`rp-btn ${allOk?"ready":""}`} disabled={loading||!allOk}>
                  {loading ? <div className="rp-spinner" /> : t('reset.submit')}
                </button>
              </form>
            </>
          )}
          {!done && <button className="rp-back" onClick={goLogin}><ArrowLeft size={16} /> {t('reset.back')}</button>}
        </div>
      </div>
    </>
  );
}

export default ResetPassword;