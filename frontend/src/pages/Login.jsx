import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import PoliceEmblem from "../components/PoliceEmblem.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function Login() {
  const { login } = useAuth(); const { t } = useLanguage();
  const [form, setForm] = useState({ identifier: "", password: "", secretCode: "" });
  const [showPassword, setShowPassword] = useState(false); const [showSecret, setShowSecret] = useState(false);
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(e) { e.preventDefault(); setError(""); setLoading(true); try { await login(form); } catch (err) { setError(err.response?.data?.message || "Login failed"); } finally { setLoading(false); } }
  return <main className="min-h-[calc(100vh-65px)] bg-slate-100 px-5 py-12"><div className="mx-auto max-w-md"><div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl"><div className="flex items-center gap-4"><PoliceEmblem /><div><p className="text-xs font-black uppercase tracking-[.2em] text-blue-600">{t("login.access")}</p><h1 className="text-3xl font-black">{t("login.title")}</h1></div></div>{error && <div className="mt-6 rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</div>}<form onSubmit={submit} className="mt-7 space-y-4"><Field label={t("login.identifier")}><input required value={form.identifier} onChange={e => setForm({ ...form, identifier: e.target.value })} /></Field><Field label={t("login.password")}><PasswordInput value={form.password} show={showPassword} setShow={setShowPassword} onChange={e => setForm({ ...form, password: e.target.value })} /></Field><Field label={t("login.secret")}><PasswordInput value={form.secretCode} show={showSecret} setShow={setShowSecret} onChange={e => setForm({ ...form, secretCode: e.target.value })} placeholder="Leave blank for citizen/officer" /></Field><button disabled={loading} className="w-full rounded-2xl bg-slate-950 py-3.5 font-black text-white disabled:opacity-50">{loading ? t("login.signing") : t("login.signIn")}</button></form><p className="mt-6 text-center text-sm text-slate-600">{t("login.citizen")} <Link className="font-bold text-blue-600" to="/register">{t("login.create")}</Link></p></div></div></main>;
}
function PasswordInput({ show, setShow, ...props }) { return <div className="relative"><input {...props} type={show ? "text" : "password"} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-11 outline-none focus:border-blue-500" /><button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">{show ? <EyeOff size={19} /> : <Eye size={19} />}</button></div>; }
function Field({ label, children }) { return <label className="block text-sm font-bold text-slate-700">{label}<div className="mt-2">{children}</div></label>; }
