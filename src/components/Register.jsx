import React, { useState } from "react";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast } from "react-toastify";
import { User, Building2, Mail, Lock, MapPin, ArrowRight, Briefcase, Sparkles, CheckCircle2, Globe, Users } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  :root { --bg-dark: #060b13; --primary-cyan: #26c1c9; --text-muted: #94a3b8; }
  .reg-root { display: flex; min-height: 100vh; width: 100%; font-family: 'Plus Jakarta Sans', sans-serif; background: var(--bg-dark); overflow: hidden; }
  .reg-left { flex: 1.2; position: relative; display: flex; flex-direction: column; justify-content: space-between; padding: 60px; overflow: hidden; background: radial-gradient(circle at 0% 100%, rgba(38,193,201,0.1) 0%, transparent 50%); }
  .reg-left::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 30px 30px; }
  .reg-left-content { position: relative; z-index: 1; height: 100%; display: flex; flex-direction: column; }
  .reg-brand { display: flex; align-items: center; gap: 12px; margin-bottom: 40px; }
  .reg-brand-icon { width: 36px; height: 36px; background: var(--primary-cyan); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--bg-dark); font-weight: 800; }
  .reg-brand-name { font-size: 20px; font-weight: 800; color: #fff; }
  .reg-hero { flex: 1; display: flex; flex-direction: column; justify-content: center; }
  .reg-tag { display: inline-flex; align-items: center; gap: 8px; background: rgba(38,193,201,0.1); border: 1px solid rgba(38,193,201,0.2); color: var(--primary-cyan); font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 100px; margin-bottom: 24px; width: fit-content; }
  .reg-title { font-size: clamp(32px,4vw,52px); font-weight: 800; color: #fff; line-height: 1.1; letter-spacing: -1.5px; margin-bottom: 20px; }
  .reg-title span { color: var(--primary-cyan); }
  .reg-benefits { display: flex; flex-direction: column; gap: 16px; margin-top: 32px; }
  .reg-benefit { display: flex; align-items: center; gap: 12px; font-size: 15px; color: var(--text-muted); }
  .reg-benefit svg { color: var(--primary-cyan); flex-shrink: 0; }
  .reg-right { flex: 1; background: #f8fafc; display: flex; align-items: center; justify-content: center; padding: 40px; overflow-y: auto; position: relative; }
  .reg-lang-top { position: absolute; top: 24px; right: 24px; }
  .reg-card { width: 100%; max-width: 520px; background: white; border-radius: 30px; padding: 40px; box-shadow: 0 20px 50px rgba(0,0,0,0.04); border: 1px solid #f1f5f9; }
  .reg-card-head { margin-bottom: 24px; }
  .reg-card-title { font-size: 26px; font-weight: 800; color: var(--bg-dark); letter-spacing: -1px; }
  .reg-tabs { display: flex; gap: 8px; background: #f1f5f9; padding: 6px; border-radius: 16px; margin-bottom: 24px; }
  .reg-tab { flex: 1; padding: 10px; border: none; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: 0.3s; background: transparent; color: #64748b; font-family: inherit; }
  .reg-tab.active { background: white; color: var(--bg-dark); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
  .reg-tab.active svg { color: var(--primary-cyan); }
  .reg-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .reg-field { display: flex; flex-direction: column; gap: 6px; }
  .reg-field.full { grid-column: span 2; }
  .reg-field label { font-size: 13px; font-weight: 600; color: #475569; }
  .reg-input-wrap { position: relative; }
  .reg-field-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94a3b8; pointer-events: none; }
  .reg-input { width: 100%; padding: 12px 14px 12px 42px; border: 2px solid #f1f5f9; border-radius: 12px; font-size: 14px; background: #f8fafc; outline: none; transition: 0.3s; font-family: inherit; }
  .reg-input:focus { border-color: var(--primary-cyan); background: #fff; box-shadow: 0 0 0 4px rgba(38,193,201,0.1); }
  .reg-select { width: 100%; padding: 12px 14px 12px 42px; border: 2px solid #f1f5f9; border-radius: 12px; font-size: 14px; background: #f8fafc; outline: none; transition: 0.3s; font-family: inherit; appearance: none; cursor: pointer; color: #0f172a; }
  .reg-select:focus { border-color: var(--primary-cyan); background: #fff; box-shadow: 0 0 0 4px rgba(38,193,201,0.1); }
  .reg-textarea { width: 100%; padding: 12px 14px; border: 2px solid #f1f5f9; border-radius: 12px; font-size: 14px; background: #f8fafc; outline: none; transition: 0.3s; font-family: inherit; resize: none; color: #0f172a; }
  .reg-textarea:focus { border-color: var(--primary-cyan); background: #fff; box-shadow: 0 0 0 4px rgba(38,193,201,0.1); }
  .react-tel-input .form-control { width: 100% !important; height: 46px !important; border: 2px solid #f1f5f9 !important; border-radius: 12px !important; background: #f8fafc !important; font-family: inherit !important; }
  .react-tel-input .flag-dropdown { border: 2px solid #f1f5f9 !important; border-radius: 12px 0 0 12px !important; background: #f8fafc !important; }
  .reg-btn { grid-column: span 2; padding: 14px; margin-top: 6px; background: var(--bg-dark); color: white; border: none; border-radius: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: 0.3s; font-size: 15px; font-family: inherit; }
  .reg-btn:hover { background: #1a2333; transform: translateY(-2px); }
  .reg-btn:disabled { opacity: 0.7; }
  .reg-footer { text-align: center; margin-top: 20px; font-size: 14px; color: #64748b; }
  .reg-footer-link { color: var(--primary-cyan); font-weight: 700; cursor: pointer; margin-left: 5px; }
  .reg-spin { width: 18px; height: 18px; border: 3px solid rgba(255,255,255,0.2); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
  .reg-section-label { grid-column: span 2; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.8px; padding: 6px 0 2px; border-top: 2px solid #f1f5f9; margin-top: 4px; }
  .reg-email-banner { background: rgba(38,193,201,0.06); border: 1.5px solid rgba(38,193,201,0.2); border-radius: 16px; padding: 20px; display: flex; align-items: flex-start; gap: 14px; margin-bottom: 20px; animation: fadeIn 0.4s ease; }
  .reg-email-banner-icon { width: 40px; height: 40px; background: rgba(38,193,201,0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--primary-cyan); }
  .reg-email-banner-body { flex: 1; }
  .reg-email-banner-title { font-size: 14px; font-weight: 700; color: var(--bg-dark); margin-bottom: 6px; }
  .reg-email-banner-text { font-size: 13px; color: #64748b; line-height: 1.6; }
  .reg-email-banner-text strong { color: var(--bg-dark); }
  .reg-email-banner-link { display: inline-block; margin-top: 12px; color: var(--primary-cyan); font-size: 13px; font-weight: 700; cursor: pointer; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
  @media (max-width: 950px) { .reg-left { display: none; } .reg-right { background: var(--bg-dark); } }
`;

function Register({ goLogin }) {
  const { t } = useLanguage();
  const [role, setRole] = useState("CANDIDAT");
  const [formData, setFormData] = useState({});
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error(t('register.passwordMismatch'));
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://localhost:8081/api/auth/register", {
        ...formData, telephone: phone, role: role.toUpperCase()
      });
      setRegisteredEmail(formData.email);
      setEmailSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur d'inscription");
    } finally {
      setLoading(false);
    }
  };

  const benefits = role === "CANDIDAT"
    ? [t('register.benefit_c1'), t('register.benefit_c2'), t('register.benefit_c3')]
    : [t('register.benefit_e1'), t('register.benefit_e2'), t('register.benefit_e3')];

  return (
    <>
      <style>{styles}</style>
      <div className="reg-root">

        {/* LEFT */}
        <div className="reg-left">
          <div className="reg-left-content">
            <div className="reg-brand">
              <div className="reg-brand-icon">R</div>
              <span className="reg-brand-name">RecruitPro</span>
            </div>
            <div className="reg-hero">
              <div className="reg-tag">
                <Sparkles size={14} />
                {role === "CANDIDAT" ? t('register.tag_candidat') : t('register.tag_entreprise')}
              </div>
              <h1 className="reg-title">
                {t('register.heroTitle')} <span>{t('register.heroTitle2')}</span> {t('register.heroTitle3')}
              </h1>
              <div className="reg-benefits">
                {benefits.map((b, i) => (
                  <div className="reg-benefit" key={i}><CheckCircle2 size={18} /> {b}</div>
                ))}
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>{t('register.rgpd')}</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="reg-right">
          <div className="reg-lang-top"><LanguageSwitcher variant="light" /></div>
          <div className="reg-card">
            <div className="reg-card-head">
              <h2 className="reg-card-title">{t('register.title')}</h2>
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>{t('register.subtitle')}</p>
            </div>

            {emailSent ? (
              <div className="reg-email-banner">
                <div className="reg-email-banner-icon"><Mail size={20} /></div>
                <div className="reg-email-banner-body">
                  <div className="reg-email-banner-title">
                    {role === "ENTREPRISE" ? "Vérifiez votre email 📧" : "Activez votre compte 📧"}
                  </div>
                  <div className="reg-email-banner-text">
                    Un lien a été envoyé à <strong>{registeredEmail}</strong>.<br />
                    {role === "ENTREPRISE"
                      ? "Après vérification, votre compte sera examiné par notre équipe."
                      : "Cliquez sur le lien pour activer votre compte."}
                  </div>
                  <span className="reg-email-banner-link" onClick={goLogin}>Déjà vérifié ? Se connecter →</span>
                </div>
              </div>
            ) : (
              <>
                <div className="reg-tabs">
                  <button type="button" className={`reg-tab ${role === "CANDIDAT" ? "active" : ""}`}
                    onClick={() => { setRole("CANDIDAT"); setFormData({}); setPhone(""); }}>
                    <User size={16} /> {t('register.tabCandidat')}
                  </button>
                  <button type="button" className={`reg-tab ${role === "ENTREPRISE" ? "active" : ""}`}
                    onClick={() => { setRole("ENTREPRISE"); setFormData({}); setPhone(""); }}>
                    <Building2 size={16} /> {t('register.tabEntreprise')}
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="reg-grid">

                    {role === "CANDIDAT" ? (
                      <>
                        <div className="reg-field">
                          <label>{t('register.nom')}</label>
                          <div className="reg-input-wrap"><User className="reg-field-icon" size={18} />
                            <input className="reg-input" name="nom" placeholder={t('register.nom')} onChange={handleChange} required />
                          </div>
                        </div>
                        <div className="reg-field">
                          <label>{t('register.prenom')}</label>
                          <div className="reg-input-wrap"><User className="reg-field-icon" size={18} />
                            <input className="reg-input" name="prenom" placeholder={t('register.prenom')} onChange={handleChange} required />
                          </div>
                        </div>
                        <div className="reg-field full">
                          <label>{t('register.email')}</label>
                          <div className="reg-input-wrap"><Mail className="reg-field-icon" size={18} />
                            <input className="reg-input" name="email" type="email" placeholder="email@exemple.tn" onChange={handleChange} required />
                          </div>
                        </div>
                        <div className="reg-field">
                          <label>{t('register.ville')}</label>
                          <div className="reg-input-wrap"><MapPin className="reg-field-icon" size={18} />
                            <input className="reg-input" name="ville" placeholder="Tunis" onChange={handleChange} required />
                          </div>
                        </div>
                        <div className="reg-field">
                          <label>Nationalité</label>
                          <div className="reg-input-wrap"><Globe className="reg-field-icon" size={18} />
                            <input className="reg-input" name="nationalite" placeholder="ex: Tunisienne" onChange={handleChange} />
                          </div>
                        </div>
                        <div className="reg-field full">
                          <label>{t('register.phone')}</label>
                          <PhoneInput country="tn" value={phone} onChange={setPhone} />
                        </div>
                        <div className="reg-field full">
                          <label>LinkedIn (optionnel)</label>
                          <div className="reg-input-wrap"><Globe className="reg-field-icon" size={18} />
                            <input className="reg-input" name="linkedin" placeholder="https://linkedin.com/in/..." onChange={handleChange} />
                          </div>
                        </div>
                        <div className="reg-field">
                          <label>{t('register.password')}</label>
                          <div className="reg-input-wrap"><Lock className="reg-field-icon" size={18} />
                            <input className="reg-input" name="password" type="password" placeholder="••••••••" onChange={handleChange} required />
                          </div>
                        </div>
                        <div className="reg-field">
                          <label>{t('register.confirm')}</label>
                          <div className="reg-input-wrap"><Lock className="reg-field-icon" size={18} />
                            <input className="reg-input" name="confirmPassword" type="password" placeholder="••••••••" onChange={handleChange} required />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="reg-section-label">Identité de l'entreprise</div>
                        <div className="reg-field">
                          <label>{t('register.nomEntreprise')}</label>
                          <div className="reg-input-wrap"><Building2 className="reg-field-icon" size={18} />
                            <input className="reg-input" name="nomEntreprise" placeholder="ex: Orange Tunisie" onChange={handleChange} required />
                          </div>
                        </div>
                        <div className="reg-field">
                          <label>Secteur d'activité</label>
                          <div className="reg-input-wrap"><Briefcase className="reg-field-icon" size={18} />
                            <input className="reg-input" name="secteur" placeholder="IT, Finance, Santé..." onChange={handleChange} required />
                          </div>
                        </div>
                        <div className="reg-field">
                          <label>Taille de l'entreprise</label>
                          <div className="reg-input-wrap"><Users className="reg-field-icon" size={18} />
                            <select className="reg-select" name="taille" onChange={handleChange} required>
                              <option value="">Nombre d'employés</option>
                              <option value="1-10">1 – 10</option>
                              <option value="11-50">11 – 50</option>
                              <option value="51-200">51 – 200</option>
                              <option value="201-500">201 – 500</option>
                              <option value="500+">500+</option>
                            </select>
                          </div>
                        </div>
                        <div className="reg-field">
                          <label>Pays</label>
                          <div className="reg-input-wrap"><Globe className="reg-field-icon" size={18} />
                            <input className="reg-input" name="pays" placeholder="ex: Tunisie" onChange={handleChange} required />
                          </div>
                        </div>
                        <div className="reg-field">
                          <label>Ville</label>
                          <div className="reg-input-wrap"><MapPin className="reg-field-icon" size={18} />
                            <input className="reg-input" name="ville" placeholder="ex: Tunis" onChange={handleChange} required />
                          </div>
                        </div>
                        <div className="reg-field">
                          <label>Site web</label>
                          <div className="reg-input-wrap"><Globe className="reg-field-icon" size={18} />
                            <input className="reg-input" name="siteWeb" placeholder="https://entreprise.tn" onChange={handleChange} />
                          </div>
                        </div>
                        <div className="reg-field full">
                          <label>Description de l'entreprise</label>
                          <textarea className="reg-textarea" name="description" rows="3"
                            placeholder="Décrivez votre entreprise en quelques mots..." onChange={handleChange} />
                        </div>
                        <div className="reg-section-label">Contact</div>
                        <div className="reg-field full">
                          <label>Email professionnel</label>
                          <div className="reg-input-wrap"><Mail className="reg-field-icon" size={18} />
                            <input className="reg-input" name="email" type="email" placeholder="contact@entreprise.tn" onChange={handleChange} required />
                          </div>
                        </div>
                        <div className="reg-field full">
                          <label>Téléphone</label>
                          <PhoneInput country="tn" value={phone} onChange={setPhone} />
                        </div>
                        <div className="reg-section-label">Sécurité</div>
                        <div className="reg-field">
                          <label>{t('register.password')}</label>
                          <div className="reg-input-wrap"><Lock className="reg-field-icon" size={18} />
                            <input className="reg-input" name="password" type="password" placeholder="••••••••" onChange={handleChange} required />
                          </div>
                        </div>
                        <div className="reg-field">
                          <label>{t('register.confirm')}</label>
                          <div className="reg-input-wrap"><Lock className="reg-field-icon" size={18} />
                            <input className="reg-input" name="confirmPassword" type="password" placeholder="••••••••" onChange={handleChange} required />
                          </div>
                        </div>
                      </>
                    )}

                    <button type="submit" className="reg-btn" disabled={loading}>
                      {loading ? <div className="reg-spin" /> : <>{t('register.submit')} <ArrowRight size={18} /></>}
                    </button>
                  </div>
                </form>
              </>
            )}

            <div className="reg-footer">
              {t('register.hasAccount')}
              <span className="reg-footer-link" onClick={goLogin}>{t('register.goLogin')}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;