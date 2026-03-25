import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Mail, Lock, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  :root { --bg-dark: #060b13; --primary-cyan: #26c1c9; --text-muted: #94a3b8; }
  .auth-root { display: flex; min-height: 100vh; width: 100%; font-family: 'Plus Jakarta Sans', sans-serif; background: var(--bg-dark); overflow: hidden; }
  .auth-left { flex: 1.2; position: relative; display: flex; flex-direction: column; justify-content: space-between; padding: 60px; overflow: hidden; background: radial-gradient(circle at 0% 0%, rgba(38,193,201,0.15) 0%, transparent 50%); }
  .auth-left::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 30px 30px; }
  .left-content { position: relative; z-index: 1; height: 100%; display: flex; flex-direction: column; }
  .brand { display: flex; align-items: center; gap: 12px; }
  .brand-icon { width: 40px; height: 40px; background: var(--primary-cyan); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--bg-dark); font-weight: 800; font-size: 20px; }
  .brand-name { font-size: 22px; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
  .hero-block { flex: 1; display: flex; flex-direction: column; justify-content: center; }
  .hero-tag { display: inline-flex; align-items: center; gap: 8px; background: rgba(38,193,201,0.1); border: 1px solid rgba(38,193,201,0.2); color: var(--primary-cyan); font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 100px; margin-bottom: 24px; width: fit-content; }
  .hero-title { font-size: clamp(40px,5vw,64px); font-weight: 800; color: #fff; line-height: 1.1; letter-spacing: -2px; margin-bottom: 20px; }
  .hero-title span { color: var(--primary-cyan); }
  .hero-desc { font-size: 17px; color: var(--text-muted); line-height: 1.6; max-width: 440px; }
  .auth-right { flex: 1; background: #f8fafc; display: flex; align-items: center; justify-content: center; padding: 40px; position: relative; }
  .lang-topright { position: absolute; top: 24px; right: 24px; }
  .auth-card { width: 100%; max-width: 440px; background: #fff; border-radius: 30px; padding: 50px; box-shadow: 0 20px 50px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; }
  .card-header { margin-bottom: 35px; }
  .card-title { font-size: 28px; font-weight: 800; color: var(--bg-dark); letter-spacing: -1px; }
  .form-field { margin-bottom: 20px; }
  .field-label { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; font-weight: 600; color: #475569; }
  .forgot-link { color: var(--primary-cyan); cursor: pointer; font-size: 13px; }
  .field-input-wrap { position: relative; }
  .field-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
  .field-input { width: 100%; padding: 14px 16px 14px 48px; border: 2px solid #f1f5f9; border-radius: 14px; font-size: 15px; background: #f8fafc; outline: none; transition: 0.3s; font-family: inherit; }
  .field-input:focus { border-color: var(--primary-cyan); background: #fff; box-shadow: 0 0 0 4px rgba(38,193,201,0.1); }
  .btn-login { width: 100%; padding: 16px; background: var(--bg-dark); color: #fff; border: none; border-radius: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: 0.3s; font-size: 16px; margin-top: 10px; font-family: inherit; }
  .btn-login:hover { background: #1a2333; transform: translateY(-2px); }
  .btn-login:disabled { opacity: 0.7; cursor: not-allowed; }
  .card-footer { text-align: center; margin-top: 25px; font-size: 14px; color: #64748b; }
  .card-footer-link { color: var(--primary-cyan); font-weight: 700; cursor: pointer; margin-left: 5px; }
  .spin { width: 18px; height: 18px; border: 3px solid rgba(255,255,255,0.2); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @media (max-width: 950px) { .auth-left { display: none; } .auth-right { background: var(--bg-dark); } }
`;

function Login({ goRegister, onLoginSuccess, goForgot }) {
  const { t } = useLanguage();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8081/api/auth/login", credentials);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("user", JSON.stringify({ id: res.data.id, email: res.data.email, role: res.data.role }));
      toast.success(t('login.success'));
      onLoginSuccess(res.data.role);
    } catch (err) {
      toast.error(err.response?.data?.message || t('login.error'));
    } finally { setLoading(false); }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="auth-root">
        <div className="auth-left">
          <div className="left-content">
            <div className="brand"><div className="brand-icon">R</div><span className="brand-name">RecruitPro</span></div>
            <div className="hero-block">
              <div className="hero-tag"><Sparkles size={14} /> {t('login.tag')}</div>
              <h1 className="hero-title">{t('login.heroTitle')} <span>{t('login.heroTitle2')}</span></h1>
              <p className="hero-desc">{t('login.heroDesc')}</p>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'8px',color:'rgba(255,255,255,0.3)',fontSize:'12px'}}>
              <ShieldCheck size={14} /> {t('login.ssl')}
            </div>
          </div>
        </div>
        <div className="auth-right">
          <div className="lang-topright"><LanguageSwitcher variant="light" /></div>
          <div className="auth-card">
            <div className="card-header">
              <h2 className="card-title">{t('login.title')}</h2>
              <p style={{color:'#94a3b8',fontSize:'14px',marginTop:'5px'}}>{t('login.subtitle')}</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <div className="field-label">{t('login.email')}</div>
                <div className="field-input-wrap">
                  <Mail className="field-icon" size={18} />
                  <input className="field-input" name="email" type="email" placeholder="nom@exemple.tn" onChange={handleChange} required />
                </div>
              </div>
              <div className="form-field">
                <div className="field-label">
                  <span>{t('login.password')}</span>
                  <span className="forgot-link" onClick={goForgot}>{t('login.forgot')}</span>
                </div>
                <div className="field-input-wrap">
                  <Lock className="field-icon" size={18} />
                  <input className="field-input" name="password" type="password" placeholder="••••••••" onChange={handleChange} required />
                </div>
              </div>
              <button type="submit" className="btn-login" disabled={loading}>
                {loading ? <div className="spin" /> : <>{t('login.submit')} <ArrowRight size={18} /></>}
              </button>
            </form>
            <div className="card-footer">
              {t('login.noAccount')}
              <span className="card-footer-link" onClick={goRegister}>{t('login.createAccount')}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;