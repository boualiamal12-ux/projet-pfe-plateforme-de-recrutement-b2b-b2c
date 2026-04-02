import React, { useState, useEffect, useCallback, useRef } from "react";
import api from "../api/axiosConfig";
import {
  Plus, MapPin, Trash2, Users, Briefcase, LogOut, Calendar, ShieldCheck,
  Search, ToggleLeft, ToggleRight, UserCheck, Eye, X, Upload, Building2,
  TrendingUp, Filter, Save, Edit3, ChevronDown, Phone, Globe, Linkedin,
  FileText, CheckCircle2, XCircle, Clock, Mail, Award, BookOpen, ArrowLeft
} from "lucide-react";
import { toast } from "react-toastify";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  :root { --bg-dark: #050c1a; --primary-cyan: #14b8a6; --bg-main: #f8fafc; --text-dark: #0f172a; --text-muted: #64748b; }
  .go-root { display: flex; min-height: 100vh; background: var(--bg-main); font-family: 'Plus Jakarta Sans', sans-serif; }
  .go-sidebar { width: 260px; background: var(--bg-dark); padding: 32px 20px; display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; overflow-y: auto; }
  .go-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 24px; padding: 0 10px; }
  .go-brand-icon { width: 32px; height: 32px; background: var(--primary-cyan); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; }
  .go-brand-name { color: #fff; font-size: 18px; font-weight: 800; }
  .go-nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; color: #94a3b8; border-radius: 12px; cursor: pointer; transition: 0.3s; font-size: 14px; font-weight: 500; margin-bottom: 4px; }
  .go-nav-item:hover { background: rgba(255,255,255,0.05); color: #fff; }
  .go-nav-item.active { background: rgba(20,184,166,0.1); color: var(--primary-cyan); font-weight: 600; }
  .go-sidebar-bottom { margin-top: auto; display: flex; flex-direction: column; gap: 8px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.06); }
  .go-main { flex: 1; padding: 40px 50px; overflow-y: auto; }
  .go-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
  .go-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; margin-bottom: 32px; }
  .go-stats-5 { display: grid; grid-template-columns: repeat(5,1fr); gap: 16px; margin-bottom: 32px; }
  .go-stat-card { background: #fff; padding: 24px; border-radius: 20px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 16px; }
  .go-stat-card-sm { background: #fff; padding: 18px 20px; border-radius: 16px; border: 1px solid #e2e8f0; }
  .go-stat-icon { width: 48px; height: 48px; border-radius: 12px; background: #f1f5f9; color: var(--primary-cyan); display: flex; align-items: center; justify-content: center; }
  .go-card-table { background: #fff; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden; }
  .go-table { width: 100%; border-collapse: collapse; }
  .go-table th { background: #f8fafc; padding: 16px 24px; text-align: left; font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
  .go-table td { padding: 14px 24px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
  .go-table tr:last-child td { border-bottom: none; }
  .go-table tbody tr:hover { background: #f8fafc; cursor: pointer; }
  .go-badge { padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; border: none; }
  .go-btn-add { background: var(--bg-dark); color: #fff; padding: 12px 20px; border-radius: 12px; border: none; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; font-family: inherit; transition: 0.3s; }
  .go-btn-add:hover { background: var(--primary-cyan); }
  .go-search-wrapper { position: relative; margin-bottom: 25px; }
  .go-search-input { width: 100%; padding: 12px 45px; border-radius: 12px; border: 1px solid #e2e8f0; background: #fff; outline: none; transition: 0.3s; font-family: inherit; font-size: 14px; }
  .go-search-input:focus { border-color: var(--primary-cyan); box-shadow: 0 0 0 3px rgba(20,184,166,0.1); }
  .go-overlay { position: fixed; inset: 0; background: rgba(5,12,26,0.8); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
  .go-modal { background: #fff; width: 580px; border-radius: 24px; padding: 36px; max-height: 90vh; overflow-y: auto; }
  .go-modal-title { font-size: 22px; font-weight: 800; color: var(--text-dark); margin-bottom: 24px; letter-spacing: -0.5px; }
  .go-field { margin-bottom: 16px; }
  .go-field label { display: block; font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 6px; }
  .go-field input, .go-field select, .go-field textarea { width: 100%; padding: 12px 14px; border-radius: 10px; border: 2px solid #f1f5f9; background: #f8fafc; outline: none; font-family: inherit; font-size: 14px; transition: 0.3s; }
  .go-field input:focus, .go-field select:focus, .go-field textarea:focus { border-color: var(--primary-cyan); background: #fff; }
  .go-field input:disabled { opacity: 0.5; }
  .go-expiry-warning { display: inline-flex; align-items: center; gap: 4px; background: #fef3c7; color: #d97706; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; }
  .go-expiry-expired { background: #fee2e2; color: #dc2626; }
  .go-cand-modal { background: #fff; width: 560px; border-radius: 24px; padding: 36px; max-height: 90vh; overflow-y: auto; }
  .go-status-badge { padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; }
  .go-status-attente { background: #fef3c7; color: #d97706; }
  .go-status-acceptee { background: #f0fdf4; color: #16a34a; }
  .go-status-refusee { background: #fee2e2; color: #dc2626; }
  .go-logo-zone { border: 2px dashed rgba(255,255,255,0.15); border-radius: 14px; padding: 12px 14px; cursor: pointer; transition: 0.3s; margin-bottom: 20px; display: flex; align-items: center; gap: 12px; }
  .go-logo-zone:hover { border-color: #14b8a6; background: rgba(20,184,166,0.06); }
  .go-filter-select { padding: 9px 14px; border-radius: 10px; border: 2px solid #e2e8f0; background: #fff; font-family: inherit; font-size: 13px; font-weight: 600; color: #475569; outline: none; cursor: pointer; transition: 0.3s; }
  .go-filter-select:focus { border-color: var(--primary-cyan); }
  .go-profil-card { background: #fff; border-radius: 24px; padding: 36px; border: 1px solid #e2e8f0; }
  .go-taux-bar { width: 100%; height: 10px; background: #f1f5f9; border-radius: 99px; overflow: hidden; margin-top: 10px; }
  .go-statut-wrap { position: relative; display: inline-block; }
  .go-statut-dropdown { position: absolute; top: calc(100% + 6px); left: 0; background: #fff; border-radius: 12px; border: 1.5px solid #e2e8f0; box-shadow: 0 8px 24px rgba(0,0,0,0.1); z-index: 50; overflow: hidden; min-width: 160px; }
  .go-statut-option { padding: 10px 14px; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.15s; }
  .go-statut-option:hover { background: #f8fafc; }
  .go-cand-detail { background: #fff; width: 480px; border-radius: 24px; padding: 32px; max-height: 90vh; overflow-y: auto; }
  .go-cand-avatar-lg { width: 72px; height: 72px; border-radius: 20px; object-fit: cover; border: 3px solid #e2e8f0; }
  .go-cand-avatar-fallback { width: 72px; height: 72px; border-radius: 20px; background: linear-gradient(135deg, #26c1c9, #0891b2); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 26px; font-weight: 800; }
  .go-info-row { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #334155; }
  .go-info-row:last-child { border-bottom: none; }
  .go-info-icon { color: var(--primary-cyan); flex-shrink: 0; }

  /* ── Vue détail candidat ── */
  .go-detail-avatar { width: 88px; height: 88px; border-radius: 24px; background: linear-gradient(135deg, #14b8a6, #0891b2); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 32px; font-weight: 900; flex-shrink: 0; overflow: hidden; }
  .go-detail-avatar img { width: 88px; height: 88px; border-radius: 24px; object-fit: cover; }
  .go-detail-card { background: #fff; border-radius: 20px; border: 1px solid #e2e8f0; padding: 28px; margin-bottom: 20px; }
  .go-detail-card h3 { font-size: 12px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.7px; margin-bottom: 18px; }
  .go-back-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 10px; border: 2px solid #e2e8f0; background: #fff; cursor: pointer; font-weight: 700; font-size: 13px; color: #475569; font-family: inherit; transition: 0.2s; }
  .go-back-btn:hover { border-color: var(--primary-cyan); color: var(--primary-cyan); }
  .go-skill-tag { background: rgba(20,184,166,0.1); color: var(--primary-cyan); padding: 6px 14px; border-radius: 8px; font-size: 13px; font-weight: 700; display: inline-block; }
`;

const GestionOffres = ({ onLogout }) => {
  const { t } = useLanguage();
  const [view, setView] = useState("offres");
  const [offres, setOffres] = useState([]);
  const [allCandidatures, setAllCandidatures] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCandModal, setShowCandModal] = useState(false);
  const [selectedCand, setSelectedCand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [logoUrl, setLogoUrl] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const logoInputRef = useRef(null);

  const [filtreOffreId, setFiltreOffreId] = useState("tous");

  // ✅ Vue dédiée candidat (page complète)
  const [detailCandView, setDetailCandView] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Panel modal candidat (garde pour rétrocompat depuis modal)
  const [showCandProfil, setShowCandProfil] = useState(false);
  const [candProfilData, setCandProfilData] = useState(null);
  const [loadingProfil, setLoadingProfil] = useState(false);

  // Statut dropdown
  const [openStatutId, setOpenStatutId] = useState(null);
  const statutRef = useRef(null);

  // Profil entreprise
  const [profilEdit, setProfilEdit] = useState(false);
  const [profilForm, setProfilForm] = useState({ nomEntreprise: "", secteur: "", ville: "", telephone: "", adresse: "", siteWeb: "", responsableRH: "" });
  const [savingProfil, setSavingProfil] = useState(false);

  // Visa
  const [showVisaModal, setShowVisaModal] = useState(false);
  const [candidatureAcceptee, setCandidatureAcceptee] = useState(null);
  const [visaForm, setVisaForm] = useState({ pays: "", typeVisa: "Visa Travail", dateDebut: "" });

  const user = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({ titre: "", description: "", localisation: "", typeContrat: "CDI", salaireMin: "", salaireMax: "", dateExpiration: "", nombrePostes: 1 });

  useEffect(() => {
    const handler = e => { if (statutRef.current && !statutRef.current.contains(e.target)) setOpenStatutId(null); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const resOffres = await api.get(`/offres/entreprise/${user.id}`);
      setOffres(resOffres.data);
      try {
        const resE = await api.get(`/entreprises/${user.id}`);
        if (resE.data?.logoUrl) setLogoUrl(`http://localhost:8081/api/entreprises/${user.id}/logo/view?t=${Date.now()}`);
        const d = resE.data || {};
        setProfilForm({ nomEntreprise: d.nomEntreprise || "", secteur: d.secteur || "", ville: d.ville || "", telephone: d.telephone || "", adresse: d.adresse || "", siteWeb: d.siteWeb || "", responsableRH: d.responsableRH || "" });
      } catch {}
      const allCands = [];
      await Promise.all(resOffres.data.map(async offre => {
        try {
          const res = await api.get(`/candidatures/entreprise/${offre.id}`);
          res.data.forEach(c => allCands.push({ ...c, offreTitre: offre.titre, offreId: offre.id }));
        } catch {}
      }));
      setAllCandidatures(allCands);
    } catch { toast.error("Erreur de synchronisation"); }
    finally { setLoading(false); }
  }, [user?.id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ✅ Ouvrir PAGE DÉDIÉE candidat
  const handleOpenCandDetail = async (cand, e) => {
    e.stopPropagation();
    setView("candidat-detail");
    setLoadingDetail(true);
    setDetailCandView(null);
    try {
      const res = await api.get(`/candidats/${cand.candidatId}`);
      setDetailCandView({ ...res.data, candidature: cand });
    } catch {
      setDetailCandView({ candidature: cand });
    } finally {
      setLoadingDetail(false);
    }
  };

  // Panel modal (depuis modal détail candidature)
  const handleOpenCandProfil = async (cand, e) => {
    e.stopPropagation();
    setShowCandProfil(true);
    setLoadingProfil(true);
    setCandProfilData(null);
    try {
      const res = await api.get(`/candidats/${cand.candidatId}`);
      setCandProfilData({ ...res.data, candidature: cand });
    } catch { setCandProfilData({ candidature: cand }); }
    finally { setLoadingProfil(false); }
  };

  const handleLogoChange = async e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setLogoPreview(ev.target.result);
    reader.readAsDataURL(file);
    const fd = new FormData(); fd.append("file", file);
    try {
      await api.post(`/entreprises/${user.id}/logo`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Logo mis à jour !");
      setLogoUrl(`http://localhost:8081/api/entreprises/${user.id}/logo/view?t=${Date.now()}`);
    } catch { toast.error("Erreur upload logo"); }
  };

  const handleSaveProfil = async () => {
    setSavingProfil(true);
    try { await api.put(`/entreprises/${user.id}`, profilForm); toast.success("✅ Profil mis à jour !"); setProfilEdit(false); }
    catch { toast.error("Erreur mise à jour profil"); }
    finally { setSavingProfil(false); }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post("/offres", { ...formData, entrepriseId: user.id, statut: "ouverte" });
      toast.success("Offre publiée !"); setShowModal(false);
      setFormData({ titre: "", description: "", localisation: "", typeContrat: "CDI", salaireMin: "", salaireMax: "", dateExpiration: "", nombrePostes: 1 });
      fetchData();
    } catch { toast.error("Erreur publication"); }
  };

  const handleToggleStatut = async offre => {
    const nouveauStatut = offre.statut === "ouverte" ? "fermée" : "ouverte";
    try { await api.put(`/offres/${offre.id}`, { ...offre, statut: nouveauStatut }); toast.info(`Offre marquée comme ${nouveauStatut}`); fetchData(); }
    catch { toast.error("Erreur statut"); }
  };

  const handleDelete = async id => {
    if (!window.confirm("Supprimer cette offre ?")) return;
    try { await api.delete(`/offres/${id}`); fetchData(); toast.success("Offre supprimée"); }
    catch { toast.error("Erreur suppression"); }
  };

  const handleUpdateStatutCand = async (candId, statut) => {
    try {
      await api.put(`/candidatures/${candId}/statut`, { statut });
      setOpenStatutId(null);
      if (statut === "ACCEPTEE") {
        const cand = allCandidatures.find(c => c.id === candId);
        setCandidatureAcceptee(cand);
        setShowCandModal(false);
        setShowVisaModal(true);
        toast.success("Candidature acceptée ! 🎉");
      } else {
        toast.info(statut === "REFUSEE" ? "Candidature refusée ❌" : "Statut mis à jour");
        setShowCandModal(false);
      }
      fetchData();
    } catch { toast.error("Erreur mise à jour statut"); }
  };

  const handleCreerVisa = async e => {
    e.preventDefault();
    try {
      await api.post(`/candidatures/${candidatureAcceptee.id}/visa`, visaForm);
      toast.success("✅ Demande de visa créée !"); setShowVisaModal(false);
      setVisaForm({ pays: "", typeVisa: "Visa Travail", dateDebut: "" }); setCandidatureAcceptee(null);
    } catch { toast.error("Erreur création visa"); }
  };

  const getScoreColor = s => s >= 70 ? "#16a34a" : s >= 40 ? "#d97706" : "#dc2626";
  const getScoreBg = s => s >= 70 ? "#f0fdf4" : s >= 40 ? "#fffbeb" : "#fef2f2";

  const getExpiryBadge = d => {
    if (!d) return null;
    const diff = Math.ceil((new Date(d) - new Date()) / 86400000);
    if (diff < 0) return <span className="go-expiry-warning go-expiry-expired">Expirée</span>;
    if (diff <= 7) return <span className="go-expiry-warning">⚠️ {diff}j restants</span>;
    return <span style={{ fontSize: '12px', color: '#64748b' }}>{new Date(d).toLocaleDateString('fr-FR')}</span>;
  };

  const getStatutBadge = statut => {
    const map = {
      EN_ATTENTE: { label: "En attente ⏳", cls: "go-status-attente" },
      ACCEPTEE: { label: "Acceptée ✅", cls: "go-status-acceptee" },
      REFUSEE: { label: "Refusée ❌", cls: "go-status-refusee" },
    };
    const s = map[statut] || map.EN_ATTENTE;
    return <span className={`go-status-badge ${s.cls}`}>{s.label}</span>;
  };

  const StatutDropdown = ({ cand }) => (
    <div className="go-statut-wrap" ref={openStatutId === cand.id ? statutRef : null}>
      <button
        onClick={e => { e.stopPropagation(); setOpenStatutId(openStatutId === cand.id ? null : cand.id); }}
        style={{ border: "none", background: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 4 }}
      >
        {getStatutBadge(cand.statut)}
        <ChevronDown size={12} color="#94a3b8" style={{ flexShrink: 0 }} />
      </button>
      {openStatutId === cand.id && (
        <div className="go-statut-dropdown">
          {[
            { val: "EN_ATTENTE", label: "En attente ⏳", color: "#d97706" },
            { val: "ACCEPTEE", label: "Acceptée ✅", color: "#16a34a" },
            { val: "REFUSEE", label: "Refusée ❌", color: "#dc2626" },
          ].map(opt => (
            <div key={opt.val} className="go-statut-option"
              style={{ color: cand.statut === opt.val ? opt.color : "#334155", fontWeight: cand.statut === opt.val ? 800 : 600 }}
              onClick={e => { e.stopPropagation(); handleUpdateStatutCand(cand.id, opt.val); }}>
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const nbAcceptees = allCandidatures.filter(c => c.statut === "ACCEPTEE").length;
  const nbRefusees = allCandidatures.filter(c => c.statut === "REFUSEE").length;
  const nbAttente = allCandidatures.filter(c => c.statut === "EN_ATTENTE").length;
  const tauxAccept = allCandidatures.length > 0 ? Math.round((nbAcceptees / allCandidatures.length) * 100) : 0;
  const scoresMoy = allCandidatures.filter(c => c.score != null);
  const scoreMoyen = scoresMoy.length > 0 ? Math.round(scoresMoy.reduce((a, c) => a + c.score, 0) / scoresMoy.length) : null;

  const currentLogo = logoPreview || logoUrl;
  const offresOuvertes = offres.filter(o => o.statut === "ouverte").length;
  const filteredOffres = offres.filter(o => o.titre.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredCand = allCandidatures.filter(c => {
    const ms = (c.offreTitre || "").toLowerCase().includes(searchTerm.toLowerCase());
    const mo = filtreOffreId === "tous" || String(c.offreId) === String(filtreOffreId);
    return ms && mo;
  });

  // Helpers vue détail
  const getInitials = data => {
    if (data?.prenom) return data.prenom[0].toUpperCase();
    if (data?.candidature?.candidatId) return data.candidature.candidatId.toString()[0];
    return "?";
  };
  const getFullName = data => {
    const name = [data?.prenom, data?.nom].filter(Boolean).join(" ");
    return name || `Candidat #${data?.candidature?.candidatId}`;
  };
  const parseCompetences = comp => {
    if (!comp) return [];
    if (Array.isArray(comp)) return comp;
    return comp.split(",").map(c => c.trim()).filter(Boolean);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="go-root">

        {/* ══════════════ SIDEBAR ══════════════ */}
        <aside className="go-sidebar">
          <div className="go-brand">
            <div className="go-brand-icon"><ShieldCheck size={18} /></div>
            <span className="go-brand-name">RecruitPro</span>
          </div>
          <input ref={logoInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleLogoChange} />
          <div className="go-logo-zone" onClick={() => logoInputRef.current?.click()}>
            {currentLogo
              ? <img src={currentLogo} alt="Logo" style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover", border: "2px solid rgba(255,255,255,0.2)", flexShrink: 0 }} />
              : <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Building2 size={20} color="#64748b" /></div>}
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>{currentLogo ? "Changer le logo" : "Ajouter un logo"}</div>
              <div style={{ color: "#64748b", fontSize: 11 }}>PNG, JPG, WEBP</div>
            </div>
            <Upload size={14} color="#64748b" />
          </div>
          <nav style={{ flex: 1 }}>
            <div className={`go-nav-item ${view === "offres" ? "active" : ""}`} onClick={() => setView("offres")}><Briefcase size={18} /><span>Mes offres</span></div>
            <div className={`go-nav-item ${view === "candidatures" || view === "candidat-detail" ? "active" : ""}`} onClick={() => setView("candidatures")}>
              <Users size={18} /><span>Candidatures</span>
              {allCandidatures.length > 0 && <span style={{ marginLeft: "auto", background: "var(--primary-cyan)", color: "#fff", borderRadius: 20, padding: "2px 8px", fontSize: 11, fontWeight: 800 }}>{allCandidatures.length}</span>}
            </div>
            <div className={`go-nav-item ${view === "statistiques" ? "active" : ""}`} onClick={() => setView("statistiques")}><TrendingUp size={18} /><span>Statistiques</span></div>
            <div className={`go-nav-item ${view === "profil" ? "active" : ""}`} onClick={() => setView("profil")}><Building2 size={18} /><span>Mon entreprise</span></div>
          </nav>
          <div className="go-sidebar-bottom">
            <LanguageSwitcher variant="dark" />
            <div className="go-nav-item" onClick={onLogout} style={{ color: "#f87171" }}><LogOut size={18} /><span>Déconnexion</span></div>
          </div>
        </aside>

        <main className="go-main">

          {/* ════ OFFRES ════ */}
          {view === "offres" && (<>
            <header className="go-header">
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {currentLogo && <img src={currentLogo} alt="Logo" style={{ width: 52, height: 52, borderRadius: 14, objectFit: "cover", border: "2px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />}
                <div>
                  <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px" }}>Mes offres</h1>
                  <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>{profilForm.nomEntreprise || user?.email}</p>
                </div>
              </div>
              <button className="go-btn-add" onClick={() => setShowModal(true)}><Plus size={18} /> Publier une offre</button>
            </header>
            <div className="go-stats">
              <div className="go-stat-card"><div className="go-stat-icon"><Briefcase size={20} /></div><div><h3 style={{ fontSize: 24, fontWeight: 800 }}>{offres.length}</h3><p style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>Total offres</p></div></div>
              <div className="go-stat-card"><div className="go-stat-icon" style={{ background: "#f0fdf4", color: "#16a34a" }}><ToggleRight size={20} /></div><div><h3 style={{ fontSize: 24, fontWeight: 800, color: "#16a34a" }}>{offresOuvertes}</h3><p style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>Offres ouvertes</p></div></div>
              <div className="go-stat-card"><div className="go-stat-icon"><Users size={20} /></div><div><h3 style={{ fontSize: 24, fontWeight: 800 }}>{allCandidatures.length}</h3><p style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>Candidatures</p></div></div>
            </div>
            <div className="go-search-wrapper">
              <Search size={18} style={{ position: 'absolute', left: 15, top: 13, color: '#94a3b8' }} />
              <input className="go-search-input" placeholder="Rechercher une offre..." onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="go-card-table">
              {loading ? <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Chargement...</div> : (
                <table className="go-table">
                  <thead><tr><th>Logo</th><th>Poste</th><th>Contrat</th><th>Postes</th><th>Salaire</th><th>Expiration</th><th>Statut</th><th style={{ textAlign: "right" }}>Action</th></tr></thead>
                  <tbody>
                    {filteredOffres.length === 0
                      ? <tr><td colSpan={8} style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>Aucune offre publiée</td></tr>
                      : filteredOffres.map(o => (
                        <tr key={o.id} style={{ opacity: o.statut === "fermée" ? 0.6 : 1 }}>
                          <td>{currentLogo ? <img src={currentLogo} alt="logo" style={{ width: 38, height: 38, borderRadius: 8, objectFit: "cover", border: "1px solid #e2e8f0" }} /> : <div style={{ width: 38, height: 38, borderRadius: 8, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}><Building2 size={16} color="#94a3b8" /></div>}</td>
                          <td><div style={{ fontWeight: 700 }}>{o.titre}</div><div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}><MapPin size={11} style={{ verticalAlign: "middle" }} /> {o.localisation}</div></td>
                          <td><span className="go-badge" style={{ background: "#eff6ff", color: "#1e40af" }}>{o.typeContrat}</span></td>
                          <td><div style={{ display: "flex", alignItems: "center", gap: 6 }}><UserCheck size={14} color="#14b8a6" /><span style={{ fontWeight: 700 }}>{o.nombrePostes || 1}</span></div></td>
                          <td>{o.salaireMin && o.salaireMax ? <span style={{ fontSize: 13, fontWeight: 600 }}>{o.salaireMin} – {o.salaireMax} DT</span> : <span style={{ color: "#94a3b8" }}>—</span>}</td>
                          <td>{getExpiryBadge(o.dateExpiration)}</td>
                          <td>
                            <button onClick={() => handleToggleStatut(o)} style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 8 }}>
                              {o.statut === "ouverte" ? <><ToggleRight size={20} color="#14b8a6" /><span style={{ fontSize: 11, fontWeight: 800, color: "#14b8a6" }}>OUVERTE</span></> : <><ToggleLeft size={20} color="#94a3b8" /><span style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8" }}>FERMÉE</span></>}
                            </button>
                          </td>
                          <td style={{ textAlign: "right" }}><button onClick={() => handleDelete(o.id)} style={{ border: "none", background: "#fee2e2", color: "#ef4444", cursor: "pointer", padding: 8, borderRadius: 8 }}><Trash2 size={16} /></button></td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          </>)}

          {/* ════ CANDIDATURES ════ */}
          {view === "candidatures" && (<>
            <header className="go-header">
              <div>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px" }}>Candidatures reçues</h1>
                <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>{filteredCand.length} candidature(s)</p>
              </div>
            </header>
            <div style={{ display: "flex", gap: 12, marginBottom: 24, alignItems: "center", flexWrap: "wrap" }}>
              <div className="go-search-wrapper" style={{ flex: 1, marginBottom: 0 }}>
                <Search size={18} style={{ position: 'absolute', left: 15, top: 13, color: '#94a3b8' }} />
                <input className="go-search-input" placeholder="Rechercher..." onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Filter size={16} color="#64748b" />
                <select className="go-filter-select" value={filtreOffreId} onChange={e => setFiltreOffreId(e.target.value)}>
                  <option value="tous">Toutes les offres</option>
                  {offres.map(o => <option key={o.id} value={o.id}>{o.titre}</option>)}
                </select>
              </div>
            </div>
            <div className="go-card-table">
              {loading ? <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>Chargement...</div> : (
                <table className="go-table">
                  <thead><tr><th>Candidat</th><th>Offre</th><th>Date</th><th>Score IA</th><th>Statut</th><th style={{ textAlign: "right" }}>Action</th></tr></thead>
                  <tbody>
                    {filteredCand.length === 0
                      ? <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>Aucune candidature</td></tr>
                      : filteredCand.map(c => (
                        <tr key={c.id} onClick={() => { setSelectedCand(c); setShowCandModal(true); }}>
                          {/* ✅ Clic nom → page dédiée */}
                          <td>
                            <button
                              onClick={e => handleOpenCandDetail(c, e)}
                              style={{ border: "none", background: "none", cursor: "pointer", fontWeight: 700, color: "#0f172a", fontSize: 14, padding: 0, textDecoration: "underline", textDecorationColor: "#e2e8f0", fontFamily: "inherit" }}
                            >
                              Candidat #{c.candidatId}
                            </button>
                          </td>
                          <td><span style={{ background: "#f1f5f9", padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600 }}>{c.offreTitre}</span></td>
                          <td><Calendar size={14} style={{ verticalAlign: "middle", marginRight: 4 }} />{new Date(c.dateEnvoi).toLocaleDateString('fr-FR')}</td>
                          <td>
                            {c.score != null ? (
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{ width: 60, height: 6, background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
                                  <div style={{ height: "100%", width: `${c.score}%`, background: getScoreColor(c.score), borderRadius: 99 }} />
                                </div>
                                <span style={{ fontWeight: 800, fontSize: 13, color: getScoreColor(c.score) }}>{Math.round(c.score)}%</span>
                              </div>
                            ) : <span style={{ color: "#94a3b8" }}>—</span>}
                          </td>
                          <td onClick={e => e.stopPropagation()}><StatutDropdown cand={c} /></td>
                          <td style={{ textAlign: "right" }}>
                            <button
                              onClick={e => { e.stopPropagation(); handleOpenCandDetail(c, e); }}
                              style={{ border: "none", background: "#f0fdf4", color: "#16a34a", cursor: "pointer", padding: "8px 14px", borderRadius: 8, fontWeight: 700, fontSize: 12, display: "inline-flex", alignItems: "center", gap: 6 }}
                            >
                              <Eye size={14} /> Voir
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          </>)}

          {/* ════ VUE DÉDIÉE CANDIDAT ════ */}
          {view === "candidat-detail" && (
            <>
              {/* Header avec retour + actions */}
              <header className="go-header" style={{ marginBottom: 24 }}>
                <button className="go-back-btn" onClick={() => setView("candidatures")}>
                  <ArrowLeft size={16} /> Retour aux candidatures
                </button>
                {detailCandView && detailCandView.candidature?.statut === "EN_ATTENTE" && (
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={() => { handleUpdateStatutCand(detailCandView.candidature.id, "ACCEPTEE"); setView("candidatures"); }}
                      style={{ padding: "10px 20px", background: "#f0fdf4", color: "#16a34a", border: "2px solid #bbf7d0", borderRadius: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 14 }}
                    >Accepter ✅</button>
                    <button
                      onClick={() => { handleUpdateStatutCand(detailCandView.candidature.id, "REFUSEE"); setView("candidatures"); }}
                      style={{ padding: "10px 20px", background: "#fee2e2", color: "#dc2626", border: "2px solid #fecaca", borderRadius: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 14 }}
                    >Refuser ❌</button>
                  </div>
                )}
              </header>

              {loadingDetail ? (
                <div style={{ textAlign: "center", padding: 80, color: "#64748b", fontSize: 16 }}>Chargement du profil...</div>
              ) : detailCandView ? (
                <div style={{ maxWidth: 900 }}>

                  {/* ── Carte en-tête candidat ── */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0", padding: 28 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                      <div className="go-detail-avatar">
                        {detailCandView.photoUrl
                          ? <img src={`http://localhost:8081/api/candidats/${detailCandView.candidature?.candidatId}/photo`} alt="photo" onError={e => { e.target.style.display = 'none'; }} />
                          : getInitials(detailCandView)
                        }
                      </div>
                      <div>
                        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px", marginBottom: 6 }}>
                          {getFullName(detailCandView)}
                        </h1>
                        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 4 }}>
                          Candidature pour : <strong style={{ color: "#0f172a" }}>{detailCandView.candidature?.offreTitre}</strong>
                        </p>
                        {(detailCandView.ville || detailCandView.nationalite) && (
                          <p style={{ color: "#94a3b8", fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}>
                            <MapPin size={13} /> {[detailCandView.ville, detailCandView.nationalite].filter(Boolean).join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                    {getStatutBadge(detailCandView.candidature?.statut)}
                  </div>

                  {/* ── Grille 2 colonnes ── */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 0 }}>

                    {/* Infos personnelles */}
                    <div className="go-detail-card">
                      <h3>Informations personnelles</h3>
                      {detailCandView.email && (
                        <div className="go-info-row"><Mail size={16} className="go-info-icon" /><span>{detailCandView.email}</span></div>
                      )}
                      {detailCandView.telephone && (
                        <div className="go-info-row"><Phone size={16} className="go-info-icon" /><span>{detailCandView.telephone}</span></div>
                      )}
                      {(detailCandView.ville || detailCandView.nationalite) && (
                        <div className="go-info-row"><MapPin size={16} className="go-info-icon" /><span>{[detailCandView.ville, detailCandView.nationalite].filter(Boolean).join(", ")}</span></div>
                      )}
                      {detailCandView.linkedin && (
                        <div className="go-info-row">
                          <Linkedin size={16} className="go-info-icon" />
                          <a href={detailCandView.linkedin} target="_blank" rel="noreferrer" style={{ color: "var(--primary-cyan)", fontWeight: 600, textDecoration: "none" }}>Voir LinkedIn</a>
                        </div>
                      )}
                      {!detailCandView.email && !detailCandView.telephone && !detailCandView.ville && !detailCandView.linkedin && (
                        <p style={{ color: "#94a3b8", fontSize: 13 }}>Aucune information disponible</p>
                      )}
                    </div>

                    {/* Détails candidature */}
                    <div className="go-detail-card">
                      <h3>Détails candidature</h3>
                      <div className="go-info-row">
                        <Calendar size={16} className="go-info-icon" />
                        <span>Date : {new Date(detailCandView.candidature?.dateEnvoi).toLocaleDateString("fr-FR")}</span>
                      </div>
                      {detailCandView.experience && (
                        <div className="go-info-row"><Briefcase size={16} className="go-info-icon" /><span>Expérience : {detailCandView.experience}</span></div>
                      )}
                      {detailCandView.formation && (
                        <div className="go-info-row"><BookOpen size={16} className="go-info-icon" /><span>{detailCandView.formation}</span></div>
                      )}
                      {detailCandView.candidature?.cvId && (
                        <div className="go-info-row" style={{ marginTop: 4 }}>
                          <FileText size={16} className="go-info-icon" />
                          <a href={`http://localhost:8081/api/candidatures/${detailCandView.candidature.id}/cv`} target="_blank" rel="noreferrer"
                            style={{ color: "#1e40af", fontWeight: 700, textDecoration: "none", background: "#eff6ff", padding: "4px 12px", borderRadius: 6, fontSize: 13 }}>
                            📄 Voir le CV
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── Score IA ── */}
                  {detailCandView.candidature?.score != null && (
                    <div className="go-detail-card" style={{ marginTop: 20 }}>
                      <h3>Score IA 🤖</h3>
                      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                        <div style={{ flex: 1, height: 12, background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${detailCandView.candidature.score}%`, background: getScoreColor(detailCandView.candidature.score), borderRadius: 99, transition: "width 1s ease" }} />
                        </div>
                        <span style={{ fontSize: 28, fontWeight: 900, color: getScoreColor(detailCandView.candidature.score), minWidth: 64 }}>
                          {Math.round(detailCandView.candidature.score)}%
                        </span>
                      </div>
                      <p style={{ marginTop: 10, fontSize: 13, fontWeight: 700, color: getScoreColor(detailCandView.candidature.score) }}>
                        {detailCandView.candidature.score >= 70 ? "✅ Excellent profil" : detailCandView.candidature.score >= 40 ? "⚠️ Profil moyen" : "❌ Profil faible"}
                      </p>
                    </div>
                  )}

                  {/* ── Résumé ── */}
                  {detailCandView.resume && (
                    <div className="go-detail-card" style={{ marginTop: 20 }}>
                      <h3>Résumé</h3>
                      <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.8 }}>{detailCandView.resume}</p>
                    </div>
                  )}

                  {/* ── Compétences ── */}
                  {detailCandView.competences && parseCompetences(detailCandView.competences).length > 0 && (
                    <div className="go-detail-card" style={{ marginTop: 20 }}>
                      <h3>Compétences</h3>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {parseCompetences(detailCandView.competences).map((c, i) => (
                          <span key={i} className="go-skill-tag">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Lettre de motivation ── */}
                  {detailCandView.candidature?.lettreMotivation && (
                    <div className="go-detail-card" style={{ marginTop: 20 }}>
                      <h3>Lettre de motivation</h3>
                      <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.8 }}>{detailCandView.candidature.lettreMotivation}</p>
                    </div>
                  )}

                  {/* ── Analyse IA ── */}
                  {detailCandView.candidature?.aiFeedback && detailCandView.candidature.aiFeedback !== "Analyse indisponible pour le moment." && (
                    <div style={{ background: "#f0f9ff", borderRadius: 20, border: "1px solid #bae6fd", padding: 28, marginTop: 20 }}>
                      <h3 style={{ fontSize: 12, fontWeight: 800, color: "#0c4a6e", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 14 }}>Analyse IA 🤖</h3>
                      <p style={{ color: "#0c4a6e", fontSize: 14, lineHeight: 1.8 }}>{detailCandView.candidature.aiFeedback}</p>
                    </div>
                  )}

                </div>
              ) : (
                <div style={{ textAlign: "center", padding: 80, color: "#94a3b8" }}>Profil introuvable</div>
              )}
            </>
          )}

          {/* ════ STATISTIQUES ════ */}
          {view === "statistiques" && (<>
            <header className="go-header">
              <div><h1 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px" }}>Statistiques 📊</h1><p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>Vue d'ensemble de vos recrutements</p></div>
            </header>
            <div className="go-stats-5">
              {[
                { label: "Total candidatures", val: allCandidatures.length, color: "#0f172a" },
                { label: "✅ Acceptées", val: nbAcceptees, color: "#16a34a" },
                { label: "❌ Refusées", val: nbRefusees, color: "#dc2626" },
                { label: "⏳ En attente", val: nbAttente, color: "#d97706" },
                { label: "🤖 Score moyen", val: scoreMoyen != null ? `${scoreMoyen}%` : "—", color: scoreMoyen != null ? getScoreColor(scoreMoyen) : "#94a3b8" }
              ].map(s => (
                <div key={s.label} className="go-stat-card-sm">
                  <p style={{ fontSize: 12, color: "#64748b", fontWeight: 700, marginBottom: 8 }}>{s.label}</p>
                  <h3 style={{ fontSize: 28, fontWeight: 900, color: s.color }}>{s.val}</h3>
                </div>
              ))}
            </div>
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0", padding: 28, marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ fontWeight: 800, fontSize: 16 }}>Taux d'acceptation</h3>
                <span style={{ fontSize: 28, fontWeight: 900, color: tauxAccept >= 50 ? "#16a34a" : "#d97706" }}>{tauxAccept}%</span>
              </div>
              <div className="go-taux-bar"><div style={{ height: "100%", width: `${tauxAccept}%`, background: tauxAccept >= 50 ? "#16a34a" : "#d97706", borderRadius: 99, transition: "width 1s ease" }} /></div>
              <div style={{ display: "flex", gap: 24, marginTop: 16 }}>
                {[{ color: "#16a34a", label: `Acceptées: ${nbAcceptees}` }, { color: "#dc2626", label: `Refusées: ${nbRefusees}` }, { color: "#d97706", label: `En attente: ${nbAttente}` }].map(x => (
                  <div key={x.label} style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 10, height: 10, borderRadius: "50%", background: x.color }} /><span style={{ fontSize: 13, color: "#64748b" }}>{x.label}</span></div>
                ))}
              </div>
            </div>
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0", padding: 28 }}>
              <h3 style={{ fontWeight: 800, fontSize: 16, marginBottom: 20 }}>Candidatures par offre</h3>
              {offres.map(o => {
                const cands = allCandidatures.filter(c => String(c.offreId) === String(o.id));
                const pct = allCandidatures.length > 0 ? Math.round((cands.length / allCandidatures.length) * 100) : 0;
                return (
                  <div key={o.id} style={{ marginBottom: 18 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{o.titre}</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: "var(--primary-cyan)" }}>{cands.length}</span>
                    </div>
                    <div style={{ width: "100%", height: 8, background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: "var(--primary-cyan)", borderRadius: 99 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </>)}

          {/* ════ PROFIL ENTREPRISE ════ */}
          {view === "profil" && (<>
            <header className="go-header">
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {currentLogo && <img src={currentLogo} alt="Logo" style={{ width: 52, height: 52, borderRadius: 14, objectFit: "cover", border: "2px solid #e2e8f0" }} />}
                <div><h1 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px" }}>Mon entreprise 🏢</h1><p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>Gérez les informations de votre entreprise</p></div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                {profilEdit ? (
                  <>
                    <button onClick={handleSaveProfil} disabled={savingProfil} className="go-btn-add"><Save size={16} />{savingProfil ? "Sauvegarde..." : "Sauvegarder"}</button>
                    <button onClick={() => setProfilEdit(false)} style={{ padding: "10px 18px", borderRadius: 10, border: "2px solid #e2e8f0", background: "#fff", cursor: "pointer", fontWeight: 600, color: "#64748b", fontFamily: "inherit" }}>Annuler</button>
                  </>
                ) : (
                  <button onClick={() => setProfilEdit(true)} style={{ padding: "10px 18px", borderRadius: 10, border: "2px solid #e2e8f0", background: "#fff", cursor: "pointer", fontWeight: 600, color: "#64748b", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8 }}><Edit3 size={16} /> Modifier</button>
                )}
              </div>
            </header>
            <div className="go-profil-card">
              <div style={{ marginBottom: 28, paddingBottom: 28, borderBottom: "2px solid #f1f5f9" }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 12 }}>Logo de l'entreprise</label>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  {currentLogo ? <img src={currentLogo} alt="Logo" style={{ width: 72, height: 72, borderRadius: 16, objectFit: "cover", border: "2px solid #e2e8f0" }} /> : <div style={{ width: 72, height: 72, borderRadius: 16, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}><Building2 size={28} color="#94a3b8" /></div>}
                  <button onClick={() => logoInputRef.current?.click()} style={{ padding: "10px 18px", borderRadius: 10, border: "2px solid #e2e8f0", background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 13, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8, color: "#475569" }}><Upload size={14} /> Changer le logo</button>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { label: "Nom de l'entreprise", key: "nomEntreprise", ph: "ex: Orange Tunisie" },
                  { label: "Secteur d'activité", key: "secteur", ph: "ex: Télécommunications" },
                  { label: "Ville", key: "ville", ph: "ex: Tunis" },
                  { label: "Téléphone", key: "telephone", ph: "ex: +216 71 XXX XXX" },
                  { label: "Responsable RH", key: "responsableRH", ph: "ex: Nom Prénom" },
                  { label: "Site web", key: "siteWeb", ph: "ex: https://orange.tn" }
                ].map(f => (
                  <div key={f.key} className="go-field">
                    <label>{f.label}</label>
                    <input value={profilForm[f.key]} disabled={!profilEdit} placeholder={f.ph} onChange={e => setProfilForm({ ...profilForm, [f.key]: e.target.value })} />
                  </div>
                ))}
                <div className="go-field" style={{ gridColumn: "span 2" }}><label>Adresse</label><input value={profilForm.adresse} disabled={!profilEdit} placeholder="ex: Avenue Mohamed V, Tunis" onChange={e => setProfilForm({ ...profilForm, adresse: e.target.value })} /></div>
                <div className="go-field" style={{ gridColumn: "span 2" }}><label>Email</label><input value={user?.email || ""} disabled /></div>
              </div>
            </div>
          </>)}

        </main>
      </div>

      {/* ══════ MODAL PUBLIER OFFRE ══════ */}
      {showModal && (
        <div className="go-overlay" onClick={() => setShowModal(false)}>
          <div className="go-modal" onClick={e => e.stopPropagation()}>
            <h2 className="go-modal-title">📋 Publier une offre</h2>
            <form onSubmit={handleSubmit}>
              <div className="go-field"><label>Titre du poste *</label><input required placeholder="ex: Développeur Fullstack" onChange={e => setFormData({ ...formData, titre: e.target.value })} /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
                <div className="go-field"><label>Type de contrat</label><select onChange={e => setFormData({ ...formData, typeContrat: e.target.value })}><option>CDI</option><option>STAGE</option><option>CDD</option><option>FREELANCE</option></select></div>
                <div className="go-field"><label>Localisation *</label><input required placeholder="ex: Tunis" onChange={e => setFormData({ ...formData, localisation: e.target.value })} /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 15 }}>
                <div className="go-field"><label>Salaire Min (DT)</label><input type="number" placeholder="1500" onChange={e => setFormData({ ...formData, salaireMin: e.target.value })} /></div>
                <div className="go-field"><label>Salaire Max (DT)</label><input type="number" placeholder="3000" onChange={e => setFormData({ ...formData, salaireMax: e.target.value })} /></div>
                <div className="go-field"><label>Nb. postes</label><input type="number" min="1" defaultValue="1" onChange={e => setFormData({ ...formData, nombrePostes: parseInt(e.target.value) })} /></div>
              </div>
              <div className="go-field"><label>Date d'expiration *</label><input type="date" required min={new Date().toISOString().split('T')[0]} onChange={e => setFormData({ ...formData, dateExpiration: e.target.value })} /></div>
              <div className="go-field"><label>Description</label><textarea rows="4" placeholder="Décrivez le poste..." onChange={e => setFormData({ ...formData, description: e.target.value })} /></div>
              <div style={{ display: "flex", gap: 12 }}>
                <button type="submit" className="go-btn-add" style={{ flex: 1, justifyContent: "center" }}><Plus size={18} /> Publier l'offre</button>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: "12px 20px", borderRadius: 12, border: "2px solid #e2e8f0", background: "#fff", cursor: "pointer", fontWeight: 600, color: "#64748b", fontFamily: "inherit" }}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════ MODAL DETAIL CANDIDATURE ══════ */}
      {showCandModal && selectedCand && (
        <div className="go-overlay" onClick={() => setShowCandModal(false)}>
          <div className="go-cand-modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800 }}>Détail candidature</h2>
              <button onClick={() => setShowCandModal(false)} style={{ border: "none", background: "#f1f5f9", borderRadius: 8, padding: 8, cursor: "pointer" }}><X size={18} /></button>
            </div>
            <div style={{ background: "#f8fafc", borderRadius: 16, padding: 20, marginBottom: 20, display: "flex", alignItems: "center", gap: 14 }}>
              {currentLogo && <img src={currentLogo} alt="logo" style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }} />}
              <div><div style={{ fontSize: 13, color: "#64748b", marginBottom: 2 }}>Offre</div><div style={{ fontWeight: 800, fontSize: 16 }}>{selectedCand.offreTitre}</div></div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 4 }}>Candidat</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontWeight: 600 }}>Candidat #{selectedCand.candidatId}</div>
                <button
                  onClick={e => { setShowCandModal(false); handleOpenCandDetail(selectedCand, e); }}
                  style={{ border: "none", background: "#f0f9ff", color: "#0891b2", cursor: "pointer", padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}
                >
                  👤 Voir profil complet
                </button>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}><div style={{ fontSize: 13, color: "#64748b", marginBottom: 4 }}>Date d'envoi</div><div style={{ fontWeight: 600 }}>{new Date(selectedCand.dateEnvoi).toLocaleDateString('fr-FR')}</div></div>
            {selectedCand.score != null && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: "#64748b", marginBottom: 10 }}>Score IA 🤖</div>
                <div style={{ background: getScoreBg(selectedCand.score), borderRadius: 16, padding: 20, border: `2px solid ${getScoreColor(selectedCand.score)}22` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>Compatibilité CV / Offre</span>
                    <span style={{ fontSize: 28, fontWeight: 900, color: getScoreColor(selectedCand.score) }}>{Math.round(selectedCand.score)}%</span>
                  </div>
                  <div style={{ width: "100%", height: 10, background: "#e2e8f0", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${selectedCand.score}%`, background: getScoreColor(selectedCand.score), borderRadius: 99, transition: "width 0.8s ease" }} />
                  </div>
                  <div style={{ marginTop: 10, fontSize: 12, fontWeight: 700, color: getScoreColor(selectedCand.score) }}>
                    {selectedCand.score >= 70 ? "✅ Excellent profil" : selectedCand.score >= 40 ? "⚠️ Profil moyen" : "❌ Profil faible"}
                  </div>
                </div>
              </div>
            )}
            {selectedCand.aiFeedback && selectedCand.aiFeedback !== "Analyse indisponible pour le moment." && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>Analyse IA 🤖</div>
                <div style={{ background: "#f0f9ff", borderRadius: 12, padding: 16, fontSize: 14, lineHeight: 1.7, color: "#0c4a6e", border: "1px solid #bae6fd" }}>{selectedCand.aiFeedback}</div>
              </div>
            )}
            {selectedCand.cvId && (
              <a href={"http://localhost:8081/api/candidatures/" + selectedCand.id + "/cv"} target="_blank" rel="noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", background: "#eff6ff", color: "#1e40af", borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: "none", marginBottom: 20, border: "2px solid #bfdbfe" }}>
                📄 Voir le CV
              </a>
            )}
            {selectedCand.lettreMotivation && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>Lettre de motivation</div>
                <div style={{ background: "#f8fafc", borderRadius: 12, padding: 16, fontSize: 14, lineHeight: 1.7, color: "#334155" }}>{selectedCand.lettreMotivation}</div>
              </div>
            )}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>Statut actuel</div>
              {getStatutBadge(selectedCand.statut)}
            </div>
            {selectedCand.statut === "EN_ATTENTE" && (
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => handleUpdateStatutCand(selectedCand.id, "ACCEPTEE")} style={{ flex: 1, padding: 12, background: "#f0fdf4", color: "#16a34a", border: "2px solid #bbf7d0", borderRadius: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 14 }}>Accepter ✅</button>
                <button onClick={() => handleUpdateStatutCand(selectedCand.id, "REFUSEE")} style={{ flex: 1, padding: 12, background: "#fee2e2", color: "#dc2626", border: "2px solid #fecaca", borderRadius: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 14 }}>Refuser ❌</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════ PANEL PROFIL CANDIDAT (modal) ══════ */}
      {showCandProfil && (
        <div className="go-overlay" onClick={() => setShowCandProfil(false)}>
          <div className="go-cand-detail" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800 }}>👤 Profil candidat</h2>
              <button onClick={() => setShowCandProfil(false)} style={{ border: "none", background: "#f1f5f9", borderRadius: 8, padding: 8, cursor: "pointer" }}><X size={18} /></button>
            </div>
            {loadingProfil ? (
              <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>Chargement...</div>
            ) : candProfilData ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, paddingBottom: 24, borderBottom: "2px solid #f1f5f9" }}>
                  <div>
                    {candProfilData.photoUrl
                      ? <img src={`http://localhost:8081/api/candidats/${candProfilData.candidature?.candidatId}/photo`} alt="photo" className="go-cand-avatar-lg" onError={e => { e.target.style.display = 'none'; }} />
                      : <div className="go-cand-avatar-fallback">{candProfilData.prenom ? candProfilData.prenom[0].toUpperCase() : candProfilData.candidature?.candidatId?.toString()[0] || "?"}</div>
                    }
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
                      {[candProfilData.prenom, candProfilData.nom].filter(Boolean).join(" ") || `Candidat #${candProfilData.candidature?.candidatId}`}
                    </div>
                    {candProfilData.ville && <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}><MapPin size={13} style={{ verticalAlign: "middle" }} /> {candProfilData.ville}</div>}
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  {candProfilData.telephone && <div className="go-info-row"><Phone size={16} className="go-info-icon" /><span>{candProfilData.telephone}</span></div>}
                  {candProfilData.nationalite && <div className="go-info-row"><Globe size={16} className="go-info-icon" /><span>{candProfilData.nationalite}</span></div>}
                  {candProfilData.linkedin && <div className="go-info-row"><Linkedin size={16} className="go-info-icon" /><a href={candProfilData.linkedin} target="_blank" rel="noreferrer" style={{ color: "var(--primary-cyan)", fontWeight: 600 }}>{candProfilData.linkedin}</a></div>}
                </div>
                {candProfilData.candidature && (
                  <div style={{ background: "#f8fafc", borderRadius: 14, padding: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>Candidature</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 700 }}>{candProfilData.candidature.offreTitre}</span>
                      {getStatutBadge(candProfilData.candidature.statut)}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{new Date(candProfilData.candidature.dateEnvoi).toLocaleDateString('fr-FR')}</div>
                    {candProfilData.candidature.score != null && (
                      <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, height: 6, background: "#e2e8f0", borderRadius: 99, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${candProfilData.candidature.score}%`, background: getScoreColor(candProfilData.candidature.score), borderRadius: 99 }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 800, color: getScoreColor(candProfilData.candidature.score) }}>{Math.round(candProfilData.candidature.score)}%</span>
                      </div>
                    )}
                    {candProfilData.candidature.cvId && (
                      <a href={`http://localhost:8081/api/candidatures/${candProfilData.candidature.id}/cv`} target="_blank" rel="noreferrer"
                        style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, padding: "8px 14px", background: "#eff6ff", color: "#1e40af", borderRadius: 8, fontWeight: 700, fontSize: 12, textDecoration: "none" }}>
                        <FileText size={14} /> Voir le CV
                      </a>
                    )}
                  </div>
                )}
                {candProfilData.candidature?.statut === "EN_ATTENTE" && (
                  <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                    <button onClick={() => { handleUpdateStatutCand(candProfilData.candidature.id, "ACCEPTEE"); setShowCandProfil(false); }} style={{ flex: 1, padding: "10px", background: "#f0fdf4", color: "#16a34a", border: "2px solid #bbf7d0", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>Accepter ✅</button>
                    <button onClick={() => { handleUpdateStatutCand(candProfilData.candidature.id, "REFUSEE"); setShowCandProfil(false); }} style={{ flex: 1, padding: "10px", background: "#fee2e2", color: "#dc2626", border: "2px solid #fecaca", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>Refuser ❌</button>
                  </div>
                )}
              </>
            ) : <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>Profil introuvable</div>}
          </div>
        </div>
      )}

      {/* ══════ MODAL VISA ══════ */}
      {showVisaModal && candidatureAcceptee && (
        <div className="go-overlay" onClick={() => setShowVisaModal(false)}>
          <div className="go-modal" onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 52, marginBottom: 8 }}>✈️</div>
              <h2 className="go-modal-title" style={{ textAlign: "center", marginBottom: 8 }}>Créer demande de visa</h2>
              <p style={{ color: "#64748b", fontSize: 14 }}>Candidat #{candidatureAcceptee.candidatId} · {candidatureAcceptee.offreTitre}</p>
            </div>
            <div style={{ background: "#f0fdf4", borderRadius: 12, padding: "14px 16px", marginBottom: 24, border: "1px solid #bbf7d0" }}>
              <p style={{ fontSize: 13, color: "#15803d", margin: 0, lineHeight: 1.8 }}>✅ Email de confirmation envoyé<br />📄 Documents requis disponibles dans le dashboard<br />✈️ Visa créé automatiquement après soumission</p>
            </div>
            <form onSubmit={handleCreerVisa}>
              <div className="go-field"><label>Pays de destination *</label><input required placeholder="ex: France, Canada..." value={visaForm.pays} onChange={e => setVisaForm({ ...visaForm, pays: e.target.value })} /></div>
              <div className="go-field"><label>Type de visa</label><select value={visaForm.typeVisa} onChange={e => setVisaForm({ ...visaForm, typeVisa: e.target.value })}><option>Visa Travail</option><option>Visa Étudiant</option><option>Visa Affaires</option><option>Visa Touriste</option></select></div>
              <div className="go-field"><label>Date de début souhaitée</label><input type="date" value={visaForm.dateDebut} onChange={e => setVisaForm({ ...visaForm, dateDebut: e.target.value })} /></div>
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button type="submit" className="go-btn-add" style={{ flex: 1, justifyContent: "center" }}>✈️ Créer la demande de visa</button>
                <button type="button" onClick={() => setShowVisaModal(false)} style={{ padding: "12px 20px", borderRadius: 12, border: "2px solid #e2e8f0", background: "#fff", cursor: "pointer", fontWeight: 600, color: "#64748b", fontFamily: "inherit" }}>Plus tard</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default GestionOffres;