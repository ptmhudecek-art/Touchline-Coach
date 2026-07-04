import { createClient } from '@supabase/supabase-js'

document.querySelector('#app').innerHTML = `<header>
  <div class="logo">Touchline Coach</div>
  <div class="sub">TJ Město Zbiroh • Online Alpha</div>
  <div class="row" style="margin-top:10px">
    <select id="teamSelect" onchange="selectTeam(this.value)"></select>
    <button class="btn2" onclick="toggleAddTeam()">+ tým</button>
  </div>
  <div id="addTeamBox" class="hidden" style="margin-top:10px">
    <div class="row"><input id="newTeamName" placeholder="Nový tým, např. U19"><button class="btn" onclick="addTeam()">Přidat</button></div>
  </div>
</header>

<main>
<section id="home" class="page active">
  <div class="card" onclick="toggleDetail()">
    <div class="space"><div><div class="logo" style="font-size:20px">TJ Město Zbiroh</div><div id="homeTeam" class="small">Tým</div></div><span class="pill green">Trénink</span></div>
    <h2>Nejbližší trénink</h2>
    <div id="homeInfo" class="small">Zatím není žádný trénink.</div>
    <div class="row" style="margin-top:12px"><span id="hYes" class="pill green">0 přijde</span><span id="hExc" class="pill red">0 omluveno</span><span id="hNone" class="pill gray">0 bez reakce</span></div>
    <p class="small">Klikni pro detail.</p>
  </div>
  <div class="card">
    <div class="space">
      <div>
        <h3>Nejbližší utkání</h3>
        <div id="matchInfo" class="small">Zatím není zadané žádné utkání.</div>
      </div>
      <span class="pill blue">Utkání</span>
    </div>
  </div>
  <div id="homeDetail" class="hidden">
    <div class="card"><h3>Obsah tréninku</h3><div id="homeBlocks"></div></div>
    <div class="card"><h3>Přehled docházky</h3><div class="row"><span id="sumYes" class="pill green">0 Přijde</span><span id="sumInj" class="pill red">0 Zranění</span><span id="sumWork" class="pill yellow">0 Práce/škola</span><span id="sumOther" class="pill gray">0 Ostatní</span><span id="sumNone" class="pill gray">0 Bez odpovědi</span></div></div>
  </div>
</section>

<section id="calendar" class="page">
  <div class="card"><div class="space"><button class="btn2" onclick="moveMonth(-1)">‹</button><h3 id="monthTitle"></h3><button class="btn2" onclick="moveMonth(1)">›</button></div><div id="cal" class="calendar"></div></div>
  <div class="card"><h2 id="selTitle">Vyber den</h2>
    <div id="editor" class="hidden">
      <div class="row"><input id="trTime" placeholder="Čas 18:00–19:30"><input id="trPlace" placeholder="Místo"></div>
      <div class="card" style="background:#11141a">
        <h3>Typ události</h3>
        <div class="row">
          <button type="button" class="btn" id="typeTraining" onclick="window.setEventTypeHard(\'training\')">Trénink</button>
          <button type="button" class="btn2" id="typeMatch" onclick="window.setEventTypeHard(\'match\')">Utkání</button>
        </div>
        <input id="eventType" type="hidden" value="training">
        <div id="matchFields" class="hidden" style="margin-top:10px">
          <input id="matchOpponent" placeholder="Soupeř, např. FK Hrádek">
          <div style="height:8px"></div>
          <select id="matchHomeAway">
            <option value="home">Doma</option>
            <option value="away">Venku</option>
          </select>
          <div style="height:8px"></div>
          <input id="matchMeet" placeholder="Sraz, např. 16:15">
          <div class="small">Utkání se automaticky ukáže na Home jako nejbližší zápas.</div>
        </div>
      </div>
      <h3 id="planTitle">Plán tréninku</h3><p class="small">Enter přidá další blok.</p><div id="blocks"></div>
      <div class="row"><button class="btn" onclick="addBlock()">Přidat blok</button><button class="btn" onclick="saveTraining()">Uložit trénink</button><button class="danger" onclick="deleteTraining()">Smazat trénink</button></div>
    </div>
  </div>
</section>

<section id="team" class="page">
  <div class="card"><h2>Tým</h2><div class="small">Hráči: <b id="playerCount">0</b></div></div>
  <div class="card"><h3>Přidat hráče</h3><div class="row"><input id="onePlayer" placeholder="Příjmení Jméno"><button class="btn" onclick="addOne()">Přidat</button></div></div>
  <div class="card"><h3>Import z Excelu</h3><textarea id="bulkPlayers" placeholder="Novák Petr&#10;Svoboda Martin"></textarea><div class="row"><input id="teamCode" value="ZBIROH25" style="max-width:170px"><button class="btn" onclick="importPlayers()">Importovat</button></div></div>
  <div class="card"><h3>Seznam hráčů</h3><div id="playersTable"></div><button class="btn2" onclick="copyCodes()">Kopírovat kódy</button><pre id="copyBox" class="small"></pre></div>
</section>

<section id="attendance" class="page"><div class="card"><h2>Docházka</h2><div id="attendanceList"></div></div></section>

<section id="vault" class="page">
  <div class="card"><h2>🔒 Trezor</h2><p class="small">Společný klubový trezor.</p><div class="row"><input id="folderName" placeholder="Nová složka"><button class="btn" onclick="addFolder()">Přidat složku</button></div></div>
  <div class="card"><h3>Složky</h3><div id="folderList"></div></div>
  <div id="exerciseBox" class="card hidden"><div class="space"><h3 id="folderTitle">Složka</h3><button class="btn2" onclick="closeFolder()">Zavřít</button></div>
    <div class="card" style="background:#11141a"><h3>Nové cvičení</h3><input id="exerciseTitle" placeholder="Název cvičení"><div class="row" style="margin-top:10px"><button class="btn" onclick="saveExercise()">Uložit cvičení</button></div></div>
    <div id="exerciseList"></div>
  </div>
</section>

<section id="staff" class="page"><div class="card"><h2>RT</h2><p class="small">Realizační tým pro aktuální tým.</p><div class="row"><input id="staffName" placeholder="Jméno člena RT"><select id="staffRole"><option value="team_admin">Admin týmu</option><option value="coach">Trenér</option><option value="view">RT náhled</option></select><button class="btn" onclick="addStaff()">Přidat</button></div></div><div class="card"><div id="staffList"></div></div></section>
</main>

<nav>
<button id="nav-home" class="active" onclick="tab('home')">Home</button>
<button id="nav-calendar" onclick="tab('calendar')">Kalendář</button>
<button id="nav-team" onclick="tab('team')">Tým</button>
<button id="nav-attendance" onclick="tab('attendance')">Docházka</button>
<button id="nav-vault" onclick="tab('vault')">Trezor</button>
<button id="nav-staff" onclick="tab('staff')">RT</button>
</nav>`

