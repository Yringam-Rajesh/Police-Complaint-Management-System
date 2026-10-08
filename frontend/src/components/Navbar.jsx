import { Link } from "react-router-dom";
import { ShieldCheck, LogOut, Languages } from "lucide-react";
import PoliceEmblem from "./PoliceEmblem.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-slate-950 text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3">
        <Link to="/" className="flex items-center gap-3">
          <PoliceEmblem small />
          <div><div className="font-black tracking-tight">JANRAKSHA</div><div className="text-[10px] uppercase tracking-[.22em] text-slate-300">Public Safety Portal</div></div>
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-2 py-1.5">
            <Languages size={16} />
            <select value={language} onChange={e => setLanguage(e.target.value)} className="bg-transparent text-sm font-bold outline-none">
              <option className="text-slate-900">English</option><option className="text-slate-900">Telugu</option><option className="text-slate-900">Hindi</option>
            </select>
          </div>
          {user ? <><span className="hidden text-sm text-slate-300 lg:block">{user.fullName} · {user.role.replace("_", " ")}</span><button onClick={logout} title={t("nav.logout")} className="rounded-xl border border-white/10 bg-white/10 p-2 hover:bg-white/20"><LogOut size={18} /></button></> : <Link to="/login" className="flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-sm font-bold text-slate-950"><ShieldCheck size={17} /> {t("nav.login")}</Link>}
        </div>
      </div>
    </header>
  );
}
