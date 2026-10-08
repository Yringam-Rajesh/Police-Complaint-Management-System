export default function PoliceEmblem({ small = false }) {
  return (
    <div className={`${small ? "h-10 w-10" : "h-16 w-16"} shrink-0 rounded-full border-2 border-amber-300/80 bg-slate-900 flex items-center justify-center shadow-lg`}>
      <div className="text-center text-amber-200 leading-none">
        <div className={`${small ? "text-base" : "text-2xl"} font-black`}>JR</div>
        <div className="text-[7px] tracking-widest">CIVIC</div>
      </div>
    </div>
  );
}
