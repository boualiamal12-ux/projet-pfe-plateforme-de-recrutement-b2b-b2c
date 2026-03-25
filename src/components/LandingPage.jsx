import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  :root { --bg-dark: #060b13; --primary-cyan: #26c1c9; --primary-cyan-h: #1eaeb5; --white: #ffffff; --text-muted: #94a3b8; --glass: rgba(255,255,255,0.03); --glass-border: rgba(255,255,255,0.08); }
  .lp-wrap { font-family: 'Plus Jakarta Sans', sans-serif; background: var(--bg-dark); color: var(--white); min-height: 100vh; overflow-x: hidden; }
  .lp-nav { display: flex; justify-content: space-between; align-items: center; padding: 0 80px; height: 80px; background: rgba(6,11,19,0.8); backdrop-filter: blur(12px); position: fixed; top: 0; width: 100%; z-index: 1000; border-bottom: 1px solid var(--glass-border); }
  .lp-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; }
  .lp-logo-icon { width: 34px; height: 34px; background: var(--primary-cyan); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--bg-dark); font-weight: 800; }
  .lp-logo-name { font-size: 20px; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
  .lp-nav-actions { display: flex; align-items: center; gap: 16px; }
  .lp-link { color: var(--text-muted); font-size: 14px; font-weight: 500; text-decoration: none; transition: 0.3s; cursor: pointer; }
  .lp-link:hover { color: var(--primary-cyan); }
  .lp-btn-login { background: var(--glass); border: 1px solid var(--glass-border); color: #fff; padding: 10px 20px; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; transition: 0.3s; font-family: inherit; }
  .lp-btn-login:hover { background: var(--glass-border); }
  .lp-hero { padding: 180px 20px 100px; display: flex; flex-direction: column; align-items: center; text-align: center; position: relative; }
  .lp-hero::after { content: ''; position: absolute; top: 20%; left: 50%; transform: translate(-50%,-50%); width: 400px; height: 400px; background: var(--primary-cyan); filter: blur(150px); opacity: 0.15; pointer-events: none; }
  .lp-hero-tag { background: rgba(38,193,201,0.1); color: var(--primary-cyan); padding: 6px 16px; border-radius: 100px; font-size: 12px; font-weight: 700; margin-bottom: 24px; border: 1px solid rgba(38,193,201,0.2); display: inline-flex; align-items: center; gap: 8px; }
  .lp-hero h1 { font-size: clamp(40px,8vw,72px); font-weight: 800; line-height: 1.1; letter-spacing: -2px; margin-bottom: 24px; max-width: 900px; }
  .lp-hero h1 span { background: linear-gradient(90deg,#fff,var(--primary-cyan)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .lp-hero-desc { color: var(--text-muted); font-size: 18px; max-width: 600px; line-height: 1.6; margin-bottom: 48px; }
  .lp-search-box { background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); padding: 8px; border-radius: 20px; display: flex; align-items: center; width: 100%; max-width: 750px; backdrop-filter: blur(10px); }
  .lp-search-input { flex: 1; display: flex; align-items: center; gap: 12px; padding: 12px 20px; }
  .lp-search-input input { background: transparent; border: none; outline: none; color: #fff; width: 100%; font-size: 15px; font-family: inherit; }
  .lp-search-input input::placeholder { color: #4b5563; }
  .lp-btn-search { background: var(--primary-cyan); color: var(--bg-dark); padding: 14px 28px; border-radius: 14px; border: none; font-weight: 700; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap: 8px; font-family: inherit; font-size: 14px; }
  .lp-btn-search:hover { background: var(--primary-cyan-h); transform: scale(1.02); }
  .lp-stats { display: flex; gap: 60px; margin-top: 80px; padding: 40px; border-top: 1px solid var(--glass-border); }
  .lp-stat-item h3 { font-size: 32px; font-weight: 800; margin-bottom: 4px; }
  .lp-stat-item p { color: var(--text-muted); font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
  .lp-features { padding: 100px 80px; background: #0a101a; }
  .lp-feat-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 30px; margin-top: 60px; }
  .lp-feat-card { background: var(--glass); border: 1px solid var(--glass-border); padding: 40px; border-radius: 24px; transition: 0.3s; }
  .lp-feat-card:hover { border-color: var(--primary-cyan); transform: translateY(-10px); background: rgba(38,193,201,0.03); }
  .lp-feat-icon { width: 50px; height: 50px; background: rgba(38,193,201,0.1); color: var(--primary-cyan); border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; }
  .lp-feat-card h4 { font-size: 20px; font-weight: 700; margin-bottom: 12px; }
  .lp-feat-card p { color: var(--text-muted); line-height: 1.6; font-size: 15px; }
  .lp-footer { padding: 60px 80px; border-top: 1px solid var(--glass-border); display: flex; justify-content: space-between; align-items: center; background: var(--bg-dark); }
  @media (max-width: 900px) { .lp-nav { padding: 0 24px; } .lp-features { padding: 80px 24px; } .lp-feat-grid { grid-template-columns: 1fr; } .lp-search-box { flex-direction: column; border-radius: 24px; } .lp-btn-search { width: 100%; justify-content: center; } .lp-stats { flex-direction: column; gap: 30px; align-items: center; } .lp-nav-actions .lp-link { display: none; } }
`;

const LandingPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [keyword, setKeyword] = useState('');

  return (
    <>
      <style>{styles}</style>
      <div className="lp-wrap">
        <nav className="lp-nav">
          <div className="lp-logo">
            <div className="lp-logo-icon">R</div>
            <span className="lp-logo-name">RecruitPro</span>
          </div>
          <div className="lp-nav-actions">
            <a className="lp-link">{t('nav.offers')}</a>
            <a className="lp-link">{t('nav.companies')}</a>
            <button className="lp-btn-login" onClick={() => navigate('/login')}>{t('nav.login')}</button>
            <button className="lp-btn-search" style={{padding:'10px 20px'}} onClick={() => navigate('/register')}>{t('nav.register')}</button>
            <LanguageSwitcher variant="dark" />
          </div>
        </nav>

        <header className="lp-hero">
          <div className="lp-hero-tag"><Zap size={14} /> {t('landing.tag')}</div>
          <h1>{t('landing.heroTitle1')} <span>{t('landing.heroTitle2')}</span></h1>
          <p className="lp-hero-desc">{t('landing.heroDesc')}</p>
          <div className="lp-search-box">
            <div className="lp-search-input">
              <Search size={20} color="#26c1c9" />
              <input placeholder={t('landing.searchJob')} value={keyword} onChange={(e) => setKeyword(e.target.value)} />
            </div>
            <div className="lp-search-input" style={{borderLeft:'1px solid rgba(255,255,255,0.1)'}}>
              <MapPin size={20} color="#94a3b8" />
              <input placeholder={t('landing.searchLoc')} />
            </div>
            <button className="lp-btn-search">{t('landing.searchBtn')} <ArrowRight size={18} /></button>
          </div>
          <div className="lp-stats">
            <div className="lp-stat-item"><h3>12k+</h3><p>{t('landing.statJobs')}</p></div>
            <div className="lp-stat-item"><h3>500+</h3><p>{t('landing.statCompanies')}</p></div>
            <div className="lp-stat-item"><h3>25k</h3><p>{t('landing.statCandidats')}</p></div>
          </div>
        </header>

        <section className="lp-features">
          <div style={{textAlign:'center',marginBottom:'60px'}}>
            <h2 style={{fontSize:'36px',fontWeight:800}}>{t('landing.whyTitle')}</h2>
            <p style={{color:'#94a3b8',marginTop:'10px'}}>{t('landing.whyDesc')}</p>
          </div>
          <div className="lp-feat-grid">
            <div className="lp-feat-card"><div className="lp-feat-icon"><Zap size={24} /></div><h4>{t('landing.feat1Title')}</h4><p>{t('landing.feat1Desc')}</p></div>
            <div className="lp-feat-card"><div className="lp-feat-icon"><ShieldCheck size={24} /></div><h4>{t('landing.feat2Title')}</h4><p>{t('landing.feat2Desc')}</p></div>
            <div className="lp-feat-card"><div className="lp-feat-icon"><Globe size={24} /></div><h4>{t('landing.feat3Title')}</h4><p>{t('landing.feat3Desc')}</p></div>
          </div>
        </section>

        <section style={{padding:'100px 20px',textAlign:'center',background:'linear-gradient(to bottom,#0a101a,#060b13)'}}>
          <h2 style={{fontSize:'42px',fontWeight:800,marginBottom:'20px'}}>{t('landing.ctaTitle')}</h2>
          <p style={{color:'#94a3b8',marginBottom:'40px',fontSize:'18px'}}>{t('landing.ctaDesc')}</p>
          <button className="lp-btn-search" style={{margin:'0 auto',padding:'16px 40px',fontSize:'18px'}} onClick={() => navigate('/register')}>
            {t('landing.ctaBtn')}
          </button>
        </section>

        <footer className="lp-footer">
          <div className="lp-logo"><div className="lp-logo-icon">R</div><span className="lp-logo-name">RecruitPro</span></div>
          <p style={{color:'#4b5563',fontSize:'14px'}}>© 2026 RecruitPro. All rights reserved.</p>
          <div style={{display:'flex',gap:'20px',alignItems:'center'}}>
            <a className="lp-link">Privacy</a>
            <a className="lp-link">Terms</a>
            <LanguageSwitcher variant="dark" />
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;