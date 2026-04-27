import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// #region agent log
fetch('http://127.0.0.1:7753/ingest/b67305a2-8703-4d0c-9907-e6f5fc96d49c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'8d4cf9'},body:JSON.stringify({sessionId:'8d4cf9',runId:'pre-fix',hypothesisId:'C0',location:'main.jsx:boot',message:'boot',data:{userAgent:navigator.userAgent,href:window.location.href},timestamp:Date.now()})}).catch(()=>{});
// #endregion

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
