import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await API.get("/auth/me");
        setUser(res.data.user);
      } catch (err) {
        navigate("/");
      }
    }
    load();
  }, [navigate]);

  async function logout() {
    try {
      await API.post("/auth/logout");
    } catch (err) {
      // ignore
    } finally {
      navigate("/");
    }
  }

  return (
    <div className="auth-root">
      <div className="auth-wrapper">
        <div className="auth-card" style={{ textAlign: "center", padding: "32px" }}>
          <h1 style={{ fontSize: "30px", marginBottom: "10px", fontWeight: "700" }}>
            Assignment Completed
          </h1>

          <p style={{ fontSize: "18px", marginBottom: "20px", color: "#6b7280" }}>
            Welcome, {user ? user.name : "User"} 🎉
          </p>

          <button className="auth-cta small" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
