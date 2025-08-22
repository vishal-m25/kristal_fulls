import React, { useEffect, useState } from 'react'
import { apiGet, apiPost } from '../lib/api.js'

export default function Assignments() {
  const [items, setItems] = useState([])
  const [types, setTypes] = useState([])
  const [bases, setBases] = useState([])
  const [assign, setAssign] = useState({})
  const [expend, setExpend] = useState({})

  async function load() {
    setTypes(await apiGet('/api/master/equipment-types'))
    setBases(await apiGet('/api/master/bases'))
    setItems(await apiGet('/api/assignments'))
  }

  useEffect(() => { load() }, [])

  async function submitAssign(e) {
    e.preventDefault()
    await apiPost('/api/assignments/assign', assign)
    setItems(await apiGet('/api/assignments'))
  }

  async function submitExpend(e) {
    e.preventDefault()
    await apiPost('/api/assignments/expend', expend)
    setItems(await apiGet('/api/assignments'))
  }

  return (
    <div>
      <h2>Assignments & Expenditures</h2>
      <div className="grid">
        {/* Assign Form */}
        <form onSubmit={submitAssign} className="card">
          <b>Assign Asset</b>
          <div className="filters">
            <select onChange={e => setAssign({ ...assign, base_id: e.target.value })}>
              <option value="">Base</option>
              {bases.map(b => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))}
            </select>
            <select onChange={e => setAssign({ ...assign, equipment_type_id: e.target.value })}>
              <option value="">Equipment</option>
              {types.map(t => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>
            <input placeholder="Assigned To" onChange={e => setAssign({ ...assign, assigned_to: e.target.value })} />
            <input placeholder="ID No" onChange={e => setAssign({ ...assign, assigned_to_idno: e.target.value })} />
            <input type="number" placeholder="Qty" onChange={e => setAssign({ ...assign, qty: Number(e.target.value) })} />
            <button className="btn">Assign</button>
          </div>
        </form>

        {/* Expenditure Form */}
        <form onSubmit={submitExpend} className="card">
          <b>Record Expenditure</b>
          <div className="filters">
            <select onChange={e => setExpend({ ...expend, base_id: e.target.value })}>
              <option value="">Base</option>
              {bases.map(b => (
                <option key={b._id} value={b._id}>{b.name}</option>
              ))}
            </select>
            <select onChange={e => setExpend({ ...expend, equipment_type_id: e.target.value })}>
              <option value="">Equipment</option>
              {types.map(t => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>
            <input type="number" placeholder="Qty" onChange={e => setExpend({ ...expend, qty: Number(e.target.value) })} />
            <input placeholder="Reason" onChange={e => setExpend({ ...expend, reason: e.target.value })} />
            <button className="btn">Record</button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Base</th>
              <th>Equipment</th>
              <th>Assigned To</th>
              <th>Qty</th>
            </tr>
          </thead>
          <tbody>
            {items.map(r => (
              <tr key={r._id}>
                <td>{new Date(r.assigned_at).toLocaleString()}</td>
                <td>{r.base_name}</td>
                <td>{r.equipment_name}</td>
                <td>{r.assigned_to}</td>
                <td>{r.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
