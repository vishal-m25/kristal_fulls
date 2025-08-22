import React, { useEffect, useState } from 'react'
import { apiGet, apiPost } from '../lib/api.js'

export default function Transfers(){
  const [items,setItems] = useState([])
  const [types,setTypes] = useState([])
  const [bases,setBases] = useState([])
  const [line,setLine] = useState({})
  const [lines,setLines] = useState([])
  const [hdr,setHdr] = useState({})

  async function load(){
    setTypes(await apiGet('/api/master/equipment-types'))
    setBases(await apiGet('/api/master/bases'))
    setItems(await apiGet('/api/transfers'))
  }
  useEffect(()=>{ load() },[])

  function addLine(){
    if(line.equipment_type_id && line.qty){
      setLines([...lines, line]); setLine({})
    }
  }
  async function submit(e){
    e.preventDefault()
    await apiPost('/api/transfers', { ...hdr, lines })
    setLines([]); setLine({}); setHdr({})
    setItems(await apiGet('/api/transfers'))
  }

  return <div>
    <h2>Transfers</h2>
    <form onSubmit={submit} className="card">
      <div className="filters">
        <select onChange={e=>setHdr({...hdr, from_base_id: Number(e.target.value)})}>
          <option>From Base</option>
          {bases.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <select onChange={e=>setHdr({...hdr, to_base_id: Number(e.target.value)})}>
          <option>To Base</option>
          {bases.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>
      <div className="filters">
        <select value={line.equipment_type_id||''} onChange={e=>setLine({...line, equipment_type_id: Number(e.target.value)})}>
          <option value="">Equipment</option>
          {types.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <input type="number" placeholder="Qty" value={line.qty||''} onChange={e=>setLine({...line, qty: Number(e.target.value)})}/>
        <button type="button" className="btn" onClick={addLine}>Add Line</button>
      </div>
      {lines.length>0 && <div className="card">
        <b>Lines</b>
        <ul>{lines.map((l,i)=><li key={i}>{types.find(t=>t.id===l.equipment_type_id)?.name} — {l.qty}</li>)}</ul>
      </div>}
      <button className="btn">Create Transfer</button>
    </form>

    <div className="card">
      <table>
        <thead><tr><th>Date</th><th>From</th><th>To</th><th>Status</th></tr></thead>
        <tbody>
          {items.map((r,i)=>(<tr key={i}>
            <td>{new Date(r.created_at).toLocaleString()}</td><td>{r.from_base}</td><td>{r.to_base}</td><td>{r.status}</td>
          </tr>))}
        </tbody>
      </table>
    </div>
  </div>
}
