import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Building2, Users, LogOut, Search, Trash2, Edit, Clock,
  ShieldCheck, ChevronDown, Filter, CheckCircle2,
  XCircle, Globe, MapPin, Calendar, Briefcase, TrendingUp,
  Eye, Ban, RefreshCw, BarChart2
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
    --bg-sidebar: #060b13; --primary: #26c1c9; --primary-soft: rgba(38,193,201,0.1);
    --bg-main: #f0f4f8; --white: #ffffff; --dark: #0f172a; --muted: #64748b;
    --border: #e2e8f0; --danger: #ef4444; --success: #10b981; --warning: #f59e0b;
  }
  .ad-root { display: flex; min-height: 100vh; background: var(--bg-main); font-family: 'Plus Jakarta Sans', sans-serif; }
  .ad-sidebar { width: 270px; background: var(--bg-sidebar); display: flex; flex-direction: column; padding: 28px 20px; position: sticky; top: 0; height: 100vh; flex-shrink: 0; overflow-y: auto; }
  .ad-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 40px; padding-left: 6px; }
  .ad-brand-icon { width: 34px; height: 34px; background: var(--primary); border-radius: 9px; display: flex; align-items: center; justify-content: center; color: var(--bg-sidebar); }
  .ad-brand-name { font-size: 18px; font-weight: 800; color: #fff; }
  .ad-nav { flex: 1; display: flex; flex-direction: column; gap: 4px; }
  .ad-nav-section { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.2); text-transform: uppercase; letter-spacing: 1px; padding: 16px 8px 8px; }
  .ad-nav-item { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-radius: 11px; color: #94a3b8; cursor: pointer; transition: all 0.25s; font-size: 14px; font-weight: 500; position: relative; }
  .ad-nav-item:hover { background: rgba(255,255,255,0.05); color: #e2e8f0; }
  .ad-nav-item.active { background: rgba(38,193,201,0.12); color: var(--primary); font-weight: 700; }
  .ad-nav-item.active::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 3px; height: 60%; background: var(--primary); border-radius: 0 3px 3px 0; }
  .ad-nav-badge { margin-left: auto; background: var(--primary); color: #060b13; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 6px; }
  .ad-nav-badge.warn { background: var(--warning); }
  .ad-sidebar-bottom { margin-top: auto; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; flex-direction: column; gap: 6px; }
  .ad-logout { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-radius: 11px; color: #f87171; cursor: pointer; font-size: 14px; font-weight: 600; transition: 0.2s; border: 1px solid rgba(248,113,113,0.12); }
  .ad-logout:hover { background: rgba(248,113,113,0.08); }
  .ad-main { flex: 1; padding: 40px 48px; overflow-y: auto; }
  .ad-topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 36px; }
  .ad-page-title { font-size: 28px; font-weight: 800; color: var(--dark); letter-spacing: -0.8px; }
  .ad-page-title span { color: var(--primary); }
  .ad-page-sub { color: var(--muted); font-size: 14px; margin-top: 3px; }
  .ad-topbar-right { display: flex; gap: 12px; align-items: center; }
  .ad-search-bar { display: flex; align-items: center; gap: 10px; background: var(--white); border: 1.5px solid var(--border); border-radius: 13px; padding: 11px 18px; width: 280px; transition: 0.2s; }
  .ad-search-bar:focus-within { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(38,193,201,0.1); }
  .ad-search-bar input { border: none; outline: none; font-family: inherit; font-size: 14px; color: var(--dark); background: transparent; width: 100%; }
  .ad-filter-btn { display: flex; align-items: center; gap: 8px; background: var(--white); border: 1.5px solid var(--border); border-radius: 13px; padding: 11px 16px; cursor: pointer; font-size: 13px; font-weight: 600; color: var(--muted); transition: 0.2s; font-family: inherit; }
  .ad-filter-btn:hover, .ad-filter-btn.active { border-color: var(--primary); color: var(--primary); background: var(--primary-soft); }
  .ad-filter-dropdown { position: absolute; top: calc(100% + 8px); right: 0; background: var(--white); border: 1.5px solid var(--border); border-radius: 16px; padding: 8px; min-width: 200px; box-shadow: 0 8px 30px rgba(0,0,0,0.1); z-index: 100; }
  .ad-filter-option { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 10px; cursor: pointer; font-size: 13px; font-weight: 500; color: var(--dark); transition: 0.15s; }
  .ad-filter-option:hover { background: var(--bg-main); }
  .ad-filter-option.selected { background: var(--primary-soft); color: var(--primary); font-weight: 700; }
  .ad-filter-wrap { position: relative; }
  .ad-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 32px; }
  .ad-stat { background: var(--white); border-radius: 20px; padding: 22px 24px; border: 1.5px solid var(--border); display: flex; align-items: center; gap: 16px; transition: 0.2s; }
  .ad-stat:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
  .ad-stat-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .ad-stat-icon.cyan { background: rgba(38,193,201,0.12); color: var(--primary); }
  .ad-stat-icon.green { background: rgba(16,185,129,0.1); color: var(--success); }
  .ad-stat-icon.amber { background: rgba(245,158,11,0.1); color: var(--warning); }
  .ad-stat-icon.red { background: rgba(239,68,68,0.1); color: var(--danger); }
  .ad-stat-val { font-size: 24px; font-weight: 800; color: var(--dark); line-height: 1; }
  .ad-stat-label { font-size: 12px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }
  .ad-cards-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
  .ad-cards-title { font-size: 16px; font-weight: 700; color: var(--dark); }
  .ad-cards-count { font-size: 13px; color: var(--muted); font-weight: 500; }
  .ad-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 18px; }
  .ad-ent-card { background: var(--white); border-radius: 20px; border: 1.5px solid var(--border); overflow: hidden; transition: all 0.25s; }
  .ad-ent-card:hover { transform: translateY(-3px); box-shadow: 0 12px 36px rgba(0,0,0,0.08); border-color: rgba(38,193,201,0.2); }
  .ad-ent-card-top { padding: 20px 20px 16px; display: flex; gap: 14px; align-items: flex-start; border-bottom: 1px solid #f1f5f9; }
  .ad-ent-logo { width: 52px; height: 52px; border-radius: 14px; object-fit: cover; border: 1.5px solid var(--border); flex-shrink: 0; }
  .ad-ent-logo-fallback { width: 52px; height: 52px; border-radius: 14px; background: linear-gradient(135deg, var(--primary-soft), rgba(38,193,201,0.2)); display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800; color: var(--primary); flex-shrink: 0; border: 1.5px solid rgba(38,193,201,0.15); }
  .ad-ent-info { flex: 1; min-width: 0; }
  .ad-ent-name { font-size: 15px; font-weight: 700; color: var(--dark); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ad-ent-email { font-size: 12px; color: var(--muted); margin-top: 3px; }
  .ad-ent-meta { display: flex; gap: 10px; margin-top: 8px; flex-wrap: wrap; }
  .ad-ent-tag { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--muted); font-weight: 500; }
  .ad-status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .ad-status-dot.valid { background: var(--success); box-shadow: 0 0 0 3px rgba(16,185,129,0.15); }
  .ad-status-dot.pending { background: var(--warning); box-shadow: 0 0 0 3px rgba(245,158,11,0.15); }
  .ad-ent-card-mid { padding: 14px 20px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; border-bottom: 1px solid #f1f5f9; }
  .ad-ent-stat { text-align: center; }
  .ad-ent-stat-val { font-size: 16px; font-weight: 800; color: var(--dark); }
  .ad-ent-stat-label { font-size: 10px; color: var(--muted); font-weight: 600; text-transform: uppercase; margin-top: 2px; }
  .ad-ent-card-bot { padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; }
  .ad-badge-valid { background: rgba(16,185,129,0.1); color: var(--success); font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 7px; }
  .ad-badge-pending { background: rgba(245,158,11,0.1); color: var(--warning); font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 7px; }
  .ad-card-actions { display: flex; gap: 6px; }
  .ad-act-btn { width: 32px; height: 32px; border-radius: 9px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; font-family: inherit; }
  .ad-act-btn.validate { background: rgba(16,185,129,0.1); color: var(--success); }
  .ad-act-btn.validate:hover { background: var(--success); color: #fff; }
  .ad-act-btn.suspend { background: rgba(245,158,11,0.1); color: var(--warning); }
  .ad-act-btn.suspend:hover { background: var(--warning); color: #fff; }
  .ad-act-btn.edit { background: rgba(99,102,241,0.1); color: #6366f1; }
  .ad-act-btn.edit:hover { background: #6366f1; color: #fff; }
  .ad-act-btn.del { background: rgba(239,68,68,0.1); color: var(--danger); }
  .ad-act-btn.del:hover { background: var(--danger); color: #fff; }
  .ad-cand-card { background: var(--white); border-radius: 18px; border: 1.5px solid var(--border); padding: 18px 20px; display: flex; align-items: center; gap: 14px; transition: all 0.25s; }
  .ad-cand-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
  .ad-cand-avatar-fallback { width: 46px; height: 46px; border-radius: 13px; background: linear-gradient(135deg, #eff4ff, #dde8ff); display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800; color: #6366f1; flex-shrink: 0; }
  .ad-cand-info { flex: 1; }
  .ad-cand-name { font-size: 14px; font-weight: 700; color: var(--dark); }
  .ad-cand-email { font-size: 12px; color: var(--muted); }
  .ad-cand-meta { display: flex; gap: 12px; margin-top: 6px; }
  .ad-cand-actions { display: flex; gap: 6px; flex-shrink: 0; }
  .ad-overlay { position: fixed; inset: 0; background: rgba(6,11,19,0.75); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: fadeIn 0.2s ease; }
  .ad-modal { background: white; width: 460px; border-radius: 28px; padding: 36px; position: relative; animation: slideUp 0.3s ease; max-height: 90vh; overflow-y: auto; }
  .ad-modal-head { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; }
  .ad-modal-icon { width: 44px; height: 44px; border-radius: 12px; background: var(--primary-soft); display: flex; align-items: center; justify-content: center; color: var(--primary); }
  .ad-modal-title { font-size: 20px; font-weight: 800; color: var(--dark); }
  .ad-field { margin-bottom: 18px; }
  .ad-field label { display: block; font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 8px; }
  .ad-field input, .ad-field select { width: 100%; padding: 13px 16px; border-radius: 12px; background: #f8fafc; border: 1.5px solid var(--border); font-family: inherit; font-size: 14px; transition: 0.2s; color: var(--dark); }
  .ad-field input:focus, .ad-field select:focus { border-color: var(--primary); background: #fff; outline: none; }
  .ad-modal-btn { width: 100%; padding: 14px; background: var(--dark); color: #fff; border: none; border-radius: 14px; font-weight: 700; font-size: 15px; cursor: pointer; font-family: inherit; transition: 0.2s; margin-top: 8px; }
  .ad-modal-btn:hover { background: var(--primary); }
  .ad-empty { text-align: center; padding: 60px 20px; color: var(--muted); }
  .ad-empty-icon { width: 64px; height: 64px; background: var(--bg-main); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #cbd5e1; }
  /* ── STATS TAB ── */
  .ad-stats-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; margin-bottom: 28px; }
  .ad-chart-card { background: var(--white); border-radius: 20px; border: 1.5px solid var(--border); padding: 28px; margin-bottom: 24px; }
  .ad-chart-title { font-size: 15px; font-weight: 700; color: var(--dark); margin-bottom: 20px; }
  .ad-bar-row { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
  .ad-bar-label { width: 150px; font-size: 13px; font-weight: 600; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex-shrink: 0; }
  .ad-bar-track { flex: 1; height: 10px; background: #f1f5f9; border-radius: 99px; overflow: hidden; }
  .ad-bar-fill { height: 100%; border-radius: 99px; transition: width 0.8s ease; }
  .ad-bar-val { width: 32px; text-align: right; font-size: 13px; font-weight: 800; color: var(--dark); flex-shrink: 0; }
  .ad-donut-row { display: flex; gap: 12px; flex-wrap: wrap; }
  .ad-donut-item { flex: 1; min-width: 100px; background: #f8fafc; border-radius: 14px; padding: 16px; text-align: center; border: 1.5px solid var(--border); }
  .ad-donut-val { font-size: 28px; font-weight: 900; }
  .ad-donut-label { font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase; margin-top: 4px; }
  .ad-evol-row { display: flex; align-items: flex-end; gap: 6px; height: 80px; margin-bottom: 8px; }
  .ad-evol-bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; height: 100%; justify-content: flex-end; }
  .ad-evol-bar { width: 100%; border-radius: 6px 6px 0 0; min-height: 4px; }
  .ad-evol-month { font-size: 10px; color: var(--muted); font-weight: 600; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
`;

function EntLogo({ id, nom }) {
  const [err, setErr] = useState(false);
  const letter = (nom || "?")[0].toUpperCase();
  if (err) return <div className="ad-ent-logo-fallback">{letter}</div>;
  return <img className="ad-ent-logo" src={`http://localhost:8081/api/entreprises/${id}/logo/view`} alt={nom} onError={() => setErr(true)} />;
}

function AdminDashboard({ onLogout }) {
  const { t } = useLanguage();
  const [entreprises, setEntreprises]   = useState([]);
  const [candidats,   setCandidats]     = useState([]);
  const [stats,       setStats]         = useState(null);
  const [activeNav,   setActiveNav]     = useState("entreprises");
  const [searchTerm,  setSearchTerm]    = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilter,  setShowFilter]    = useState(false);
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [currentEmp,  setCurrentEmp]    = useState(null);
  const filterRef = useRef(null);

  useEffect(() => { fetchEntreprises(); fetchCandidats(); fetchStats(); }, []);

  useEffect(() => {
    const handler = (e) => { if (filterRef.current && !filterRef.current.contains(e.target)) setShowFilter(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const token = () => localStorage.getItem("token");

  const fetchEntreprises = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/admin/all", { headers: { Authorization: token() } });
      setEntreprises(res.data);
    } catch { toast.error("Erreur chargement entreprises"); }
  };

  const fetchCandidats = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/admin/candidats", { headers: { Authorization: token() } });
      setCandidats(res.data);
    } catch { toast.error("Erreur chargement candidats"); }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/admin/stats", { headers: { Authorization: token() } });
      setStats(res.data);
    } catch { toast.error("Erreur chargement statistiques"); }
  };

  const toggleValidation = async (entreprise) => {
    try {
      if (!entreprise.validated) {
        await axios.put(`http://localhost:8081/api/admin/validate/${entreprise.id}`, {}, { headers: { Authorization: token() } });
      } else {
        await axios.put(`http://localhost:8081/api/admin/update/${entreprise.id}`, { ...entreprise, validated: false }, { headers: { Authorization: token() } });
      }
      toast.success(entreprise.validated ? "Compte suspendu" : "Compte validé ✓");
      fetchEntreprises();
    } catch { toast.error("Action échouée"); }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    try {
      await axios.delete(`http://localhost:8081/api/admin/delete/${id}`, { headers: { Authorization: token() } });
      toast.success("Supprimé avec succès");
      type === "candidat" ? fetchCandidats() : fetchEntreprises();
    } catch { toast.error("Erreur suppression"); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8081/api/admin/update/${currentEmp.id}`, currentEmp, { headers: { Authorization: token() } });
      toast.success("Modifié ✓");
      setIsModalOpen(false);
      fetchEntreprises();
    } catch { toast.error("Erreur modification"); }
  };

  const pendingCount = entreprises.filter(e => !e.validated).length;

  const filteredEntreprises = entreprises.filter(e => {
    const match = (e.email || "").toLowerCase().includes(searchTerm.toLowerCase())
      || (e.nomEntreprise || "").toLowerCase().includes(searchTerm.toLowerCase());
    if (filterStatus === "validated") return match && e.validated;
    if (filterStatus === "pending")   return match && !e.validated;
    return match;
  });

  const filteredCandidats = candidats.filter(c =>
    (c.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    || (c.nom  || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ── Stats helpers
  const total = stats ? (
    (stats.repartitionStatuts?.ACCEPTEE  || 0) +
    (stats.repartitionStatuts?.REFUSEE   || 0) +
    (stats.repartitionStatuts?.EN_ATTENTE|| 0)
  ) : 0;
  const pct = (val) => total > 0 ? Math.round((val / total) * 100) : 0;
  const maxOffres = stats ? Math.max(...(stats.topEntreprises||[]).map(e=>e.nbOffres), 1) : 1;
  const evol    = stats?.evolutionInscriptions || [];
  const maxEvol = Math.max(...evol.map(e=>(Number(e.entreprises)||0)+(Number(e.candidats)||0)), 1);

  return (
    <>
      <style>{styles}</style>
      <div className="ad-root">

        {/* SIDEBAR */}
        <aside className="ad-sidebar">
          <div className="ad-brand">
            <div className="ad-brand-icon"><ShieldCheck size={18} /></div>
            <span className="ad-brand-name">RecruitPro</span>
          </div>
          <nav className="ad-nav">
            <div className="ad-nav-section">Navigation</div>
            <div className={`ad-nav-item ${activeNav==="entreprises"?"active":""}`}
              onClick={()=>{setActiveNav("entreprises");setSearchTerm("");setFilterStatus("all");}}>
              <Building2 size={17}/><span>Entreprises</span>
              {pendingCount>0&&<span className="ad-nav-badge warn">{pendingCount}</span>}
            </div>
            <div className={`ad-nav-item ${activeNav==="candidats"?"active":""}`}
              onClick={()=>{setActiveNav("candidats");setSearchTerm("");setFilterStatus("all");}}>
              <Users size={17}/><span>Candidats</span>
              <span className="ad-nav-badge" style={{background:"rgba(255,255,255,0.1)",color:"#94a3b8"}}>{candidats.length}</span>
            </div>
            <div className={`ad-nav-item ${activeNav==="statistiques"?"active":""}`}
              onClick={()=>{setActiveNav("statistiques");setSearchTerm("");}}>
              <BarChart2 size={17}/><span>Statistiques</span>
            </div>
          </nav>
          <div className="ad-sidebar-bottom">
            <LanguageSwitcher variant="dark" />
            <div className="ad-logout" onClick={onLogout}><LogOut size={16}/><span>Déconnexion</span></div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="ad-main">

          {/* ══ ENTREPRISES ══ */}
          {activeNav==="entreprises" && (<>
            <header className="ad-topbar">
              <div>
                <h1 className="ad-page-title">Gestion des <span>Entreprises</span></h1>
                <p className="ad-page-sub">{entreprises.length} entreprises · {pendingCount} en attente</p>
              </div>
              <div className="ad-topbar-right">
                <div className="ad-search-bar">
                  <Search size={16} color="#94a3b8"/>
                  <input placeholder="Rechercher une entreprise..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}/>
                </div>
                <div className="ad-filter-wrap" ref={filterRef}>
                  <button className={`ad-filter-btn ${filterStatus!=="all"?"active":""}`} onClick={()=>setShowFilter(v=>!v)}>
                    <Filter size={14}/>
                    {filterStatus==="all"?"Tous":filterStatus==="validated"?"Validés":"En attente"}
                    <ChevronDown size={13}/>
                  </button>
                  {showFilter&&(
                    <div className="ad-filter-dropdown">
                      {[{val:"all",label:"Tous"},{val:"validated",label:"Validés"},{val:"pending",label:"En attente"}].map(o=>(
                        <div key={o.val} className={`ad-filter-option ${filterStatus===o.val?"selected":""}`}
                          onClick={()=>{setFilterStatus(o.val);setShowFilter(false);}}>
                          {o.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button className="ad-filter-btn" onClick={()=>{fetchEntreprises();fetchCandidats();fetchStats();toast.success("Actualisé");}}>
                  <RefreshCw size={14}/>
                </button>
              </div>
            </header>

            <div className="ad-stats">
              <div className="ad-stat"><div className="ad-stat-icon cyan"><Building2 size={22}/></div><div><div className="ad-stat-val">{entreprises.length}</div><div className="ad-stat-label">Entreprises</div></div></div>
              <div className="ad-stat"><div className="ad-stat-icon green"><CheckCircle2 size={22}/></div><div><div className="ad-stat-val">{entreprises.filter(e=>e.validated).length}</div><div className="ad-stat-label">Validées</div></div></div>
              <div className="ad-stat"><div className="ad-stat-icon amber"><Clock size={22}/></div><div><div className="ad-stat-val">{pendingCount}</div><div className="ad-stat-label">En attente</div></div></div>
              <div className="ad-stat"><div className="ad-stat-icon" style={{background:"rgba(99,102,241,0.1)",color:"#6366f1"}}><Users size={22}/></div><div><div className="ad-stat-val">{candidats.length}</div><div className="ad-stat-label">Candidats</div></div></div>
            </div>

            <div className="ad-cards-header">
              <span className="ad-cards-title">Liste des entreprises</span>
              <span className="ad-cards-count">{filteredEntreprises.length} résultat(s)</span>
            </div>

            {filteredEntreprises.length===0
              ? <div className="ad-empty"><div className="ad-empty-icon"><Building2 size={28}/></div><p style={{fontWeight:600}}>Aucune entreprise trouvée</p></div>
              : <div className="ad-cards-grid">
                  {filteredEntreprises.map(ent=>(
                    <div className="ad-ent-card" key={ent.id}>
                      <div className="ad-ent-card-top">
                        <EntLogo id={ent.id} nom={ent.nomEntreprise||ent.email}/>
                        <div className="ad-ent-info">
                          <div className="ad-ent-name">{ent.nomEntreprise||"—"}</div>
                          <div className="ad-ent-email">{ent.email}</div>
                          <div className="ad-ent-meta">
                            {ent.ville&&<span className="ad-ent-tag"><MapPin size={11}/>{ent.ville}</span>}
                            {ent.secteur&&<span className="ad-ent-tag"><Briefcase size={11}/>{ent.secteur}</span>}
                          </div>
                        </div>
                        <div className={`ad-status-dot ${ent.validated?"valid":"pending"}`}/>
                      </div>
                      <div className="ad-ent-card-mid">
                        <div className="ad-ent-stat"><div className="ad-ent-stat-val">{ent.nombreOffres??0}</div><div className="ad-ent-stat-label">Offres</div></div>
                        <div className="ad-ent-stat"><div className="ad-ent-stat-val">{ent.nombreCandidatures??0}</div><div className="ad-ent-stat-label">Candidatures</div></div>
                        <div className="ad-ent-stat"><div className="ad-ent-stat-val">{ent.taille||"—"}</div><div className="ad-ent-stat-label">Taille</div></div>
                      </div>
                      <div className="ad-ent-card-bot">
                        <span className={ent.validated?"ad-badge-valid":"ad-badge-pending"}>
                          {ent.validated?"✓ Validé":"⏳ En attente"}
                        </span>
                        <div className="ad-card-actions">
                          {!ent.validated
                            ? <button className="ad-act-btn validate" onClick={()=>toggleValidation(ent)}><CheckCircle2 size={15}/></button>
                            : <button className="ad-act-btn suspend"  onClick={()=>toggleValidation(ent)}><Ban size={15}/></button>}
                          <button className="ad-act-btn edit" onClick={()=>{setCurrentEmp({...ent});setIsModalOpen(true);}}><Edit size={15}/></button>
                          <button className="ad-act-btn del"  onClick={()=>handleDelete(ent.id,"entreprise")}><Trash2 size={15}/></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>}
          </>)}

          {/* ══ CANDIDATS ══ */}
          {activeNav==="candidats" && (<>
            <header className="ad-topbar">
              <div>
                <h1 className="ad-page-title">Gestion des <span>Candidats</span></h1>
                <p className="ad-page-sub">{candidats.length} candidats enregistrés</p>
              </div>
              <div className="ad-topbar-right">
                <div className="ad-search-bar">
                  <Search size={16} color="#94a3b8"/>
                  <input placeholder="Rechercher un candidat..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}/>
                </div>
              </div>
            </header>
            <div className="ad-cards-header">
              <span className="ad-cards-title">Liste des candidats</span>
              <span className="ad-cards-count">{filteredCandidats.length} résultat(s)</span>
            </div>
            {filteredCandidats.length===0
              ? <div className="ad-empty"><div className="ad-empty-icon"><Users size={28}/></div><p style={{fontWeight:600}}>Aucun candidat trouvé</p></div>
              : <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {filteredCandidats.map(cand=>(
                    <div className="ad-cand-card" key={cand.id}>
                      <div className="ad-cand-avatar-fallback">{(cand.nom||cand.email||"?")[0].toUpperCase()}</div>
                      <div className="ad-cand-info">
                        <div className="ad-cand-name">{cand.nom&&cand.prenom?`${cand.prenom} ${cand.nom}`:cand.email}</div>
                        <div className="ad-cand-email">{cand.email}</div>
                        <div className="ad-cand-meta">
                          {cand.ville&&<span className="ad-ent-tag"><MapPin size={11}/>{cand.ville}</span>}
                        </div>
                      </div>
                      <span className="ad-badge-valid" style={{flexShrink:0}}>✓ Actif</span>
                      <div className="ad-cand-actions">
                        <button className="ad-act-btn del" onClick={()=>handleDelete(cand.id,"candidat")}><Trash2 size={15}/></button>
                      </div>
                    </div>
                  ))}
                </div>}
          </>)}

          {/* ══ STATISTIQUES ══ */}
          {activeNav==="statistiques" && (<>
            <header className="ad-topbar">
              <div>
                <h1 className="ad-page-title">Statistiques <span>globales</span></h1>
                <p className="ad-page-sub">Vue d'ensemble de la plateforme</p>
              </div>
              <button className="ad-filter-btn" onClick={()=>{fetchStats();toast.success("Actualisé");}}>
                <RefreshCw size={14}/> Actualiser
              </button>
            </header>

            {!stats ? <div style={{padding:"40px",textAlign:"center",color:"#64748b"}}>Chargement...</div> : (<>

              {/* Totaux */}
              <div className="ad-stats-4">
                {[
                  {label:"Entreprises", val:stats.totalEntreprises,  icon:"🏢", color:"#26c1c9"},
                  {label:"Candidats",   val:stats.totalCandidats,    icon:"👤", color:"#6366f1"},
                  {label:"Offres",      val:stats.totalOffres,       icon:"📋", color:"#10b981"},
                  {label:"Candidatures",val:stats.totalCandidatures, icon:"📨", color:"#f59e0b"},
                ].map(s=>(
                  <div key={s.label} style={{background:"#fff",borderRadius:"20px",border:"1.5px solid #e2e8f0",padding:"22px 24px",display:"flex",alignItems:"center",gap:"16px"}}>
                    <div style={{fontSize:"28px"}}>{s.icon}</div>
                    <div>
                      <div style={{fontSize:"26px",fontWeight:"900",color:s.color}}>{s.val}</div>
                      <div style={{fontSize:"12px",fontWeight:"700",color:"#64748b",textTransform:"uppercase"}}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"24px",marginBottom:"24px"}}>

                {/* Répartition candidatures */}
                <div className="ad-chart-card">
                  <div className="ad-chart-title">📊 Répartition candidatures</div>
                  <div className="ad-donut-row">
                    <div className="ad-donut-item">
                      <div className="ad-donut-val" style={{color:"#16a34a"}}>{stats.repartitionStatuts?.ACCEPTEE||0}</div>
                      <div className="ad-donut-label">✅ Acceptées</div>
                      <div style={{fontSize:"13px",color:"#16a34a",fontWeight:"800",marginTop:"4px"}}>{pct(stats.repartitionStatuts?.ACCEPTEE||0)}%</div>
                    </div>
                    <div className="ad-donut-item">
                      <div className="ad-donut-val" style={{color:"#d97706"}}>{stats.repartitionStatuts?.EN_ATTENTE||0}</div>
                      <div className="ad-donut-label">⏳ Attente</div>
                      <div style={{fontSize:"13px",color:"#d97706",fontWeight:"800",marginTop:"4px"}}>{pct(stats.repartitionStatuts?.EN_ATTENTE||0)}%</div>
                    </div>
                    <div className="ad-donut-item">
                      <div className="ad-donut-val" style={{color:"#dc2626"}}>{stats.repartitionStatuts?.REFUSEE||0}</div>
                      <div className="ad-donut-label">❌ Refusées</div>
                      <div style={{fontSize:"13px",color:"#dc2626",fontWeight:"800",marginTop:"4px"}}>{pct(stats.repartitionStatuts?.REFUSEE||0)}%</div>
                    </div>
                  </div>
                  <div style={{marginTop:"20px",width:"100%",height:"12px",borderRadius:"99px",overflow:"hidden",display:"flex"}}>
                    <div style={{width:`${pct(stats.repartitionStatuts?.ACCEPTEE||0)}%`,background:"#16a34a",transition:"width 0.8s"}}/>
                    <div style={{width:`${pct(stats.repartitionStatuts?.EN_ATTENTE||0)}%`,background:"#d97706",transition:"width 0.8s"}}/>
                    <div style={{width:`${pct(stats.repartitionStatuts?.REFUSEE||0)}%`,background:"#dc2626",transition:"width 0.8s"}}/>
                  </div>
                </div>

                {/* Top 5 entreprises */}
                <div className="ad-chart-card">
                  <div className="ad-chart-title">🏆 Top entreprises (offres publiées)</div>
                  {(stats.topEntreprises||[]).map((ent,i)=>(
                    <div key={ent.id} className="ad-bar-row">
                      <div className="ad-bar-label">
                        <span style={{color:"var(--primary)",fontWeight:"800",marginRight:"6px"}}>#{i+1}</span>
                        {ent.nom}
                      </div>
                      <div className="ad-bar-track">
                        <div className="ad-bar-fill" style={{width:`${Math.round((ent.nbOffres/maxOffres)*100)}%`,background:"var(--primary)"}}/>
                      </div>
                      <div className="ad-bar-val">{ent.nbOffres}</div>
                    </div>
                  ))}
                  {(stats.topEntreprises||[]).length===0&&<p style={{color:"#94a3b8",fontSize:"13px"}}>Aucune donnée</p>}
                </div>
              </div>

              {/* Évolution inscriptions */}
              <div className="ad-chart-card">
                <div className="ad-chart-title">📈 Évolution des inscriptions (12 derniers mois)</div>
                {evol.length===0
                  ? <p style={{color:"#94a3b8",fontSize:"13px"}}>Aucune donnée — ajoutez <code>date_creation</code> dans la table utilisateur</p>
                  : (<>
                    <div className="ad-evol-row">
                      {evol.map((m,i)=>{
                        const hE = Math.round(((Number(m.entreprises)||0)/maxEvol)*72);
                        const hC = Math.round(((Number(m.candidats)||0)/maxEvol)*72);
                        return (
                          <div key={i} className="ad-evol-bar-wrap" title={`${m.mois}: ${m.entreprises} entreprises, ${m.candidats} candidats`}>
                            <div style={{display:"flex",flexDirection:"column",justifyContent:"flex-end",height:"72px",width:"100%",gap:"1px"}}>
                              <div className="ad-evol-bar" style={{height:`${hC}px`,background:"#6366f1"}}/>
                              <div className="ad-evol-bar" style={{height:`${hE}px`,background:"var(--primary)"}}/>
                            </div>
                            <div className="ad-evol-month">{(m.mois||"").slice(5)}</div>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{display:"flex",gap:"20px",marginTop:"12px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:"6px"}}><div style={{width:"10px",height:"10px",borderRadius:"3px",background:"var(--primary)"}}/><span style={{fontSize:"12px",color:"#64748b"}}>Entreprises</span></div>
                      <div style={{display:"flex",alignItems:"center",gap:"6px"}}><div style={{width:"10px",height:"10px",borderRadius:"3px",background:"#6366f1"}}/><span style={{fontSize:"12px",color:"#64748b"}}>Candidats</span></div>
                    </div>
                  </>)}
              </div>
            </>)}
          </>)}

        </main>
      </div>

      {/* MODAL EDIT */}
      {isModalOpen && currentEmp && (
        <div className="ad-overlay" onClick={()=>setIsModalOpen(false)}>
          <div className="ad-modal" onClick={e=>e.stopPropagation()}>
            <div className="ad-modal-head">
              <div className="ad-modal-icon"><Edit size={20}/></div>
              <div>
                <div className="ad-modal-title">Modifier l'entreprise</div>
                <div style={{fontSize:13,color:"var(--muted)"}}>{currentEmp.email}</div>
              </div>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="ad-field"><label>Email</label><input type="email" value={currentEmp.email||""} onChange={e=>setCurrentEmp({...currentEmp,email:e.target.value})} required/></div>
              <div className="ad-field"><label>Nom entreprise</label><input value={currentEmp.nomEntreprise||""} onChange={e=>setCurrentEmp({...currentEmp,nomEntreprise:e.target.value})}/></div>
              <div className="ad-field"><label>Secteur</label><input value={currentEmp.secteur||""} onChange={e=>setCurrentEmp({...currentEmp,secteur:e.target.value})}/></div>
              <div className="ad-field"><label>Ville</label><input value={currentEmp.ville||""} onChange={e=>setCurrentEmp({...currentEmp,ville:e.target.value})}/></div>
              <div className="ad-field"><label>Statut</label>
                <select value={currentEmp.validated} onChange={e=>setCurrentEmp({...currentEmp,validated:e.target.value==="true"})}>
                  <option value="true">✓ Validé</option>
                  <option value="false">⏳ En attente</option>
                </select>
              </div>
              <button type="submit" className="ad-modal-btn">Sauvegarder</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminDashboard;