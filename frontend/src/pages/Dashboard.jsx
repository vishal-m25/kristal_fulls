import React, { useEffect, useState } from 'react'
import { apiGet } from '../lib/api.js'

export default function Dashboard(){
  const [rows, setRows] = useState([])
  const [filters, setFilters] = useState({})
  const [detail, setDetail] = useState(null)

  async function load(){
    const qs = new URLSearchParams(filters).toString()
    const data = await apiGet('/api/dashboard/summary' + (qs? ('?'+qs):''))
    setRows(data)
  }
  useEffect(()=>{ load() }, [JSON.stringify(filters)])

  async function openDetail(base_id, equipment_type_id){
    const qs = new URLSearchParams({base_id, equipment_type_id}).toString()
    const d = await apiGet('/api/dashboard/net-movement-detail?'+qs)
    setDetail({ base_id, equipment_type_id, rows: d })
  }

  return <div>
    <h2>Dashboard</h2>
    <div className="filters">
      <input placeholder="Date From (YYYY-MM-DD)" onChange={e=>setFilters({...filters, date_from: e.target.value})}/>
      <input placeholder="Date To (YYYY-MM-DD)" onChange={e=>setFilters({...filters, date_to: e.target.value})}/>
      <input placeholder="Base ID" onChange={e=>setFilters({...filters, base_id: e.target.value})}/>
      <input placeholder="Equipment Type ID" onChange={e=>setFilters({...filters, equipment_type_id: e.target.value})}/>
    </div>
    <div className="card">
      <table>
        <thead><tr><th>Base</th><th>Equipment</th><th>Opening</th><th>Net Movement</th><th>Closing</th></tr></thead>
        <tbody>
          {rows.map((r,i)=>{
            const closing = (Number(r.opening||0) + Number(r.in_qty||0) - Number(r.out_qty||0)).toFixed(2)
            const net = (Number(r.in_qty||0) - Number(r.out_qty||0)).toFixed(2)
            return <tr key={i}>
              <td>{r.base_name}</td>
              <td>{r.equipment_name}</td>
              <td>{Number(r.opening||0).toFixed(2)}</td>
              <td><span className="link" onClick={()=>openDetail(r.base_id, r.equipment_type_id)}>{net}</span></td>
              <td>{closing}</td>
            </tr>
          })}
        </tbody>
      </table>
    </div>

    {detail && <div className="modal" onClick={()=>setDetail(null)}>
      <div onClick={e=>e.stopPropagation()}>
        <h3>Net Movement Detail</h3>
        <table>
          <thead><tr><th>Type</th><th>Qty</th><th>Ref</th><th>Date</th></tr></thead>
          <tbody>
            {detail.rows.map((d,i)=>(
              <tr key={i}><td>{d.movement_type}</td><td>{d.qty}</td><td>{d.ref_table}#{d.ref_id}</td><td>{new Date(d.created_at).toLocaleString()}</td></tr>
            ))}
          </tbody>
        </table>
        <div style={{textAlign:'right'}}><button className="btn" onClick={()=>setDetail(null)}>Close</button></div>
      </div>
    </div>}
  </div>
}
