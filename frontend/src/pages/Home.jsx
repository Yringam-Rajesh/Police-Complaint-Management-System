import { Link } from "react-router-dom";
import { ArrowRight, Languages, LockKeyhole, MapPinned, ShieldCheck, Workflow } from "lucide-react";
import PoliceEmblem from "../components/PoliceEmblem.jsx";

const features = [
  { icon: Languages, title: "Multilingual assistance", text: "Design the complaint journey around citizens who prefer regional languages." },
  { icon: Workflow, title: "Transparent workflow", text: "Track a complaint from submission and assignment through investigation and resolution." },
  { icon: LockKeyhole, title: "Role-based access", text: "Separate citizen, police officer and administrator permissions." },
  { icon: MapPinned, title: "Centralized management", text: "Give authorized officers and administrators one operational view." }
];

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="grid-pattern absolute inset-0 opacity-70" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:py-28">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[.18em] text-amber-200">
              <ShieldCheck size={16} /> Citizen Safety • Digital Services
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[.98] tracking-tight sm:text-6xl">
              A modern command center for <span className="text-amber-300">citizen complaints.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              JanRaksha is an educational full-stack system for multilingual complaint registration,
              police investigation workflows and administrative visibility.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/register" className="flex items-center gap-2 rounded-2xl bg-amber-400 px-6 py-3 font-black text-slate-950 hover:bg-amber-300">
                Register as Citizen <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="rounded-2xl border border-white/15 bg-white/10 px-6 py-3 font-bold hover:bg-white/15">
                Open Portal
              </Link>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
              <PoliceEmblem />
              <p className="mt-7 text-sm font-bold uppercase tracking-[.2em] text-amber-300">Public Safety Portal</p>
              <h2 className="mt-2 text-3xl font-black">One complaint. One transparent workflow.</h2>
              <div className="mt-8 space-y-3">
                {["Submit in a preferred language", "Receive status updates", "Officer investigation workflow", "Administrative analytics"].map(item => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/5 p-3 text-sm text-slate-200">
                    <span className="h-2 w-2 rounded-full bg-amber-300" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-black uppercase tracking-[.18em] text-blue-600">Built for the workflow</p>
          <h2 className="mt-2 text-4xl font-black tracking-tight">From citizen report to resolution.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 inline-flex rounded-2xl bg-slate-950 p-3 text-amber-300"><Icon size={22} /></div>
              <h3 className="font-black">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
