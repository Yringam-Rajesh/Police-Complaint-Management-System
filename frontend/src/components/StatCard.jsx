export default function StatCard({ label, value, icon: Icon, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-900 text-white",
    amber: "bg-amber-400 text-slate-950",
    blue: "bg-blue-600 text-white",
    emerald: "bg-emerald-600 text-white",
    rose: "bg-rose-600 text-white"
  };

  return (
    <div className={`rounded-3xl p-5 shadow-sm ${tones[tone]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-75">{label}</p>
          <p className="mt-2 text-3xl font-black">{value}</p>
        </div>
        {Icon && <Icon size={28} className="opacity-80" />}
      </div>
    </div>
  );
}
