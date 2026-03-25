import React, { useState, useEffect, useCallback, useRef } from "react";
import api from "../api/axiosConfig";
import {
  Briefcase, MapPin, Search, LogOut, FileText,
  Clock, CheckCircle, Filter, ArrowLeft,
  Upload, Sparkles, User, Edit, Save, X, Plane, Plus, Building2,
  Bell, Eye, Camera
} from "lucide-react";
import { toast } from "react-toastify";
import LanguageSwitcher from "./LanguageSwitcher";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  :root { --bg-dark: #060b13; --cyan: #26c1c9; --bg-main: #f8fafc; --text-dark: #0f172a; --muted: #64748b; }
  .dc-root { display: flex; min-height: 100vh; font-family: 'Plus Jakarta Sans', sans-serif; background: var(--bg-main); }
  .dc-sidebar { width: 260px; background: var(--bg-dark); padding: 32px 20px; display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; }
  .dc-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 40px; }
  .dc-brand-icon { width: 32px; height: 32px; background: var(--cyan); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #060b13; font-weight: 800; font-size: 16px; }
  .dc-brand-name { color: #fff; font-size: 18px; font-weight: 800; }
  .dc-nav { display: flex; align-items: center; gap: 12px; padding: 12px 16px; color: #94a3b8; border-radius: 12px; cursor: pointer; transition: 0.3s; font-size: 14px; font-weight: 500; margin-bottom: 4px; }
  .dc-nav:hover { background: rgba(255,255,255,0.05); color: #fff; }
  .dc-nav.active { background: rgba(38,193,201,0.1); color: var(--cyan); font-weight: 600; }
  .dc-sidebar-bottom { margin-top: auto; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; flex-direction: column; gap: 8px; }
  .dc-main { flex: 1; padding: 40px 50px; overflow-y: auto; }
  .dc-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
  .dc-title { font-size: 28px; font-weight: 800; color: var(--text-dark); letter-spacing: -0.5px; }
  .dc-subtitle { font-size: 14px; color: var(--muted); margin-top: 4px; }
  .dc-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 32px; }
  .dc-stat { background: #fff; padding: 24px; border-radius: 20px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 16px; }
  .dc-stat-icon { width: 48px; height: 48px; border-radius: 12px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; color: var(--cyan); }
  .dc-filters { display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; align-items: center; }
  .dc-filter-btn { padding: 8px 16px; border-radius: 10px; border: 2px solid #e2e8f0; background: #fff; font-size: 13px; font-weight: 600; cursor: pointer; transition: 0.3s; font-family: inherit; color: var(--muted); }
  .dc-filter-btn.active { border-color: var(--cyan); background: rgba(38,193,201,0.08); color: var(--cyan); }
  .dc-search-wrap { position: relative; margin-bottom: 24px; }
  .dc-search-input { width: 100%; padding: 12px 12px 12px 44px; border-radius: 12px; border: 2px solid #e2e8f0; background: #fff; font-family: inherit; font-size: 14px; outline: none; transition: 0.3s; }
  .dc-search-input:focus { border-color: var(--cyan); box-shadow: 0 0 0 3px rgba(38,193,201,0.1); }
  .dc-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
  .dc-card { background: #fff; border-radius: 20px; padding: 24px; border: 2px solid #e2e8f0; cursor: pointer; transition: 0.3s; }
  .dc-card:hover { border-color: var(--cyan); transform: translateY(-2px); box-shadow: 0 12px 30px rgba(38,193,201,0.1); }
  .dc-card-title { font-size: 16px; font-weight: 800; color: var(--text-dark); margin-bottom: 4px; }
  .dc-card-company { font-size: 13px; color: var(--cyan); font-weight: 600; margin-bottom: 4px; }
  .dc-card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
  .dc-card-loc { font-size: 12px; color: var(--muted); }
  .dc-card-tags { display: flex; gap: 8px; flex-wrap: wrap; margin: 12px 0; }
  .dc-tag { padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; }
  .dc-tag-contrat { background: #eff6ff; color: #1e40af; }
  .dc-tag-salaire { background: #fef3c7; color: #d97706; }
  .dc-tag-postes { background: #f5f3ff; color: #7c3aed; }
  .dc-card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; padding-top: 16px; border-top: 1px solid #f1f5f9; }
  .dc-btn-postuler { background: var(--bg-dark); color: #fff; padding: 10px 20px; border-radius: 10px; border: none; font-weight: 700; cursor: pointer; font-size: 13px; font-family: inherit; transition: 0.3s; }
  .dc-btn-postuler:hover { background: var(--cyan); }
  .dc-btn-postuler:disabled { opacity: 0.5; cursor: not-allowed; background: var(--bg-dark); }
  .dc-detail { background: #fff; border-radius: 24px; padding: 40px; border: 1px solid #e2e8f0; }
  .dc-detail-title { font-size: 28px; font-weight: 800; color: var(--text-dark); margin-bottom: 4px; }
  .dc-detail-company { font-size: 16px; color: var(--cyan); font-weight: 700; margin-bottom: 16px; }
  .dc-detail-tags { display: flex; gap: 10px; flex-wrap: wrap; margin: 16px 0; }
  .dc-detail-desc { color: var(--muted); font-size: 15px; line-height: 1.8; white-space: pre-wrap; }
  .dc-similar { margin-top: 40px; }
  .dc-similar-title { font-size: 18px; font-weight: 800; color: var(--text-dark); margin-bottom: 16px; }
  .dc-similar-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .dc-overlay { position: fixed; inset: 0; background: rgba(6,11,19,0.8); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
  .dc-modal { background: #fff; width: 520px; border-radius: 24px; padding: 36px; max-height: 90vh; overflow-y: auto; }
  .dc-modal-title { font-size: 22px; font-weight: 800; color: var(--text-dark); margin-bottom: 8px; }
  .dc-modal-sub { font-size: 14px; color: var(--muted); margin-bottom: 24px; }
  .dc-field { margin-bottom: 16px; }
  .dc-field label { display: block; font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 6px; }
  .dc-field input, .dc-field textarea, .dc-field select { width: 100%; padding: 12px; border-radius: 10px; border: 2px solid #f1f5f9; background: #f8fafc; font-family: inherit; font-size: 14px; outline: none; transition: 0.3s; }
  .dc-field input:focus, .dc-field textarea:focus, .dc-field select:focus { border-color: var(--cyan); background: #fff; }
  .dc-field input:disabled { opacity: 0.6; cursor: not-allowed; background: #f1f5f9; }
  .dc-upload-zone { border: 2px dashed #e2e8f0; border-radius: 12px; padding: 28px; text-align: center; cursor: pointer; transition: 0.3s; background: #f8fafc; }
  .dc-upload-zone:hover, .dc-upload-zone.has-file { border-color: var(--cyan); background: rgba(38,193,201,0.04); }
  .dc-btn-submit { width: 100%; padding: 14px; background: var(--bg-dark); color: #fff; border: none; border-radius: 14px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: inherit; transition: 0.3s; margin-top: 8px; }
  .dc-btn-submit:hover { background: var(--cyan); }
  .dc-cand-list { display: flex; flex-direction: column; gap: 16px; }
  .dc-cand-item { background: #fff; border-radius: 20px; padding: 24px; border: 1px solid #e2e8f0; }
  .dc-status-badge { padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 700; }
  .dc-status-attente { background: #fef3c7; color: #d97706; }
  .dc-status-acceptee { background: #f0fdf4; color: #16a34a; }
  .dc-status-refusee { background: #fee2e2; color: #dc2626; }
  .dc-profil-card { background: #fff; border-radius: 24px; padding: 40px; border: 1px solid #e2e8f0; max-width: 680px; }
  .dc-btn-edit { display: flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 10px; border: 2px solid #e2e8f0; background: #fff; font-family: inherit; font-size: 13px; font-weight: 600; cursor: pointer; transition: 0.3s; color: var(--muted); }
  .dc-btn-edit:hover { border-color: var(--cyan); color: var(--cyan); }
  .dc-btn-save { display: flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 10px; border: none; background: var(--bg-dark); color: #fff; font-family: inherit; font-size: 13px; font-weight: 700; cursor: pointer; transition: 0.3s; }
  .dc-btn-save:hover { background: var(--cyan); }
  .dc-visa-list { display: flex; flex-direction: column; gap: 16px; }
  .dc-visa-item { background: #fff; border-radius: 16px; padding: 20px 24px; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; }
  .dc-visa-badge-encours { background: #eff6ff; color: #2563eb; padding: 5px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; }
  .dc-visa-badge-approuve { background: #f0fdf4; color: #16a34a; padding: 5px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; }
  .dc-visa-badge-refuse { background: #fee2e2; color: #dc2626; padding: 5px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; }
  .dc-visa-badge-docs { background: #fef3c7; color: #d97706; padding: 5px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; }
  .dc-visa-badge-soumis { background: #f5f3ff; color: #7c3aed; padding: 5px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; }
  .dc-doc-upload-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #f8fafc; border-radius: 12px; border: 1.5px solid #e2e8f0; margin-bottom: 10px; }
  .dc-map-section { margin-top: 32px; border-top: 2px solid #f1f5f9; padding-top: 28px; }
  .dc-map-section h3 { font-size: 16px; font-weight: 800; color: var(--text-dark); margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
  .dc-map-container { width: 100%; height: 300px; border-radius: 16px; overflow: hidden; border: 2px solid #e2e8f0; }
  .dc-map-loading { width: 100%; height: 300px; border-radius: 16px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; color: var(--muted); font-size: 14px; font-weight: 600; gap: 8px; }
  .dc-map-notfound { width: 100%; height: 120px; border-radius: 16px; background: #f8fafc; border: 2px dashed #e2e8f0; display: flex; align-items: center; justify-content: center; color: var(--muted); font-size: 13px; gap: 8px; }
  .dc-map-company-banner { display: flex; align-items: center; gap: 12px; background: #f0fdfc; border: 1.5px solid #99f6e4; border-radius: 12px; padding: 12px 16px; margin-bottom: 12px; }
  .dc-map-company-name { font-size: 15px; font-weight: 800; color: var(--text-dark); }
  .dc-map-company-loc { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .dc-map-address { margin-top: 10px; display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--muted); }
  .dc-map-address a { color: var(--cyan); font-weight: 600; text-decoration: none; }
  .dc-notif-btn { position: relative; background: #fff; border: 2px solid #e2e8f0; border-radius: 12px; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.3s; }
  .dc-notif-btn:hover { border-color: var(--cyan); }
  .dc-notif-dot { position: absolute; top: -4px; right: -4px; width: 18px; height: 18px; background: #ef4444; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; color: #fff; border: 2px solid #fff; }
  .dc-notif-panel { position: absolute; top: 56px; right: 0; width: 340px; background: #fff; border-radius: 20px; border: 1px solid #e2e8f0; box-shadow: 0 20px 60px rgba(0,0,0,0.12); z-index: 500; overflow: hidden; }
  .dc-notif-header { padding: 16px 20px; border-bottom: 1px solid #f1f5f9; font-weight: 800; font-size: 14px; display: flex; justify-content: space-between; align-items: center; }
  .dc-notif-item { padding: 14px 20px; border-bottom: 1px solid #f8fafc; display: flex; gap: 12px; align-items: flex-start; cursor: pointer; transition: 0.2s; }
  .dc-notif-item:hover { background: #f8fafc; }
  .dc-notif-item.unread { background: #f0fdfc; }
  .dc-photo-wrap { position: relative; width: 90px; height: 90px; margin-bottom: 28px; }
  .dc-photo-img { width: 90px; height: 90px; border-radius: 22px; object-fit: cover; border: 3px solid #e2e8f0; }
  .dc-photo-avatar { width: 90px; height: 90px; border-radius: 22px; background: linear-gradient(135deg, var(--cyan), #0891b2); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 32px; font-weight: 800; }
  .dc-photo-btn { position: absolute; bottom: -8px; right: -8px; width: 32px; height: 32px; background: var(--bg-dark); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 2px solid #fff; transition: 0.3s; }
  .dc-photo-btn:hover { background: var(--cyan); }
  .dc-photo-hover-card { position: absolute; top: 50%; left: 105px; transform: translateY(-50%) translateX(-8px); background: white; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.15); padding: 14px 18px; display: flex; align-items: center; gap: 12px; white-space: nowrap; z-index: 100; opacity: 0; pointer-events: none; transition: opacity 0.25s ease, transform 0.25s ease; border: 1px solid #e2e8f0; }
  .dc-photo-wrap:hover .dc-photo-hover-card { opacity: 1; transform: translateY(-50%) translateX(0); }
  .dc-hover-img { width: 52px; height: 52px; border-radius: 14px; object-fit: cover; border: 2.5px solid #26c1c9; flex-shrink: 0; }
  .dc-hover-avatar { width: 52px; height: 52px; border-radius: 14px; background: linear-gradient(135deg, #26c1c9, #0891b2); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 20px; font-weight: 800; flex-shrink: 0; border: 2.5px solid #26c1c9; }
  .dc-hover-name { font-size: 14px; font-weight: 800; color: #0f172a; }
  .dc-hover-role { font-size: 11px; color: #26c1c9; font-weight: 700; margin-top: 3px; }
  .dc-progress-steps { display: flex; align-items: center; margin-top: 16px; }
  .dc-step { display: flex; flex-direction: column; align-items: center; flex: 1; position: relative; }
  .dc-step-circle { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; z-index: 1; }
  .dc-step-done { background: #16a34a; color: #fff; }
  .dc-step-active { background: var(--cyan); color: #fff; }
  .dc-step-pending { background: #f1f5f9; color: #94a3b8; }
  .dc-step-label { font-size: 10px; font-weight: 700; margin-top: 6px; text-align: center; }
  .dc-step-line { position: absolute; top: 14px; left: 50%; width: 100%; height: 2px; z-index: 0; }
  .dc-step-line-done { background: #16a34a; }
  .dc-step-line-pending { background: #e2e8f0; }
  .dc-cv-viewer { width: 100%; height: 500px; border-radius: 12px; border: 2px solid #e2e8f0; }
  @keyframes dc-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @media (max-width: 950px) { .dc-sidebar { display: none; } .dc-grid { grid-template-columns: 1fr; } }
`;

const CONTRATS = ["Tous", "CDI", "CDD", "STAGE", "FREELANCE"];
const logoCache = {};

function useEntrepriseLogo(entrepriseId) {
  const [logoUrl, setLogoUrl] = useState(null);
  useEffect(() => {
    if (!entrepriseId) return;
    if (logoCache[entrepriseId] !== undefined) { setLogoUrl(logoCache[entrepriseId]); return; }
    const url = `http://localhost:8081/api/entreprises/${entrepriseId}/logo/view`;
    fetch(url).then(res => {
      if (res.ok) { logoCache[entrepriseId] = url; setLogoUrl(url); }
      else { logoCache[entrepriseId] = null; setLogoUrl(null); }
    }).catch(() => { logoCache[entrepriseId] = null; });
  }, [entrepriseId]);
  return logoUrl;
}

function EntrepriseAvatar({ entrepriseId, nomEntreprise, size = 42 }) {
  const logoUrl = useEntrepriseLogo(entrepriseId);
  if (logoUrl) return <img src={logoUrl} alt={nomEntreprise} style={{ width: size, height: size, borderRadius: "10px", objectFit: "cover", border: "1.5px solid #e2e8f0", flexShrink: 0 }} />;
  if (nomEntreprise) return <div style={{ width: size, height: size, borderRadius: "10px", background: "linear-gradient(135deg, #26c1c9, #0891b2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: size * 0.38, fontWeight: 800, flexShrink: 0 }}>{nomEntreprise[0].toUpperCase()}</div>;
  return <div style={{ width: size, height: size, borderRadius: "10px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Building2 size={size * 0.42} color="#94a3b8" /></div>;
}

function OffreMap({ localisation, nomEntreprise }) {
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState("loading");
  useEffect(() => {
    if (!localisation) { setStatus("notfound"); return; }
    setStatus("loading"); setCoords(null);
    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(localisation)}&format=json&limit=1`, { headers: { "Accept-Language": "fr" } })
      .then(r => r.json()).then(data => {
        if (!data || data.length === 0) { setStatus("notfound"); return; }
        setCoords({ lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) });
        setStatus("found");
      }).catch(() => setStatus("notfound"));
  }, [localisation]);
  if (!localisation) return null;
  const iframeSrc = coords ? `https://www.openstreetmap.org/export/embed.html?bbox=${coords.lon-0.02},${coords.lat-0.015},${coords.lon+0.02},${coords.lat+0.015}&layer=mapnik&marker=${coords.lat},${coords.lon}` : null;
  return (
    <div className="dc-map-section">
      <h3><MapPin size={16} color="#26c1c9" /> Localisation de l'entreprise</h3>
      {status==="loading" && <div className="dc-map-loading"><span style={{animation:"dc-spin 1s linear infinite",display:"inline-block"}}>⟳</span>&nbsp;Chargement...</div>}
      {status==="notfound" && <div className="dc-map-notfound"><MapPin size={18}/> Localisation introuvable</div>}
      {status==="found" && iframeSrc && (<>
        <div className="dc-map-company-banner">
          <div style={{width:40,height:40,borderRadius:10,background:"linear-gradient(135deg,#26c1c9,#0891b2)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:16,flexShrink:0}}>{nomEntreprise?nomEntreprise[0].toUpperCase():"🏢"}</div>
          <div><div className="dc-map-company-name">{nomEntreprise||"Entreprise"}</div><div className="dc-map-company-loc"><MapPin size={11} style={{verticalAlign:"middle"}}/> {localisation}</div></div>
        </div>
        <div className="dc-map-container"><iframe title={`Carte ${localisation}`} src={iframeSrc} width="100%" height="300" style={{border:"none",display:"block"}} loading="lazy" allowFullScreen/></div>
        <div className="dc-map-address"><MapPin size={14}/><span>{localisation}</span><span>·</span><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(localisation)}`} target="_blank" rel="noopener noreferrer">Ouvrir dans Google Maps →</a></div>
      </>)}
    </div>
  );
}

function VisaBadge({ statut }) {
  const map = {
    EN_COURS: <span className="dc-visa-badge-encours">⏱ En cours</span>,
    DOCUMENTS_REQUIS: <span className="dc-visa-badge-docs">📄 Docs requis</span>,
    SOUMIS: <span className="dc-visa-badge-soumis">📨 Soumis</span>,
    APPROUVE: <span className="dc-visa-badge-approuve">✅ Approuvé</span>,
    REFUSE: <span className="dc-visa-badge-refuse">❌ Refusé</span>,
  };
  return map[statut] || map.EN_COURS;
}

function ProgressTracker({ statut }) {
  const steps = [
    { key: "EN_ATTENTE", label: "Envoyée",  icon: "📤" },
    { key: "EN_COURS",   label: "En cours", icon: "🔍" },
    { key: "ACCEPTEE",   label: "Acceptée", icon: "✅" },
  ];
  const refusee = statut === "REFUSEE";
  const currentIdx = refusee ? -1 : steps.findIndex(s => s.key === statut);
  const activeIdx = currentIdx === -1 ? 0 : currentIdx;
  if (refusee) return (
    <div style={{marginTop:14,background:"#fee2e2",borderRadius:12,padding:"12px 16px",display:"flex",alignItems:"center",gap:8}}>
      <span style={{fontSize:18}}>❌</span>
      <span style={{fontSize:13,fontWeight:700,color:"#dc2626"}}>Candidature refusée</span>
    </div>
  );
  return (
    <div className="dc-progress-steps">
      {steps.map((step, i) => {
        const isDone = i < activeIdx, isActive = i === activeIdx;
        return (
          <div key={step.key} className="dc-step">
            {i < steps.length-1 && <div className={`dc-step-line ${isDone?"dc-step-line-done":"dc-step-line-pending"}`}/>}
            <div className={`dc-step-circle ${isDone?"dc-step-done":isActive?"dc-step-active":"dc-step-pending"}`}>{isDone?"✓":step.icon}</div>
            <span className="dc-step-label" style={{color:isActive?"var(--cyan)":isDone?"#16a34a":"var(--muted)"}}>{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function DashboardCandidat({ onLogout }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [view, setView] = useState("offres");
  const [offres, setOffres] = useState([]);
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [mesCandidatures, setMesCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filtreContrat, setFiltreContrat] = useState("Tous");
  const [showModal, setShowModal] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [lettre, setLettre] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [dejaCandidature, setDejaCandidature] = useState(new Set());
  const [editMode, setEditMode] = useState(false);
  const [profilForm, setProfilForm] = useState({ prenom:"", nom:"", telephone:"", ville:"", nationalite:"", linkedin:"" });
  const [mesVisas, setMesVisas] = useState([]);
  const [showVisaModal, setShowVisaModal] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [selectedVisa, setSelectedVisa] = useState(null);
  const [visaDocs, setVisaDocs] = useState([]);
  const [visaForm, setVisaForm] = useState({ pays:"", typeVisa:"Visa Travail", dateDebut:"" });
  const [submittingVisa, setSubmittingVisa] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showCvModal, setShowCvModal] = useState(false);
  const [cvViewUrl, setCvViewUrl] = useState(null);
  const photoInputRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handler = e => { if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchOffres = useCallback(async () => {
    try { setLoading(true); const res = await api.get("/offres/ouvertes"); setOffres(res.data); }
    catch { toast.error("Erreur chargement offres"); }
    finally { setLoading(false); }
  }, []);

  const fetchMesCandidatures = useCallback(async () => {
    try {
      const res = await api.get(`/candidatures/candidat/${user.id}`);
      setMesCandidatures(res.data);
      setDejaCandidature(new Set(res.data.map(c => c.offreId)));
      const key = `notifs_seen_${user.id}`;
      const seen = JSON.parse(localStorage.getItem(key) || "[]");
      const newNotifs = res.data
        .filter(c => c.statut === "ACCEPTEE" && !seen.includes(c.id))
        .map(c => ({ id: c.id, message: "🎉 Candidature acceptée !", sub: `Offre #${c.offreId}`, read: false }));
      setNotifications(newNotifs);
    } catch {}
  }, [user?.id]);

  // ✅ fetchProfil corrigé — utilise les champs plats du Map
  const fetchProfil = useCallback(async () => {
    try {
      const res = await api.get(`/candidats/${user.id}`);
      const d = res.data || {};
      setProfilForm({
        prenom:      d.prenom      || "",
        nom:         d.nom         || "",
        telephone:   d.telephone   || "",
        ville:       d.ville       || "",
        nationalite: d.nationalite || "",
        linkedin:    d.linkedin    || "",
      });
      if (d.photoUrl) {
        setPhotoUrl(`http://localhost:8081/api/candidats/${user.id}/photo?t=${Date.now()}`);
      }
    } catch {}
  }, [user?.id]);

  const fetchMesVisas = useCallback(async () => {
    try { const res = await api.get(`/visa/candidat/${user.id}`); setMesVisas(res.data); } catch {}
  }, [user?.id]);

  useEffect(() => { fetchOffres(); fetchMesCandidatures(); fetchProfil(); fetchMesVisas(); }, [fetchOffres, fetchMesCandidatures, fetchProfil, fetchMesVisas]);

  const handlePhotoChange = async e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
    const fd = new FormData(); fd.append("file", file);
    try {
      await api.post(`/candidats/${user.id}/photo`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("✅ Photo mise à jour !");
      setPhotoUrl(`http://localhost:8081/api/candidats/${user.id}/photo?t=${Date.now()}`);
    } catch { toast.error("Erreur upload photo"); }
  };

  const handleMarkAllRead = () => {
    const key = `notifs_seen_${user.id}`;
    localStorage.setItem(key, JSON.stringify(notifications.map(n => n.id)));
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handlePostuler = async e => {
    e.preventDefault();
    if (!cvFile) { toast.error("Veuillez uploader votre CV !"); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("candidatId", user.id); fd.append("offreId", selectedOffre.id); fd.append("cv", cvFile);
      if (lettre) fd.append("lettreMotivation", lettre);
      await api.post("/candidatures", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Candidature envoyée !");
      setShowModal(false); setCvFile(null); setLettre("");
      fetchMesCandidatures();
    } catch (err) { toast.error(err.response?.data?.error || "Erreur candidature"); }
    finally { setSubmitting(false); }
  };

  // ✅ handleSaveProfil corrigé — envoie Map<String,String>
  const handleSaveProfil = async () => {
    try {
      const res = await api.put(`/candidats/${user.id}`, profilForm);
      const d = res.data || {};
      setProfilForm({
        prenom:      d.prenom      || "",
        nom:         d.nom         || "",
        telephone:   d.telephone   || "",
        ville:       d.ville       || "",
        nationalite: d.nationalite || "",
        linkedin:    d.linkedin    || "",
      });
      setEditMode(false);
      toast.success("✅ Profil mis à jour !");
    } catch { toast.error("Erreur mise à jour profil"); }
  };

  const handleCreerVisa = async e => {
    e.preventDefault(); setSubmittingVisa(true);
    try {
      await api.post("/visa", { ...visaForm, candidatId: user.id, candidatNom: `${profilForm.prenom} ${profilForm.nom}`.trim() || user.email });
      toast.success("✅ Demande de visa créée !");
      setShowVisaModal(false); setVisaForm({ pays:"", typeVisa:"Visa Travail", dateDebut:"" });
      fetchMesVisas();
    } catch { toast.error("Erreur création demande visa"); }
    finally { setSubmittingVisa(false); }
  };

  const handleVoirDocs = async visa => {
    setSelectedVisa(visa);
    try { const res = await api.get(`/visa/${visa.id}`); setVisaDocs(res.data.documents || []); }
    catch { setVisaDocs([]); }
    setShowDocsModal(true);
  };

  const handleUploadDoc = async (docId, file) => {
    try {
      const fd = new FormData(); fd.append("file", file); fd.append("statut", "FOURNI");
      await api.put(`/visa/documents/${docId}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("✅ Document uploadé !");
      if (selectedVisa) handleVoirDocs(selectedVisa);
    } catch {
      try {
        await api.put(`/visa/documents/${docId}`, { statut: "FOURNI", fichierUrl: file.name });
        toast.success("✅ Document marqué comme fourni !");
        if (selectedVisa) handleVoirDocs(selectedVisa);
      } catch { toast.error("Erreur upload document"); }
    }
  };

  const getStatutBadge = statut => {
    const map = {
      EN_ATTENTE: { label: "En attente ⏳", cls: "dc-status-attente" },
      ACCEPTEE:   { label: "Acceptée ✅",   cls: "dc-status-acceptee" },
      REFUSEE:    { label: "Refusée ❌",    cls: "dc-status-refusee" },
    };
    const s = map[statut] || map.EN_ATTENTE;
    return <span className={`dc-status-badge ${s.cls}`}>{s.label}</span>;
  };

  const offresFiltrees = offres.filter(o => {
    const ms = o.titre.toLowerCase().includes(search.toLowerCase()) || o.localisation.toLowerCase().includes(search.toLowerCase());
    const mc = filtreContrat === "Tous" || o.typeContrat === filtreContrat;
    return ms && mc;
  });
  const offresSimilaires = selectedOffre ? offres.filter(o => o.id !== selectedOffre.id && o.typeContrat === selectedOffre.typeContrat).slice(0, 4) : [];
  // ✅ Affiche prénom+nom si disponibles, sinon email
  const prenomNom = [profilForm.prenom, profilForm.nom].filter(Boolean).join(" ");
  const nomAffiche = prenomNom || user?.email || "";
  const initiales  = prenomNom
    ? prenomNom.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || "?";
  const currentPhoto = photoPreview || photoUrl;
  const unreadCount  = notifications.filter(n => !n.read).length;

  return (
    <>
      <style>{styles}</style>
      <div className="dc-root">

        {/* SIDEBAR */}
        <aside className="dc-sidebar">
          <div className="dc-brand"><div className="dc-brand-icon">R</div><span className="dc-brand-name">RecruitPro</span></div>
          <nav style={{flex:1}}>
            <div className={`dc-nav ${view==="offres"||view==="detail"?"active":""}`} onClick={()=>setView("offres")}><Briefcase size={18}/> Offres d'emploi</div>
            <div className={`dc-nav ${view==="candidatures"?"active":""}`} onClick={()=>setView("candidatures")}>
              <FileText size={18}/> Mes candidatures
              {mesCandidatures.length>0&&<span style={{marginLeft:"auto",background:"var(--cyan)",color:"#060b13",borderRadius:20,padding:"2px 8px",fontSize:11,fontWeight:800}}>{mesCandidatures.length}</span>}
            </div>
            <div className={`dc-nav ${view==="visas"?"active":""}`} onClick={()=>setView("visas")}>
              <Plane size={18}/> Mes visas
              {mesVisas.length>0&&<span style={{marginLeft:"auto",background:"var(--cyan)",color:"#060b13",borderRadius:20,padding:"2px 8px",fontSize:11,fontWeight:800}}>{mesVisas.length}</span>}
            </div>
            <div className={`dc-nav ${view==="profil"?"active":""}`} onClick={()=>setView("profil")}><User size={18}/> Mon profil</div>
          </nav>
          <div className="dc-sidebar-bottom">
            <LanguageSwitcher variant="dark"/>
            <div className="dc-nav" onClick={onLogout} style={{color:"#f87171"}}><LogOut size={18}/> Déconnexion</div>
          </div>
        </aside>

        <main className="dc-main">

          {/* ── OFFRES ── */}
          {view==="offres"&&(<>
            <header className="dc-header">
              <div><h1 className="dc-title">Bienvenue, {nomAffiche} 👋</h1><p className="dc-subtitle">Trouvez votre prochain emploi</p></div>
              <div style={{position:"relative"}} ref={notifRef}>
                <button className="dc-notif-btn" onClick={()=>setShowNotifs(v=>!v)}>
                  <Bell size={20} color="#64748b"/>
                  {unreadCount>0&&<span className="dc-notif-dot">{unreadCount}</span>}
                </button>
                {showNotifs&&(
                  <div className="dc-notif-panel">
                    <div className="dc-notif-header">
                      <span>Notifications</span>
                      {unreadCount>0&&<button onClick={handleMarkAllRead} style={{fontSize:11,color:"var(--cyan)",background:"none",border:"none",cursor:"pointer",fontWeight:700}}>Tout marquer lu</button>}
                    </div>
                    {notifications.length===0
                      ?<div style={{padding:24,textAlign:"center",color:"var(--muted)",fontSize:13}}>Aucune notification</div>
                      :notifications.map(n=>(
                        <div key={n.id} className={`dc-notif-item ${!n.read?"unread":""}`} onClick={()=>{setView("candidatures");setShowNotifs(false);}}>
                          <div style={{width:36,height:36,background:"#f0fdf4",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>🎉</div>
                          <div><div style={{fontSize:13,fontWeight:700}}>{n.message}</div><div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>{n.sub}</div></div>
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>
            </header>
            <div className="dc-stats">
              <div className="dc-stat"><div className="dc-stat-icon"><Briefcase size={20}/></div><div><h3 style={{fontSize:24,fontWeight:800}}>{offres.length}</h3><p style={{fontSize:12,color:"var(--muted)",fontWeight:700}}>Offres disponibles</p></div></div>
              <div className="dc-stat"><div className="dc-stat-icon" style={{background:"#f0fdf4",color:"#16a34a"}}><FileText size={20}/></div><div><h3 style={{fontSize:24,fontWeight:800,color:"#16a34a"}}>{mesCandidatures.length}</h3><p style={{fontSize:12,color:"var(--muted)",fontWeight:700}}>Mes candidatures</p></div></div>
              <div className="dc-stat"><div className="dc-stat-icon" style={{background:"#fef3c7",color:"#d97706"}}><Clock size={20}/></div><div><h3 style={{fontSize:24,fontWeight:800,color:"#d97706"}}>{mesCandidatures.filter(c=>c.statut==="EN_ATTENTE").length}</h3><p style={{fontSize:12,color:"var(--muted)",fontWeight:700}}>En attente</p></div></div>
            </div>
            <div className="dc-search-wrap">
              <Search size={18} style={{position:"absolute",left:14,top:13,color:"#94a3b8"}}/>
              <input className="dc-search-input" placeholder="Rechercher par titre, ville..." value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            <div className="dc-filters">
              <Filter size={16} style={{color:"var(--muted)"}}/>
              {CONTRATS.map(c=><button key={c} className={`dc-filter-btn ${filtreContrat===c?"active":""}`} onClick={()=>setFiltreContrat(c)}>{c}</button>)}
            </div>
            {loading?<div style={{textAlign:"center",padding:60,color:"var(--muted)"}}>Chargement...</div>
            :offresFiltrees.length===0?<div style={{textAlign:"center",padding:60,color:"var(--muted)"}}><Sparkles size={40} style={{marginBottom:12,opacity:0.3}}/><p>Aucune offre trouvée</p></div>
            :<div className="dc-grid">
              {offresFiltrees.map(o=>(
                <div key={o.id} className="dc-card" onClick={()=>{setSelectedOffre(o);setView("detail");}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <div className="dc-card-header">
                      <EntrepriseAvatar entrepriseId={o.entrepriseId} nomEntreprise={o.nomEntreprise} size={42}/>
                      <div>
                        <div className="dc-card-title">{o.titre}</div>
                        {o.nomEntreprise&&<div className="dc-card-company">🏢 {o.nomEntreprise}</div>}
                        <div className="dc-card-loc"><MapPin size={11} style={{verticalAlign:"middle"}}/> {o.localisation}</div>
                      </div>
                    </div>
                    {dejaCandidature.has(o.id)&&<span style={{background:"#f0fdf4",color:"#16a34a",fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:8,flexShrink:0}}>✅ Postulé</span>}
                  </div>
                  <div className="dc-card-tags">
                    <span className="dc-tag dc-tag-contrat">{o.typeContrat}</span>
                    {o.nombrePostes&&<span className="dc-tag dc-tag-postes">👥 {o.nombrePostes} poste(s)</span>}
                    {o.salaireMin&&o.salaireMax&&<span className="dc-tag dc-tag-salaire">💰 {o.salaireMin}–{o.salaireMax} DT</span>}
                    {o.dateExpiration&&<span className="dc-tag" style={{background:"#f1f5f9",color:"#64748b"}}>⏰ {new Date(o.dateExpiration).toLocaleDateString('fr-FR')}</span>}
                  </div>
                  <div className="dc-card-footer">
                    <span style={{fontSize:12,color:"var(--muted)"}}>Voir détails →</span>
                    <button className="dc-btn-postuler" disabled={dejaCandidature.has(o.id)} onClick={e=>{e.stopPropagation();setSelectedOffre(o);setShowModal(true);}}>
                      {dejaCandidature.has(o.id)?"Postulé ✅":"Postuler"}
                    </button>
                  </div>
                </div>
              ))}
            </div>}
          </>)}

          {/* ── DETAIL ── */}
          {view==="detail"&&selectedOffre&&(<>
            <button onClick={()=>setView("offres")} style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"none",cursor:"pointer",color:"var(--muted)",fontWeight:600,marginBottom:24,fontFamily:"inherit"}}>
              <ArrowLeft size={18}/> Retour
            </button>
            <div className="dc-detail">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,paddingBottom:24,borderBottom:"2px solid #f1f5f9"}}>
                <div style={{display:"flex",gap:20,alignItems:"flex-start"}}>
                  <EntrepriseAvatar entrepriseId={selectedOffre.entrepriseId} nomEntreprise={selectedOffre.nomEntreprise} size={64}/>
                  <div>
                    <h1 className="dc-detail-title">{selectedOffre.titre}</h1>
                    <div className="dc-detail-company">🏢 {selectedOffre.nomEntreprise||"Entreprise"}</div>
                    <div className="dc-detail-tags">
                      <span className="dc-tag dc-tag-contrat" style={{fontSize:13,padding:"6px 14px"}}>{selectedOffre.typeContrat}</span>
                      <span className="dc-tag" style={{background:"#f0fdf4",color:"#16a34a",fontSize:13,padding:"6px 14px"}}><MapPin size={12} style={{verticalAlign:"middle"}}/> {selectedOffre.localisation}</span>
                      {selectedOffre.nombrePostes&&<span className="dc-tag dc-tag-postes" style={{fontSize:13,padding:"6px 14px"}}>👥 {selectedOffre.nombrePostes} poste(s)</span>}
                      {selectedOffre.salaireMin&&selectedOffre.salaireMax&&<span className="dc-tag dc-tag-salaire" style={{fontSize:13,padding:"6px 14px"}}>💰 {selectedOffre.salaireMin} – {selectedOffre.salaireMax} DT</span>}
                    </div>
                  </div>
                </div>
                <button className="dc-btn-postuler" disabled={dejaCandidature.has(selectedOffre.id)} onClick={()=>setShowModal(true)} style={{padding:"12px 28px",fontSize:14}}>
                  {dejaCandidature.has(selectedOffre.id)?"Déjà postulé ✅":"Postuler →"}
                </button>
              </div>
              <h3 style={{fontWeight:800,marginBottom:12}}>Description</h3>
              <p className="dc-detail-desc">{selectedOffre.description||"Aucune description."}</p>
              <OffreMap localisation={selectedOffre.localisation} nomEntreprise={selectedOffre.nomEntreprise}/>
              {offresSimilaires.length>0&&(
                <div className="dc-similar">
                  <h3 className="dc-similar-title">Offres similaires</h3>
                  <div className="dc-similar-grid">
                    {offresSimilaires.map(o=>(
                      <div key={o.id} className="dc-card" onClick={()=>setSelectedOffre(o)} style={{padding:16}}>
                        <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
                          <EntrepriseAvatar entrepriseId={o.entrepriseId} nomEntreprise={o.nomEntreprise} size={32}/>
                          <div>
                            <div className="dc-card-title" style={{fontSize:14}}>{o.titre}</div>
                            {o.nomEntreprise&&<div className="dc-card-company" style={{fontSize:12}}>{o.nomEntreprise}</div>}
                          </div>
                        </div>
                        <div className="dc-card-loc"><MapPin size={11} style={{verticalAlign:"middle"}}/> {o.localisation}</div>
                        <div className="dc-card-tags" style={{marginTop:8}}><span className="dc-tag dc-tag-contrat">{o.typeContrat}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>)}

          {/* ── CANDIDATURES ── */}
          {view==="candidatures"&&(<>
            <header className="dc-header">
              <div><h1 className="dc-title">Mes candidatures 📋</h1><p className="dc-subtitle">{mesCandidatures.length} candidature(s)</p></div>
            </header>
            {mesCandidatures.length===0
              ?<div style={{textAlign:"center",padding:80,color:"var(--muted)"}}>
                <FileText size={48} style={{opacity:0.2,marginBottom:16}}/><p style={{fontWeight:600}}>Aucune candidature</p>
                <button onClick={()=>setView("offres")} className="dc-btn-postuler" style={{marginTop:20}}>Voir les offres →</button>
              </div>
              :<div className="dc-cand-list">
                {mesCandidatures.map(c=>{
                  const offre=offres.find(o=>o.id===c.offreId);
                  return (
                    <div key={c.id} className="dc-cand-item">
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                        <div style={{display:"flex",alignItems:"center",gap:16}}>
                          <EntrepriseAvatar entrepriseId={offre?.entrepriseId} nomEntreprise={offre?.nomEntreprise} size={44}/>
                          <div>
                            <div style={{fontWeight:700,fontSize:15}}>{offre?.titre||"Offre #"+c.offreId}</div>
                            {offre?.nomEntreprise&&<div style={{fontSize:12,color:"var(--cyan)",fontWeight:600,marginTop:2}}>{offre.nomEntreprise}</div>}
                            <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>Envoyée le {new Date(c.dateEnvoi).toLocaleDateString('fr-FR')}</div>
                          </div>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          {getStatutBadge(c.statut)}
                          {c.cvId&&(
                            <button onClick={()=>{setCvViewUrl(`http://localhost:8081/api/candidatures/${c.id}/cv`);setShowCvModal(true);}}
                              style={{border:"none",background:"#eff6ff",color:"#1e40af",cursor:"pointer",padding:"6px 12px",borderRadius:8,fontWeight:700,fontSize:12,display:"flex",alignItems:"center",gap:4}}>
                              <Eye size={13}/> CV
                            </button>
                          )}
                        </div>
                      </div>
                      {/* ✅ Tracker seulement — pas de score */}
                      <ProgressTracker statut={c.statut}/>
                    </div>
                  );
                })}
              </div>
            }
          </>)}

          {/* ── VISAS ── */}
          {view==="visas"&&(<>
            <header className="dc-header">
              <div><h1 className="dc-title">Mes visas ✈️</h1><p className="dc-subtitle">{mesVisas.length} demande(s)</p></div>
              <button onClick={()=>setShowVisaModal(true)} style={{background:"var(--bg-dark)",color:"#fff",padding:"11px 20px",borderRadius:12,border:"none",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:8,fontFamily:"inherit",fontSize:13}}>
                <Plus size={18}/> Nouvelle demande
              </button>
            </header>
            {mesVisas.length===0
              ?<div style={{textAlign:"center",padding:80,color:"var(--muted)"}}>
                <Plane size={48} style={{opacity:0.2,marginBottom:16}}/><p style={{fontWeight:600}}>Aucune demande de visa</p>
                <button onClick={()=>setShowVisaModal(true)} style={{marginTop:20,background:"var(--bg-dark)",color:"#fff",padding:"10px 24px",borderRadius:10,border:"none",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Créer une demande →</button>
              </div>
              :<div className="dc-visa-list">
                {mesVisas.map(v=>(
                  <div key={v.id} className="dc-visa-item">
                    <div style={{display:"flex",alignItems:"center",gap:16}}>
                      <div style={{width:44,height:44,background:"#eff6ff",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center"}}><Plane size={18} color="#2563eb"/></div>
                      <div><div style={{fontWeight:700}}>{v.typeVisa} — {v.pays}</div><div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>Créée le {v.dateCreation||"—"}</div></div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <VisaBadge statut={v.statut}/>
                      <button onClick={()=>handleVoirDocs(v)} style={{border:"none",background:"#f0fdf4",color:"#16a34a",cursor:"pointer",padding:"7px 14px",borderRadius:8,fontWeight:700,fontSize:12}}>📄 Documents</button>
                    </div>
                  </div>
                ))}
              </div>
            }
          </>)}

          {/* ── PROFIL ── */}
          {view==="profil"&&(<>
            <header className="dc-header">
              <div><h1 className="dc-title">Mon profil 👤</h1><p className="dc-subtitle">Gérez vos informations personnelles</p></div>
              <div style={{display:"flex",gap:10}}>
                {editMode
                  ?<><button className="dc-btn-save" onClick={handleSaveProfil}><Save size={16}/> Sauvegarder</button><button className="dc-btn-edit" onClick={()=>{setEditMode(false);fetchProfil();}}><X size={16}/> Annuler</button></>
                  :<button className="dc-btn-edit" onClick={()=>setEditMode(true)}><Edit size={16}/> Modifier</button>
                }
              </div>
            </header>
            <div className="dc-profil-card">
              <input ref={photoInputRef} type="file" accept="image/*" style={{display:"none"}} onChange={handlePhotoChange}/>
              {/* ✅ Photo avec hover card */}
              <div className="dc-photo-wrap">
                {currentPhoto?<img src={currentPhoto} alt="Photo" className="dc-photo-img"/>:<div className="dc-photo-avatar">{initiales}</div>}
                <div className="dc-photo-btn" onClick={()=>photoInputRef.current?.click()} title="Changer la photo"><Camera size={14} color="#fff"/></div>
                <div className="dc-photo-hover-card">
                  {currentPhoto?<img src={currentPhoto} alt="Photo" className="dc-hover-img"/>:<div className="dc-hover-avatar">{initiales}</div>}
                  <div><div className="dc-hover-name">{nomAffiche}</div><div className="dc-hover-role">Candidat</div></div>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                <div className="dc-field"><label>Prénom</label><input value={profilForm.prenom} disabled={!editMode} placeholder="Votre prénom" onChange={e=>setProfilForm({...profilForm,prenom:e.target.value})}/></div>
                <div className="dc-field"><label>Nom</label><input value={profilForm.nom} disabled={!editMode} placeholder="Votre nom" onChange={e=>setProfilForm({...profilForm,nom:e.target.value})}/></div>
                <div className="dc-field"><label>Téléphone</label><input value={profilForm.telephone} disabled={!editMode} placeholder="+216 XX XXX XXX" onChange={e=>setProfilForm({...profilForm,telephone:e.target.value})}/></div>
                <div className="dc-field"><label>Ville</label><input value={profilForm.ville} disabled={!editMode} placeholder="ex: Tunis" onChange={e=>setProfilForm({...profilForm,ville:e.target.value})}/></div>
                <div className="dc-field"><label>Nationalité</label><input value={profilForm.nationalite} disabled={!editMode} placeholder="ex: Tunisienne" onChange={e=>setProfilForm({...profilForm,nationalite:e.target.value})}/></div>
                <div className="dc-field"><label>LinkedIn</label><input value={profilForm.linkedin} disabled={!editMode} placeholder="https://linkedin.com/in/..." onChange={e=>setProfilForm({...profilForm,linkedin:e.target.value})}/></div>
                <div className="dc-field" style={{gridColumn:"span 2"}}><label>Email</label><input value={user?.email||""} disabled/></div>
              </div>
            </div>
          </>)}

        </main>
      </div>

      {/* MODAL POSTULER */}
      {showModal&&selectedOffre&&(
        <div className="dc-overlay" onClick={()=>setShowModal(false)}>
          <div className="dc-modal" onClick={e=>e.stopPropagation()}>
            <h2 className="dc-modal-title">Postuler</h2>
            <p className="dc-modal-sub">{selectedOffre.titre}{selectedOffre.nomEntreprise?` · ${selectedOffre.nomEntreprise}`:""}</p>
            <form onSubmit={handlePostuler}>
              <div className="dc-field">
                <label>CV (PDF) *</label>
                <div className={`dc-upload-zone ${cvFile?"has-file":""}`} onClick={()=>document.getElementById("cv-input").click()}>
                  <input id="cv-input" type="file" accept=".pdf" style={{display:"none"}} onChange={e=>setCvFile(e.target.files[0])}/>
                  {cvFile?<div style={{color:"var(--cyan)",fontWeight:700}}><CheckCircle size={24} style={{marginBottom:8}}/><div>{cvFile.name}</div></div>
                  :<div style={{color:"var(--muted)"}}><Upload size={24} style={{marginBottom:8}}/><div style={{fontWeight:600}}>Uploader votre CV</div><div style={{fontSize:12,marginTop:4}}>PDF · Max 5MB</div></div>}
                </div>
              </div>
              <div className="dc-field"><label>Lettre de motivation (optionnel)</label><textarea rows="4" placeholder="Présentez-vous..." value={lettre} onChange={e=>setLettre(e.target.value)}/></div>
              <button type="submit" className="dc-btn-submit" disabled={submitting}>{submitting?"Envoi en cours... 🤖":"Envoyer ma candidature →"}</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL VISA */}
      {showVisaModal&&(
        <div className="dc-overlay" onClick={()=>setShowVisaModal(false)}>
          <div className="dc-modal" onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
              <h2 className="dc-modal-title">✈️ Demande de visa</h2>
              <button onClick={()=>setShowVisaModal(false)} style={{border:"none",background:"#f1f5f9",padding:8,borderRadius:8,cursor:"pointer"}}><X size={18}/></button>
            </div>
            <form onSubmit={handleCreerVisa}>
              <div className="dc-field"><label>Pays de destination *</label><input required placeholder="ex: France" value={visaForm.pays} onChange={e=>setVisaForm({...visaForm,pays:e.target.value})}/></div>
              <div className="dc-field"><label>Type de visa</label><select value={visaForm.typeVisa} onChange={e=>setVisaForm({...visaForm,typeVisa:e.target.value})}><option>Visa Travail</option><option>Visa Étudiant</option><option>Visa Touriste</option><option>Visa Affaires</option></select></div>
              <div className="dc-field"><label>Date de début souhaitée</label><input type="date" value={visaForm.dateDebut} onChange={e=>setVisaForm({...visaForm,dateDebut:e.target.value})}/></div>
              <button type="submit" className="dc-btn-submit" disabled={submittingVisa}>{submittingVisa?"Envoi...":"✈️ Créer la demande"}</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DOCUMENTS VISA */}
      {showDocsModal&&selectedVisa&&(
        <div className="dc-overlay" onClick={()=>setShowDocsModal(false)}>
          <div className="dc-modal" onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
              <h2 className="dc-modal-title">📄 Documents requis</h2>
              <button onClick={()=>setShowDocsModal(false)} style={{border:"none",background:"#f1f5f9",padding:8,borderRadius:8,cursor:"pointer"}}><X size={18}/></button>
            </div>
            <div style={{background:"#f8fafc",borderRadius:12,padding:"14px 16px",marginBottom:20}}>
              <div style={{fontWeight:700}}>{selectedVisa.typeVisa} — {selectedVisa.pays}</div>
              <div style={{marginTop:6}}><VisaBadge statut={selectedVisa.statut}/></div>
            </div>
            {visaDocs.length===0?<p style={{color:"var(--muted)",textAlign:"center",padding:20}}>Aucun document trouvé</p>
            :visaDocs.map(doc=>(
              <div key={doc.id} className="dc-doc-upload-item">
                <div>
                  <div style={{fontWeight:700,fontSize:14}}>{doc.nomDocument}</div>
                  <div style={{fontSize:12,marginTop:3}}>
                    {["FOURNI","VALIDE"].includes(doc.statut)?<span style={{color:"#16a34a",fontWeight:700}}>✅ Fourni</span>:<span style={{color:"#d97706",fontWeight:700}}>⏳ Manquant</span>}
                  </div>
                </div>
                {!["FOURNI","VALIDE"].includes(doc.statut)&&(
                  <label style={{background:"var(--bg-dark)",color:"#fff",padding:"7px 14px",borderRadius:8,fontWeight:700,fontSize:12,cursor:"pointer"}}>
                    <Upload size={13} style={{verticalAlign:"middle",marginRight:4}}/> Uploader
                    <input type="file" style={{display:"none"}} onChange={e=>{if(e.target.files[0])handleUploadDoc(doc.id,e.target.files[0]);}}/>
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL CV */}
      {showCvModal&&cvViewUrl&&(
        <div className="dc-overlay" onClick={()=>setShowCvModal(false)}>
          <div style={{background:"#fff",width:700,borderRadius:24,padding:28,maxHeight:"90vh",overflow:"hidden",display:"flex",flexDirection:"column"}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h2 style={{fontSize:20,fontWeight:800}}>📄 Mon CV</h2>
              <div style={{display:"flex",gap:8}}>
                <a href={cvViewUrl} target="_blank" rel="noreferrer" style={{background:"var(--bg-dark)",color:"#fff",padding:"8px 16px",borderRadius:8,fontWeight:700,fontSize:12,textDecoration:"none"}}>↗ Ouvrir</a>
                <button onClick={()=>setShowCvModal(false)} style={{border:"none",background:"#f1f5f9",padding:8,borderRadius:8,cursor:"pointer"}}><X size={18}/></button>
              </div>
            </div>
            <iframe src={cvViewUrl} className="dc-cv-viewer" title="CV"/>
          </div>
        </div>
      )}
    </>
  );
}
