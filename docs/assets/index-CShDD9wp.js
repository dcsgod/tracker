(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const c of i.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&n(c)}).observe(document,{childList:!0,subtree:!0});function a(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(s){if(s.ep)return;s.ep=!0;const i=a(s);fetch(s.href,i)}})();const gt="cpml-tracker:v1",D={schemaVersion:1,roadmaps:{},cp:{topics:{},starredProblems:{}},daily:{},papers:{},gist:{connected:!1,gistId:null,lastSyncedAt:null},updatedAt:null};function Tt(){try{const t=localStorage.getItem(gt);if(!t)return structuredClone(D);const e=JSON.parse(t);return e.schemaVersion===1?{...structuredClone(D),...e}:structuredClone(D)}catch{return structuredClone(D)}}function T(t){const e={...t,updatedAt:new Date().toISOString()};return localStorage.setItem(gt,JSON.stringify(e)),e}function It(t,e,a,n){const s=structuredClone(t);return s.roadmaps[e]||(s.roadmaps[e]={}),s.roadmaps[e][a]=n,T(s)}function Pt(t,e,a){var n;return!!((n=t.roadmaps[e])!=null&&n[a])}function Ct(t,e,a,n){const s=structuredClone(t);return s.daily[e]||(s.daily[e]={}),s.daily[e][a]=n,T(s)}function Dt(t,e,a){const n=structuredClone(t);return n.cp.topics[e]||(n.cp.topics[e]={problems:[]}),n.cp.topics[e].problems.find(i=>i.cfId===a.cfId)||n.cp.topics[e].problems.push({...a,done:!1,addedAt:new Date().toISOString()}),T(n)}function Et(t,e,a){var i,c;const n=structuredClone(t),s=(c=(i=n.cp.topics[e])==null?void 0:i.problems)==null?void 0:c.find(r=>r.cfId===a);return s&&(s.done=!s.done),T(n)}function Mt(t,e,a){var s;const n=structuredClone(t);return(s=n.cp.topics[e])!=null&&s.problems&&(n.cp.topics[e].problems=n.cp.topics[e].problems.filter(i=>i.cfId!==a)),T(n)}function et(t,e){var i;const a=new Date;let n=0,s=new Date(a);for(;;){const c=bt(s);if((i=t.daily[c])!=null&&i[e])n++,s.setDate(s.getDate()-1);else break}return n}function yt(t,e){var s;let a=0,n=0;for(const i of e.phases)for(const c of i.topics)a++,(s=t.roadmaps[e.id])!=null&&s[c.id]&&n++;return{checked:n,total:a,percent:a>0?Math.round(n/a*100):0}}function Ot(t,e){var i;const a=((i=t.cp.topics[e])==null?void 0:i.problems)??[],n=a.length,s=a.filter(c=>c.done).length;return{solved:s,total:n,percent:n>0?Math.round(s/n*100):0}}function jt(t){return JSON.stringify(t,null,2)}function Rt(t){const e=JSON.parse(t);if(!e.schemaVersion)throw new Error("Invalid progress file: missing schemaVersion");const a={...structuredClone(D),...e};return T(a)}function bt(t){return t.toISOString().slice(0,10)}function W(){return Math.max(0,Math.floor((new Date-new Date("2026-08-11"))/(7*24*60*60*1e3)))}const st="cpml-tracker:gist-pat",nt="cpml-tracker:gist-id",at="cpml-tracker:last-sync",it="https://api.github.com";let Y=null;function qt(t){localStorage.setItem(st,t)}function N(){return localStorage.getItem(st)}function zt(t){localStorage.setItem(nt,t)}function B(){return localStorage.getItem(nt)}function Gt(){localStorage.removeItem(st),localStorage.removeItem(nt),localStorage.removeItem(at)}function _(){return!!(N()&&B())}function Ht(){return localStorage.getItem(at)}async function Nt(){var a;const t=N(),e=B();if(!t||!e)return null;try{const n=await fetch(`${it}/gists/${e}`,{headers:{Authorization:`Bearer ${t}`,Accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28"}});if(!n.ok)throw new Error(`GitHub API error: ${n.status} ${n.statusText}`);const i=(a=(await n.json()).files)==null?void 0:a["progress.json"];return i!=null&&i.content?JSON.parse(i.content):null}catch(n){return console.error("[GistSync] Pull failed:",n),null}}async function ht(t){const e=N(),a=B();if(!e||!a)return!1;try{const n=await fetch(`${it}/gists/${a}`,{method:"PATCH",headers:{Authorization:`Bearer ${e}`,Accept:"application/vnd.github+json","Content-Type":"application/json","X-GitHub-Api-Version":"2022-11-28"},body:JSON.stringify({files:{"progress.json":{content:JSON.stringify(t,null,2)}}})});if(!n.ok)throw new Error(`GitHub API error: ${n.status} ${n.statusText}`);const s=new Date().toISOString();return localStorage.setItem(at,s),!0}catch(n){return console.error("[GistSync] Push failed:",n),!1}}function Bt(t,e,a){Y&&clearTimeout(Y),Y=setTimeout(async()=>{await ht(t)?e==null||e():a==null||a()},3e3)}function _t(t,e){if(!e)return t;const a=t.updatedAt?new Date(t.updatedAt):new Date(0);return(e.updatedAt?new Date(e.updatedAt):new Date(0))>a?(console.log("[GistSync] Remote is newer, using remote state"),e):(console.log("[GistSync] Local is newer or equal, keeping local state"),t)}async function Ft(t){const e=await Nt();return e?_t(t,e):null}async function Yt(t,e){try{const a=await fetch(`${it}/gists/${e}`,{headers:{Authorization:`Bearer ${t}`,Accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28"}});return a.status===404?{valid:!1,error:"Gist not found. Check the Gist ID."}:a.status===401?{valid:!1,error:"Invalid PAT. Check your token."}:a.ok?{valid:!0}:{valid:!1,error:`GitHub API error: ${a.status}`}}catch(a){return{valid:!1,error:a.message}}}const U=["mlpath","nlppath","llmreasoning","timeseriespath","quantpath","gnnpath","rlpath","diffusionmodelspath"],Jt={mlpath:"ML/DL Mastery",nlppath:"NLP → Reasoning",llmreasoning:"LLM Building & Reasoning",timeseriespath:"Time Series & Causal",quantpath:"Quant Researcher",gnnpath:"GNN Path",rlpath:"RL Path",diffusionmodelspath:"Diffusion Models"},Vt={mlpath:"🧠",nlppath:"💬",llmreasoning:"🤖",timeseriespath:"📈",quantpath:"📊",gnnpath:"🕸️",rlpath:"🎮",diffusionmodelspath:"🎨"},dt=["gym","running","diet","water","dsa","ml"],Wt={gym:"Gym",running:"Running",diet:"Diet",water:"Water 💧",dsa:"DSA",ml:"ML"},Ut={gym:"🏋️",running:"🏃",diet:"🥗",water:"💧",dsa:"⚡",ml:"🧠"};let C={};async function Kt(){const t={};return await Promise.all(U.map(async e=>{try{const a=await fetch(`/tracker/data/roadmaps/${e}.json`);t[e]=await a.json()}catch{t[e]=null}})),t}async function xt(t,e,a,n){var S,g;t.innerHTML='<div class="spinner"></div><div class="loading-text">Loading overview…</div>',Object.keys(C).length||(C=await Kt());let s=0,i=0;const c={};for(const u of U){const f=C[u];if(!f)continue;const v=yt(e,f);c[u]=v,s+=v.total,i+=v.checked}const r=s>0?Math.round(i/s*100):0,o=Object.keys(((S=e.cp)==null?void 0:S.topics)??{}),l=o.reduce((u,f)=>{var v,h,L;return u+(((L=(h=(v=e.cp.topics[f])==null?void 0:v.problems)==null?void 0:h.filter(j=>j.done))==null?void 0:L.length)??0)},0),d=o.reduce((u,f)=>{var v,h;return u+(((h=(v=e.cp.topics[f])==null?void 0:v.problems)==null?void 0:h.length)??0)},0),m={};for(const u of dt)m[u]=et(e,u);const b=Object.keys(e.daily??{}).filter(u=>Object.values(e.daily[u]).some(f=>f)).length,y=Xt(e,C);t.innerHTML=`
    <!-- Hero Overview Ring -->
    <div class="overview-hero">
      <div class="overview-ring" style="--pct: ${r}" id="overview-ring">
        <div class="overview-ring-value">${r}%</div>
      </div>
      <div class="overview-title">Overall Mastery</div>
      <div class="overview-subtitle">
        ${i} / ${s} topics completed across all tracks
      </div>
    </div>

    <!-- Stat Cards -->
    <div class="grid-4" style="margin-bottom: 24px">
      <div class="stat-card">
        <div class="stat-value">${r}%</div>
        <div class="stat-label">Roadmap Progress</div>
        <div class="stat-sub">${i}/${s} topics</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${l}</div>
        <div class="stat-label">CF Problems Solved</div>
        <div class="stat-sub">${d} added to tracker</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${b}</div>
        <div class="stat-label">Active Days</div>
        <div class="stat-sub">Since Aug 11, 2026</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${Math.max(...Object.values(m),0)}</div>
        <div class="stat-label">Best Streak</div>
        <div class="stat-sub">${((g=Object.entries(m).find(([,u])=>u===Math.max(...Object.values(m))))==null?void 0:g[0])??"—"} habit</div>
      </div>
    </div>

    <!-- Roadmap Progress -->
    <div class="grid-2" style="margin-bottom: 24px">
      <div class="card">
        <div class="card-header">
          <div class="card-title">🗺️ Roadmap Tracks</div>
          <button class="btn btn-secondary btn-sm" onclick="window.switchToTab('roadmaps')">View All →</button>
        </div>
        <div class="card-body" style="display:flex; flex-direction:column; gap:14px">
          ${U.map(u=>{const f=C[u];if(!f)return"";const v=c[u];return`
              <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px">
                  <span style="font-size:0.85rem; font-weight:500; display:flex; align-items:center; gap:6px">
                    ${Vt[u]} ${Jt[u]}
                    <span class="badge ${f.coverage==="full"?"badge-full":"badge-partial"}">${f.coverage}</span>
                    ${f.stub?'<span class="badge badge-stub">stub</span>':""}
                  </span>
                  <span style="font-size:0.78rem; font-family:var(--font-mono); color:var(--text-muted)">${v.checked}/${v.total}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width:${v.percent}%"></div>
                </div>
              </div>
            `}).join("")}
        </div>
      </div>

      <!-- Habit Streaks -->
      <div>
        <div class="card" style="margin-bottom: 16px">
          <div class="card-header">
            <div class="card-title">🔥 Habit Streaks</div>
            <button class="btn btn-secondary btn-sm" onclick="window.switchToTab('daily')">Open Tracker →</button>
          </div>
          <div class="card-body">
            <div class="streak-row">
              ${dt.map(u=>`
                <div class="streak-pill">
                  <span>${Ut[u]}</span>
                  <span>${Wt[u]}</span>
                  <span class="streak-count">${m[u]}d</span>
                </div>
              `).join("")}
            </div>
          </div>
        </div>

        <!-- CP Progress -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">⚡ CP / DSA Progress</div>
            <button class="btn btn-secondary btn-sm" onclick="window.switchToTab('cp')">View Problems →</button>
          </div>
          <div class="card-body">
            <div style="display:flex; align-items:center; gap:16px; margin-bottom:12px">
              <div>
                <div style="font-size:1.8rem; font-weight:800; background:var(--gradient-primary); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text">${l}</div>
                <div style="font-size:0.78rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:.05em">Solved</div>
              </div>
              <div class="progress-bar" style="flex:1; height:8px">
                <div class="progress-fill" style="width:${d>0?Math.round(l/d*100):0}%"></div>
              </div>
              <div style="font-size:0.85rem; font-family:var(--font-mono); color:var(--text-secondary)">${d}</div>
            </div>
            <div style="font-size:0.8rem; color:var(--text-muted)">
              Problems tracked across ${o.length} topics.
              Add problems in the CP/DSA tab.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Weekly Papers -->
    ${y.length>0?`
    <div class="card">
      <div class="card-header">
        <div class="card-title">📄 Papers to Reproduce This Week</div>
        <span class="badge badge-number">Week ${W()+1}</span>
      </div>
      <div class="card-body">
        <div class="papers-grid">
          ${y.map(u=>{var h,L;const f=btoa(u.title).slice(0,16),v=!!((L=(h=e.papers)==null?void 0:h[f])!=null&&L.reproduced);return`
              <div class="paper-card ${v?"reproduced":""}">
                <div class="paper-title">${u.title}</div>
                <div class="paper-source">${u.source}</div>
                <div class="paper-actions">
                  <button class="btn btn-xs ${v?"btn-secondary":"btn-primary"}" 
                    data-paper-id="${f}" 
                    data-paper-reproduced="${v}"
                    onclick="window.togglePaper('${f}', ${!v})">
                    ${v?"✅ Reproduced":"▶ Mark Reproduced"}
                  </button>
                </div>
              </div>
            `}).join("")}
        </div>
      </div>
    </div>
    `:""}
  `,window.switchToTab=n,window.togglePaper=(u,f)=>{const v={...e};v.papers||(v.papers={}),v.papers[u]={reproduced:f,weekReproduced:W()},a(v),xt(t,v,a,n)}}function Xt(t,e){const a=[],n=W();for(const s of["mlpath","nlppath","timeseriespath","llmreasoning"]){const i=e[s];if(i){for(const c of i.phases){const r=c.topics.filter(l=>{var d,m;return(m=(d=t.roadmaps)==null?void 0:d[s])==null?void 0:m[l.id]}).length,o=c.topics.length;if(r>0&&r<o){const l=c.topics.flatMap(d=>(d.papers??[]).map(m=>({title:m,source:`${i.title} — ${c.title}`})));if(l.length>0){const d=n*2%l.length;for(let m=0;m<3&&a.length<3;m++)a.push(l[(d+m)%l.length]);if(a.length>=3)break}}}if(a.length>=3)break}}if(a.length===0&&e.mlpath){const s=e.mlpath.phases[0],i=(s==null?void 0:s.topics.flatMap(r=>(r.papers??[]).map(o=>({title:o,source:`ML/DL Mastery — ${s.title}`}))))??[],c=n%Math.max(1,i.length);a.push(...i.slice(c,c+3))}return a.slice(0,3)}const K=["mlpath","nlppath","llmreasoning","timeseriespath","quantpath","gnnpath","rlpath","diffusionmodelspath"],wt={mlpath:"🧠",nlppath:"💬",llmreasoning:"🤖",timeseriespath:"📈",quantpath:"📊",gnnpath:"🕸️",rlpath:"🎮",diffusionmodelspath:"🎨"};let $={},R="mlpath",X="",H=new Set;async function Zt(){Object.keys($).length||await Promise.all(K.map(async t=>{try{const e=await fetch(`/tracker/data/roadmaps/${t}.json`);$[t]=await e.json()}catch{$[t]=null}}))}async function $t(t,e,a){Object.keys($).length||(t.innerHTML='<div class="spinner"></div>',await Zt());const n=$[R],s={};for(const r of K)$[r]&&(s[r]=yt(e,$[r]));const i=s[R]??{checked:0,total:0,percent:0};t.innerHTML=`
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; gap:16px; flex-wrap:wrap">
      <div>
        <h1 style="font-size:1.5rem; font-weight:700; background:var(--gradient-primary); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text">
          Learning Roadmaps
        </h1>
        <div style="color:var(--text-secondary); font-size:0.875rem; margin-top:4px">
          Track progress across 8 mastery paths
        </div>
      </div>
      <div class="search-box" style="max-width:260px">
        <span class="search-icon">🔍</span>
        <input type="text" class="input" id="roadmap-search" placeholder="Search topics…" value="${X}" />
      </div>
    </div>

    <div class="roadmap-layout">
      <!-- Sidebar -->
      <div class="roadmap-sidebar">
        ${K.map(r=>{const o=$[r];if(!o)return"";const l=s[r]??{checked:0,total:0,percent:0};return`
            <div class="roadmap-sidebar-item ${r===R?"active":""}" 
                 data-roadmap="${r}" id="sidebar-${r}">
              <div style="display:flex; align-items:center; gap:8px; flex:1; min-width:0">
                <span style="font-size:1.1rem">${wt[r]}</span>
                <div style="min-width:0">
                  <div class="roadmap-sidebar-name">${o.title}</div>
                  <div style="margin-top:4px">
                    <div class="progress-bar" style="height:3px">
                      <div class="progress-fill" style="width:${l.percent}%"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div style="text-align:right; flex-shrink:0">
                <div class="roadmap-sidebar-progress">${l.percent}%</div>
                <div style="font-size:0.65rem; color:var(--text-muted)">${l.checked}/${l.total}</div>
              </div>
            </div>
          `}).join("")}
      </div>

      <!-- Roadmap Detail -->
      <div id="roadmap-detail">
        ${pt(n,e,i)}
      </div>
    </div>
  `,t.querySelectorAll(".roadmap-sidebar-item").forEach(r=>{r.addEventListener("click",()=>{R=r.dataset.roadmap,H.clear(),$t(t,e,a)})});const c=t.querySelector("#roadmap-search");c==null||c.addEventListener("input",r=>{X=r.target.value,document.getElementById("roadmap-detail").innerHTML=pt(n,e,i),ut(t),mt(t,e,a)}),ut(t),mt(t,e,a)}function pt(t,e,a){if(!t)return'<div class="empty-state"><div class="empty-state-icon">❌</div><div class="empty-state-title">Could not load roadmap data</div></div>';const n=X.toLowerCase().trim();return`
    <!-- Roadmap Header -->
    <div class="card" style="margin-bottom:16px">
      <div class="card-body" style="display:flex; align-items:center; gap:20px; flex-wrap:wrap">
        <div style="font-size:2.5rem">${wt[t.id]}</div>
        <div style="flex:1; min-width:180px">
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:6px">
            <h2 style="font-size:1.2rem; font-weight:700">${t.title}</h2>
            <span class="badge ${t.coverage==="full"?"badge-full":"badge-partial"}">${t.coverage}</span>
            ${t.stub?'<span class="badge badge-stub">⚠ stub — needs refresh</span>':""}
          </div>
          <a href="${t.sourceUrl}" target="_blank" rel="noopener" 
             style="font-size:0.78rem; color:var(--primary); display:flex; align-items:center; gap:4px">
            ${t.sourceUrl} ↗
          </a>
        </div>
        <div style="text-align:center">
          <div style="font-size:2rem; font-weight:800; background:var(--gradient-primary); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text">${a.percent}%</div>
          <div style="font-size:0.78rem; color:var(--text-muted)">${a.checked} / ${a.total} topics</div>
          <div class="progress-bar thick" style="margin-top:6px; width:120px">
            <div class="progress-fill" style="width:${a.percent}%"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Phases -->
    ${t.phases.map((s,i)=>{const c=s.topics.filter(p=>{var b,y;return(y=(b=e.roadmaps)==null?void 0:b[t.id])==null?void 0:y[p.id]}).length,r=s.topics.length,o=r>0?Math.round(c/r*100):0,l=`${t.id}-${s.id}`,d=H.has(l)||n.length>0,m=n?s.topics.filter(p=>p.title.toLowerCase().includes(n)):s.topics;return n&&m.length===0?"":`
        <div class="phase-card" id="phase-card-${l}">
          <div class="phase-header collapsible-header ${d?"open":""}" data-phase="${l}">
            <div class="phase-number">${i+1}</div>
            <div class="phase-title-wrap">
              <div class="phase-title">${s.title}</div>
              <div class="phase-stats">${c}/${r} completed</div>
            </div>
            ${s.priority?`<span class="badge ${s.stretch?"badge-stretch":"badge-must"}">${s.stretch?"stretch":"priority"}</span>`:""}
            <div style="display:flex; align-items:center; gap:8px">
              <span class="phase-pct">${o}%</span>
              <span class="collapsible-chevron">▶</span>
            </div>
          </div>
          <div class="phase-progress-row">
            <div class="progress-bar phase-progress-bar">
              <div class="progress-fill" style="width:${o}%"></div>
            </div>
          </div>
          <div class="collapsible-body ${d?"open":""}" id="phase-body-${l}">
            <div class="topic-list">
              ${m.map(p=>{const b=Pt(e,t.id,p.id),y=p.papers&&p.papers.length>0;return`
                  <div class="topic-item" data-roadmap="${t.id}" data-topic="${p.id}">
                    <input type="checkbox" id="topic-${t.id}-${p.id}" 
                           ${b?"checked":""} />
                    <label for="topic-${t.id}-${p.id}" class="topic-text">
                      ${p.title}
                      ${y?`<span style="color:var(--accent); font-size:0.75rem; margin-left:4px" title="${p.papers.join(", ")}">📄 ${p.papers.length}</span>`:""}
                    </label>
                    <a href="${t.sourceUrl}" target="_blank" rel="noopener" 
                       class="topic-link" title="Open source">↗</a>
                  </div>
                `}).join("")}
            </div>
          </div>
        </div>
      `}).join("")}
  `}function ut(t,e,a){t.querySelectorAll(".collapsible-header[data-phase]").forEach(n=>{n.addEventListener("click",()=>{const s=n.dataset.phase,i=document.getElementById(`phase-body-${s}`);if(!i)return;i.classList.contains("open")?(i.classList.remove("open"),n.classList.remove("open"),H.delete(s)):(i.classList.add("open"),n.classList.add("open"),H.add(s))})})}function mt(t,e,a){t.querySelectorAll('.topic-item input[type="checkbox"]').forEach(n=>{n.addEventListener("change",s=>{const i=s.target.closest(".topic-item"),c=i.dataset.roadmap,r=i.dataset.topic,o=It(e,c,r,s.target.checked);e=o,a(o),Qt(t,c,r,o)})})}function Qt(t,e,a,n){const s=$[e];if(s){for(const i of s.phases)if(i.topics.find(c=>c.id===a)){const c=i.topics.filter(d=>{var m,p;return(p=(m=n.roadmaps)==null?void 0:m[e])==null?void 0:p[d.id]}).length,r=Math.round(c/i.topics.length*100),o=`${e}-${i.id}`,l=document.getElementById(`phase-card-${o}`);l&&(l.querySelector(".progress-fill").style.width=`${r}%`,l.querySelector(".phase-pct").textContent=`${r}%`,l.querySelector(".phase-stats").textContent=`${c}/${i.topics.length} completed`);break}}}const F="cpml-tracker:cf-cache",te=7*24*60*60*1e3,ee="https://codeforces.com/api/problemset.problems";async function se(){const t=vt();if(t)return t;try{const e=await fetch(ee);if(!e.ok)throw new Error(`CF API error: ${e.status}`);const a=await e.json();if(a.status!=="OK")throw new Error(`CF API status: ${a.status}`);const n=a.result.problems.map(s=>({cfId:`${s.contestId}${s.index}`,contestId:s.contestId,index:s.index,title:s.name,rating:s.rating??null,tags:s.tags??[],url:`https://codeforces.com/problemset/problem/${s.contestId}/${s.index}`}));return re(n),n}catch(e){return console.error("[CF] Fetch failed:",e),vt(!0)??[]}}function ne(t,e,a,n,s=50){return t.filter(i=>!(i.rating===null||a!==null&&i.rating<a||n!==null&&i.rating>n||e&&e.length>0&&!e.some(r=>i.tags.some(o=>o.toLowerCase().includes(r.toLowerCase()))))).sort(()=>Math.random()-.5).slice(0,s)}const kt=[{label:"800–1000 (Beginner)",min:800,max:1e3},{label:"1100–1300 (Easy)",min:1100,max:1300},{label:"1400–1600 (Medium)",min:1400,max:1600},{label:"1700–1900 (Hard)",min:1700,max:1900},{label:"2000–2100 (Expert)",min:2e3,max:2100}];function ae(){localStorage.removeItem(F)}function ie(){const t=localStorage.getItem(F);if(!t)return null;try{const{fetchedAt:e,count:a}=JSON.parse(t),s=((Date.now()-e)/(24*60*60*1e3)).toFixed(1);return{fetchedAt:new Date(e).toLocaleString(),daysOld:s,count:a}}catch{return null}}function vt(t=!1){try{const e=localStorage.getItem(F);if(!e)return null;const{fetchedAt:a,problems:n}=JSON.parse(e);return!t&&Date.now()-a>te?null:n}catch{return null}}function re(t){localStorage.setItem(F,JSON.stringify({fetchedAt:Date.now(),count:t.length,problems:t}))}let k=[],w=null,M=[],z=!1,Z=0,I="browse";async function oe(){if(k.length)return;k=await(await fetch("/tracker/data/cp-topics.json")).json(),!w&&k.length&&(w=k[0].id)}async function ce(){M.length||z||(z=!0,M=await se(),z=!1)}async function G(t,e,a){var i,c,r,o,l;k.length||(t.innerHTML='<div class="spinner"></div>',await oe());const n=k.find(d=>d.id===w)??k[0];e.cp;const s=ie();t.innerHTML=`
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:12px">
      <div>
        <h1 style="font-size:1.5rem; font-weight:700; background:var(--gradient-primary); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text">
          CP / DSA Tracker
        </h1>
        <div style="color:var(--text-secondary); font-size:0.875rem; margin-top:4px">
          Codeforces problems from 800 → 2100
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap">
        ${s?`
          <span style="font-size:0.75rem; color:var(--text-muted)">
            CF cache: ${s.count.toLocaleString()} problems, ${s.daysOld}d old
          </span>
          <button class="btn btn-secondary btn-sm" id="clear-cache-btn">🔄 Refresh</button>
        `:""}
        <a href="https://dcsgod.github.io/Cppath/" target="_blank" class="btn btn-secondary btn-sm">
          📘 CP Roadmap ↗
        </a>
      </div>
    </div>

    <div class="cp-layout">
      <!-- Topic Sidebar -->
      <div>
        <div style="font-size:0.75rem; font-weight:600; text-transform:uppercase; letter-spacing:.06em; color:var(--text-muted); padding:0 4px; margin-bottom:8px">
          DSA Topics
        </div>
        <div class="cp-topic-list" id="cp-topic-list">
          ${k.map(d=>{const m=Ot(e,d.id);return`
              <div class="cp-topic-item ${d.id===w?"active":""}" data-topic="${d.id}">
                <div style="flex:1; min-width:0">
                  <div class="cp-topic-name">${d.title}</div>
                  <div style="margin-top:4px">
                    <div class="progress-bar" style="height:2px">
                      <div class="progress-fill" style="width:${m.percent}%"></div>
                    </div>
                  </div>
                </div>
                <div class="cp-topic-meta">${m.solved}/${m.total}</div>
              </div>
            `}).join("")}
        </div>
      </div>

      <!-- Right Panel -->
      <div>
        <!-- Rating band selector & view toggle -->
        <div class="card" style="margin-bottom:16px">
          <div class="card-body" style="display:flex; align-items:center; gap:12px; flex-wrap:wrap">
            <div style="flex:1; min-width:200px">
              <div class="input-label" style="margin-bottom:6px">Rating Band</div>
              <select class="input" id="rating-band-select">
                ${kt.map((d,m)=>`
                  <option value="${m}" ${m===Z?"selected":""}>${d.label}</option>
                `).join("")}
              </select>
            </div>
            <div style="display:flex; gap:8px; align-items:flex-end; padding-bottom:1px">
              <button class="btn ${I==="browse"?"btn-primary":"btn-secondary"} btn-sm" id="view-browse">🔍 Browse</button>
              <button class="btn ${I==="mylist"?"btn-primary":"btn-secondary"} btn-sm" id="view-mylist">⭐ My List</button>
            </div>
            <button class="btn btn-primary btn-sm" id="fetch-btn">
              ${z?"⏳ Loading…":"⚡ Load Problems"}
            </button>
          </div>
        </div>

        <!-- Active Topic Info -->
        ${n?`
          <div style="margin-bottom:12px; display:flex; align-items:center; gap:12px">
            <h2 style="font-size:1.1rem; font-weight:600; flex:1">${n.title}</h2>
            <div style="display:flex; gap:6px">
              ${n.tags.map(d=>`<span class="badge badge-number">${d}</span>`).join("")}
            </div>
          </div>
        `:""}

        <!-- Problem Panel -->
        <div id="problem-panel">
          <div class="empty-state">
            <div class="empty-state-icon">⚡</div>
            <div class="empty-state-title">Click "Load Problems" to fetch from Codeforces</div>
            <div class="empty-state-desc">Problems are cached locally for 7 days</div>
          </div>
        </div>
      </div>
    </div>
  `,t.querySelectorAll(".cp-topic-item").forEach(d=>{d.addEventListener("click",()=>{w=d.dataset.topic,G(t,e,a)})}),(i=t.querySelector("#rating-band-select"))==null||i.addEventListener("change",d=>{Z=parseInt(d.target.value)}),(c=t.querySelector("#view-browse"))==null||c.addEventListener("click",()=>{I="browse",G(t,e,a)}),(r=t.querySelector("#view-mylist"))==null||r.addEventListener("click",()=>{I="mylist",J(t,e,a)}),(o=t.querySelector("#fetch-btn"))==null||o.addEventListener("click",async()=>{const d=t.querySelector("#fetch-btn");d.textContent="⏳ Loading…",d.disabled=!0,await ce(),J(t,e,a),d.textContent="⚡ Reload",d.disabled=!1}),(l=t.querySelector("#clear-cache-btn"))==null||l.addEventListener("click",()=>{ae(),M=[],G(t,e,a)}),I==="mylist"&&J(t,e,a)}function J(t,e,a){var l,d,m;const n=t.querySelector("#problem-panel");if(!n)return;if(I==="mylist"){Q(n,e,a);return}if(!M.length)return;const s=k.find(p=>p.id===w);if(!s)return;const i=kt[Z],c=ne(M,s.tags,i.min,i.max,50),r=((m=(d=(l=e.cp)==null?void 0:l.topics)==null?void 0:d[w])==null?void 0:m.problems)??[],o=new Set(r.map(p=>p.cfId));if(c.length===0){n.innerHTML=`
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <div class="empty-state-title">No problems found</div>
        <div class="empty-state-desc">No Codeforces problems matched this topic + rating band. Try a different band.</div>
      </div>
    `;return}n.innerHTML=`
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px">
      <div style="font-size:0.85rem; color:var(--text-muted)">${c.length} problems found</div>
      <div style="font-size:0.78rem; color:var(--text-muted)">Shuffled for variety · click to add to your list</div>
    </div>
    <div style="display:flex; flex-direction:column; gap:8px">
      ${c.map(p=>{const b=p.rating?`rating-${Math.floor(p.rating/100)*100}`:"",y=o.has(p.cfId);return`
          <div class="cp-problem-card" data-cf-id="${p.cfId}">
            <div style="flex:1; min-width:0">
              <div class="cp-problem-title">${p.title}</div>
              <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px; font-family:var(--font-mono)">${p.cfId}</div>
            </div>
            <div style="display:flex; align-items:center; gap:8px; flex-shrink:0">
              ${p.rating?`<span class="rating-badge ${b}">${p.rating}</span>`:""}
              <a href="${p.url}" target="_blank" rel="noopener" class="btn btn-secondary btn-xs">↗</a>
              <button class="btn ${y?"btn-secondary":"btn-primary"} btn-xs add-problem-btn" 
                      data-cf-id="${p.cfId}" data-title="${le(p.title)}" data-rating="${p.rating}"
                      ${y?"disabled":""}>
                ${y?"✓ Added":"+ Add"}
              </button>
            </div>
          </div>
        `}).join("")}
    </div>
  `,n.querySelectorAll(".add-problem-btn:not([disabled])").forEach(p=>{p.addEventListener("click",()=>{const b={cfId:p.dataset.cfId,title:p.dataset.title,rating:parseInt(p.dataset.rating)||null},y=Dt(e,w,b);e=y,a(y),p.textContent="✓ Added",p.disabled=!0,p.className="btn btn-secondary btn-xs add-problem-btn"})})}function Q(t,e,a){var i,c,r;const n=((r=(c=(i=e.cp)==null?void 0:i.topics)==null?void 0:c[w])==null?void 0:r.problems)??[];if(n.length===0){t.innerHTML=`
      <div class="empty-state">
        <div class="empty-state-icon">⭐</div>
        <div class="empty-state-title">Your list is empty</div>
        <div class="empty-state-desc">Switch to Browse mode, load problems from CF, and add them here.</div>
      </div>
    `;return}const s=n.filter(o=>o.done).length;t.innerHTML=`
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px">
      <div style="font-size:0.85rem; color:var(--text-muted)">${s}/${n.length} solved</div>
      <div class="progress-bar" style="flex:1; margin:0 16px">
        <div class="progress-fill" style="width:${n.length>0?Math.round(s/n.length*100):0}%"></div>
      </div>
      <span style="font-size:0.78rem; font-family:var(--font-mono); color:var(--primary)">
        ${n.length>0?Math.round(s/n.length*100):0}%
      </span>
    </div>
    <div style="display:flex; flex-direction:column; gap:8px">
      ${n.map(o=>{const l=o.rating?`rating-${Math.floor(o.rating/100)*100}`:"";return`
          <div class="cp-problem-card ${o.done?"done":""}">
            <input type="checkbox" class="habit-checkbox" ${o.done?"checked":""} 
                   data-cf-id="${o.cfId}" style="flex-shrink:0; margin:0" />
            <div style="flex:1; min-width:0">
              <div class="cp-problem-title">${o.title}</div>
              <div style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono)">${o.cfId}</div>
            </div>
            <div style="display:flex; align-items:center; gap:8px; flex-shrink:0">
              ${o.rating?`<span class="rating-badge ${l}">${o.rating}</span>`:""}
              <a href="https://codeforces.com/problemset/problem/${o.cfId.replace(/([A-Z]+)$/,"/$1")}" 
                 target="_blank" rel="noopener" class="btn btn-secondary btn-xs">↗</a>
              <button class="btn btn-danger btn-xs remove-btn" data-cf-id="${o.cfId}">✕</button>
            </div>
          </div>
        `}).join("")}
    </div>
  `,t.querySelectorAll(".habit-checkbox[data-cf-id]").forEach(o=>{o.addEventListener("change",()=>{const l=Et(e,w,o.dataset.cfId);e=l,a(l),Q(t,l,a)})}),t.querySelectorAll(".remove-btn").forEach(o=>{o.addEventListener("click",()=>{const l=Mt(e,w,o.dataset.cfId);e=l,a(l),Q(t,l,a)})})}function le(t){return t.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}const de=new Date("2026-08-11"),pe=new Date("2026-12-31"),E=["gym","running","diet","water","dsa","ml"],V={gym:"Gym 🏋️",running:"Running 🏃",diet:"Diet 🥗",water:"Water 💧",dsa:"DSA ⚡",ml:"ML 🧠",mtech:"MTech 🎓"},ue={gym:"#22c55e",running:"#14b8a6",diet:"#84cc16",water:"#38bdf8",dsa:"#a855f7",ml:"#6366f1",mtech:"#f97316"},me=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],ft=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];function ve(){const t=[],e=new Date(de);let a=1;for(;e<=pe;)t.push({date:new Date(e),dayN:a++}),e.setDate(e.getDate()+1);return t}function fe(t){return t.getDay()===0||t.getDay()===6}function ge(t){const e=new Date;return t.getDate()===e.getDate()&&t.getMonth()===e.getMonth()&&t.getFullYear()===e.getFullYear()}function ye(t){const e=new Date;return e.setHours(0,0,0,0),t>e}function be(t,e,a){var c;const n=ve(),s={};for(const r of[...E,"mtech"])s[r]=et(e,r);const i={};n.forEach(({date:r,dayN:o})=>{const l=`${r.getFullYear()}-${r.getMonth()}`;i[l]||(i[l]={name:ft[r.getMonth()],year:r.getFullYear(),dates:[]}),i[l].dates.push({date:r,dayN:o})}),t.innerHTML=`
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:12px">
      <div>
        <h1 style="font-size:1.5rem; font-weight:700; background:var(--gradient-primary); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text">
          Daily Habit Tracker
        </h1>
        <div style="color:var(--text-secondary); font-size:0.875rem; margin-top:4px">
          Aug 11 → Dec 31, 2026 · ${n.length} days
        </div>
      </div>
      <div style="display:flex; gap:8px">
        <button class="btn btn-secondary btn-sm" id="scroll-today-btn">📍 Jump to Today</button>
        <button class="btn btn-secondary btn-sm" onclick="window.print()">🖨 Print Week</button>
      </div>
    </div>

    <!-- Streak Summary -->
    <div class="card" style="margin-bottom:20px">
      <div class="card-body">
        <div style="font-size:0.8rem; font-weight:600; color:var(--text-secondary); margin-bottom:10px; text-transform:uppercase; letter-spacing:.05em">
          Current Streaks
        </div>
        <div class="streak-row" style="padding:0">
          ${[...E,"mtech"].map(r=>`
            <div class="streak-pill">
              <span style="color:${ue[r]}">●</span>
              <span style="font-size:0.78rem">${V[r].replace(/ .*/,"")}</span>
              <span class="streak-count">${s[r]}d</span>
            </div>
          `).join("")}
        </div>
      </div>
    </div>

    <!-- Tracker Table -->
    ${Object.values(i).map(r=>`
      <div style="margin-bottom:20px">
        <div style="font-size:1rem; font-weight:700; color:var(--text-primary); margin-bottom:10px; display:flex; align-items:center; gap:8px">
          <span>${r.name} ${r.year}</span>
          <span style="font-size:0.75rem; color:var(--text-muted)">(${r.dates.length} days)</span>
        </div>
        <div class="daily-table-wrapper">
          <table class="daily-table">
            <thead>
              <tr>
                <th style="width:90px">Date</th>
                <th style="width:40px">Day</th>
                <th style="width:50px">Day#</th>
                ${E.map(o=>`<th style="width:52px">${V[o].replace(/ .*/,"")}</th>`).join("")}
                <th style="width:60px; color:var(--accent)">MTech</th>
              </tr>
            </thead>
            <tbody>
              ${r.dates.map(({date:o,dayN:l})=>{var S;const d=bt(o),m=((S=e.daily)==null?void 0:S[d])??{},p=fe(o),b=ge(o),y=ye(o);return`
                  <tr class="${b?"today":""} ${p?"weekend":""}" 
                      id="${b?"today-row":""}">
                    <td class="day-date">${o.getDate()} ${ft[o.getMonth()]}</td>
                    <td class="day-of-week">${me[o.getDay()]}</td>
                    <td class="day-n">D${l}</td>
                    ${E.map(g=>`
                      <td>
                        <input type="checkbox" 
                               class="habit-checkbox" 
                               data-habit="${g}" 
                               data-date="${d}"
                               ${m[g]?"checked":""}
                               ${y?'style="opacity:0.35"':""}
                               title="${V[g]} · ${d}" />
                      </td>
                    `).join("")}
                    <td>
                      ${p?`
                        <input type="checkbox" 
                               class="habit-checkbox" 
                               data-habit="mtech" 
                               data-date="${d}"
                               ${m.mtech?"checked":""}
                               ${y?'style="opacity:0.35"':""}
                               title="MTech Classes · ${d}" />
                      `:'<span style="color:var(--text-muted);font-size:0.7rem">—</span>'}
                    </td>
                  </tr>
                `}).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `).join("")}
  `,t.querySelectorAll(".habit-checkbox[data-date]").forEach(r=>{r.addEventListener("change",()=>{const o=Ct(e,r.dataset.date,r.dataset.habit,r.checked);e=o,a(o),he(t,o)})}),(c=t.querySelector("#scroll-today-btn"))==null||c.addEventListener("click",()=>{var r;(r=document.getElementById("today-row"))==null||r.scrollIntoView({behavior:"smooth",block:"center"})}),setTimeout(()=>{var r;(r=document.getElementById("today-row"))==null||r.scrollIntoView({behavior:"smooth",block:"center"})},200)}function he(t,e){const a=t.querySelectorAll(".streak-pill"),n=[...E,"mtech"];a.forEach((s,i)=>{const c=n[i];if(!c)return;const r=et(e,c),o=s.querySelector(".streak-count");o&&(o.textContent=`${r}d`)})}function tt(t,e,a,n,s){var o,l,d,m,p,b,y,S;const i=_(),c=N()??"",r=B()??"";t.innerHTML=`
    <div class="modal-header">
      <h2 class="modal-title">⚙️ Settings</h2>
      <button class="btn-icon" id="settings-close">✕</button>
    </div>

    <!-- GitHub Gist Sync -->
    <div style="margin-bottom:24px">
      <div style="font-size:0.85rem; font-weight:600; text-transform:uppercase; letter-spacing:.06em; color:var(--text-secondary); margin-bottom:12px">
        GitHub Gist Sync
      </div>

      <div style="background:rgba(251,191,36,0.08); border:1px solid rgba(251,191,36,0.2); border-radius:var(--radius-md); padding:12px 14px; margin-bottom:14px; font-size:0.8rem; color:var(--warning)">
        ⚠️ Your PAT is stored only in this browser's localStorage. It is never sent anywhere other than api.github.com.
      </div>

      ${i?`
        <div style="background:rgba(52,211,153,0.08); border:1px solid rgba(52,211,153,0.2); border-radius:var(--radius-md); padding:12px 14px; margin-bottom:14px">
          <div style="color:var(--success); font-size:0.875rem; font-weight:600; margin-bottom:4px">✅ Connected to GitHub Gist</div>
          <div style="color:var(--text-muted); font-size:0.78rem">Gist ID: <code style="font-family:var(--font-mono)">${r}</code></div>
        </div>
        <div style="display:flex; gap:8px">
          <button class="btn btn-primary btn-sm" id="sync-now-btn">🔄 Sync Now</button>
          <button class="btn btn-danger btn-sm" id="disconnect-btn">Disconnect</button>
        </div>
      `:`
        <div class="input-group" style="margin-bottom:12px">
          <label class="input-label" for="pat-input">
            Personal Access Token 
            <a href="https://github.com/settings/tokens/new" target="_blank" style="color:var(--primary); font-size:0.75rem">(Create token ↗)</a>
          </label>
          <div style="position:relative">
            <input type="password" class="input" id="pat-input" placeholder="github_pat_…" value="${c}" />
            <button class="btn-icon" id="pat-toggle" style="position:absolute; right:4px; top:50%; transform:translateY(-50%)">👁</button>
          </div>
          <div style="font-size:0.72rem; color:var(--text-muted); margin-top:4px">
            Required scope: <code style="font-family:var(--font-mono)">gist</code> (fine-grained or classic)
          </div>
        </div>
        <div class="input-group" style="margin-bottom:14px">
          <label class="input-label" for="gist-id-input">
            Gist ID
            <a href="https://gist.github.com" target="_blank" style="color:var(--primary); font-size:0.75rem">(Create a secret gist ↗)</a>
          </label>
          <input type="text" class="input" id="gist-id-input" placeholder="abc123def456…" value="${r}" />
          <div style="font-size:0.72rem; color:var(--text-muted); margin-top:4px">
            From the Gist URL: gist.github.com/username/<strong>THIS_PART</strong>
          </div>
        </div>
        <div id="connect-error" style="color:var(--danger); font-size:0.8rem; margin-bottom:10px; display:none"></div>
        <button class="btn btn-primary" id="connect-btn">🔗 Connect & Verify</button>
      `}
    </div>

    <div class="divider"></div>

    <!-- Export / Import -->
    <div style="margin-bottom:24px">
      <div style="font-size:0.85rem; font-weight:600; text-transform:uppercase; letter-spacing:.06em; color:var(--text-secondary); margin-bottom:12px">
        Export / Import Progress
      </div>
      <div style="display:flex; gap:8px; flex-wrap:wrap">
        <button class="btn btn-secondary" id="export-btn">📥 Download progress.json</button>
        <label class="btn btn-secondary" for="import-file" style="cursor:pointer">📤 Import progress.json</label>
        <input type="file" id="import-file" accept=".json" style="display:none" />
      </div>
    </div>

    <div class="divider"></div>

    <!-- Danger Zone -->
    <div>
      <div style="font-size:0.85rem; font-weight:600; text-transform:uppercase; letter-spacing:.06em; color:var(--danger); margin-bottom:12px">
        Danger Zone
      </div>
      <button class="btn btn-danger" id="reset-btn">🗑 Reset All Progress</button>
    </div>
  `,(o=t.querySelector("#settings-close"))==null||o.addEventListener("click",s),(l=t.querySelector("#pat-toggle"))==null||l.addEventListener("click",()=>{const g=t.querySelector("#pat-input");g.type=g.type==="password"?"text":"password"}),(d=t.querySelector("#connect-btn"))==null||d.addEventListener("click",async()=>{var j,ot,ct,lt;const g=t.querySelector("#connect-btn"),u=t.querySelector("#connect-error"),f=(ot=(j=t.querySelector("#pat-input"))==null?void 0:j.value)==null?void 0:ot.trim(),v=(lt=(ct=t.querySelector("#gist-id-input"))==null?void 0:ct.value)==null?void 0:lt.trim();if(!f||!v){u.textContent="Both PAT and Gist ID are required.",u.style.display="block";return}g.textContent="⏳ Verifying…",g.disabled=!0,u.style.display="none";const{valid:h,error:L}=await Yt(f,v);if(!h){u.textContent=L,u.style.display="block",g.textContent="🔗 Connect & Verify",g.disabled=!1;return}qt(f),zt(v),n("GitHub Gist connected!","success"),tt(t,e,a,n,s)}),(m=t.querySelector("#sync-now-btn"))==null||m.addEventListener("click",async()=>{const g=t.querySelector("#sync-now-btn");g.textContent="⏳ Syncing…",g.disabled=!0;const u=await ht(e);g.textContent=u?"✅ Synced":"❌ Failed",setTimeout(()=>{g.textContent="🔄 Sync Now",g.disabled=!1},2e3),u?n("Progress synced to Gist!","success"):n("Gist sync failed","error")}),(p=t.querySelector("#disconnect-btn"))==null||p.addEventListener("click",()=>{confirm("Disconnect GitHub Gist? Your local progress will remain.")&&(Gt(),n("Disconnected from GitHub Gist","info"),tt(t,e,a,n,s))}),(b=t.querySelector("#export-btn"))==null||b.addEventListener("click",()=>{const g=jt(e),u=new Blob([g],{type:"application/json"}),f=URL.createObjectURL(u),v=document.createElement("a");v.href=f,v.download=`mastery-progress-${new Date().toISOString().slice(0,10)}.json`,v.click(),URL.revokeObjectURL(f),n("Progress downloaded!","success")}),(y=t.querySelector("#import-file"))==null||y.addEventListener("change",g=>{const u=g.target.files[0];if(!u)return;const f=new FileReader;f.onload=v=>{try{const h=Rt(v.target.result);a(h),n("Progress imported successfully!","success"),s()}catch(h){n(`Import failed: ${h.message}`,"error")}},f.readAsText(u)}),(S=t.querySelector("#reset-btn"))==null||S.addEventListener("click",()=>{confirm("⚠️ This will DELETE all your progress. This cannot be undone. Continue?")&&confirm("Are you absolutely sure? Type OK to confirm.","OK")&&(localStorage.removeItem("cpml-tracker:v1"),n("All progress reset","info"),s(),location.reload())})}let x=Tt(),St="overview";function O(t,e="info",a=3e3){const n=document.getElementById("toast-container"),s=document.createElement("div");s.className=`toast ${e}`;const i={success:"✅",error:"❌",info:"ℹ️",warning:"⚠️"};s.innerHTML=`<span>${i[e]||"ℹ️"}</span><span>${t}</span>`,n.appendChild(s),setTimeout(()=>s.remove(),a)}function q(t){x=t,A(),_()&&Bt(x,()=>{A("synced"),O("Synced to GitHub Gist","success")},()=>O("Gist sync failed","error"))}function A(t){const e=document.getElementById("sync-dot"),a=document.getElementById("sync-text");if(t==="synced"){e.className="sync-dot synced",a.textContent="Synced";return}if(t==="syncing"){e.className="sync-dot syncing",a.textContent="Syncing…";return}if(!_()){e.className="sync-dot",a.textContent="Local only";return}const n=Ht();if(n){const s=xe(new Date(n));e.className="sync-dot synced",a.textContent=`Synced ${s}`}else e.className="sync-dot",a.textContent="Connected"}function xe(t){const e=Math.floor((Date.now()-t)/1e3);if(e<60)return"just now";const a=Math.floor(e/60);if(a<60)return`${a}m ago`;const n=Math.floor(a/60);return n<24?`${n}h ago`:`${Math.floor(n/24)}d ago`}const At=document.querySelectorAll(".nav-tab"),we=document.querySelectorAll(".tab-panel");function Lt(t){St=t,At.forEach(e=>{const a=e.dataset.tab===t;e.classList.toggle("active",a),e.setAttribute("aria-selected",a)}),we.forEach(e=>{e.classList.toggle("active",e.id===`tab-${t}`)}),rt(t)}function rt(t){switch(t){case"overview":xt(document.getElementById("overview-root"),x,q,Lt);break;case"roadmaps":$t(document.getElementById("roadmaps-root"),x,q);break;case"cp":G(document.getElementById("cp-root"),x,q);break;case"daily":be(document.getElementById("daily-root"),x,q);break}}At.forEach(t=>{t.addEventListener("click",()=>Lt(t.dataset.tab))});const P=document.getElementById("settings-overlay"),$e=document.getElementById("settings-btn");$e.addEventListener("click",()=>{P.classList.add("open"),tt(document.getElementById("settings-root"),x,t=>{x=t,A(),rt(St),O("Settings saved","success")},O,()=>{P.classList.remove("open")})});P.addEventListener("click",t=>{t.target===P&&P.classList.remove("open")});document.addEventListener("keydown",t=>{t.key==="Escape"&&P.classList.remove("open")});async function ke(){if(A(),_()){A("syncing");try{const t=await Ft(x);t&&t!==x?(x=t,T(x),A("synced"),O("Progress loaded from GitHub Gist","success")):A()}catch{A()}}rt("overview")}ke();
