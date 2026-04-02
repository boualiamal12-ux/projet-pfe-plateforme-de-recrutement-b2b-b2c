import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader, Clock, Sparkles } from "lucide-react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  :root { --bg-dark: #060b13; --primary-cyan: #26c1c9; --text-muted: #94a3b8; }

  .ve-root { display: flex; min-height: 100vh; width: 100%; font-family: 'Plus Jakarta Sans', sans-serif; background: var(--bg-dark); }

  .ve-left { flex: 1.2; position: relative; display: flex; flex-direction: column; justify-content: center; padding: 60px; overflow: hidden; background: radial-gradient(circle at 0% 100%, rgba(38,193,201,0.1) 0%, transparent 50%); }
  .ve-left::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 30px 30px; }
  .ve-left-content { position: relative; z-index: 1; }

  .ve-brand { display: flex; align-items: center; gap: 12px; margin-bottom: 48px; }
  .ve-brand-icon { width: 36px; height: 36px; background: var(--primary-cyan); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--bg-dark); font-weight: 800; font-size: 18px; }
  .ve-brand-name { font-size: 20px; font-weight: 800; color: #fff; }

  .ve-tag { display: inline-flex; align-items: center; gap: 8px; background: rgba(38,193,201,0.1); border: 1px solid rgba(38,193,201,0.2); color: var(--primary-cyan); font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 100px; margin-bottom: 24px; width: fit-content; }

  .ve-left-title { font-size: clamp(32px,4vw,52px); font-weight: 800; color: #fff; line-height: 1.1; letter-spacing: -1.5px; margin-bottom: 20px; }
  .ve-left-title span { color: var(--primary-cyan); }
  .ve-left-sub { color: var(--text-muted); font-size: 15px; line-height: 1.7; max-width: 380px; }

  .ve-right { flex: 1; background: #f8fafc; display: flex; align-items: center; justify-content: center; padding: 40px; }

  .ve-card { width: 100%; max-width: 440px; background: white; border-radius: 30px; padding: 48px 44px; box-shadow: 0 20px 50px rgba(0,0,0,0.04); border: 1px solid #f1f5f9; text-align: center; }

  .ve-icon-wrap { margin-bottom: 24px; display: flex; justify-content: center; }

  .ve-title { font-size: 26px; font-weight: 800; color: var(--bg-dark); letter-spacing: -1px; margin-bottom: 12px; }

  .ve-sub { color: #64748b; font-size: 14px; line-height: 1.7; margin-bottom: 32px; }

  .ve-btn { display: inline-block; padding: 14px 40px; border-radius: 14px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 700; text-decoration: none; transition: 0.3s; border: none; cursor: pointer; }
  .ve-btn-success { background: var(--bg-dark); color: white; }
  .ve-btn-success:hover { background: #1a2333; transform: translateY(-2px); }
  .ve-btn-pending { background: rgba(38,193,201,0.1); color: var(--primary-cyan); border: 1.5px solid rgba(38,193,201,0.3); }
  .ve-btn-pending:hover { background: rgba(38,193,201,0.15); transform: translateY(-2px); }
  .ve-btn-error { background: var(--primary-cyan); color: var(--bg-dark); }
  .ve-btn-error:hover { opacity: 0.9; transform: translateY(-2px); }

  .ve-pending-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(38,193,201,0.08); border: 1px solid rgba(38,193,201,0.2); color: var(--primary-cyan); font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 100px; margin-bottom: 20px; }

  @keyframes spin { to { transform: rotate(360deg); } }
  .spin { animation: spin 1s linear infinite; }

  @media (max-width: 950px) { .ve-left { display: none; } .ve-right { background: var(--bg-dark); } }
`;

const LEFT_CONTENT = {
  loading: {
    tag: "Activation en cours",
    title: <>Vérification de <span>votre email</span>...</>,
    sub: "Nous vérifions votre lien d'activation. Cela ne prend que quelques secondes.",
  },
  success: {
    tag: "Compte activé ✅",
    title: <>Votre compte est <span>prêt !</span></>,
    sub: "Votre email a été vérifié avec succès. Vous pouvez maintenant accéder à toutes les fonctionnalités de RecruitPro.",
  },
  success_entreprise: {
    tag: "Email vérifié ✅",
    title: <>En attente de <span>validation</span>.</>,
    sub: "Votre email a été confirmé. Notre équipe va examiner votre dossier et vous notifier par email dès approbation.",
  },
  error: {
    tag: "Lien invalide ❌",
    title: <>Ce lien est <span>expiré</span> ou invalide.</>,
    sub: "Le lien d'activation a expiré ou a déjà été utilisé. Inscrivez-vous à nouveau pour recevoir un nouveau lien.",
  },
};

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const hasCalled = useRef(false);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Le jeton de vérification est manquant.");
      return;
    }

    if (!hasCalled.current) {
      hasCalled.current = true;

      axios.get(`http://localhost:8081/api/auth/verify-email?token=${token}`)
        .then(res => {
          // ✅ Backend retourne le rôle
          setStatus(res.data.role === "ENTREPRISE" ? "success_entreprise" : "success");
        })
        .catch(err => {
          setStatus("error");
          setMessage(err.response?.data?.error || "Le lien est invalide ou a expiré.");
        });
    }
  }, [searchParams]);

  const left = LEFT_CONTENT[status] || LEFT_CONTENT.loading;

  return (
    <>
      <style>{styles}</style>
      <div className="ve-root">

        {/* LEFT */}
        <div className="ve-left">
          <div className="ve-left-content">
            <div className="ve-brand">
              <div className="ve-brand-icon">R</div>
              <span className="ve-brand-name">RecruitPro</span>
            </div>
            <div className="ve-tag"><Sparkles size={14} /> {left.tag}</div>
            <h1 className="ve-left-title">{left.title}</h1>
            <p className="ve-left-sub">{left.sub}</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="ve-right">
          <div className="ve-card">

            {/* Loading */}
            {status === "loading" && (
              <>
                <div className="ve-icon-wrap">
                  <Loader size={56} color="#26c1c9" className="spin" />
                </div>
                <h2 className="ve-title">Vérification en cours...</h2>
                <p className="ve-sub">Nous activons votre compte, veuillez patienter.</p>
              </>
            )}

            {/* Success Candidat */}
            {status === "success" && (
              <>
                <div className="ve-icon-wrap">
                  <CheckCircle size={60} color="#22c55e" />
                </div>
                <h2 className="ve-title">Compte activé ! ✅</h2>
                <p className="ve-sub">
                  Votre email a été vérifié avec succès.<br />
                  Vous faites maintenant partie de RecruitPro.
                </p>
                <button onClick={() => navigate("/login")} className="ve-btn ve-btn-success">
                  Se connecter →
                </button>
              </>
            )}

            {/* Success Entreprise */}
            {status === "success_entreprise" && (
              <>
                <div className="ve-icon-wrap">
                  <Clock size={60} color="#26c1c9" />
                </div>
                <div className="ve-pending-badge">
                  <Sparkles size={12} /> En attente de validation
                </div>
                <h2 className="ve-title">Email vérifié ! ✅</h2>
                <p className="ve-sub">
                  Votre email a été confirmé avec succès.<br /><br />
                  Votre compte entreprise est en cours d'examen
                  par notre équipe. Vous recevrez un email
                  dès que votre compte sera approuvé. ⏳
                </p>
                <button onClick={() => navigate("/")} className="ve-btn ve-btn-pending">
                  Retour à l'accueil
                </button>
              </>
            )}

            {/* Error */}
            {status === "error" && (
              <>
                <div className="ve-icon-wrap">
                  <XCircle size={60} color="#e11d48" />
                </div>
                <h2 className="ve-title">Échec de l'activation ❌</h2>
                <p className="ve-sub">{message}</p>
                <button onClick={() => navigate("/register")} className="ve-btn ve-btn-error">
                  Retour à l'inscription
                </button>
              </>
            )}

          </div>
        </div>

      </div>
    </>
  );
}