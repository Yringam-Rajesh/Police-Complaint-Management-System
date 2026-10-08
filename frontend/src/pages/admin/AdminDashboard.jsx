import { useEffect, useState } from "react";
import { BarChart3, ClipboardCheck, Users, UserPlus, X } from "lucide-react";
import api from "../../api.js";
import StatCard from "../../components/StatCard.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [analytics, setAnalytics] = useState({});
  const [complaints, setComplaints] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [form, setForm] = useState({
    employeeCode: "", fullName: "", rank: "", department: "",
    policeStation: "", mobileNumber: "", email: "", password: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [createdOfficer, setCreatedOfficer] = useState(null);

  async function load() {
    try {
      const [a, c, o] = await Promise.all([
        api.get("/complaints/analytics"),
        api.get("/complaints/all"),
        api.get("/complaints/officers")
      ]);
      setAnalytics(a.data.analytics);
      setComplaints(c.data.complaints);
      setOfficers(o.data.officers);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load admin data");
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (user?.role === "ADMIN") setShowWelcome(true);
  }, [user]);

  async function createOfficer(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const { data } = await api.post("/complaints/officers", form);

      setCreatedOfficer({
        ...data.officer,
        rank: form.rank,
        policeStation: form.policeStation
      });

      setForm({
        employeeCode: "", fullName: "", rank: "", department: "",
        policeStation: "", mobileNumber: "", email: "", password: ""
      });

      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create officer");
    }
  }

  async function assign(complaintId, officerId) {
    if (!officerId) return;
    try {
      await api.patch(`/complaints/${complaintId}/assign`, { officerId });
      setMessage(`Complaint ${complaintId} assigned.`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Assignment failed");
    }
  }

  return (
    <>
      <main className="mx-auto max-w-7xl px-5 py-10">
        <p className="text-sm font-black uppercase tracking-[.18em] text-blue-600">{t("admin.label")}</p>
        <h1 className="mt-2 text-4xl font-black">{t("admin.title")}</h1>
        <p className="mt-2 text-slate-600">{t("admin.subtitle")}</p>

        {message && <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-emerald-700">{message}</div>}
        {error && <div className="mt-6 rounded-2xl bg-rose-50 p-4 text-rose-700">{error}</div>}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label={t("admin.total")} value={analytics.total || 0} icon={ClipboardCheck} />
          <StatCard label={t("admin.investigation")} value={analytics.investigation || 0} icon={BarChart3} tone="blue" />
          <StatCard label={t("admin.resolved")} value={analytics.resolved || 0} icon={ClipboardCheck} tone="emerald" />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[.75fr_1.25fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-slate-950 p-2 text-amber-300"><UserPlus size={20} /></div>
              <div><h2 className="font-black">{t("admin.create")}</h2><p className="text-xs text-slate-500">{language === "English" ? "Admin-provisioned account" : language === "Telugu" ? "అడ్మిన్ ద్వారా ఖాతా" : "एडमिन द्वारा खाता"}</p></div>
            </div>

            <form onSubmit={createOfficer} className="mt-6 space-y-3">
              {Object.entries(form).map(([key, value]) => (
                <input key={key} required={["employeeCode", "fullName", "password"].includes(key)} placeholder={{ employeeCode: t("employeeCode"), fullName: language === "English" ? "Full name" : language === "Telugu" ? "పూర్తి పేరు" : "पूरा नाम", rank: t("rank"), department: language === "English" ? "Department" : language === "Telugu" ? "విభాగం" : "विभाग", policeStation: t("policeStation"), mobileNumber: language === "English" ? "Mobile number" : language === "Telugu" ? "మొబైల్ నంబర్" : "मोबाइल नंबर", email: "Email", password: language === "English" ? "Password" : language === "Telugu" ? "పాస్‌వర్డ్" : "पासवर्ड" }[key]} value={value} onChange={e => setForm({ ...form, [key]: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm" />
              ))}
              <button className="w-full rounded-2xl bg-slate-950 py-3 font-black text-white">{t("createOfficerButton")}</button>
            </form>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <h2 className="font-black">{t("admin.queue")}</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {complaints.map(c => (
                <div key={c._id} className="p-5">
                  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                    <div>
                      <p className="font-black">{c.complaintId}</p>
                      <p className="text-sm text-slate-600">{c.category} · {c.citizen?.fullName} · {c.status}</p>{c.translatedDescription && <p className="mt-1 line-clamp-2 text-xs text-slate-500">{c.translatedDescription}</p>}
                    </div>
                    <select defaultValue={c.assignedOfficer?._id || ""} onChange={e => assign(c.complaintId, e.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold">
                      <option value="">{language === "English" ? "Assign officer" : language === "Telugu" ? "అధికారిని కేటాయించండి" : "अधिकारी नियुक्त करें"}</option>
                      {officers.map(o => <option key={o._id} value={o._id}>{o.fullName} ({o.activeComplaintCount}/5)</option>)}
                    </select>
                  </div>
                </div>
              ))}
              {!complaints.length && <div className="p-8 text-center text-slate-500">{language === "English" ? "No complaints found." : language === "Telugu" ? "ఫిర్యాదులు కనుగొనబడలేదు." : "कोई शिकायत नहीं मिली।"}</div>}
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Users size={20} />
            <h2 className="font-black">{t("admin.workload")}</h2>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {officers.map(o => (
              <div key={o._id} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-black">{o.fullName}</p>
                <p className="text-sm text-slate-500">{o.employeeCode} · {o.rank || "Officer"}</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.min(o.activeComplaintCount / 5 * 100, 100)}%` }} />
                </div>
                <p className="mt-2 text-xs font-bold text-slate-500">{o.activeComplaintCount} / 5 {language === "English" ? "active complaints" : language === "Telugu" ? "క్రియాశీల ఫిర్యాదులు" : "सक्रिय शिकायतें"}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-5">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
            <button
              type="button"
              onClick={() => setShowWelcome(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close welcome popup"
            >
              <X size={20} />
            </button>

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl">
              👋
            </div>
            <p className="mt-5 text-sm font-black uppercase tracking-[.16em] text-blue-600">JanRaksha Admin</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900">
              {t("admin.welcome")}, {user?.fullName || "Admin"}!
            </h2>
            <p className="mt-3 text-slate-600">
              {t("admin.welcomeText")}
            </p>

            <button
              type="button"
              onClick={() => setShowWelcome(false)}
              className="mt-6 w-full rounded-2xl bg-slate-950 py-3 font-black text-white"
            >
              {t("common.continue")}
            </button>
          </div>
        </div>
      )}

      {createdOfficer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-5">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setCreatedOfficer(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close officer success popup"
            >
              <X size={20} />
            </button>

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl">
              ✓
            </div>
            <h2 className="mt-5 text-center text-2xl font-black text-slate-900">
              {t("admin.appointed")}
            </h2>
            <p className="mt-3 text-center text-slate-600">
              Officer <span className="font-black text-slate-900">{createdOfficer.fullName}</span> has been successfully appointed.
            </p>

            <div className="mt-6 space-y-3 rounded-2xl bg-slate-50 p-5">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">{language === "English" ? "Employee Code" : language === "Telugu" ? "ఉద్యోగి కోడ్" : "कर्मचारी कोड"}</span>
                <span className="font-black">{createdOfficer.employeeCode}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">{language === "English" ? "Rank" : language === "Telugu" ? "ర్యాంక్" : "पद"}</span>
                <span className="font-black">{createdOfficer.rank || "Officer"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">{language === "English" ? "Police Station" : language === "Telugu" ? "పోలీస్ స్టేషన్" : "पुलिस स्टेशन"}</span>
                <span className="text-right font-black">{createdOfficer.policeStation || "Not specified"}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCreatedOfficer(null)}
              className="mt-6 w-full rounded-2xl bg-slate-950 py-3 font-black text-white"
            >
              {t("common.done")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
