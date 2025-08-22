import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiPost } from '../lib/api.js'

export default function AuthPage({ setToken, setRole }) {
  const nav = useNavigate()
  const [mode, setMode] = useState("login") // "login" or "register"

  // shared state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRoleInput] = useState("user")
  const [err, setErr] = useState("")

  async function handleLogin(e) {
    e.preventDefault()
    try {
      const r = await apiPost("/api/auth/login", { email, password })

      localStorage.setItem("token", r.token)
      localStorage.setItem("role", r.role || "")
      localStorage.setItem("baseId", r.baseId || "")

      setToken(r.token)
      setRole(r.role)

      nav("/")
    } catch {
      setErr("Login failed")
    }
  }

  async function handleRegister(e) {
    e.preventDefault()
    if (password !== confirmPassword) {
      setErr("Passwords do not match")
      return
    }
    try {
      const r = await apiPost("/api/auth/register", { email, password, role })

      localStorage.setItem("token", r.token)
      localStorage.setItem("role", r.role || "")
      localStorage.setItem("baseId", r.baseId || "")

      setToken(r.token)
      setRole(r.role)

      nav("/")
    } catch(e) {
      setErr("Registration failed"+e)
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <button
          type="button"
          onClick={() => setMode("login")}
          style={{ marginRight: 10, background: mode === "login" ? "#007bff" : "#eee", color: mode === "login" ? "white" : "black", padding: "8px 16px", borderRadius: 6 }}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          style={{ background: mode === "register" ? "#007bff" : "#eee", color: mode === "register" ? "white" : "black", padding: "8px 16px", borderRadius: 6 }}
        >
          Register
        </button>
      </div>

      {err && <div style={{ color: "red", marginBottom: 10 }}>{err}</div>}

      {mode === "login" ? (
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <div>
            <label>Email<br />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </label>
          </div>
          <div>
            <label>Password<br />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </label>
          </div>
          <button className="btn" type="submit">Sign In</button>
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <h2>Register</h2>
          <div>
            <label>Email<br />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </label>
          </div>
          <div>
            <label>Password<br />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </label>
          </div>
          <div>
            <label>Confirm Password<br />
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            </label>
          </div>
          <div>
            <label>Role<br />
              <select value={role} onChange={e => setRoleInput(e.target.value)}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          </div>
          <button className="btn" type="submit">Register</button>
        </form>
      )}
    </div>
  )
}
