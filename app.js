(() => {
  const $ = (s) => document.querySelector(s);
  const DAY_NAMES = ["日","月","火","水","木","金","土"];
  const categoryName = (id) => ({burn:"燃やすごみ",resource:"資源",other:"陶器・ガラス・金属ごみ",special:"粗大ごみ等",unknown:"要確認"}[id] || id);
  const categoryColor = (id) => ({burn:"burn",resource:"resource",other:"other",special:"special",unknown:"special"}[id] || "special");
  const officialFor = (item) => APP_DATA.official[item.source] || APP_DATA.official.items;
  const pad = n => String(n).padStart(2,"0");
  const dateKey = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const dateLabel = d => `${d.getMonth()+1}月${d.getDate()}日（${DAY_NAMES[d.getDay()]}）`;
  const startOfDay = d => new Date(d.getFullYear(),d.getMonth(),d.getDate());
  const nthWeek = d => Math.floor((d.getDate()-1)/7)+1;
  const isCollection = (d, rule) => {
    const key = dateKey(d);
    if (Object.prototype.hasOwnProperty.call(APP_DATA.specialDates,key)) return APP_DATA.specialDates[key].includes(rule.id);
    if (rule.weekdays && rule.weekdays.includes(d.getDay())) return true;
    return (rule.nthWeekdays || []).some(x => x.weekday === d.getDay() && x.weeks.includes(nthWeek(d)));
  };
  const pickups = d => APP_DATA.schedule.filter(r => isCollection(d,r));
  const nextPickups = (from, count=3) => {
    const out=[]; const cursor=startOfDay(from);
    for(let i=0;i<370 && out.length<count;i++){
      const d=new Date(cursor); d.setDate(cursor.getDate()+i);
      const p=pickups(d);
      if(p.length) out.push({date:d,items:p});
    }
    return out;
  };
  const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  function showScreen(id){
    document.querySelectorAll(".screen").forEach(el=>el.classList.toggle("active",el.id===id));
    document.querySelectorAll("[data-screen]").forEach(el=>el.classList.toggle("active",el.dataset.screen===id));
    if(id==="calendar") renderCalendar();
    if(id==="home") renderHome();
    window.scrollTo({top:0,behavior:"smooth"});
  }
  document.querySelectorAll("[data-screen]").forEach(el=>el.addEventListener("click",()=>showScreen(el.dataset.screen)));

  function renderHome(){
    const now=new Date(), today=startOfDay(now), todays=pickups(today);
    $("#today-date").textContent=`${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日（${DAY_NAMES[now.getDay()]}）`;
    $("#today-title").textContent=todays.length ? "今日はごみ出しの日！" : "今日は収集なし";
    $("#today-items").innerHTML=todays.map(x=>`<span class="chip"><i class="mini-dot ${x.color}"></i>${escapeHtml(x.name)}</span>`).join("");
    $("#today-note").textContent=todays.length ? "朝8時までに出してください。特別日程の有無も確認を。" : "次の収集日をチェックして、出し忘れを防ごう。";
    const upcoming=nextPickups(new Date(today.getTime()+86400000),3);
    $("#next-list").innerHTML=upcoming.map(({date,items})=>`<article class="next-card"><div class="next-date">${DAY_NAMES[date.getDay()]}曜日<strong>${date.getDate()}</strong>${date.getMonth()+1}月</div><div class="next-info"><b>${items.map(x=>`<span class="mini-dot ${x.color}"></span>${escapeHtml(x.name)}`).join("<br>")}</b><small>${dateLabel(date)}</small></div></article>`).join("") || '<p class="muted">予定を計算できませんでした。</p>';
  }

  let shownMonth = new Date(), selectedDate = startOfDay(new Date());
  function renderCalendar(){
    const y=shownMonth.getFullYear(), m=shownMonth.getMonth();
    $("#month-label").textContent=`${y}年${m+1}月`;
    const grid=$("#calendar-grid"); grid.innerHTML="";
    DAY_NAMES.forEach((d,i)=>{const el=document.createElement("div");el.className="weekday";el.textContent=d;grid.appendChild(el);});
    const first=new Date(y,m,1).getDay(), last=new Date(y,m+1,0).getDate();
    for(let i=0;i<first;i++){const e=document.createElement("div");e.className="day-cell empty";grid.appendChild(e);}
    for(let day=1;day<=last;day++){
      const d=new Date(y,m,day), p=pickups(d), key=dateKey(d), el=document.createElement("button");
      el.className="day-cell"+(key===dateKey(new Date())?" today":"")+(key===dateKey(selectedDate)?" selected":"");
      el.setAttribute("aria-label",`${dateLabel(d)} ${p.map(x=>x.name).join("、")||"収集なし"}`);
      el.innerHTML=`<span class="day-number">${day}</span><span class="day-tags">${p.map(x=>`<span class="day-tag ${x.color}">${escapeHtml(x.name.replace("ごみ",""))}</span>`).join("")}</span>`;
      el.addEventListener("click",()=>{selectedDate=d;renderCalendar();renderSelectedDay(d);});
      grid.appendChild(el);
    }
    renderSelectedDay(selectedDate);
  }
  function renderSelectedDay(d){
    const p=pickups(d), area=$("#selected-day");
    area.innerHTML=`<h3>${escapeHtml(dateLabel(d))}</h3>`+(p.length?p.map(x=>`<p><span class="mini-dot ${x.color}"></span><b>${escapeHtml(x.name)}</b></p>`).join(""):'<p>この日は通常の収集予定はありません。</p>')+`<p class="muted">通常曜日の表示です。特別日程は公式情報をご確認ください。</p>`;
  }
  $("#prev-month").addEventListener("click",()=>{shownMonth=new Date(shownMonth.getFullYear(),shownMonth.getMonth()-1,1);renderCalendar();});
  $("#next-month").addEventListener("click",()=>{shownMonth=new Date(shownMonth.getFullYear(),shownMonth.getMonth()+1,1);renderCalendar();});

  function normalize(s){return s.toLowerCase().normalize("NFKC").replace(/[ 　・･\-ー]/g,"");}
  function nextDateForCategory(category){
    const rule=APP_DATA.schedule.find(r=>r.id===category); if(!rule)return null;
    const dates=nextPickups(new Date(),10);
    for(const entry of dates){if(entry.items.some(x=>x.id===category))return entry.date;}
    return null;
  }
  function resultCard(item){
    const category=item.category, next=nextDateForCategory(category);
    const categoryLabel=category==="unknown"?"公式情報で要確認":categoryName(category);
    const dateText=next?`次回の通常収集予定：${dateLabel(next)}`:"通常収集日をこの品目からは特定できません。";
    return `<article class="result-card"><h3>${escapeHtml(item.name)}</h3><span class="category-label ${categoryColor(category)}">${escapeHtml(categoryLabel)}</span><p><b>${escapeHtml(dateText)}</b></p><p>${escapeHtml(item.note||"詳しい出し方は公式情報を確認してください。")}</p><p class="muted">分別情報の参照先：品川区公式サイト</p><a href="${officialFor(item)}" target="_blank" rel="noopener">公式情報で詳しく確認 ↗</a></article>`;
  }
  function searchItems(value){
    const q=normalize(value), out=$("#search-results");
    if(!q){out.innerHTML='<p class="muted">品名を入力するか、検索例をタップしてください。</p>';return;}
    const matches=APP_DATA.items.filter(item=>[item.name,...(item.aliases||[])].some(n=>normalize(n).includes(q)||q.includes(normalize(n))));
    if(matches.length){out.innerHTML=matches.map(resultCard).join("");}
    else out.innerHTML=`<article class="result-card"><h3>「${escapeHtml(value)}」は登録データで確認できません</h3><p>分別区分を推測していません。品川区の公式品目一覧で確認してください。</p><a href="${APP_DATA.official.items}" target="_blank" rel="noopener">品目一覧を開く ↗</a></article>`;
  }
  $("#search-input").addEventListener("input",e=>searchItems(e.target.value));
  $("#clear-search").addEventListener("click",()=>{$("#search-input").value="";searchItems("");$("#search-input").focus();});
  $("#shortcuts").innerHTML=APP_DATA.shortcuts.map(s=>`<button class="shortcut" data-query="${escapeHtml(s)}">${escapeHtml(s)}</button>`).join("");
  $("#shortcuts").addEventListener("click",e=>{const b=e.target.closest("[data-query]");if(!b)return;$("#search-input").value=b.dataset.query;searchItems(b.dataset.query);});

  // PWA service worker is available only on HTTPS or localhost.
  if("serviceWorker" in navigator && (location.protocol==="https:" || location.hostname==="localhost")){
    window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));
  }
  renderHome();
})();