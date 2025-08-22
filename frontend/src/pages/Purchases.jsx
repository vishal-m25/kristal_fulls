import React, { useEffect, useState } from 'react'
import { apiGet, apiPost } from '../lib/api.js'

export default function Purchases(){
  const [items,setItems] = useState([])
  const [types,setTypes] = useState([])
  const [bases,setBases] = useState([])
  const [form,setForm] = useState({qty:0, unit_cost:0})
  async function load(){
    setTypes(await apiGet('/api/master/equipment-types'))
    setBases(await apiGet('/api/master/bases'))
    setItems(await apiGet('/api/purchases'))
  }
  useEffect(()=>{ load() },[])
  async function submit(e){
    e.preventDefault()
    await apiPost('/api/purchases', form)
    setItems(await apiGet('/api/purchases'))
  }
  return <div>
    <h2>Purchases</h2>
    <form onSubmit={submit} className="card">
      <div className="filters">
        <select onChange={e=>setForm({...form, base_id: Number(e.target.value)})}>
          <option>Base</option>
          {bases.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <select onChange={e=>setForm({...form, equipment_type_id: Number(e.target.value)})}>
          <option>Equipment</option>
          {types.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <input type="number" placeholder="Qty" onChange={e=>setForm({...form, qty: Number(e.target.value)})}/>
        <input type="number" placeholder="Unit Cost" onChange={e=>setForm({...form, unit_cost: Number(e.target.value)})}/>
        <input placeholder="Vendor" onChange={e=>setForm({...form, vendor: e.target.value})}/>
        <button className="btn">Add Purchase</button>
      </div>
    </form>
    <div className="card">
      <table>
        <thead><tr><th>Date</th><th>Base</th><th>Equipment</th><th>Qty</th><th>Unit Cost</th><th>Vendor</th></tr></thead>
        <tbody>
          {items.map((r,i)=>(<tr key={i}>
            <td>{new Date(r.purchased_at).toLocaleString()}</td>
            <td>{r.base_name}</td><td>{r.equipment_name}</td>
            <td>{r.qty}</td><td>{r.unit_cost||'-'}</td><td>{r.vendor||'-'}</td>
          </tr>))}
        </tbody>
      </table>
    </div>
  </div>
}
