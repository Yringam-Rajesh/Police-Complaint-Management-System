import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CitizenDashboard from "./pages/citizen/CitizenDashboard.jsx";
import NewComplaint from "./pages/citizen/NewComplaint.jsx";
import PoliceDashboard from "./pages/police/PoliceDashboard.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ComplaintDetails from "./pages/citizen/ComplaintDetails.jsx";

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute roles={["CITIZEN"]} />}>
          <Route path="/citizen" element={<CitizenDashboard />} />
          <Route path="/citizen/new-complaint" element={<NewComplaint />} />
          <Route path="/citizen/complaints/:complaintId" element={<ComplaintDetails />} />
        </Route>

        <Route element={<ProtectedRoute roles={["POLICE_OFFICER"]} />}>
          <Route path="/police" element={<PoliceDashboard />} />
        </Route>

        <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </LanguageProvider>
    </AuthProvider>
  );
}
