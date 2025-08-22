const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';
function headers(){
  const token = localStorage.getItem('token');
  return {
    'Content-Type':'application/json',
    ...(token? { Authorization: 'Bearer '+token } : {})
  }
}
export async function apiGet(path){
  const res = await fetch(API_BASE+path,{ headers: headers() });
  if(!res.ok) throw new Error(await res.text());
  return res.json();
}
export async function apiPost(path, body){
  const res = await fetch(API_BASE+path,{ method:'POST', headers: headers(), body: JSON.stringify(body)});
  if(!res.ok) throw new Error(await res.text());
  return res.json();
}