const SUPABASE_URL = 'https://tkfhurvccztplhrmxlun.supabase.co'
const SUPABASE_KEY = 'sb_publishable_llvNkCG2IVoZPPxrKgwyDA_cri9RZ'
const db = createClient(SUPABASE_URL, SUPABASE_KEY)

let club=null, teams=[], currentTeam=null, players=[], trainings=[], blocksByTraining={}, attendance=[], folders=[], exercises=[], staff=[]
let viewDate=new Date(), selectedDate=null, activeFolder=null

window.tab=tab; window.toggleDetail=toggleDetail; window.moveMonth=moveMonth; window.selectDay=selectDay; window.addBlock=addBlock; window.saveTraining=saveTraining; window.deleteTraining=deleteTraining
window.addOne=addOne; window.importPlayers=importPlayers; window.removePlayer=removePlayer; window.copyCodes=copyCodes; window.setAttendance=setAttendance
window.toggleAddTeam=toggleAddTeam; window.addTeam=addTeam; window.selectTeam=selectTeam
window.addFolder=addFolder; window.openFolder=openFolder; window.closeFolder=closeFolder; window.saveExercise=saveExercise; window.deleteExercise=deleteExercise
window.addStaff=addStaff; window.deleteStaff=deleteStaff

function tab(id){document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));document.getElementById(id).classList.add('active');document.querySelectorAll('nav button').forEach(b=>b.classList.remove('active'));document.getElementById('nav-'+id).classList.add('active');render()}
function toggleDetail(){document.getElementById('homeDetail').classList.toggle('hidden')}
function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function pretty(s){return String(s||'').trim().replace(/\s+/g,' ')}
function iso(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function code4(){let c='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',s='';for(let i=0;i<4;i++)s+=c[Math.floor(Math.random()*c.length)];return s}
function label(v){return {yes:'Přijde',injury:'Zranění',work:'Práce/škola',other:'Ostatní',none:'Bez odpovědi'}[v||'none']}
function cls(v){return v==='yes'?'green':v==='injury'?'red':v==='work'?'yellow':'gray'}

async function init(){
  const {data:c}=await db.from('clubs').select('*').eq('name','TJ Město Zbiroh').single()
  club=c
  await loadTeams()
  currentTeam=teams[0]
  await reloadAll()
}
async function loadTeams(){
  const {data}=await db.from('teams').select('*').eq('club_id',club.id).order('created_at')
  teams=data||[]
  renderTeams()
}
async function reloadAll(){
  if(!currentTeam)return
  const [p,t,a,f,s] = await Promise.all([
    db.from('players').select('*').eq('team_id',currentTeam.id).order('name'),
    db.from('trainings').select('*').eq('team_id',currentTeam.id).order('training_date'),
    db.from('attendance').select('*'),
    db.from('vault_folders').select('*').eq('club_id',club.id).order('name'),
    db.from('staff').select('*').eq('team_id',currentTeam.id).order('name')
  ])
  players=p.data||[]; trainings=t.data||[]; attendance=(a.data||[]).filter(x=>players.some(p=>p.id===x.player_id)); folders=f.data||[]; staff=s.data||[]
  blocksByTraining={}
  if(trainings.length){
    const ids=trainings.map(x=>x.id)
    const {data:b}=await db.from('training_blocks').select('*').in('training_id',ids).order('position')
    ;(b||[]).forEach(x=>{if(!blocksByTraining[x.training_id])blocksByTraining[x.training_id]=[];blocksByTraining[x.training_id].push(x)})
  }
  if(folders.length){
    const ids=folders.map(x=>x.id)
    const {data:e}=await db.from('vault_exercises').select('*').in('folder_id',ids).order('title')
    exercises=e||[]
  } else exercises=[]
  render()
}
function render(){renderTeams();renderCal();renderPlayers();renderAttendance();renderSummary();renderHomeTraining();renderVault();renderStaff()}

function renderTeams(){
  const sel=document.getElementById('teamSelect'); if(!sel||!teams.length)return
  sel.innerHTML=teams.map(t=>`<option value="${t.id}" ${currentTeam&&currentTeam.id===t.id?'selected':''}>${esc(t.name)}</option>`).join('')
  document.getElementById('homeTeam').textContent=currentTeam?currentTeam.name:'Tým'
}
function selectTeam(id){currentTeam=teams.find(t=>t.id===id);reloadAll()}
function toggleAddTeam(){document.getElementById('addTeamBox').classList.toggle('hidden')}
async function addTeam(){
  let n=pretty(document.getElementById('newTeamName').value); if(!n)return
  let full=n.startsWith('TJ Město Zbiroh')?n:'TJ Město Zbiroh '+n
  await db.from('teams').insert({club_id:club.id,name:full})
  document.getElementById('newTeamName').value=''; document.getElementById('addTeamBox').classList.add('hidden')
  await loadTeams(); currentTeam=teams.find(t=>t.name===full)||teams[0]; await reloadAll()
}

function renderPlayers(){
  document.getElementById('playerCount').textContent=players.length
  if(!players.length){document.getElementById('playersTable').innerHTML='<p class=small>Zatím žádní hráči.</p>';return}
  let h='<table><tr><th>Hráč</th><th>Kód</th><th></th></tr>'
  players.forEach(p=>h+=`<tr><td>${esc(p.name)}</td><td><code>${esc(p.login_code)}</code></td><td><button class=danger onclick="removePlayer('${p.id}')">Smazat</button></td></tr>`)
  document.getElementById('playersTable').innerHTML=h+'</table>'
}
async function addOne(){let n=pretty(document.getElementById('onePlayer').value); if(!n)return; await db.from('players').insert({team_id:currentTeam.id,name:n,login_code:'ZBIROH25-'+code4()}); document.getElementById('onePlayer').value=''; await reloadAll()}
async function importPlayers(){let rows=document.getElementById('bulkPlayers').value.split(/\n+/).map(pretty).filter(Boolean),tc=document.getElementById('teamCode').value||'ZBIROH25'; if(!rows.length)return; await db.from('players').insert(rows.map(n=>({team_id:currentTeam.id,name:n,login_code:tc+'-'+code4()}))); document.getElementById('bulkPlayers').value=''; await reloadAll()}
async function removePlayer(id){await db.from('players').delete().eq('id',id); await reloadAll()}
function copyCodes(){let txt=players.map(p=>p.name+' | '+p.login_code).join('\n');document.getElementById('copyBox').textContent=txt;navigator.clipboard.writeText(txt)}

function renderAttendance(){
  if(!players.length){document.getElementById('attendanceList').innerHTML='<p class=small>Nejdřív vlož hráče.</p>';return}
  let h=''
  players.forEach(p=>{let a=attendance.find(x=>x.player_id===p.id),v=a?a.status:'none';h+=`<div class=player><div class=space><b>${esc(p.name)}</b><span class="pill ${cls(v)}">${label(v)}</span></div><div class=row style="margin-top:8px"><button class=btn2 onclick="setAttendance('${p.id}','yes')">✅ Přijde</button><button class=btn2 onclick="setAttendance('${p.id}','injury')">✚ Zranění</button><button class=btn2 onclick="setAttendance('${p.id}','work')">💼 Práce/škola</button><button class=btn2 onclick="setAttendance('${p.id}','other')">● Ostatní</button><button class=btn2 onclick="setAttendance('${p.id}','none')">○ Bez odpovědi</button></div></div>`})
  document.getElementById('attendanceList').innerHTML=h
}
async function setAttendance(playerId,status){
  let tr=nearestTraining(); if(!tr)return alert('Nejdřív vytvoř trénink.')
  await db.from('attendance').upsert({training_id:tr.id,player_id:playerId,status,updated_at:new Date().toISOString()},{onConflict:'training_id,player_id'})
  await reloadAll()
}
function renderSummary(){
  let s={yes:0,injury:0,work:0,other:0,none:0}
  players.forEach(p=>{let a=attendance.find(x=>x.player_id===p.id);s[(a&&a.status)||'none']++})
  let exc=s.injury+s.work+s.other
  ;[['sumYes',s.yes+' Přijde'],['sumInj',s.injury+' Zranění'],['sumWork',s.work+' Práce/škola'],['sumOther',s.other+' Ostatní'],['sumNone',s.none+' Bez odpovědi'],['hYes',s.yes+' přijde'],['hExc',exc+' omluveno'],['hNone',s.none+' bez reakce']].forEach(x=>{let e=document.getElementById(x[0]);if(e)e.textContent=x[1]})
}

function setEventType(type){ window.setEventTypeHard(type) }

function renderCal(){
  let grid=document.getElementById('cal'); grid.innerHTML=''
  let months=['leden','únor','březen','duben','květen','červen','červenec','srpen','září','říjen','listopad','prosinec']
  document.getElementById('monthTitle').textContent=months[viewDate.getMonth()]+' '+viewDate.getFullYear()
  ;['Po','Út','St','Čt','Pá','So','Ne'].forEach(d=>grid.innerHTML+='<div class=head>'+d+'</div>')
  let y=viewDate.getFullYear(),m=viewDate.getMonth(),first=new Date(y,m,1),start=(first.getDay()+6)%7,days=new Date(y,m+1,0).getDate(),today=iso(new Date())
  for(let i=0;i<start;i++)grid.innerHTML+='<div></div>'
  for(let d=1;d<=days;d++){let date=iso(new Date(y,m,d)),has=trainings.some(t=>t.training_date===date);grid.innerHTML+=`<button class="day ${has?'has':''} ${date===today?'today':''}" onclick="selectDay('${date}')">${d}${has?'<span class=dot></span>':''}</button>`}
}
function moveMonth(n){viewDate=new Date(viewDate.getFullYear(),viewDate.getMonth()+n,1);renderCal()}
function selectDay(date){selectedDate=date;document.getElementById('selTitle').textContent='Trénink '+date.split('-').reverse().join('.');document.getElementById('editor').classList.remove('hidden');let tr=trainings.find(t=>t.training_date===date)||{time_text:'',place:'',id:null};document.getElementById('trTime').value=tr.time_text||'';document.getElementById('trPlace').value=tr.place||'';renderBlocks(tr.id?blocksByTraining[tr.id]||[]:[{title:'Aktivace',minutes:'20'}])}
function renderBlocks(b){let box=document.getElementById('blocks');box.innerHTML='';b.forEach((x,i)=>box.innerHTML+=`<div class=block><div class=blockLine><input class=bn value="${esc(x.title||'')}" placeholder="Část tréninku" onkeydown="if(event.key==='Enter'){event.preventDefault();addBlock()}"><input class=bm value="${esc(x.minutes||'')}" placeholder="20´"><button class=danger onclick="removeBlock(${i})">×</button></div></div>`)}
function getBlocks(){let n=[...document.querySelectorAll('.bn')],m=[...document.querySelectorAll('.bm')];return n.map((x,i)=>({title:pretty(x.value),minutes:pretty(m[i].value),position:i})).filter(x=>x.title||x.minutes)}
function addBlock(){let b=getBlocks();b.push({title:'',minutes:''});renderBlocks(b)}
function removeBlock(i){let b=getBlocks();b.splice(i,1);renderBlocks(b.length?b:[{title:'',minutes:''}])}
async function saveTraining(){
  if(!selectedDate)return
  let old=trainings.find(t=>t.training_date===selectedDate)
  let payload={team_id:currentTeam.id,training_date:selectedDate,time_text:document.getElementById('trTime').value,place:document.getElementById('trPlace').value}
  let tr
  if(old){await db.from('trainings').update(payload).eq('id',old.id); tr=old}
  else {let {data}=await db.from('trainings').insert(payload).select().single(); tr=data}
  await db.from('training_blocks').delete().eq('training_id',tr.id)
  let b=getBlocks().map(x=>({...x,training_id:tr.id}))
  if(b.length)await db.from('training_blocks').insert(b)
  await reloadAll()
}
async function deleteTraining(){let old=trainings.find(t=>t.training_date===selectedDate);if(old)await db.from('trainings').delete().eq('id',old.id);selectedDate=null;document.getElementById('editor').classList.add('hidden');await reloadAll()}
function nearestTraining(){let today=iso(new Date());let list=trainings.filter(t=>(t.event_type||'training')==='training');return list.find(t=>t.training_date>=today)||list[list.length-1]}
function nearestMatch(){let today=iso(new Date());let list=trainings.filter(t=>t.event_type==='match');return list.find(t=>t.training_date>=today)||list[list.length-1]}
function renderHomeTraining(){let tr=nearestTraining(),info=document.getElementById('homeInfo'),box=document.getElementById('homeBlocks');if(!tr){info.textContent='Zatím není žádný trénink.';box.innerHTML='';return}info.textContent=tr.training_date.split('-').reverse().join('.')+' • '+(tr.time_text||'čas nezadán')+' • '+(tr.place||'místo nezadáno');box.innerHTML=(blocksByTraining[tr.id]||[]).map(b=>`<div class=block><div class=space><b>${esc(b.title)}</b><span class="pill blue">${esc(b.minutes)}´</span></div></div>`).join('')}

function renderVault(){let box=document.getElementById('folderList');if(!folders.length){box.innerHTML='<p class=small>Zatím žádné složky.</p>';return}box.innerHTML=folders.map(f=>`<div class=block><div class=space><b>📂 ${esc(f.name)}</b><button class=btn2 onclick="openFolder('${f.id}')">Otevřít</button></div></div>`).join('')}
async function addFolder(){let name=pretty(document.getElementById('folderName').value);if(!name)return;await db.from('vault_folders').insert({club_id:club.id,name});document.getElementById('folderName').value='';await reloadAll()}
function openFolder(id){activeFolder=folders.find(f=>f.id===id);document.getElementById('exerciseBox').classList.remove('hidden');renderExercises()}
function closeFolder(){activeFolder=null;document.getElementById('exerciseBox').classList.add('hidden')}
function renderExercises(){if(!activeFolder)return;document.getElementById('folderTitle').textContent='📂 '+activeFolder.name;let list=exercises.filter(e=>e.folder_id===activeFolder.id);document.getElementById('exerciseList').innerHTML=list.length?list.map(e=>`<div class=block><div class=space><b>⚽ ${esc(e.title)}</b><button class=danger onclick="deleteExercise('${e.id}')">Smazat</button></div></div>`).join(''):'<p class=small>Žádná cvičení.</p>'}
async function saveExercise(){if(!activeFolder)return;let title=pretty(document.getElementById('exerciseTitle').value);if(!title)return;await db.from('vault_exercises').insert({folder_id:activeFolder.id,title});document.getElementById('exerciseTitle').value='';await reloadAll();openFolder(activeFolder.id)}
async function deleteExercise(id){await db.from('vault_exercises').delete().eq('id',id);await reloadAll();if(activeFolder)openFolder(activeFolder.id)}

function renderStaff(){let box=document.getElementById('staffList');box.innerHTML=staff.length?'<table><tr><th>Jméno</th><th>Role</th><th></th></tr>'+staff.map(s=>`<tr><td>${esc(s.name)}</td><td>${esc(s.role)}</td><td><button class=danger onclick="deleteStaff('${s.id}')">Smazat</button></td></tr>`).join('')+'</table>':'<p class=small>Zatím nikdo v RT.</p>'}
async function addStaff(){let name=pretty(document.getElementById('staffName').value),role=document.getElementById('staffRole').value;if(!name)return;await db.from('staff').insert({club_id:club.id,team_id:currentTeam.id,name,role});document.getElementById('staffName').value='';await reloadAll()}
async function deleteStaff(id){await db.from('staff').delete().eq('id',id);await reloadAll()}

init()
