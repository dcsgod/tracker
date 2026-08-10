(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const c of i.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&n(c)}).observe(document,{childList:!0,subtree:!0});function a(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(s){if(s.ep)return;s.ep=!0;const i=a(s);fetch(s.href,i)}})();const ke="cpml-tracker:v1",M={schemaVersion:1,roadmaps:{},cp:{topics:{},starredProblems:{}},daily:{},papers:{},gist:{connected:!1,gistId:null,lastSyncedAt:null},updatedAt:null};function Me(){try{const e=localStorage.getItem(ke);if(!e)return structuredClone(M);const t=JSON.parse(e);return t.schemaVersion===1?{...structuredClone(M),...t}:structuredClone(M)}catch{return structuredClone(M)}}function E(e){const t={...e,updatedAt:new Date().toISOString()};return localStorage.setItem(ke,JSON.stringify(t)),t}function Oe(e,t,a,n){const s=structuredClone(e);return s.roadmaps[t]||(s.roadmaps[t]={}),s.roadmaps[t][a]=n,E(s)}function je(e,t,a){var n;return!!((n=e.roadmaps[t])!=null&&n[a])}function Re(e,t,a,n){const s=structuredClone(e);return s.daily[t]||(s.daily[t]={}),s.daily[t][a]=n,E(s)}function qe(e,t,a){const n=structuredClone(e);return n.cp.topics[t]||(n.cp.topics[t]={problems:[]}),n.cp.topics[t].problems.find(i=>i.cfId===a.cfId)||n.cp.topics[t].problems.push({...a,done:!1,addedAt:new Date().toISOString()}),E(n)}function ze(e,t,a){var i,c;const n=structuredClone(e),s=(c=(i=n.cp.topics[t])==null?void 0:i.problems)==null?void 0:c.find(r=>r.cfId===a);return s&&(s.done=!s.done),E(n)}function Ge(e,t,a){var s;const n=structuredClone(e);return(s=n.cp.topics[t])!=null&&s.problems&&(n.cp.topics[t].problems=n.cp.topics[t].problems.filter(i=>i.cfId!==a)),E(n)}function ae(e,t){var i;const a=new Date;let n=0,s=new Date(a);for(;;){const c=Le(s);if((i=e.daily[c])!=null&&i[t])n++,s.setDate(s.getDate()-1);else break}return n}function Se(e,t){var s;let a=0,n=0;for(const i of t.phases)for(const c of i.topics)a++,(s=e.roadmaps[t.id])!=null&&s[c.id]&&n++;return{checked:n,total:a,percent:a>0?Math.round(n/a*100):0}}function He(e,t){var i;const a=((i=e.cp.topics[t])==null?void 0:i.problems)??[],n=a.length,s=a.filter(c=>c.done).length;return{solved:s,total:n,percent:n>0?Math.round(s/n*100):0}}function Be(e){return JSON.stringify(e,null,2)}function Ne(e){const t=JSON.parse(e);if(!t.schemaVersion)throw new Error("Invalid progress file: missing schemaVersion");const a={...structuredClone(M),...t};return E(a)}function Le(e){return e.toISOString().slice(0,10)}function Z(){return Math.max(0,Math.floor((new Date-new Date("2026-08-11"))/(7*24*60*60*1e3)))}const ie="cpml-tracker:gist-pat",re="cpml-tracker:gist-id",oe="cpml-tracker:last-sync",ce="https://api.github.com";let U=null;function _e(e){localStorage.setItem(ie,e)}function F(){return localStorage.getItem(ie)}function Fe(e){localStorage.setItem(re,e)}function W(){return localStorage.getItem(re)}function We(){localStorage.removeItem(ie),localStorage.removeItem(re),localStorage.removeItem(oe)}function Y(){return!!(F()&&W())}function Ye(){return localStorage.getItem(oe)}async function Je(){var a;const e=F(),t=W();if(!e||!t)return null;try{const n=await fetch(`${ce}/gists/${t}`,{headers:{Authorization:`Bearer ${e}`,Accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28"}});if(!n.ok)throw new Error(`GitHub API error: ${n.status} ${n.statusText}`);const i=(a=(await n.json()).files)==null?void 0:a["progress.json"];return i!=null&&i.content?JSON.parse(i.content):null}catch(n){return console.error("[GistSync] Pull failed:",n),null}}async function Ae(e){const t=F(),a=W();if(!t||!a)return!1;try{const n=await fetch(`${ce}/gists/${a}`,{method:"PATCH",headers:{Authorization:`Bearer ${t}`,Accept:"application/vnd.github+json","Content-Type":"application/json","X-GitHub-Api-Version":"2022-11-28"},body:JSON.stringify({files:{"progress.json":{content:JSON.stringify(e,null,2)}}})});if(!n.ok)throw new Error(`GitHub API error: ${n.status} ${n.statusText}`);const s=new Date().toISOString();return localStorage.setItem(oe,s),!0}catch(n){return console.error("[GistSync] Push failed:",n),!1}}function Ve(e,t,a){U&&clearTimeout(U),U=setTimeout(async()=>{await Ae(e)?t==null||t():a==null||a()},3e3)}function Ue(e,t){if(!t)return e;const a=e.updatedAt?new Date(e.updatedAt):new Date(0);return(t.updatedAt?new Date(t.updatedAt):new Date(0))>a?(console.log("[GistSync] Remote is newer, using remote state"),t):(console.log("[GistSync] Local is newer or equal, keeping local state"),e)}async function Ke(e){const t=await Je();return t?Ue(e,t):null}async function Xe(e,t){try{const a=await fetch(`${ce}/gists/${t}`,{headers:{Authorization:`Bearer ${e}`,Accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28"}});return a.status===404?{valid:!1,error:"Gist not found. Check the Gist ID."}:a.status===401?{valid:!1,error:"Invalid PAT. Check your token."}:a.ok?{valid:!0}:{valid:!1,error:`GitHub API error: ${a.status}`}}catch(a){return{valid:!1,error:a.message}}}const Q=["mlpath","nlppath","llmreasoning","timeseriespath","quantpath","gnnpath","rlpath","diffusionmodelspath"],Ze={mlpath:"ML/DL Mastery",nlppath:"NLP → Reasoning",llmreasoning:"LLM Building & Reasoning",timeseriespath:"Time Series & Causal",quantpath:"Quant Researcher",gnnpath:"GNN Path",rlpath:"RL Path",diffusionmodelspath:"Diffusion Models"},Qe={mlpath:"🧠",nlppath:"💬",llmreasoning:"🤖",timeseriespath:"📈",quantpath:"📊",gnnpath:"🕸️",rlpath:"🎮",diffusionmodelspath:"🎨"},ve=["gym","running","diet","water","dsa","ml"],et={gym:"Gym",running:"Running",diet:"Diet",water:"Water 💧",dsa:"DSA",ml:"ML"},tt={gym:"🏋️",running:"🏃",diet:"🥗",water:"💧",dsa:"⚡",ml:"🧠"};let D={};async function st(){const e={};return await Promise.all(Q.map(async t=>{try{const a=await fetch(`/tracker/data/roadmaps/${t}.json`);e[t]=await a.json()}catch{e[t]=null}})),e}async function Ie(e,t,a,n){var L,g;e.innerHTML='<div class="spinner"></div><div class="loading-text">Loading overview…</div>',Object.keys(D).length||(D=await st());let s=0,i=0;const c={};for(const u of Q){const f=D[u];if(!f)continue;const v=Se(t,f);c[u]=v,s+=v.total,i+=v.checked}const r=s>0?Math.round(i/s*100):0,o=Object.keys(((L=t.cp)==null?void 0:L.topics)??{}),l=o.reduce((u,f)=>{var v,h,T;return u+(((T=(h=(v=t.cp.topics[f])==null?void 0:v.problems)==null?void 0:h.filter(q=>q.done))==null?void 0:T.length)??0)},0),d=o.reduce((u,f)=>{var v,h;return u+(((h=(v=t.cp.topics[f])==null?void 0:v.problems)==null?void 0:h.length)??0)},0),m={};for(const u of ve)m[u]=ae(t,u);const b=Object.keys(t.daily??{}).filter(u=>Object.values(t.daily[u]).some(f=>f)).length,y=nt(t,D);e.innerHTML=`
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
          ${Q.map(u=>{const f=D[u];if(!f)return"";const v=c[u];return`
              <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px">
                  <span style="font-size:0.85rem; font-weight:500; display:flex; align-items:center; gap:6px">
                    ${Qe[u]} ${Ze[u]}
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
              ${ve.map(u=>`
                <div class="streak-pill">
                  <span>${tt[u]}</span>
                  <span>${et[u]}</span>
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
        <span class="badge badge-number">Week ${Z()+1}</span>
      </div>
      <div class="card-body">
        <div class="papers-grid">
          ${y.map(u=>{var h,T;const f=btoa(u.title).slice(0,16),v=!!((T=(h=t.papers)==null?void 0:h[f])!=null&&T.reproduced);return`
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
  `,window.switchToTab=n,window.togglePaper=(u,f)=>{const v={...t};v.papers||(v.papers={}),v.papers[u]={reproduced:f,weekReproduced:Z()},a(v),Ie(e,v,a,n)}}function nt(e,t){const a=[],n=Z();for(const s of["mlpath","nlppath","timeseriespath","llmreasoning"]){const i=t[s];if(i){for(const c of i.phases){const r=c.topics.filter(l=>{var d,m;return(m=(d=e.roadmaps)==null?void 0:d[s])==null?void 0:m[l.id]}).length,o=c.topics.length;if(r>0&&r<o){const l=c.topics.flatMap(d=>(d.papers??[]).map(m=>({title:m,source:`${i.title} — ${c.title}`})));if(l.length>0){const d=n*2%l.length;for(let m=0;m<3&&a.length<3;m++)a.push(l[(d+m)%l.length]);if(a.length>=3)break}}}if(a.length>=3)break}}if(a.length===0&&t.mlpath){const s=t.mlpath.phases[0],i=(s==null?void 0:s.topics.flatMap(r=>(r.papers??[]).map(o=>({title:o,source:`ML/DL Mastery — ${s.title}`}))))??[],c=n%Math.max(1,i.length);a.push(...i.slice(c,c+3))}return a.slice(0,3)}const ee=["mlpath","nlppath","llmreasoning","timeseriespath","quantpath","gnnpath","rlpath","diffusionmodelspath"],Te={mlpath:"🧠",nlppath:"💬",llmreasoning:"🤖",timeseriespath:"📈",quantpath:"📊",gnnpath:"🕸️",rlpath:"🎮",diffusionmodelspath:"🎨"};let $={},z="mlpath",te="",N=new Set;async function at(){Object.keys($).length||await Promise.all(ee.map(async e=>{try{const t=await fetch(`/tracker/data/roadmaps/${e}.json`);$[e]=await t.json()}catch{$[e]=null}}))}async function Ee(e,t,a){Object.keys($).length||(e.innerHTML='<div class="spinner"></div>',await at());const n=$[z],s={};for(const r of ee)$[r]&&(s[r]=Se(t,$[r]));const i=s[z]??{checked:0,total:0,percent:0};e.innerHTML=`
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
        <input type="text" class="input" id="roadmap-search" placeholder="Search topics…" value="${te}" />
      </div>
    </div>

    <div class="roadmap-layout">
      <!-- Sidebar -->
      <div class="roadmap-sidebar">
        ${ee.map(r=>{const o=$[r];if(!o)return"";const l=s[r]??{checked:0,total:0,percent:0};return`
            <div class="roadmap-sidebar-item ${r===z?"active":""}" 
                 data-roadmap="${r}" id="sidebar-${r}">
              <div style="display:flex; align-items:center; gap:8px; flex:1; min-width:0">
                <span style="font-size:1.1rem">${Te[r]}</span>
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
        ${fe(n,t,i)}
      </div>
    </div>
  `,e.querySelectorAll(".roadmap-sidebar-item").forEach(r=>{r.addEventListener("click",()=>{z=r.dataset.roadmap,N.clear(),Ee(e,t,a)})});const c=e.querySelector("#roadmap-search");c==null||c.addEventListener("input",r=>{te=r.target.value,document.getElementById("roadmap-detail").innerHTML=fe(n,t,i),ge(e),ye(e,t,a)}),ge(e),ye(e,t,a)}function fe(e,t,a){if(!e)return'<div class="empty-state"><div class="empty-state-icon">❌</div><div class="empty-state-title">Could not load roadmap data</div></div>';const n=te.toLowerCase().trim();return`
    <!-- Roadmap Header -->
    <div class="card" style="margin-bottom:16px">
      <div class="card-body" style="display:flex; align-items:center; gap:20px; flex-wrap:wrap">
        <div style="font-size:2.5rem">${Te[e.id]}</div>
        <div style="flex:1; min-width:180px">
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:6px">
            <h2 style="font-size:1.2rem; font-weight:700">${e.title}</h2>
            <span class="badge ${e.coverage==="full"?"badge-full":"badge-partial"}">${e.coverage}</span>
            ${e.stub?'<span class="badge badge-stub">⚠ stub — needs refresh</span>':""}
          </div>
          <a href="${e.sourceUrl}" target="_blank" rel="noopener" 
             style="font-size:0.78rem; color:var(--primary); display:flex; align-items:center; gap:4px">
            ${e.sourceUrl} ↗
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
    ${e.phases.map((s,i)=>{const c=s.topics.filter(p=>{var b,y;return(y=(b=t.roadmaps)==null?void 0:b[e.id])==null?void 0:y[p.id]}).length,r=s.topics.length,o=r>0?Math.round(c/r*100):0,l=`${e.id}-${s.id}`,d=N.has(l)||n.length>0,m=n?s.topics.filter(p=>p.title.toLowerCase().includes(n)):s.topics;return n&&m.length===0?"":`
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
              ${m.map(p=>{const b=je(t,e.id,p.id),y=p.papers&&p.papers.length>0;return`
                  <div class="topic-item" data-roadmap="${e.id}" data-topic="${p.id}">
                    <input type="checkbox" id="topic-${e.id}-${p.id}" 
                           ${b?"checked":""} />
                    <label for="topic-${e.id}-${p.id}" class="topic-text">
                      ${p.title}
                      ${y?`<span style="color:var(--accent); font-size:0.75rem; margin-left:4px" title="${p.papers.join(", ")}">📄 ${p.papers.length}</span>`:""}
                    </label>
                    <a href="${e.sourceUrl}" target="_blank" rel="noopener" 
                       class="topic-link" title="Open source">↗</a>
                  </div>
                `}).join("")}
            </div>
          </div>
        </div>
      `}).join("")}
  `}function ge(e,t,a){e.querySelectorAll(".collapsible-header[data-phase]").forEach(n=>{n.addEventListener("click",()=>{const s=n.dataset.phase,i=document.getElementById(`phase-body-${s}`);if(!i)return;i.classList.contains("open")?(i.classList.remove("open"),n.classList.remove("open"),N.delete(s)):(i.classList.add("open"),n.classList.add("open"),N.add(s))})})}function ye(e,t,a){e.querySelectorAll('.topic-item input[type="checkbox"]').forEach(n=>{n.addEventListener("change",s=>{const i=s.target.closest(".topic-item"),c=i.dataset.roadmap,r=i.dataset.topic,o=Oe(t,c,r,s.target.checked);t=o,a(o),it(e,c,r,o)})})}function it(e,t,a,n){const s=$[t];if(s){for(const i of s.phases)if(i.topics.find(c=>c.id===a)){const c=i.topics.filter(d=>{var m,p;return(p=(m=n.roadmaps)==null?void 0:m[t])==null?void 0:p[d.id]}).length,r=Math.round(c/i.topics.length*100),o=`${t}-${i.id}`,l=document.getElementById(`phase-card-${o}`);l&&(l.querySelector(".progress-fill").style.width=`${r}%`,l.querySelector(".phase-pct").textContent=`${r}%`,l.querySelector(".phase-stats").textContent=`${c}/${i.topics.length} completed`);break}}}const J="cpml-tracker:cf-cache",rt=7*24*60*60*1e3,ot="https://codeforces.com/api/problemset.problems";async function ct(){const e=be();if(e)return e;try{const t=await fetch(ot);if(!t.ok)throw new Error(`CF API error: ${t.status}`);const a=await t.json();if(a.status!=="OK")throw new Error(`CF API status: ${a.status}`);const n=a.result.problems.map(s=>({cfId:`${s.contestId}${s.index}`,contestId:s.contestId,index:s.index,title:s.name,rating:s.rating??null,tags:s.tags??[],url:`https://codeforces.com/problemset/problem/${s.contestId}/${s.index}`}));return ut(n),n}catch(t){return console.error("[CF] Fetch failed:",t),be(!0)??[]}}function lt(e,t,a,n,s=50){return e.filter(i=>!(i.rating===null||a!==null&&i.rating<a||n!==null&&i.rating>n||t&&t.length>0&&!t.some(r=>i.tags.some(o=>o.toLowerCase().includes(r.toLowerCase()))))).sort(()=>Math.random()-.5).slice(0,s)}const Pe=[{label:"800–1000 (Beginner)",min:800,max:1e3},{label:"1100–1300 (Easy)",min:1100,max:1300},{label:"1400–1600 (Medium)",min:1400,max:1600},{label:"1700–1900 (Hard)",min:1700,max:1900},{label:"2000–2100 (Expert)",min:2e3,max:2100}];function dt(){localStorage.removeItem(J)}function pt(){const e=localStorage.getItem(J);if(!e)return null;try{const{fetchedAt:t,count:a}=JSON.parse(e),s=((Date.now()-t)/(24*60*60*1e3)).toFixed(1);return{fetchedAt:new Date(t).toLocaleString(),daysOld:s,count:a}}catch{return null}}function be(e=!1){try{const t=localStorage.getItem(J);if(!t)return null;const{fetchedAt:a,problems:n}=JSON.parse(t);return!e&&Date.now()-a>rt?null:n}catch{return null}}function ut(e){localStorage.setItem(J,JSON.stringify({fetchedAt:Date.now(),count:e.length,problems:e}))}let S=[],w=null,j=[],H=!1,se=0,P="browse";async function mt(){if(S.length)return;S=await(await fetch("/tracker/data/cp-topics.json")).json(),!w&&S.length&&(w=S[0].id)}async function vt(){j.length||H||(H=!0,j=await ct(),H=!1)}async function B(e,t,a){var i,c,r,o,l;S.length||(e.innerHTML='<div class="spinner"></div>',await mt());const n=S.find(d=>d.id===w)??S[0];t.cp;const s=pt();e.innerHTML=`
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
          ${S.map(d=>{const m=He(t,d.id);return`
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
                ${Pe.map((d,m)=>`
                  <option value="${m}" ${m===se?"selected":""}>${d.label}</option>
                `).join("")}
              </select>
            </div>
            <div style="display:flex; gap:8px; align-items:flex-end; padding-bottom:1px">
              <button class="btn ${P==="browse"?"btn-primary":"btn-secondary"} btn-sm" id="view-browse">🔍 Browse</button>
              <button class="btn ${P==="mylist"?"btn-primary":"btn-secondary"} btn-sm" id="view-mylist">⭐ My List</button>
            </div>
            <button class="btn btn-primary btn-sm" id="fetch-btn">
              ${H?"⏳ Loading…":"⚡ Load Problems"}
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
  `,e.querySelectorAll(".cp-topic-item").forEach(d=>{d.addEventListener("click",()=>{w=d.dataset.topic,B(e,t,a)})}),(i=e.querySelector("#rating-band-select"))==null||i.addEventListener("change",d=>{se=parseInt(d.target.value)}),(c=e.querySelector("#view-browse"))==null||c.addEventListener("click",()=>{P="browse",B(e,t,a)}),(r=e.querySelector("#view-mylist"))==null||r.addEventListener("click",()=>{P="mylist",K(e,t,a)}),(o=e.querySelector("#fetch-btn"))==null||o.addEventListener("click",async()=>{const d=e.querySelector("#fetch-btn");d.textContent="⏳ Loading…",d.disabled=!0,await vt(),K(e,t,a),d.textContent="⚡ Reload",d.disabled=!1}),(l=e.querySelector("#clear-cache-btn"))==null||l.addEventListener("click",()=>{dt(),j=[],B(e,t,a)}),P==="mylist"&&K(e,t,a)}function K(e,t,a){var l,d,m;const n=e.querySelector("#problem-panel");if(!n)return;if(P==="mylist"){ne(n,t,a);return}if(!j.length)return;const s=S.find(p=>p.id===w);if(!s)return;const i=Pe[se],c=lt(j,s.tags,i.min,i.max,50),r=((m=(d=(l=t.cp)==null?void 0:l.topics)==null?void 0:d[w])==null?void 0:m.problems)??[],o=new Set(r.map(p=>p.cfId));if(c.length===0){n.innerHTML=`
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
                      data-cf-id="${p.cfId}" data-title="${ft(p.title)}" data-rating="${p.rating}"
                      ${y?"disabled":""}>
                ${y?"✓ Added":"+ Add"}
              </button>
            </div>
          </div>
        `}).join("")}
    </div>
  `,n.querySelectorAll(".add-problem-btn:not([disabled])").forEach(p=>{p.addEventListener("click",()=>{const b={cfId:p.dataset.cfId,title:p.dataset.title,rating:parseInt(p.dataset.rating)||null},y=qe(t,w,b);t=y,a(y),p.textContent="✓ Added",p.disabled=!0,p.className="btn btn-secondary btn-xs add-problem-btn"})})}function ne(e,t,a){var i,c,r;const n=((r=(c=(i=t.cp)==null?void 0:i.topics)==null?void 0:c[w])==null?void 0:r.problems)??[];if(n.length===0){e.innerHTML=`
      <div class="empty-state">
        <div class="empty-state-icon">⭐</div>
        <div class="empty-state-title">Your list is empty</div>
        <div class="empty-state-desc">Switch to Browse mode, load problems from CF, and add them here.</div>
      </div>
    `;return}const s=n.filter(o=>o.done).length;e.innerHTML=`
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
  `,e.querySelectorAll(".habit-checkbox[data-cf-id]").forEach(o=>{o.addEventListener("change",()=>{const l=ze(t,w,o.dataset.cfId);t=l,a(l),ne(e,l,a)})}),e.querySelectorAll(".remove-btn").forEach(o=>{o.addEventListener("click",()=>{const l=Ge(t,w,o.dataset.cfId);t=l,a(l),ne(e,l,a)})})}function ft(e){return e.replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}const gt=new Date("2026-08-11"),yt=new Date("2026-12-31"),O=["gym","running","diet","water","dsa","ml"],X={gym:"Gym 🏋️",running:"Running 🏃",diet:"Diet 🥗",water:"Water 💧",dsa:"DSA ⚡",ml:"ML 🧠",mtech:"MTech 🎓"},bt={gym:"#22c55e",running:"#14b8a6",diet:"#84cc16",water:"#38bdf8",dsa:"#a855f7",ml:"#6366f1",mtech:"#f97316"},ht=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],he=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];function xt(){const e=[],t=new Date(gt);let a=1;for(;t<=yt;)e.push({date:new Date(t),dayN:a++}),t.setDate(t.getDate()+1);return e}function wt(e){return e.getDay()===0||e.getDay()===6}function $t(e){const t=new Date;return e.getDate()===t.getDate()&&e.getMonth()===t.getMonth()&&e.getFullYear()===t.getFullYear()}function kt(e){const t=new Date;return t.setHours(0,0,0,0),e>t}function St(e,t,a){var c;const n=xt(),s={};for(const r of[...O,"mtech"])s[r]=ae(t,r);const i={};n.forEach(({date:r,dayN:o})=>{const l=`${r.getFullYear()}-${r.getMonth()}`;i[l]||(i[l]={name:he[r.getMonth()],year:r.getFullYear(),dates:[]}),i[l].dates.push({date:r,dayN:o})}),e.innerHTML=`
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
          ${[...O,"mtech"].map(r=>`
            <div class="streak-pill">
              <span style="color:${bt[r]}">●</span>
              <span style="font-size:0.78rem">${X[r].replace(/ .*/,"")}</span>
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
                ${O.map(o=>`<th style="width:52px">${X[o].replace(/ .*/,"")}</th>`).join("")}
                <th style="width:60px; color:var(--accent)">MTech</th>
              </tr>
            </thead>
            <tbody>
              ${r.dates.map(({date:o,dayN:l})=>{var L;const d=Le(o),m=((L=t.daily)==null?void 0:L[d])??{},p=wt(o),b=$t(o),y=kt(o);return`
                  <tr class="${b?"today":""} ${p?"weekend":""}" 
                      id="${b?"today-row":""}">
                    <td class="day-date">${o.getDate()} ${he[o.getMonth()]}</td>
                    <td class="day-of-week">${ht[o.getDay()]}</td>
                    <td class="day-n">D${l}</td>
                    ${O.map(g=>`
                      <td>
                        <input type="checkbox" 
                               class="habit-checkbox" 
                               data-habit="${g}" 
                               data-date="${d}"
                               ${m[g]?"checked":""}
                               ${y?'style="opacity:0.35"':""}
                               title="${X[g]} · ${d}" />
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
  `,e.querySelectorAll(".habit-checkbox[data-date]").forEach(r=>{r.addEventListener("change",()=>{const o=Re(t,r.dataset.date,r.dataset.habit,r.checked);t=o,a(o),Lt(e,o)})}),(c=e.querySelector("#scroll-today-btn"))==null||c.addEventListener("click",()=>{var r;(r=document.getElementById("today-row"))==null||r.scrollIntoView({behavior:"smooth",block:"center"})}),setTimeout(()=>{var r;(r=document.getElementById("today-row"))==null||r.scrollIntoView({behavior:"smooth",block:"center"})},200)}function Lt(e,t){const a=e.querySelectorAll(".streak-pill"),n=[...O,"mtech"];a.forEach((s,i)=>{const c=n[i];if(!c)return;const r=ae(t,c),o=s.querySelector(".streak-count");o&&(o.textContent=`${r}d`)})}function _(e,t,a,n,s){var o,l,d,m,p,b,y,L;const i=Y(),c=F()??"",r=W()??"";e.innerHTML=`
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
  `,(o=e.querySelector("#settings-close"))==null||o.addEventListener("click",s),(l=e.querySelector("#pat-toggle"))==null||l.addEventListener("click",()=>{const g=e.querySelector("#pat-input");g.type=g.type==="password"?"text":"password"}),(d=e.querySelector("#connect-btn"))==null||d.addEventListener("click",async()=>{var q,pe,ue,me;const g=e.querySelector("#connect-btn"),u=e.querySelector("#connect-error"),f=(pe=(q=e.querySelector("#pat-input"))==null?void 0:q.value)==null?void 0:pe.trim(),v=(me=(ue=e.querySelector("#gist-id-input"))==null?void 0:ue.value)==null?void 0:me.trim();if(!f||!v){u.textContent="Both PAT and Gist ID are required.",u.style.display="block";return}g.textContent="⏳ Verifying…",g.disabled=!0,u.style.display="none";const{valid:h,error:T}=await Xe(f,v);if(!h){u.textContent=T,u.style.display="block",g.textContent="🔗 Connect & Verify",g.disabled=!1;return}_e(f),Fe(v),n("GitHub Gist connected!","success"),_(e,t,a,n,s)}),(m=e.querySelector("#sync-now-btn"))==null||m.addEventListener("click",async()=>{const g=e.querySelector("#sync-now-btn");g.textContent="⏳ Syncing…",g.disabled=!0;const u=await Ae(t);g.textContent=u?"✅ Synced":"❌ Failed",setTimeout(()=>{g.textContent="🔄 Sync Now",g.disabled=!1},2e3),u?n("Progress synced to Gist!","success"):n("Gist sync failed","error")}),(p=e.querySelector("#disconnect-btn"))==null||p.addEventListener("click",()=>{confirm("Disconnect GitHub Gist? Your local progress will remain.")&&(We(),n("Disconnected from GitHub Gist","info"),_(e,t,a,n,s))}),(b=e.querySelector("#export-btn"))==null||b.addEventListener("click",()=>{const g=Be(t),u=new Blob([g],{type:"application/json"}),f=URL.createObjectURL(u),v=document.createElement("a");v.href=f,v.download=`mastery-progress-${new Date().toISOString().slice(0,10)}.json`,v.click(),URL.revokeObjectURL(f),n("Progress downloaded!","success")}),(y=e.querySelector("#import-file"))==null||y.addEventListener("change",g=>{const u=g.target.files[0];if(!u)return;const f=new FileReader;f.onload=v=>{try{const h=Ne(v.target.result);a(h),n("Progress imported successfully!","success"),s()}catch(h){n(`Import failed: ${h.message}`,"error")}},f.readAsText(u)}),(L=e.querySelector("#reset-btn"))==null||L.addEventListener("click",()=>{confirm("⚠️ This will DELETE all your progress. This cannot be undone. Continue?")&&confirm("Are you absolutely sure? Type OK to confirm.","OK")&&(localStorage.removeItem("cpml-tracker:v1"),n("All progress reset","info"),s(),location.reload())})}"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/tracker/sw.js",{scope:"/tracker/"}).then(e=>console.log("[SW] Registered, scope:",e.scope)).catch(e=>console.warn("[SW] Registration failed:",e))});let x=Me(),le="overview";function I(e,t="info",a=3e3){const n=document.getElementById("toast-container"),s=document.createElement("div");s.className=`toast ${t}`;const i={success:"✅",error:"❌",info:"ℹ️",warning:"⚠️"};s.innerHTML=`<span>${i[t]||"ℹ️"}</span><span>${e}</span>`,n.appendChild(s),setTimeout(()=>s.remove(),a)}function G(e){x=e,k(),Y()&&Ve(x,()=>{k("synced"),I("Synced to GitHub Gist","success")},()=>I("Gist sync failed","error"))}function k(e){const t=document.getElementById("sync-dot"),a=document.getElementById("sync-text");if(e==="synced"){t.className="sync-dot synced",a.textContent="Synced";return}if(e==="syncing"){t.className="sync-dot syncing",a.textContent="Syncing…";return}if(!Y()){t.className="sync-dot",a.textContent="Local only";return}const n=Ye();if(n){const s=At(new Date(n));t.className="sync-dot synced",a.textContent=`Synced ${s}`}else t.className="sync-dot",a.textContent="Connected"}function At(e){const t=Math.floor((Date.now()-e)/1e3);if(t<60)return"just now";const a=Math.floor(t/60);if(a<60)return`${a}m ago`;const n=Math.floor(a/60);return n<24?`${n}h ago`:`${Math.floor(n/24)}d ago`}const Ce=document.querySelectorAll(".nav-tab"),De=document.querySelectorAll(".bottom-nav-item[data-tab]"),It=document.querySelectorAll(".tab-panel");function de(e){le=e,Ce.forEach(t=>{const a=t.dataset.tab===e;t.classList.toggle("active",a),t.setAttribute("aria-selected",a)}),De.forEach(t=>{t.classList.toggle("active",t.dataset.tab===e)}),It.forEach(t=>{t.classList.toggle("active",t.id===`tab-${e}`)}),V(e),window.scrollTo({top:0,behavior:"smooth"})}function V(e){switch(e){case"overview":Ie(document.getElementById("overview-root"),x,G,de);break;case"roadmaps":Ee(document.getElementById("roadmaps-root"),x,G);break;case"cp":B(document.getElementById("cp-root"),x,G);break;case"daily":St(document.getElementById("daily-root"),x,G);break}}Ce.forEach(e=>{e.addEventListener("click",()=>de(e.dataset.tab))});De.forEach(e=>{e.addEventListener("click",()=>de(e.dataset.tab))});var xe;(xe=document.getElementById("bnav-settings"))==null||xe.addEventListener("click",()=>{A.classList.add("open"),_(document.getElementById("settings-root"),x,e=>{x=e,k(),V(le),I("Settings saved","success")},I,()=>{A.classList.remove("open")})});const A=document.getElementById("settings-overlay"),Tt=document.getElementById("settings-btn");Tt.addEventListener("click",()=>{A.classList.add("open"),_(document.getElementById("settings-root"),x,e=>{x=e,k(),V(le),I("Settings saved","success")},I,()=>{A.classList.remove("open")})});A.addEventListener("click",e=>{e.target===A&&A.classList.remove("open")});document.addEventListener("keydown",e=>{e.key==="Escape"&&A.classList.remove("open")});let C=null;const R=document.getElementById("pwa-install-banner");window.addEventListener("beforeinstallprompt",e=>{e.preventDefault(),C=e,setTimeout(()=>{R&&(R.style.display="flex")},3e3)});var we;(we=document.getElementById("pwa-install-btn"))==null||we.addEventListener("click",async()=>{if(!C)return;R.style.display="none",C.prompt();const{outcome:e}=await C.userChoice;console.log("[PWA] Install outcome:",e),C=null});var $e;($e=document.getElementById("pwa-dismiss-btn"))==null||$e.addEventListener("click",()=>{R.style.display="none",C=null});window.addEventListener("appinstalled",()=>{I("App installed! 🎉 Open from your home screen","success",5e3),R.style.display="none"});async function Et(){if(k(),Y()){k("syncing");try{const e=await Ke(x);e&&e!==x?(x=e,E(x),k("synced"),I("Progress loaded from GitHub Gist","success")):k()}catch{k()}}V("overview")}Et();
