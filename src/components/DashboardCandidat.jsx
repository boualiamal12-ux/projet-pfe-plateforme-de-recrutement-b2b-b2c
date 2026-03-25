import React, { useState, useEffect, useCallback, useRef } from "react";
import api from "../api/axiosConfig";
import {
  Briefcase, MapPin, Search, LogOut, FileText,
  Clock, CheckCircle, Filter, ArrowLeft,
  Upload, Sparkles, User, Edit, Save, X, Plane, Plus, Building2,
  Bell, Eye, Camera, BookOpen, Play, ExternalLink,
  Zap, AlertCircle, TrendingUp, BookMarked, FileEdit
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
  .dc-btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
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
  .dc-notif-btn { position: relative; background: rgba(255,255,255,0.08); border: 1.5px solid rgba(255,255,255,0.15); border-radius: 12px; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.3s; }
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
  .dc-progress-steps { display: flex; align-items: center; margin-top: 14px; }
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
  .dc-cours-card { background: #fff; border-radius: 20px; border: 2px solid #e2e8f0; overflow: hidden; transition: 0.3s; cursor: pointer; }
  .dc-cours-card:hover { border-color: var(--cyan); transform: translateY(-3px); box-shadow: 0 16px 40px rgba(38,193,201,0.12); }
  .dc-cours-thumb-placeholder { width: 100%; height: 140px; background: linear-gradient(135deg, #060b13 0%, #0c1f3d 100%); display: flex; align-items: center; justify-content: center; position: relative; }
  .dc-cours-body { padding: 18px; }
  .dc-cours-title { font-size: 14px; font-weight: 800; color: var(--text-dark); margin-bottom: 6px; line-height: 1.4; }
  .dc-cours-desc { font-size: 12px; color: var(--muted); line-height: 1.6; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .dc-cours-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1px solid #f1f5f9; }
  .dc-niveau-badge { padding: 3px 9px; border-radius: 6px; font-size: 10px; font-weight: 800; }
  .dc-niveau-debutant { background: #f0fdf4; color: #16a34a; }
  .dc-niveau-intermediaire { background: #fef3c7; color: #d97706; }
  .dc-niveau-avance { background: #fee2e2; color: #dc2626; }
  .dc-welcome-banner {
    background: linear-gradient(135deg, #060b13 0%, #0c2240 60%, #0f2a4a 100%);
    border-radius: 20px; padding: 28px 32px; margin-bottom: 28px;
    display: flex; align-items: center; justify-content: space-between;
    border: 1px solid rgba(38,193,201,0.15); position: relative; overflow: visible;
  }
  .dc-welcome-banner::before {
    content: ''; position: absolute; top: -40px; right: -40px;
    width: 200px; height: 200px; background: var(--cyan);
    border-radius: 50%; opacity: 0.06; pointer-events: none;
  }
  .dc-welcome-name { font-size: 22px; font-weight: 800; color: #fff; margin-bottom: 4px; }
  .dc-welcome-sub { font-size: 13px; color: #94a3b8; }
  @keyframes dc-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .dc-cours-card:hover .dc-cours-play-overlay { opacity: 1 !important; }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  /* ── SMART MATCH ── */
  .sm-section { margin-top: 32px; border-top: 2px solid #f1f5f9; padding-top: 28px; }
  .sm-banner {
    background: linear-gradient(135deg, #060b13 0%, #0c1f3d 100%);
    border-radius: 20px; padding: 24px 28px;
    border: 1px solid rgba(38,193,201,0.2);
    display: flex; align-items: center; justify-content: space-between;
    position: relative; overflow: hidden; gap: 20px;
  }
  .sm-banner::before { content: ''; position: absolute; top: -30px; right: 60px; width: 140px; height: 140px; background: #26c1c9; border-radius: 50%; opacity: 0.07; pointer-events: none; }
  .sm-banner-left { position: relative; z-index: 1; flex: 1; }
  .sm-banner-title { font-size: 17px; font-weight: 800; color: #fff; margin-bottom: 4px; display: flex; align-items: center; gap: 8px; }
  .sm-banner-sub { font-size: 12px; color: #94a3b8; }
  .sm-btn-analyze { background: var(--cyan); color: #060b13; border: none; padding: 11px 22px; border-radius: 12px; font-weight: 800; font-size: 13px; cursor: pointer; font-family: inherit; display: flex; align-items: center; gap: 8px; transition: 0.3s; position: relative; z-index: 1; flex-shrink: 0; }
  .sm-btn-analyze:hover { background: #1eb8c0; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(38,193,201,0.35); }
  .sm-btn-analyze:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }
  .sm-upload-row { display: flex; align-items: center; gap: 12px; margin-top: 16px; }
  .sm-upload-label { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.07); border: 2px dashed rgba(255,255,255,0.15); border-radius: 12px; padding: 11px 18px; cursor: pointer; font-size: 13px; font-weight: 600; color: #94a3b8; transition: 0.3s; flex: 1; }
  .sm-upload-label:hover { border-color: var(--cyan); color: var(--cyan); }
  .sm-upload-label.has-file { border-color: var(--cyan); color: var(--cyan); background: rgba(38,193,201,0.08); }
  .sm-score-ring { position: relative; width: 100px; height: 100px; flex-shrink: 0; }
  .sm-score-ring svg { transform: rotate(-90deg); }
  .sm-score-val { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; flex-direction: column; }
  .sm-score-num { font-size: 26px; font-weight: 800; line-height: 1; }
  .sm-score-pct { font-size: 11px; font-weight: 700; color: #94a3b8; }
  .sm-result-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 20px; animation: fadeIn 0.4s ease; }
  .sm-panel { background: #fff; border-radius: 16px; padding: 20px; border: 1.5px solid #e2e8f0; }
  .sm-panel-title { font-size: 13px; font-weight: 800; margin-bottom: 14px; display: flex; align-items: center; gap: 7px; }
  .sm-skill-chip { display: inline-flex; align-items: center; gap: 5px; padding: 5px 11px; border-radius: 20px; font-size: 12px; font-weight: 700; margin: 3px; }
  .sm-skill-missing { background: #fee2e2; color: #dc2626; }
  .sm-skill-strength { background: #f0fdf4; color: #16a34a; }
  .sm-cours-mini { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: #f8fafc; border-radius: 10px; border: 1.5px solid #e2e8f0; margin-bottom: 8px; cursor: pointer; transition: 0.2s; }
  .sm-cours-mini:hover { border-color: var(--cyan); background: rgba(38,193,201,0.04); }
  .sm-cours-mini-icon { width: 34px; height: 34px; border-radius: 9px; background: linear-gradient(135deg,#26c1c9,#0891b2); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; font-size: 13px; flex-shrink: 0; }
  .sm-loading-bar { height: 10px; background: linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%); background-size: 400% 100%; animation: shimmer 1.4s infinite; border-radius: 6px; }

  /* ── LETTRE MOTIVATION IA ── */
  .lm-section { margin-top: 20px; }
  .lm-generate-btn { display: flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 10px; border: 2px solid rgba(38,193,201,0.4); background: rgba(38,193,201,0.07); color: var(--cyan); font-weight: 700; font-size: 13px; cursor: pointer; font-family: inherit; transition: 0.3s; }
  .lm-generate-btn:hover { background: rgba(38,193,201,0.14); border-color: var(--cyan); }
  .lm-generate-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .lm-textarea-wrap { position: relative; margin-top: 10px; }
  .lm-textarea { width: 100%; min-height: 160px; padding: 14px; border-radius: 12px; border: 2px solid #e2e8f0; background: #f8fafc; font-family: inherit; font-size: 14px; line-height: 1.7; outline: none; transition: 0.3s; resize: vertical; }
  .lm-textarea:focus { border-color: var(--cyan); background: #fff; }
  .lm-badge { position: absolute; top: -10px; right: 14px; background: linear-gradient(135deg,#26c1c9,#0891b2); color: #fff; font-size: 10px; font-weight: 800; padding: 3px 10px; border-radius: 20px; display: flex; align-items: center; gap: 4px; }

  @media (max-width: 950px) { .dc-sidebar { display: none; } .dc-grid { grid-template-columns: 1fr; } .sm-result-grid { grid-template-columns: 1fr; } }
`;

const CONTRATS = ["Tous", "CDI", "CDD", "STAGE", "FREELANCE"];
const CATEGORIES_COURS = ["Tous", "Développement", "Marketing", "Design", "Data", "Management", "Langues"];
const logoCache = {};

// ── PDF text extractor ──
async function extractTextFromPDF(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const typedArray = new Uint8Array(e.target.result);
        if (window.pdfjsLib) {
          const pdf = await window.pdfjsLib.getDocument({ data: typedArray }).promise;
          let fullText = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            fullText += content.items.map(item => item.str).join(" ") + "\n";
          }
          resolve(fullText.trim());
        } else {
          const text = new TextDecoder("utf-8", { fatal: false }).decode(typedArray);
          resolve(text.replace(/[^\x20-\x7E\n]/g, " ").replace(/\s+/g, " ").trim());
        }
      } catch (err) { reject(err); }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

function loadPDFjs() {
  if (window.pdfjsLib) return;
  const script = document.createElement("script");
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
  script.onload = () => {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  };
  document.head.appendChild(script);
}

// ── Helper: résoudre l'ID de l'offre de façon sécurisée ──
function resolveOffreId(offre) {
  if (!offre) return null;
  const id = offre.id ?? offre.offreId ?? offre.ID ?? null;
  return id !== null && id !== undefined ? Number(id) : null;
}

// ── Logo hook ──
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
  const iframeSrc = coords ? `https://www.openstreetmap.org/export/embed.html?bbox=${coords.lon - 0.02},${coords.lat - 0.015},${coords.lon + 0.02},${coords.lat + 0.015}&layer=mapnik&marker=${coords.lat},${coords.lon}` : null;
  return (
    <div className="dc-map-section">
      <h3><MapPin size={16} color="#26c1c9" /> Localisation de l'entreprise</h3>
      {status === "loading" && <div className="dc-map-loading"><span style={{ animation: "dc-spin 1s linear infinite", display: "inline-block" }}>⟳</span>&nbsp;Chargement...</div>}
      {status === "notfound" && <div className="dc-map-notfound"><MapPin size={18} /> Localisation introuvable</div>}
      {status === "found" && iframeSrc && (<>
        <div className="dc-map-company-banner">
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#26c1c9,#0891b2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 16, flexShrink: 0 }}>{nomEntreprise ? nomEntreprise[0].toUpperCase() : "🏢"}</div>
          <div><div className="dc-map-company-name">{nomEntreprise || "Entreprise"}</div><div className="dc-map-company-loc"><MapPin size={11} style={{ verticalAlign: "middle" }} /> {localisation}</div></div>
        </div>
        <div className="dc-map-container"><iframe title={`Carte ${localisation}`} src={iframeSrc} width="100%" height="300" style={{ border: "none", display: "block" }} loading="lazy" allowFullScreen /></div>
        <div className="dc-map-address"><MapPin size={14} /><span>{localisation}</span><span>·</span><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(localisation)}`} target="_blank" rel="noopener noreferrer">Ouvrir dans Google Maps →</a></div>
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
    { key: "EN_ATTENTE", label: "Envoyée", icon: "📤" },
    { key: "EN_COURS", label: "En cours", icon: "🔍" },
    { key: "ACCEPTEE", label: "Acceptée", icon: "✅" },
  ];
  const refusee = statut === "REFUSEE";
  const currentIdx = refusee ? -1 : steps.findIndex(s => s.key === statut);
  const activeIdx = currentIdx === -1 ? 0 : currentIdx;
  if (refusee) return (
    <div style={{ marginTop: 14, background: "#fee2e2", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 18 }}>❌</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#dc2626" }}>Candidature refusée</span>
    </div>
  );
  return (
    <div className="dc-progress-steps">
      {steps.map((step, i) => {
        const isDone = i < activeIdx, isActive = i === activeIdx;
        return (
          <div key={step.key} className="dc-step">
            {i < steps.length - 1 && <div className={`dc-step-line ${isDone ? "dc-step-line-done" : "dc-step-line-pending"}`} />}
            <div className={`dc-step-circle ${isDone ? "dc-step-done" : isActive ? "dc-step-active" : "dc-step-pending"}`}>{isDone ? "✓" : step.icon}</div>
            <span className="dc-step-label" style={{ color: isActive ? "var(--cyan)" : isDone ? "#16a34a" : "var(--muted)" }}>{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function NiveauBadge({ niveau }) {
  const map = { "Débutant": "dc-niveau-debutant", "Intermédiaire": "dc-niveau-intermediaire", "Avancé": "dc-niveau-avance" };
  return <span className={`dc-niveau-badge ${map[niveau] || "dc-niveau-debutant"}`}>{niveau}</span>;
}

const CAT_COLORS = {
  "Développement": { bg: "#eff6ff", color: "#1e40af", icon: "💻" },
  "Marketing": { bg: "#fdf4ff", color: "#7e22ce", icon: "📢" },
  "Design": { bg: "#fff7ed", color: "#c2410c", icon: "🎨" },
  "Data": { bg: "#f0fdf4", color: "#166534", icon: "📊" },
  "Management": { bg: "#fefce8", color: "#a16207", icon: "🏆" },
  "Langues": { bg: "#fef2f2", color: "#b91c1c", icon: "🌍" },
};

function CoursCard({ cours, onClick }) {
  const cat = CAT_COLORS[cours.categorie] || { bg: "#f1f5f9", color: "#475569", icon: "📖" };
  return (
    <div className="dc-cours-card" onClick={() => onClick(cours)}>
      <div className="dc-cours-thumb-placeholder">
        {cours.imageUrl
          ? <img src={cours.imageUrl} alt={cours.titre} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
          : <>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#060b13 0%,#0c1f3d 100%)" }} />
            <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, background: "#26c1c9", borderRadius: "50%", opacity: 0.07 }} />
            <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 32 }}>{cat.icon}</div>
              <div style={{ background: "rgba(38,193,201,0.2)", border: "1px solid rgba(38,193,201,0.3)", borderRadius: 8, padding: "3px 10px", fontSize: 10, fontWeight: 800, color: "#26c1c9", textTransform: "uppercase", letterSpacing: 1 }}>{cours.categorie}</div>
            </div>
          </>
        }
        <div style={{ position: "absolute", inset: 0, background: "rgba(38,193,201,0.15)", opacity: 0, transition: "0.3s", display: "flex", alignItems: "center", justifyContent: "center" }} className="dc-cours-play-overlay">
          <div style={{ width: 48, height: 48, background: "var(--cyan)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}><Play size={20} color="#060b13" fill="#060b13" /></div>
        </div>
      </div>
      <div className="dc-cours-body">
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <span style={{ background: cat.bg, color: cat.color, padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 800 }}>{cat.icon} {cours.categorie}</span>
          <NiveauBadge niveau={cours.niveau} />
        </div>
        <div className="dc-cours-title">{cours.titre}</div>
        {cours.instructeurNom && <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>👤 {cours.instructeurNom}</div>}
        <div className="dc-cours-desc">{cours.description || "Aucune description."}</div>
        <div className="dc-cours-footer">
          {cours.dureeMinutes && <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>⏱ {cours.dureeMinutes} min</span>}
          <span style={{ fontSize: 11, color: "#26c1c9", fontWeight: 700 }}>Voir le cours →</span>
        </div>
      </div>
    </div>
  );
}

// ── Score Ring ──
function ScoreRing({ score }) {
  const r = 40, cx = 50, cy = 50, circumference = 2 * Math.PI * r;
  const safeScore = Math.max(0, Math.min(100, Number(score) || 0));
  const color = safeScore >= 70 ? "#16a34a" : safeScore >= 40 ? "#d97706" : "#dc2626";
  const offset = circumference - (safeScore / 100) * circumference;
  return (
    <div className="sm-score-ring">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset 1.2s ease" }} />
      </svg>
      <div className="sm-score-val">
        <span className="sm-score-num" style={{ color }}>{safeScore}</span>
        <span className="sm-score-pct">/ 100</span>
      </div>
    </div>
  );
}

// ── Smart Match Section ── CORRIGÉE SCORE
function SmartMatchSection({ offre, profilNom, onViewCours }) {
  const [cvFile, setCvFile] = useState(null);
  const [cvText, setCvText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [generatingLettre, setGeneratingLettre] = useState(false);
  const [lettreIA, setLettreIA] = useState("");
  const [lettreVisible, setLettreVisible] = useState(false);

  useEffect(() => { loadPDFjs(); }, []);

  const getOffreId = () => {
    const id = resolveOffreId(offre);
    if (!id) console.error("❌ offreId introuvable dans l'objet offre:", offre);
    return id;
  };

  const handleCvChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCvFile(file);
    setResult(null);
    setLettreIA("");
    setLettreVisible(false);
    try {
      const text = await extractTextFromPDF(file);
      setCvText(text);
    } catch {
      setCvText("");
    }
  };

  const handleAnalyze = async () => {
    if (!cvFile) { toast.error("Uploadez votre CV d'abord !"); return; }
    if (!cvText || cvText.length < 30) { toast.error("Impossible d'extraire le texte du CV. Utilisez un PDF texte."); return; }

    const offreId = getOffreId();
    if (!offreId) { toast.error("ID de l'offre introuvable. Veuillez réessayer."); return; }

    setAnalyzing(true);
    setResult(null);
    try {
      const payload = { cvText, offreId };
      console.log("📤 Envoi analyse:", payload);
      const res = await api.post("/matching/analyze", payload);
      console.log("📥 Réponse brute backend:", res.data);

      const raw = res.data;

      // ── NORMALISATION SCORE ROBUSTE ──
      const rawScore =
        raw?.score_matching ??
        raw?.scoreMatching ??
        raw?.score ??
        raw?.Score ??
        null;

      console.log("🎯 rawScore trouvé:", rawScore, "type:", typeof rawScore);

      let scoreVal = 0;
      if (typeof rawScore === "number" && !isNaN(rawScore)) {
        scoreVal = rawScore;
      } else if (typeof rawScore === "string") {
        const parsed = parseFloat(rawScore.replace(",", "."));
        if (!isNaN(parsed)) scoreVal = parsed;
      }
      scoreVal = Math.max(0, Math.min(100, Math.round(scoreVal)));
      console.log("✅ Score final normalisé:", scoreVal);

      const normalized = {
        ...raw,
        score_matching: scoreVal,
        points_forts: Array.isArray(raw?.points_forts)
          ? raw.points_forts
          : Array.isArray(raw?.pointsForts) ? raw.pointsForts : [],
        competences_manquantes: Array.isArray(raw?.competences_manquantes)
          ? raw.competences_manquantes
          : Array.isArray(raw?.competencesManquantes) ? raw.competencesManquantes : [],
        conseil: raw?.conseil ?? raw?.recommendation ?? "",
        resume_matching: raw?.resume_matching ?? raw?.resumeMatching ?? "",
        coursSuggeres: Array.isArray(raw?.coursSuggeres) ? raw.coursSuggeres : [],
      };

      console.log("📊 Résultat normalisé:", normalized);
      setResult(normalized);

    } catch (err) {
      console.error("❌ Erreur analyze:", err.response?.data || err.message);
      toast.error(err.response?.data || "Erreur analyse IA");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGenererLettre = async () => {
    if (!cvText || cvText.length < 30) { toast.error("Uploadez d'abord votre CV pour générer la lettre !"); return; }

    const offreId = getOffreId();
    if (!offreId) { toast.error("ID de l'offre introuvable. Veuillez réessayer."); return; }

    setGeneratingLettre(true);
    setLettreVisible(true);
    setLettreIA("");
    try {
      const payload = { cvText, offreId, candidatNom: profilNom || "" };
      const res = await api.post("/matching/lettre", payload);
      setLettreIA(res.data?.lettre || res.data || "");
    } catch (err) {
      console.error("❌ Erreur lettre:", err.response?.data || err.message);
      toast.error("Erreur génération lettre IA");
      setLettreVisible(false);
    } finally {
      setGeneratingLettre(false);
    }
  };

  // ── Extraction sécurisée depuis result normalisé ──
  const scoreInt = result !== null ? (result.score_matching ?? null) : null;
  const missing = result?.competences_manquantes ?? [];
  const strengths = result?.points_forts ?? [];
  const suggestedCours = result?.coursSuggeres ?? [];
  const conseil = result?.conseil || null;
  const resumeMatching = result?.resume_matching || null;

  return (
    <div className="sm-section">
      {/* ── Banner principal ── */}
      <div className="sm-banner">
        <div className="sm-banner-left">
          <div className="sm-banner-title">
            <Zap size={18} color="#26c1c9" /> Analyse IA de compatibilité
          </div>
          <div className="sm-banner-sub">
            Uploadez votre CV — l'IA analyse votre compatibilité avec ce poste et suggère des cours
          </div>
          <div className="sm-upload-row">
            <label className={`sm-upload-label ${cvFile ? "has-file" : ""}`}>
              <input type="file" accept=".pdf" style={{ display: "none" }} onChange={handleCvChange} />
              <Upload size={15} />
              {cvFile ? <span>📄 {cvFile.name}</span> : <span>Uploader votre CV (PDF)</span>}
            </label>
            {cvFile && (
              <button className="sm-btn-analyze" onClick={handleAnalyze} disabled={analyzing}>
                {analyzing
                  ? <><span style={{ animation: "dc-spin 1s linear infinite", display: "inline-block" }}>⟳</span> Analyse...</>
                  : <><Sparkles size={15} /> Analyser</>
                }
              </button>
            )}
          </div>
        </div>

        {scoreInt !== null && !analyzing && <ScoreRing score={scoreInt} />}

        {analyzing && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <div style={{ width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "2px solid rgba(38,193,201,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={28} color="#26c1c9" style={{ animation: "dc-spin 2s linear infinite" }} />
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>IA analyse...</div>
          </div>
        )}
      </div>

      {/* ── Shimmer loading ── */}
      {analyzing && (
        <div className="sm-result-grid" style={{ marginTop: 20 }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="sm-panel">
              <div className="sm-loading-bar" style={{ width: "55%", marginBottom: 12 }} />
              <div className="sm-loading-bar" style={{ width: "100%", marginBottom: 8 }} />
              <div className="sm-loading-bar" style={{ width: "75%" }} />
            </div>
          ))}
        </div>
      )}

      {/* ── Résultats ── */}
      {result && !analyzing && (
        <>
          {scoreInt !== null && (
            <div style={{ marginTop: 16, background: "#fff", borderRadius: 14, border: "1.5px solid #e2e8f0", padding: "14px 20px", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                    Score de compatibilité
                    {resumeMatching && <span style={{ fontWeight: 400, color: "#64748b" }}> — {resumeMatching}</span>}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: scoreInt >= 70 ? "#16a34a" : scoreInt >= 40 ? "#d97706" : "#dc2626" }}>
                    {scoreInt}%
                  </span>
                </div>
                <div style={{ height: 8, background: "#f1f5f9", borderRadius: 6, overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 6, width: `${scoreInt}%`, background: scoreInt >= 70 ? "#16a34a" : scoreInt >= 40 ? "#d97706" : "#dc2626", transition: "width 1.2s ease" }} />
                </div>
              </div>
              <span style={{ fontSize: 22 }}>{scoreInt >= 70 ? "🟢" : scoreInt >= 40 ? "🟡" : "🔴"}</span>
            </div>
          )}

          <div className="sm-result-grid">
            {missing.length > 0 && (
              <div className="sm-panel">
                <div className="sm-panel-title" style={{ color: "#dc2626" }}>
                  <AlertCircle size={15} color="#dc2626" /> Compétences manquantes
                </div>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {missing.map((sk, i) => <span key={i} className="sm-skill-chip sm-skill-missing">⚠ {sk}</span>)}
                </div>
              </div>
            )}

            {strengths.length > 0 && (
              <div className="sm-panel">
                <div className="sm-panel-title" style={{ color: "#16a34a" }}>
                  <TrendingUp size={15} color="#16a34a" /> Points forts détectés
                </div>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {strengths.map((sk, i) => <span key={i} className="sm-skill-chip sm-skill-strength">✓ {sk}</span>)}
                </div>
              </div>
            )}

            {conseil && (
              <div className="sm-panel" style={{ gridColumn: missing.length > 0 && strengths.length > 0 ? "span 2" : undefined }}>
                <div className="sm-panel-title" style={{ color: "#7c3aed" }}>
                  <Sparkles size={15} color="#7c3aed" /> Conseil personnalisé
                </div>
                <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>{conseil}</p>
              </div>
            )}

            {suggestedCours.length > 0 && (
              <div className="sm-panel" style={{ gridColumn: "span 2" }}>
                <div className="sm-panel-title" style={{ color: "#0891b2" }}>
                  <BookMarked size={15} color="#0891b2" /> Cours recommandés pour combler les lacunes
                </div>
                {suggestedCours.map((c, i) => {
                  const cat = CAT_COLORS[c.categorie] || { bg: "#f1f5f9", color: "#475569", icon: "📖" };
                  return (
                    <div key={c.id || i} className="sm-cours-mini" onClick={() => onViewCours(c)}>
                      <div className="sm-cours-mini-icon">{cat.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.titre}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{c.categorie} · {c.niveau}</div>
                      </div>
                      <div style={{ fontSize: 11, color: "#26c1c9", fontWeight: 700, flexShrink: 0 }}>Voir →</div>
                    </div>
                  );
                })}
                <button onClick={() => onViewCours(null)}
                  style={{ marginTop: 4, width: "100%", padding: "9px", borderRadius: 10, border: "2px solid #e2e8f0", background: "#fff", color: "#26c1c9", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit", transition: "0.2s" }}
                  onMouseEnter={e => e.target.style.borderColor = "#26c1c9"}
                  onMouseLeave={e => e.target.style.borderColor = "#e2e8f0"}>
                  Voir tous les cours →
                </button>
              </div>
            )}

            {missing.length === 0 && strengths.length === 0 && !conseil && suggestedCours.length === 0 && (
              <div className="sm-panel" style={{ gridColumn: "span 2", textAlign: "center", padding: 28 }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>🤔</div>
                <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>Analyse incomplète</div>
                <div style={{ fontSize: 13, color: "#94a3b8" }}>
                  L'IA n'a pas pu extraire suffisamment d'informations. Vérifiez que votre CV contient du texte lisible.
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Lettre de motivation IA ── */}
      {cvFile && (
        <div className="lm-section">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: lettreVisible ? 12 : 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: 8 }}>
              <FileEdit size={16} color="#26c1c9" /> Lettre de motivation
            </div>
            {!lettreVisible && (
              <button className="lm-generate-btn" onClick={handleGenererLettre} disabled={generatingLettre}>
                {generatingLettre
                  ? <><span style={{ animation: "dc-spin 1s linear infinite", display: "inline-block" }}>⟳</span> Génération...</>
                  : <><Sparkles size={14} /> Générer avec l'IA</>
                }
              </button>
            )}
            {lettreVisible && (
              <div style={{ display: "flex", gap: 8 }}>
                {!generatingLettre && (
                  <button className="lm-generate-btn" onClick={handleGenererLettre} style={{ fontSize: 12, padding: "7px 14px" }}>
                    <Sparkles size={13} /> Regénérer
                  </button>
                )}
                <button onClick={() => { setLettreVisible(false); setLettreIA(""); }}
                  style={{ padding: "7px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", color: "#94a3b8", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>
                  Masquer
                </button>
              </div>
            )}
          </div>

          {lettreVisible && (
            <div className="lm-textarea-wrap">
              {lettreIA && <div className="lm-badge"><Sparkles size={10} /> Généré par IA</div>}
              {generatingLettre
                ? <div style={{ padding: "20px 14px", borderRadius: 12, border: "2px solid #e2e8f0", background: "#f8fafc", display: "flex", flexDirection: "column", gap: 10 }}>
                  {[1, 2, 3, 4, 5].map(i => <div key={i} className="sm-loading-bar" style={{ width: `${[90, 75, 85, 60, 40][i - 1]}%`, height: 12 }} />)}
                </div>
                : <textarea className="lm-textarea" value={lettreIA} onChange={e => setLettreIA(e.target.value)}
                  placeholder="La lettre générée par l'IA apparaîtra ici. Vous pouvez la modifier avant de l'utiliser." />
              }
              {lettreIA && !generatingLettre && (
                <button onClick={() => { navigator.clipboard.writeText(lettreIA); toast.success("✅ Lettre copiée !"); }}
                  style={{ marginTop: 8, padding: "8px 16px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 12, fontFamily: "inherit", color: "#475569", display: "flex", alignItems: "center", gap: 6 }}>
                  📋 Copier la lettre
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── MODAL POSTULER avec lettre IA intégrée ──
function ModalPostuler({ offre, profilNom, onClose, onSubmit, submitting }) {
  const [cvFile, setCvFile] = useState(null);
  const [cvText, setCvText] = useState("");
  const [lettre, setLettre] = useState("");
  const [generatingLettre, setGeneratingLettre] = useState(false);

  useEffect(() => { loadPDFjs(); }, []);

  const handleCvChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCvFile(file);
    try {
      const text = await extractTextFromPDF(file);
      setCvText(text);
    } catch { setCvText(""); }
  };

  const handleGenererLettre = async () => {
    if (!cvText || cvText.length < 30) { toast.error("Uploadez d'abord votre CV !"); return; }
    const offreId = resolveOffreId(offre);
    if (!offreId) { toast.error("ID de l'offre introuvable !"); return; }
    setGeneratingLettre(true);
    try {
      const res = await api.post("/matching/lettre", { cvText, offreId, candidatNom: profilNom || "" });
      setLettre(res.data?.lettre || res.data || "");
    } catch {
      toast.error("Erreur génération lettre IA");
    } finally {
      setGeneratingLettre(false);
    }
  };

  return (
    <div className="dc-overlay" onClick={onClose}>
      <div className="dc-modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h2 className="dc-modal-title">Postuler</h2>
            <p className="dc-modal-sub" style={{ marginBottom: 0 }}>{offre.titre}{offre.nomEntreprise ? ` · ${offre.nomEntreprise}` : ""}</p>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "#f1f5f9", padding: 8, borderRadius: 8, cursor: "pointer", marginTop: 4 }}><X size={18} /></button>
        </div>

        <form onSubmit={e => onSubmit(e, cvFile, lettre)}>
          <div className="dc-field">
            <label>CV (PDF) *</label>
            <div className={`dc-upload-zone ${cvFile ? "has-file" : ""}`} onClick={() => document.getElementById("cv-modal-input").click()}>
              <input id="cv-modal-input" type="file" accept=".pdf" style={{ display: "none" }} onChange={handleCvChange} />
              {cvFile
                ? <div style={{ color: "var(--cyan)", fontWeight: 700 }}><CheckCircle size={24} style={{ marginBottom: 8 }} /><div>{cvFile.name}</div></div>
                : <div style={{ color: "var(--muted)" }}><Upload size={24} style={{ marginBottom: 8 }} /><div style={{ fontWeight: 600 }}>Uploader votre CV</div><div style={{ fontSize: 12, marginTop: 4 }}>PDF · Max 5MB</div></div>
              }
            </div>
          </div>

          <div className="dc-field">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <label style={{ marginBottom: 0 }}>Lettre de motivation</label>
              {cvFile && (
                <button type="button" className="lm-generate-btn" onClick={handleGenererLettre} disabled={generatingLettre} style={{ padding: "5px 12px", fontSize: 11 }}>
                  {generatingLettre
                    ? <><span style={{ animation: "dc-spin 1s linear infinite", display: "inline-block" }}>⟳</span> Génération...</>
                    : <><Sparkles size={12} /> Générer avec IA</>
                  }
                </button>
              )}
            </div>
            <div style={{ position: "relative" }}>
              {lettre && <div className="lm-badge" style={{ top: -10, right: 14 }}><Sparkles size={10} /> IA</div>}
              {generatingLettre
                ? <div style={{ padding: "16px 14px", borderRadius: 10, border: "2px solid #e2e8f0", background: "#f8fafc", display: "flex", flexDirection: "column", gap: 8 }}>
                  {[1, 2, 3].map(i => <div key={i} className="sm-loading-bar" style={{ width: `${[90, 75, 55][i - 1]}%`, height: 10 }} />)}
                </div>
                : <textarea rows="5" placeholder="Présentez-vous ou générez avec l'IA ci-dessus..." value={lettre} onChange={e => setLettre(e.target.value)}
                  style={{ width: "100%", padding: 12, borderRadius: 10, border: "2px solid #f1f5f9", background: "#f8fafc", fontFamily: "inherit", fontSize: 14, outline: "none", transition: "0.3s", resize: "vertical" }}
                  onFocus={e => { e.target.style.borderColor = "#26c1c9"; e.target.style.background = "#fff"; }}
                  onBlur={e => { e.target.style.borderColor = "#f1f5f9"; e.target.style.background = "#f8fafc"; }}
                />
              }
            </div>
          </div>

          <button type="submit" className="dc-btn-submit" disabled={submitting || !cvFile}>
            {submitting ? "Envoi en cours... 🤖" : "Envoyer ma candidature →"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════
export default function DashboardCandidat({ onLogout }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const cachedProfil = JSON.parse(localStorage.getItem(`profil_${user?.id}`) || "{}");
  const cachedNomComplet = [cachedProfil.prenom, cachedProfil.nom].filter(Boolean).join(" ") || user?.prenom || user?.name || "";

  const [view, setView] = useState("offres");
  const [offres, setOffres] = useState([]);
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [mesCandidatures, setMesCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filtreContrat, setFiltreContrat] = useState("Tous");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dejaCandidature, setDejaCandidature] = useState(new Set());
  const [editMode, setEditMode] = useState(false);
  const [profilForm, setProfilForm] = useState({
    prenom: cachedProfil.prenom || "", nom: cachedProfil.nom || "",
    telephone: cachedProfil.telephone || "", ville: cachedProfil.ville || "",
    nationalite: cachedProfil.nationalite || "", linkedin: cachedProfil.linkedin || "",
  });
  const [mesVisas, setMesVisas] = useState([]);
  const [showVisaModal, setShowVisaModal] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [selectedVisa, setSelectedVisa] = useState(null);
  const [visaDocs, setVisaDocs] = useState([]);
  const [visaForm, setVisaForm] = useState({ pays: "", typeVisa: "Visa Travail", dateDebut: "" });
  const [submittingVisa, setSubmittingVisa] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showCvModal, setShowCvModal] = useState(false);
  const [cvViewUrl, setCvViewUrl] = useState(null);
  const [cours, setCours] = useState([]);
  const [coursLoading, setCoursLoading] = useState(false);
  const [selectedCours, setSelectedCours] = useState(null);
  const [showCoursModal, setShowCoursModal] = useState(false);
  const [filtreCategorie, setFiltreCategorie] = useState("Tous");
  const [coursSearch, setCoursSearch] = useState("");

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
    } catch { }
  }, [user?.id]);

  const fetchProfil = useCallback(async () => {
    try {
      const res = await api.get(`/candidats/${user.id}`);
      const d = res.data || {};
      const p = { prenom: d.prenom || "", nom: d.nom || "", telephone: d.telephone || "", ville: d.ville || "", nationalite: d.nationalite || "", linkedin: d.linkedin || "" };
      localStorage.setItem(`profil_${user.id}`, JSON.stringify(p));
      setProfilForm(p);
      if (d.photoUrl) setPhotoUrl(`http://localhost:8081/api/candidats/${user.id}/photo?t=${Date.now()}`);
    } catch { }
  }, [user?.id]);

  const fetchMesVisas = useCallback(async () => {
    try { const res = await api.get(`/visa/candidat/${user.id}`); setMesVisas(res.data); } catch { }
  }, [user?.id]);

  const fetchCours = useCallback(async () => {
    try { setCoursLoading(true); const res = await api.get("/cours"); setCours(res.data); }
    catch { toast.error("Erreur chargement cours"); }
    finally { setCoursLoading(false); }
  }, []);

  useEffect(() => { fetchOffres(); fetchMesCandidatures(); fetchProfil(); fetchMesVisas(); }, [fetchOffres, fetchMesCandidatures, fetchProfil, fetchMesVisas]);
  useEffect(() => { if (view === "cours") fetchCours(); }, [view, fetchCours]);

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

  const handlePostuler = async (e, cvFile, lettre) => {
    e.preventDefault();
    if (!cvFile) { toast.error("Veuillez uploader votre CV !"); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("candidatId", user.id);
      fd.append("offreId", selectedOffre.id);
      fd.append("cv", cvFile);
      if (lettre) fd.append("lettreMotivation", lettre);
      await api.post("/candidatures", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Candidature envoyée !");
      setShowModal(false);
      fetchMesCandidatures();
    } catch (err) { toast.error(err.response?.data?.error || "Erreur candidature"); }
    finally { setSubmitting(false); }
  };

  const handleSaveProfil = async () => {
    try {
      const res = await api.put(`/candidats/${user.id}`, profilForm);
      const d = res.data || {};
      const p = { prenom: d.prenom || "", nom: d.nom || "", telephone: d.telephone || "", ville: d.ville || "", nationalite: d.nationalite || "", linkedin: d.linkedin || "" };
      localStorage.setItem(`profil_${user.id}`, JSON.stringify(p));
      setProfilForm(p); setEditMode(false);
      toast.success("✅ Profil mis à jour !");
    } catch { toast.error("Erreur mise à jour profil"); }
  };

  const handleCreerVisa = async e => {
    e.preventDefault(); setSubmittingVisa(true);
    try {
      await api.post("/visa", { ...visaForm, candidatId: user.id, candidatNom: `${profilForm.prenom} ${profilForm.nom}`.trim() || user.email });
      toast.success("✅ Demande de visa créée !");
      setShowVisaModal(false); setVisaForm({ pays: "", typeVisa: "Visa Travail", dateDebut: "" });
      fetchMesVisas();
    } catch { toast.error("Erreur création demande visa"); }
    finally { setSubmittingVisa(false); }
  };

  const handleVoirDocs = async visa => {
    setSelectedVisa(visa);
    try { const res = await api.get(`/visa/${visa.id}`); setVisaDocs(res.data.documents || []); } catch { setVisaDocs([]); }
    setShowDocsModal(true);
  };

  const handleUploadDoc = async (docId, file) => {
    try {
      const fd = new FormData(); fd.append("file", file); fd.append("statut", "FOURNI");
      await api.put(`/visa/documents/${docId}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("✅ Document uploadé !"); if (selectedVisa) handleVoirDocs(selectedVisa);
    } catch {
      try {
        await api.put(`/visa/documents/${docId}`, { statut: "FOURNI", fichierUrl: file.name });
        toast.success("✅ Document marqué comme fourni !"); if (selectedVisa) handleVoirDocs(selectedVisa);
      } catch { toast.error("Erreur upload document"); }
    }
  };

  const getStatutBadge = statut => {
    const map = {
      EN_ATTENTE: { label: "En attente ⏳", cls: "dc-status-attente" },
      ACCEPTEE: { label: "Acceptée ✅", cls: "dc-status-acceptee" },
      REFUSEE: { label: "Refusée ❌", cls: "dc-status-refusee" },
    };
    const s = map[statut] || map.EN_ATTENTE;
    return <span className={`dc-status-badge ${s.cls}`}>{s.label}</span>;
  };

  const handleViewCoursFromMatch = (coursItem) => {
    if (coursItem) { setSelectedCours(coursItem); setShowCoursModal(true); }
    else setView("cours");
  };

  const offresFiltrees = offres.filter(o => {
    const ms = o.titre.toLowerCase().includes(search.toLowerCase()) || o.localisation.toLowerCase().includes(search.toLowerCase());
    const mc = filtreContrat === "Tous" || o.typeContrat === filtreContrat;
    return ms && mc;
  });

  const coursFiltres = cours.filter(c => {
    const matchSearch = c.titre.toLowerCase().includes(coursSearch.toLowerCase()) || (c.description || "").toLowerCase().includes(coursSearch.toLowerCase());
    const matchCat = filtreCategorie === "Tous" || c.categorie === filtreCategorie;
    return matchSearch && matchCat;
  });

  const offresSimilaires = selectedOffre ? offres.filter(o => o.id !== selectedOffre.id && o.typeContrat === selectedOffre.typeContrat).slice(0, 4) : [];

  const prenomNom = [profilForm.prenom, profilForm.nom].filter(Boolean).join(" ");
  const nomAffiche = prenomNom || cachedNomComplet || user?.email || "";
  const initiales = nomAffiche && nomAffiche !== user?.email
    ? nomAffiche.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || "?";
  const currentPhoto = photoPreview || photoUrl;
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <style>{styles}</style>
      <div className="dc-root">

        {/* ── SIDEBAR ── */}
        <aside className="dc-sidebar">
          <div className="dc-brand"><div className="dc-brand-icon">R</div><span className="dc-brand-name">RecruitPro</span></div>
          <nav style={{ flex: 1 }}>
            <div className={`dc-nav ${view === "offres" || view === "detail" ? "active" : ""}`} onClick={() => setView("offres")}><Briefcase size={18} /> Offres d'emploi</div>
            <div className={`dc-nav ${view === "candidatures" ? "active" : ""}`} onClick={() => setView("candidatures")}>
              <FileText size={18} /> Mes candidatures
              {mesCandidatures.length > 0 && <span style={{ marginLeft: "auto", background: "var(--cyan)", color: "#060b13", borderRadius: 20, padding: "2px 8px", fontSize: 11, fontWeight: 800 }}>{mesCandidatures.length}</span>}
            </div>
            <div className={`dc-nav ${view === "visas" ? "active" : ""}`} onClick={() => setView("visas")}>
              <Plane size={18} /> Mes visas
              {mesVisas.length > 0 && <span style={{ marginLeft: "auto", background: "var(--cyan)", color: "#060b13", borderRadius: 20, padding: "2px 8px", fontSize: 11, fontWeight: 800 }}>{mesVisas.length}</span>}
            </div>
            <div className={`dc-nav ${view === "cours" ? "active" : ""}`} onClick={() => setView("cours")}><BookOpen size={18} /> Cours & Formation</div>
            <div className={`dc-nav ${view === "profil" ? "active" : ""}`} onClick={() => setView("profil")}><User size={18} /> Mon profil</div>
          </nav>
          <div className="dc-sidebar-bottom">
            <LanguageSwitcher variant="dark" />
            <div className="dc-nav" onClick={onLogout} style={{ color: "#f87171" }}><LogOut size={18} /> Déconnexion</div>
          </div>
        </aside>

        <main className="dc-main">

          {/* ── OFFRES ── */}
          {view === "offres" && (<>
            <div className="dc-welcome-banner">
              <div>
                <div className="dc-welcome-name">Bienvenue, {nomAffiche} 👋</div>
                <div className="dc-welcome-sub">Trouvez votre prochain emploi parmi {offres.length} offres disponibles</div>
              </div>
              <div style={{ position: "relative" }} ref={notifRef}>
                <button className="dc-notif-btn" onClick={() => setShowNotifs(v => !v)}>
                  <Bell size={18} color="#94a3b8" />
                  {unreadCount > 0 && <span className="dc-notif-dot">{unreadCount}</span>}
                </button>
                {showNotifs && (
                  <div className="dc-notif-panel">
                    <div className="dc-notif-header">
                      <span>Notifications</span>
                      {unreadCount > 0 && <button onClick={handleMarkAllRead} style={{ fontSize: 11, color: "var(--cyan)", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}>Tout marquer lu</button>}
                    </div>
                    {notifications.length === 0
                      ? <div style={{ padding: 24, textAlign: "center", color: "var(--muted)", fontSize: 13 }}>Aucune notification</div>
                      : notifications.map(n => (
                        <div key={n.id} className={`dc-notif-item ${!n.read ? "unread" : ""}`} onClick={() => { setView("candidatures"); setShowNotifs(false); }}>
                          <div style={{ width: 36, height: 36, background: "#f0fdf4", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>🎉</div>
                          <div><div style={{ fontSize: 13, fontWeight: 700 }}>{n.message}</div><div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{n.sub}</div></div>
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>
            </div>

            <div className="dc-stats">
              <div className="dc-stat"><div className="dc-stat-icon"><Briefcase size={20} /></div><div><h3 style={{ fontSize: 24, fontWeight: 800 }}>{offres.length}</h3><p style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>Offres disponibles</p></div></div>
              <div className="dc-stat"><div className="dc-stat-icon" style={{ background: "#f0fdf4", color: "#16a34a" }}><FileText size={20} /></div><div><h3 style={{ fontSize: 24, fontWeight: 800, color: "#16a34a" }}>{mesCandidatures.length}</h3><p style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>Mes candidatures</p></div></div>
              <div className="dc-stat"><div className="dc-stat-icon" style={{ background: "#fef3c7", color: "#d97706" }}><Clock size={20} /></div><div><h3 style={{ fontSize: 24, fontWeight: 800, color: "#d97706" }}>{mesCandidatures.filter(c => c.statut === "EN_ATTENTE").length}</h3><p style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>En attente</p></div></div>
            </div>

            <div className="dc-search-wrap">
              <Search size={18} style={{ position: "absolute", left: 14, top: 13, color: "#94a3b8" }} />
              <input className="dc-search-input" placeholder="Rechercher par titre, ville..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="dc-filters">
              <Filter size={16} style={{ color: "var(--muted)" }} />
              {CONTRATS.map(c => <button key={c} className={`dc-filter-btn ${filtreContrat === c ? "active" : ""}`} onClick={() => setFiltreContrat(c)}>{c}</button>)}
            </div>

            {loading
              ? <div style={{ textAlign: "center", padding: 60, color: "var(--muted)" }}>Chargement...</div>
              : offresFiltrees.length === 0
                ? <div style={{ textAlign: "center", padding: 60, color: "var(--muted)" }}><Sparkles size={40} style={{ marginBottom: 12, opacity: 0.3 }} /><p>Aucune offre trouvée</p></div>
                : <div className="dc-grid">
                  {offresFiltrees.map(o => (
                    <div key={o.id} className="dc-card" onClick={() => { setSelectedOffre(o); setView("detail"); }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <div className="dc-card-header">
                          <EntrepriseAvatar entrepriseId={o.entrepriseId} nomEntreprise={o.nomEntreprise} size={42} />
                          <div>
                            <div className="dc-card-title">{o.titre}</div>
                            {o.nomEntreprise && <div className="dc-card-company">🏢 {o.nomEntreprise}</div>}
                            <div className="dc-card-loc"><MapPin size={11} style={{ verticalAlign: "middle" }} /> {o.localisation}</div>
                          </div>
                        </div>
                        {dejaCandidature.has(o.id) && <span style={{ background: "#f0fdf4", color: "#16a34a", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 8, flexShrink: 0 }}>✅ Postulé</span>}
                      </div>
                      <div className="dc-card-tags">
                        <span className="dc-tag dc-tag-contrat">{o.typeContrat}</span>
                        {o.nombrePostes && <span className="dc-tag dc-tag-postes">👥 {o.nombrePostes} poste(s)</span>}
                        {o.salaireMin && o.salaireMax && <span className="dc-tag dc-tag-salaire">💰 {o.salaireMin}–{o.salaireMax} DT</span>}
                        {o.dateExpiration && <span className="dc-tag" style={{ background: "#f1f5f9", color: "#64748b" }}>⏰ {new Date(o.dateExpiration).toLocaleDateString('fr-FR')}</span>}
                      </div>
                      <div className="dc-card-footer">
                        <span style={{ fontSize: 12, color: "var(--muted)" }}>Voir détails →</span>
                        <button className="dc-btn-postuler" disabled={dejaCandidature.has(o.id)}
                          onClick={e => { e.stopPropagation(); setSelectedOffre(o); setShowModal(true); }}>
                          {dejaCandidature.has(o.id) ? "Postulé ✅" : "Postuler"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
            }
          </>)}

          {/* ── DETAIL ── */}
          {view === "detail" && selectedOffre && (<>
            <button onClick={() => setView("offres")} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontWeight: 600, marginBottom: 24, fontFamily: "inherit" }}>
              <ArrowLeft size={18} /> Retour
            </button>
            <div className="dc-detail">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, paddingBottom: 24, borderBottom: "2px solid #f1f5f9" }}>
                <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                  <EntrepriseAvatar entrepriseId={selectedOffre.entrepriseId} nomEntreprise={selectedOffre.nomEntreprise} size={64} />
                  <div>
                    <h1 className="dc-detail-title">{selectedOffre.titre}</h1>
                    <div className="dc-detail-company">🏢 {selectedOffre.nomEntreprise || "Entreprise"}</div>
                    <div className="dc-detail-tags">
                      <span className="dc-tag dc-tag-contrat" style={{ fontSize: 13, padding: "6px 14px" }}>{selectedOffre.typeContrat}</span>
                      <span className="dc-tag" style={{ background: "#f0fdf4", color: "#16a34a", fontSize: 13, padding: "6px 14px" }}><MapPin size={12} style={{ verticalAlign: "middle" }} /> {selectedOffre.localisation}</span>
                      {selectedOffre.nombrePostes && <span className="dc-tag dc-tag-postes" style={{ fontSize: 13, padding: "6px 14px" }}>👥 {selectedOffre.nombrePostes} poste(s)</span>}
                      {selectedOffre.salaireMin && selectedOffre.salaireMax && <span className="dc-tag dc-tag-salaire" style={{ fontSize: 13, padding: "6px 14px" }}>💰 {selectedOffre.salaireMin} – {selectedOffre.salaireMax} DT</span>}
                    </div>
                  </div>
                </div>
                <button className="dc-btn-postuler" disabled={dejaCandidature.has(selectedOffre.id)}
                  onClick={() => setShowModal(true)} style={{ padding: "12px 28px", fontSize: 14 }}>
                  {dejaCandidature.has(selectedOffre.id) ? "Déjà postulé ✅" : "Postuler →"}
                </button>
              </div>

              <h3 style={{ fontWeight: 800, marginBottom: 12 }}>Description</h3>
              <p className="dc-detail-desc">{selectedOffre.description || "Aucune description."}</p>

              <SmartMatchSection
                offre={selectedOffre}
                profilNom={nomAffiche}
                onViewCours={handleViewCoursFromMatch}
              />

              <OffreMap localisation={selectedOffre.localisation} nomEntreprise={selectedOffre.nomEntreprise} />

              {offresSimilaires.length > 0 && (
                <div className="dc-similar">
                  <h3 className="dc-similar-title">Offres similaires</h3>
                  <div className="dc-similar-grid">
                    {offresSimilaires.map(o => (
                      <div key={o.id} className="dc-card" onClick={() => setSelectedOffre(o)} style={{ padding: 16 }}>
                        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                          <EntrepriseAvatar entrepriseId={o.entrepriseId} nomEntreprise={o.nomEntreprise} size={32} />
                          <div>
                            <div className="dc-card-title" style={{ fontSize: 14 }}>{o.titre}</div>
                            {o.nomEntreprise && <div className="dc-card-company" style={{ fontSize: 12 }}>{o.nomEntreprise}</div>}
                          </div>
                        </div>
                        <div className="dc-card-loc"><MapPin size={11} style={{ verticalAlign: "middle" }} /> {o.localisation}</div>
                        <div className="dc-card-tags" style={{ marginTop: 8 }}><span className="dc-tag dc-tag-contrat">{o.typeContrat}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>)}

          {/* ── CANDIDATURES ── */}
          {view === "candidatures" && (<>
            <header className="dc-header">
              <div><h1 className="dc-title">Mes candidatures 📋</h1><p className="dc-subtitle">{mesCandidatures.length} candidature(s)</p></div>
            </header>
            {mesCandidatures.length === 0
              ? <div style={{ textAlign: "center", padding: 80, color: "var(--muted)" }}>
                <FileText size={48} style={{ opacity: 0.2, marginBottom: 16 }} /><p style={{ fontWeight: 600 }}>Aucune candidature</p>
                <button onClick={() => setView("offres")} className="dc-btn-postuler" style={{ marginTop: 20 }}>Voir les offres →</button>
              </div>
              : <div className="dc-cand-list">
                {mesCandidatures.map(c => {
                  const offre = offres.find(o => o.id === c.offreId);
                  return (
                    <div key={c.id} className="dc-cand-item">
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                          <EntrepriseAvatar entrepriseId={offre?.entrepriseId} nomEntreprise={offre?.nomEntreprise} size={44} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 15 }}>{offre?.titre || "Offre #" + c.offreId}</div>
                            {offre?.nomEntreprise && <div style={{ fontSize: 12, color: "var(--cyan)", fontWeight: 600, marginTop: 2 }}>{offre.nomEntreprise}</div>}
                            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Envoyée le {new Date(c.dateEnvoi).toLocaleDateString('fr-FR')}</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {getStatutBadge(c.statut)}
                          {c.cvId && (
                            <button onClick={() => { setCvViewUrl(`http://localhost:8081/api/candidatures/${c.id}/cv`); setShowCvModal(true); }}
                              style={{ border: "none", background: "#eff6ff", color: "#1e40af", cursor: "pointer", padding: "6px 12px", borderRadius: 8, fontWeight: 700, fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                              <Eye size={13} /> CV
                            </button>
                          )}
                        </div>
                      </div>
                      <ProgressTracker statut={c.statut} />
                    </div>
                  );
                })}
              </div>
            }
          </>)}

          {/* ── VISAS ── */}
          {view === "visas" && (<>
            <header className="dc-header">
              <div><h1 className="dc-title">Mes visas ✈️</h1><p className="dc-subtitle">{mesVisas.length} demande(s)</p></div>
              <button onClick={() => setShowVisaModal(true)} style={{ background: "var(--bg-dark)", color: "#fff", padding: "11px 20px", borderRadius: 12, border: "none", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: "inherit", fontSize: 13 }}>
                <Plus size={18} /> Nouvelle demande
              </button>
            </header>
            {mesVisas.length === 0
              ? <div style={{ textAlign: "center", padding: 80, color: "var(--muted)" }}>
                <Plane size={48} style={{ opacity: 0.2, marginBottom: 16 }} /><p style={{ fontWeight: 600 }}>Aucune demande de visa</p>
                <button onClick={() => setShowVisaModal(true)} style={{ marginTop: 20, background: "var(--bg-dark)", color: "#fff", padding: "10px 24px", borderRadius: 10, border: "none", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Créer une demande →</button>
              </div>
              : <div className="dc-visa-list">
                {mesVisas.map(v => (
                  <div key={v.id} className="dc-visa-item">
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ width: 44, height: 44, background: "#eff6ff", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}><Plane size={18} color="#2563eb" /></div>
                      <div><div style={{ fontWeight: 700 }}>{v.typeVisa} — {v.pays}</div><div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Créée le {v.dateCreation || "—"}</div></div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <VisaBadge statut={v.statut} />
                      <button onClick={() => handleVoirDocs(v)} style={{ border: "none", background: "#f0fdf4", color: "#16a34a", cursor: "pointer", padding: "7px 14px", borderRadius: 8, fontWeight: 700, fontSize: 12 }}>📄 Documents</button>
                    </div>
                  </div>
                ))}
              </div>
            }
          </>)}

          {/* ── COURS ── */}
          {view === "cours" && (<>
            <div style={{ background: "linear-gradient(135deg,#060b13 0%,#0c2240 55%,#0f2a4a 100%)", borderRadius: 24, padding: "32px 40px", marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid rgba(38,193,201,0.15)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -60, right: 80, width: 220, height: 220, background: "#26c1c9", borderRadius: "50%", opacity: 0.06, pointerEvents: "none" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ background: "rgba(38,193,201,0.15)", border: "1px solid rgba(38,193,201,0.3)", borderRadius: 8, padding: "4px 12px", fontSize: 11, fontWeight: 800, color: "#26c1c9", textTransform: "uppercase", letterSpacing: 1 }}>🎓 Formation</div>
                </div>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", marginBottom: 6, letterSpacing: "-0.5px" }}>Développez vos compétences</h1>
                <p style={{ fontSize: 13, color: "#94a3b8", maxWidth: 420, lineHeight: 1.6 }}>Accédez à des cours sélectionnés pour booster votre profil et décrocher l'emploi idéal.</p>
              </div>
              <div style={{ display: "flex", gap: 24, position: "relative", zIndex: 1 }}>
                {[{ icon: "📚", val: cours.length, label: "Cours" }, { icon: "🏷️", val: new Set(cours.map(c => c.categorie)).size, label: "Catégories" }, { icon: "🎯", val: cours.filter(c => c.niveau === "Débutant").length, label: "Débutant" }].map(s => (
                  <div key={s.label} style={{ textAlign: "center", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "16px 20px", minWidth: 80 }}>
                    <div style={{ fontSize: 22 }}>{s.icon}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", lineHeight: 1.2, marginTop: 4 }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
                <Search size={16} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                <input style={{ width: "100%", padding: "11px 12px 11px 40px", borderRadius: 12, border: "2px solid #e2e8f0", background: "#fff", fontFamily: "inherit", fontSize: 13, outline: "none", transition: "0.3s" }}
                  placeholder="Rechercher un cours..." value={coursSearch} onChange={e => setCoursSearch(e.target.value)}
                  onFocus={e => { e.target.style.borderColor = "#26c1c9"; e.target.style.boxShadow = "0 0 0 3px rgba(38,193,201,0.1)"; }}
                  onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }} />
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {CATEGORIES_COURS.map(cat => (
                  <button key={cat} onClick={() => setFiltreCategorie(cat)}
                    style={{ padding: "9px 16px", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "0.25s", border: filtreCategorie === cat ? "2px solid #26c1c9" : "2px solid #e2e8f0", background: filtreCategorie === cat ? "rgba(38,193,201,0.08)" : "#fff", color: filtreCategorie === cat ? "#26c1c9" : "#64748b" }}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {!coursLoading && coursFiltres.length > 0 && (
              <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600, marginBottom: 16 }}>
                {coursFiltres.length} cours trouvé{coursFiltres.length > 1 ? "s" : ""}
                {filtreCategorie !== "Tous" && <span style={{ color: "#26c1c9" }}> · {filtreCategorie}</span>}
                {coursSearch && <span> pour "<strong style={{ color: "#0f172a" }}>{coursSearch}</strong>"</span>}
              </div>
            )}

            {coursLoading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} style={{ background: "#fff", borderRadius: 20, border: "2px solid #e2e8f0", overflow: "hidden" }}>
                    <div style={{ height: 140, background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)", backgroundSize: "400% 100%", animation: "shimmer 1.5s infinite" }} />
                    <div style={{ padding: 18 }}>
                      <div style={{ height: 10, background: "#f1f5f9", borderRadius: 6, width: "40%", marginBottom: 10 }} />
                      <div style={{ height: 14, background: "#f1f5f9", borderRadius: 6, width: "80%", marginBottom: 6 }} />
                      <div style={{ height: 12, background: "#f1f5f9", borderRadius: 6, width: "60%" }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : coursFiltres.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 20px", background: "#fff", borderRadius: 24, border: "2px dashed #e2e8f0" }}>
                <div style={{ fontSize: 52, marginBottom: 16 }}>📭</div>
                <p style={{ fontWeight: 800, fontSize: 16, color: "#0f172a", marginBottom: 8 }}>{coursSearch || filtreCategorie !== "Tous" ? "Aucun cours trouvé" : "Aucun cours disponible"}</p>
                <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>{coursSearch || filtreCategorie !== "Tous" ? "Essayez d'autres mots-clés ou une autre catégorie" : "De nouveaux cours seront ajoutés prochainement !"}</p>
                {(coursSearch || filtreCategorie !== "Tous") && (
                  <button onClick={() => { setCoursSearch(""); setFiltreCategorie("Tous"); }}
                    style={{ background: "#060b13", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                    Réinitialiser les filtres
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
                {coursFiltres.map(c => (
                  <CoursCard key={c.id} cours={c} onClick={c => { setSelectedCours(c); setShowCoursModal(true); }} />
                ))}
              </div>
            )}
          </>)}

          {/* ── PROFIL ── */}
          {view === "profil" && (<>
            <header className="dc-header">
              <div><h1 className="dc-title">Mon profil 👤</h1><p className="dc-subtitle">Gérez vos informations personnelles</p></div>
              <div style={{ display: "flex", gap: 10 }}>
                {editMode
                  ? <><button className="dc-btn-save" onClick={handleSaveProfil}><Save size={16} /> Sauvegarder</button><button className="dc-btn-edit" onClick={() => { setEditMode(false); fetchProfil(); }}><X size={16} /> Annuler</button></>
                  : <button className="dc-btn-edit" onClick={() => setEditMode(true)}><Edit size={16} /> Modifier</button>
                }
              </div>
            </header>
            <div className="dc-profil-card">
              <input ref={photoInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoChange} />
              <div className="dc-photo-wrap">
                {currentPhoto ? <img src={currentPhoto} alt="Photo" className="dc-photo-img" /> : <div className="dc-photo-avatar">{initiales}</div>}
                <div className="dc-photo-btn" onClick={() => photoInputRef.current?.click()}><Camera size={14} color="#fff" /></div>
                <div className="dc-photo-hover-card">
                  {currentPhoto ? <img src={currentPhoto} alt="Photo" className="dc-hover-img" /> : <div className="dc-hover-avatar">{initiales}</div>}
                  <div><div className="dc-hover-name">{nomAffiche}</div><div className="dc-hover-role">Candidat</div></div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="dc-field"><label>Prénom</label><input value={profilForm.prenom} disabled={!editMode} placeholder="Votre prénom" onChange={e => setProfilForm({ ...profilForm, prenom: e.target.value })} /></div>
                <div className="dc-field"><label>Nom</label><input value={profilForm.nom} disabled={!editMode} placeholder="Votre nom" onChange={e => setProfilForm({ ...profilForm, nom: e.target.value })} /></div>
                <div className="dc-field"><label>Téléphone</label><input value={profilForm.telephone} disabled={!editMode} placeholder="+216 XX XXX XXX" onChange={e => setProfilForm({ ...profilForm, telephone: e.target.value })} /></div>
                <div className="dc-field"><label>Ville</label><input value={profilForm.ville} disabled={!editMode} placeholder="ex: Tunis" onChange={e => setProfilForm({ ...profilForm, ville: e.target.value })} /></div>
                <div className="dc-field"><label>Nationalité</label><input value={profilForm.nationalite} disabled={!editMode} placeholder="ex: Tunisienne" onChange={e => setProfilForm({ ...profilForm, nationalite: e.target.value })} /></div>
                <div className="dc-field"><label>LinkedIn</label><input value={profilForm.linkedin} disabled={!editMode} placeholder="https://linkedin.com/in/..." onChange={e => setProfilForm({ ...profilForm, linkedin: e.target.value })} /></div>
                <div className="dc-field" style={{ gridColumn: "span 2" }}><label>Email</label><input value={user?.email || ""} disabled /></div>
              </div>
            </div>
          </>)}

        </main>
      </div>

      {/* ── MODAL POSTULER ── */}
      {showModal && selectedOffre && (
        <ModalPostuler
          offre={selectedOffre}
          profilNom={nomAffiche}
          onClose={() => setShowModal(false)}
          onSubmit={handlePostuler}
          submitting={submitting}
        />
      )}

      {/* ── MODAL VISA ── */}
      {showVisaModal && (
        <div className="dc-overlay" onClick={() => setShowVisaModal(false)}>
          <div className="dc-modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 className="dc-modal-title">✈️ Demande de visa</h2>
              <button onClick={() => setShowVisaModal(false)} style={{ border: "none", background: "#f1f5f9", padding: 8, borderRadius: 8, cursor: "pointer" }}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreerVisa}>
              <div className="dc-field"><label>Pays de destination *</label><input required placeholder="ex: France" value={visaForm.pays} onChange={e => setVisaForm({ ...visaForm, pays: e.target.value })} /></div>
              <div className="dc-field"><label>Type de visa</label><select value={visaForm.typeVisa} onChange={e => setVisaForm({ ...visaForm, typeVisa: e.target.value })}><option>Visa Travail</option><option>Visa Étudiant</option><option>Visa Touriste</option><option>Visa Affaires</option></select></div>
              <div className="dc-field"><label>Date de début souhaitée</label><input type="date" value={visaForm.dateDebut} onChange={e => setVisaForm({ ...visaForm, dateDebut: e.target.value })} /></div>
              <button type="submit" className="dc-btn-submit" disabled={submittingVisa}>{submittingVisa ? "Envoi..." : "✈️ Créer la demande"}</button>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL DOCUMENTS VISA ── */}
      {showDocsModal && selectedVisa && (
        <div className="dc-overlay" onClick={() => setShowDocsModal(false)}>
          <div className="dc-modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 className="dc-modal-title">📄 Documents requis</h2>
              <button onClick={() => setShowDocsModal(false)} style={{ border: "none", background: "#f1f5f9", padding: 8, borderRadius: 8, cursor: "pointer" }}><X size={18} /></button>
            </div>
            <div style={{ background: "#f8fafc", borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
              <div style={{ fontWeight: 700 }}>{selectedVisa.typeVisa} — {selectedVisa.pays}</div>
              <div style={{ marginTop: 6 }}><VisaBadge statut={selectedVisa.statut} /></div>
            </div>
            {visaDocs.length === 0 ? <p style={{ color: "var(--muted)", textAlign: "center", padding: 20 }}>Aucun document trouvé</p>
              : visaDocs.map(doc => (
                <div key={doc.id} className="dc-doc-upload-item">
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{doc.nomDocument}</div>
                    <div style={{ fontSize: 12, marginTop: 3 }}>
                      {["FOURNI", "VALIDE"].includes(doc.statut) ? <span style={{ color: "#16a34a", fontWeight: 700 }}>✅ Fourni</span> : <span style={{ color: "#d97706", fontWeight: 700 }}>⏳ Manquant</span>}
                    </div>
                  </div>
                  {!["FOURNI", "VALIDE"].includes(doc.statut) && (
                    <label style={{ background: "var(--bg-dark)", color: "#fff", padding: "7px 14px", borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                      <Upload size={13} style={{ verticalAlign: "middle", marginRight: 4 }} /> Uploader
                      <input type="file" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) handleUploadDoc(doc.id, e.target.files[0]); }} />
                    </label>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ── MODAL CV ── */}
      {showCvModal && cvViewUrl && (
        <div className="dc-overlay" onClick={() => setShowCvModal(false)}>
          <div style={{ background: "#fff", width: 700, borderRadius: 24, padding: 28, maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800 }}>📄 Mon CV</h2>
              <div style={{ display: "flex", gap: 8 }}>
                <a href={cvViewUrl} target="_blank" rel="noreferrer" style={{ background: "var(--bg-dark)", color: "#fff", padding: "8px 16px", borderRadius: 8, fontWeight: 700, fontSize: 12, textDecoration: "none" }}>↗ Ouvrir</a>
                <button onClick={() => setShowCvModal(false)} style={{ border: "none", background: "#f1f5f9", padding: 8, borderRadius: 8, cursor: "pointer" }}><X size={18} /></button>
              </div>
            </div>
            <iframe src={cvViewUrl} className="dc-cv-viewer" title="CV" />
          </div>
        </div>
      )}

      {/* ── MODAL COURS DETAIL ── */}
      {showCoursModal && selectedCours && (() => {
        const cat = CAT_COLORS[selectedCours.categorie] || { bg: "#f1f5f9", color: "#475569", icon: "📖" };
        return (
          <div className="dc-overlay" onClick={() => setShowCoursModal(false)}>
            <div style={{ background: "#fff", width: 640, borderRadius: 24, maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
              <div style={{ width: "100%", height: 200, position: "relative", overflow: "hidden", borderRadius: "24px 24px 0 0", background: "linear-gradient(135deg,#060b13 0%,#0c1f3d 100%)" }}>
                {selectedCours.imageUrl && <img src={selectedCours.imageUrl} alt={selectedCours.titre} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0, opacity: 0.6 }} />}
                <div style={{ position: "absolute", top: -30, right: 40, width: 160, height: 160, background: "#26c1c9", borderRadius: "50%", opacity: 0.08 }} />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
                  <div style={{ fontSize: 48 }}>{cat.icon}</div>
                  <div style={{ background: "rgba(38,193,201,0.2)", border: "1px solid rgba(38,193,201,0.4)", borderRadius: 10, padding: "5px 14px", fontSize: 11, fontWeight: 800, color: "#26c1c9", textTransform: "uppercase", letterSpacing: 1 }}>{selectedCours.categorie}</div>
                </div>
                <button onClick={() => setShowCoursModal(false)} style={{ position: "absolute", top: 14, right: 14, background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}>
                  <X size={16} />
                </button>
              </div>
              <div style={{ padding: 32 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                  <span style={{ background: cat.bg, color: cat.color, padding: "4px 10px", borderRadius: 7, fontSize: 11, fontWeight: 800 }}>{cat.icon} {selectedCours.categorie}</span>
                  <NiveauBadge niveau={selectedCours.niveau} />
                  {selectedCours.dureeMinutes && <span style={{ background: "#f1f5f9", color: "#475569", padding: "4px 10px", borderRadius: 7, fontSize: 11, fontWeight: 700 }}>⏱ {selectedCours.dureeMinutes} min</span>}
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 12, lineHeight: 1.3 }}>{selectedCours.titre}</h2>
                {selectedCours.instructeurNom && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, padding: "10px 14px", background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#26c1c9,#0891b2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{selectedCours.instructeurNom[0].toUpperCase()}</div>
                    <div><div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{selectedCours.instructeurNom}</div><div style={{ fontSize: 11, color: "#26c1c9", fontWeight: 600 }}>Instructeur</div></div>
                  </div>
                )}
                <div style={{ height: 2, background: "#f1f5f9", borderRadius: 2, marginBottom: 16 }} />
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>À propos de ce cours</div>
                  <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.8 }}>{selectedCours.description || "Aucune description disponible."}</p>
                </div>
                <div style={{ background: "linear-gradient(135deg,#f0fdfc,#f8fafc)", border: "1.5px solid #99f6e4", borderRadius: 14, padding: "18px 20px", marginBottom: 24 }}>
                  <div style={{ fontWeight: 800, fontSize: 13, color: "#0f172a", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><span>✨</span> Ce que vous allez apprendre</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {["Concepts fondamentaux", "Exemples pratiques", "Bonnes pratiques", "Cas d'usage réels"].map(item => (
                      <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#475569", fontWeight: 600 }}>
                        <div style={{ width: 18, height: 18, background: "#26c1c9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span style={{ fontSize: 9, color: "#060b13", fontWeight: 900 }}>✓</span>
                        </div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  {selectedCours.urlVideo ? (
                    <a href={selectedCours.urlVideo} target="_blank" rel="noopener noreferrer"
                      style={{ flex: 1, padding: 14, borderRadius: 12, background: "#060b13", color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#26c1c9"}
                      onMouseLeave={e => e.currentTarget.style.background = "#060b13"}>
                      <Play size={16} fill="#fff" /> Regarder la vidéo
                    </a>
                  ) : (
                    <div style={{ flex: 1, padding: 14, borderRadius: 12, background: "#f1f5f9", color: "#94a3b8", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      🎥 Vidéo bientôt disponible
                    </div>
                  )}
                  {selectedCours.urlRessource && (
                    <a href={selectedCours.urlRessource} target="_blank" rel="noopener noreferrer"
                      style={{ padding: "14px 20px", borderRadius: 12, background: "#f1f5f9", color: "#0f172a", fontWeight: 700, fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, border: "2px solid #e2e8f0" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = "#26c1c9"}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}>
                      <ExternalLink size={15} /> Ressource
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}