import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api.js";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "", dateOfBirth: "", mobileNumber: "", email: "",
    address: "", occupation: "", password: ""
  });
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  const update = e => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/register", form);
      setDone(`Registration successful. Your Citizen ID is ${data.user.citizenId}`);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || "Registration failed");
    }
  }

  return (
    <main className="min-h-[calc(100vh-65px)] bg-slate-100 px-5 py-10">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-7 shadow-xl md:p-10">
        <p className="text-sm font-black uppercase tracking-[.18em] text-blue-600">Citizen onboarding</p>
        <h1 className="mt-2 text-4xl font-black">Create your citizen account</h1>
        <p className="mt-2 text-slate-600">Use accurate contact information so complaint updates can reach you.</p>

        {error && <div className="mt-5 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}
        {done && <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">{done}</div>}

        <form onSubmit={submit} className="mt-7 grid gap-4 md:grid-cols-2">
          <Input name="fullName" label="Full name" value={form.fullName} onChange={update} required />
          <Input name="dateOfBirth" type="date" label="Date of birth" value={form.dateOfBirth} onChange={update} />
          <Input name="mobileNumber" label="Mobile number" value={form.mobileNumber} onChange={update} required />
          <Input name="email" type="email" label="Email" value={form.email} onChange={update} required />
          <Input name="occupation" label="Occupation" value={form.occupation} onChange={update} />
          <Input name="address" label="Address" value={form.address} onChange={update} />
          <Input name="password" type="password" label="Password" value={form.password} onChange={update} required />
          <div className="flex items-end">
            <button className="w-full rounded-2xl bg-slate-950 py-3.5 font-black text-white">Create account</button>
          </div>
        </form>

        <p className="mt-6 text-sm text-slate-600">Already registered? <Link className="font-bold text-blue-600" to="/login">Login</Link></p>
      </div>
    </main>
  );
}

function Input({ label, ...props }) {
  return (
    <label className="block text-sm font-bold text-slate-700">
      {label}
      <input {...props} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500" />
    </label>
  );
}
