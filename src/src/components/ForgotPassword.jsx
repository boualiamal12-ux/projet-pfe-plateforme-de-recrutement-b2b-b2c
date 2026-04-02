import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  :root { --bg-dark: #060b13; --primary-cyan: #26c1c9; --text-dark: #0f172a; --input-bg: #eff4ff; }
  .fp-root { display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: 'Plus Jakarta Sans', sans-serif; background: var(--bg-dark); position: relative; overflow: hidden; }
  .fp-root::after { content: ''; position: absolute; top: 20%; right: 10%; width: 400px; height: 400px; background: radial-gradient(circle, rgba(38,193,201,0.08) 0%, transparent 70%); pointer-events: none; }
  .fp-lang { position: absolute; top: 24px; right: 24px; z-index: 10; }
  .fp-card { width: 100%; max-width: 440px; background: #fff; border-radius: 32px; padding: 50px 40px; box-shadow: 0 40px 100px rgba(0,0,0,0.4); position: relative; z-index: 1; animation: cardIn 0.6s cubic-bezier(0.22,1,0.36,1) both; }
  @keyframes cardIn { from { opacity:0; transform:scale(0.95) translateY(20px); } to { opacity:1; transform:scale(1) translateY(0); } }
  .fp-brand { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; }
  .fp-brand-icon { width: 36px; height: 36px; background: var(--primary-cyan); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; color: var(--bg-dark); }
  .fp-brand-name { font-weight: 800; color: var(--text-dark); font-size: 18px; }
  .fp-title { font-size: 26px; font-weight: 800; color: var(--text-dark); margin: 0 0 10px; }
  .fp-subtitle { font-size: 15px; color: #64748b; margin: 0 0 32px; line-height: 1.6; }
  .fp-hint { background: var(--input-bg); border-radius: 14px; padding: 14px 18px; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; border: 1px solid rgba(38,193,201,0.1); }
  .fp-hint p { font-size: 13px; color: #475569; line-height: 1.5; margin: 0; }
  .fp-field { position: relative; display: flex; align-items: center; margin-bottom: 24px; }
  .fp-field-icon { position: absolute; left: 16px; color: #94a3b8; pointer-events: none; }
  .fp-input { width: 100%; padding: 15px 16px 15px 48px; border: 2px solid transparent; border-radius: 14px; outline: none; font-size: 15px; font-family: inherit; background: var(--input-bg); color: #0f172a; transition: all 0.3s; }
  .fp-input:focus { border-color: var(--primary-cyan); background: white; box-shadow: 0 0 0 4px rgba(38,193,201,0.1); }
  .fp-btn { width: 100%; padding: 16px; background: var(--bg-dark); color: white; border: none; border-radius: 14px; font-weight: 700; font-size: 15px; font-family: inherit; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.3s; }
  .fp-btn:hover:not(:disabled) { background: #1e293b; transform: translateY(-2px); }
  .fp-btn:disabled { opacity: 0.7; cursor: not-allowed; }
  .fp-spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: fp-spin 0.8s linear infinite; }
  @keyframes fp-spin { to { transform: rotate(360deg); } }
  .fp-success { background: #f0fdf9; border: 1px solid #a7f3d0; border-radius: 18px; padding: 28px; text-align: center; margin-bottom: 24px; }
  .fp-success-title { font-size: 18px; font-weight: 800; color: #065f46; margin-bottom: 8px; }
  .fp-success-text { font-size: 14px; color: #065f46; margin: 0; line-height: 1.6; opacity: 0.8; }
  .fp-progress-wrap { height: 4px; background: rgba(5,150,105,0.1); border-radius: 10px; margin-top: 16px; overflow: hidden; }
  .fp-progress-bar { height: 100%; background: #10b981; animation: fp-progress 5s linear forwards; }
  @keyframes fp-progress { from { width: 100%; } to { width: 0%; } }
  .fp-back { display: block; text-align: center; margin-top: 24px; font-size: 14px; color: #64748b; cursor: pointer; background: none; border: none; font-family: inherit; font-weight: 600; transition: color 0.2s; }
  .fp-back:hover { color: var(--primary-cyan); }
`;

function ForgotPassword({ goLogin }) {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:8081/api/auth/forgot-password", { email });
      setSent(true);
      toast.success(t('forgot.sent'));
      setTimeout(() => goLogin(), 5000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'envoi.");
    } finally { setLoading(false); }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="fp-root">
        <div className="fp-lang"><LanguageSwitcher variant="dark" /></div>
        <div className="fp-card">
          <div className="fp-brand"><div className="fp-brand-icon"><ShieldCheck size={20} /></div><span className="fp-brand-name">RecruitPro</span></div>
          <h2 className="fp-title">{t('forgot.title')}</h2>
          <p className="fp-subtitle">{t('forgot.subtitle')}</p>
          {sent ? (
            <div className="fp-success">
              <p className="fp-success-title">{t('forgot.successTitle')}</p>
              <p className="fp-success-text">{t('forgot.successText')} <strong>{email}</strong>.</p>
              <div className="fp-progress-wrap"><div className="fp-progress-bar" /></div>
            </div>
          ) : (
            <>
              <div className="fp-hint"><span style={{fontSize:18}}>✨</span><p>{t('forgot.hint')}</p></div>
              <form onSubmit={handleSubmit}>
                <div className="fp-field">
                  <Mail className="fp-field-icon" size={18} />
                  <input className="fp-input" type="email" placeholder={t('forgot.email')} value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
                </div>
                <button type="submit" className="fp-btn" disabled={loading}>
                  {loading ? <div className="fp-spinner" /> : <>{t('forgot.submit')} <ArrowRight size={18} /></>}
                </button>
              </form>
            </>
          )}
          <button className="fp-back" onClick={goLogin}>{t('forgot.back')}</button>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;