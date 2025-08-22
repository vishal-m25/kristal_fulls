import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import Purchases from './pages/Purchases.jsx'
import Transfers from './pages/Transfers.jsx'
import Assignments from './pages/Assignments.jsx'
import Login from './pages/Login.jsx'

function AppShell(){
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [role, setRole] = useState(localStorage.getItem('role'))

  // Keep state in sync if localStorage changes (e.g. from Login)
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'))
      setRole(localStorage.getItem('role'))
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    setToken(null)
    setRole(null)
  }

  return (
    <BrowserRouter>
      <div className="topbar">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div><b>MAMS</b></div>
          <nav style={{display:'flex',gap:12,alignItems:'center',color:'white'}}>
            {token && (
              <>
                <Link style={{color:'white'}} to="/">Dashboard</Link>
                <Link style={{color:'white'}} to="/purchases">Purchases</Link>
                <Link style={{color:'white'}} to="/transfers">Transfers</Link>
                <Link style={{color:'white'}} to="/assignments">Assignments</Link>
              </>
            )}
            {!token ? (
              <Link to="/login">Login</Link>
            ) : (
              <><span className="pill" style={{ color: 'black' }}>
                  {role || "user"}{' '}
                </span><span className="link pill" onClick={handleLogout}>
                    Logout
                  </span></>
            )}
          </nav>
        </div>
      </div>
      <div className="container">
        <Routes>
<Route 
  path="/login" 
  element={<Login setToken={setToken} setRole={setRole} />} 
/>          <Route path="/" element={token ? <Dashboard/> : <Navigate to="/login" />} />
          <Route path="/purchases" element={token ? <Purchases/> : <Navigate to="/login" />} />
          <Route path="/transfers" element={token ? <Transfers/> : <Navigate to="/login" />} />
          <Route path="/assignments" element={token ? <Assignments/> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<AppShell/>)
