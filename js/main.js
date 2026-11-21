const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
// Ring of colored ticks (like the biomarker ring); it turns as you scroll.
const ring = document.getElementById('ring'), cols = ['#ff4a1c','#ffd08a','#2fe0b0','#a78bfa','#ffffff'];
let t = '';
for (let i = 0; i < 120; i++) {
  const a = i * 3 * Math.PI / 180, r1 = 150, r2 = r1 + 14 + (i * 37 % 26);
  t += `<line x1="${Math.cos(a)*r1}" y1="${Math.sin(a)*r1}" x2="${Math.cos(a)*r2}" y2="${Math.sin(a)*r2}" stroke="${cols[i % 5]}" stroke-width="2.5" stroke-linecap="round" opacity=".85"/>`;
}
ring.innerHTML = `<g id="rg">${t}</g>`;
// Tablet showcase: a bento dashboard whose screens change with the pill tabs.
const CAT = {imaging:'#ff4a1c', heart:'#2fe0b0', screening:'#ffd08a', workflow:'#a78bfa'};
const order = ['imaging','imaging','imaging','heart','heart','heart','screening','screening','screening','workflow'];
const seg = order.map(c => `<i style="background:${CAT[c]}"></i>`).join('');
let ticks = '';
for (let i = 0; i < 60; i++) { const a = i * 6 * Math.PI / 180, r2 = 62 + 10 + (i * 29 % 18);
  ticks += `<line x1="${Math.cos(a)*62}" y1="${Math.sin(a)*62}" x2="${Math.cos(a)*r2}" y2="${Math.sin(a)*r2}" stroke="${CAT[order[Math.floor(i/6)]]}" stroke-width="2.5" stroke-linecap="round"/>`; }
const legend = [['Imaging',3,'imaging'],['Heart',3,'heart'],['Screening',3,'screening'],['Assistant',1,'workflow']].map(([n,c,k]) => `<span><i style="background:${CAT[k]}"></i>${n} ${c}</span>`).join('');
const card = (cls, inner) => `<div class="bc ${cls}">${inner}</div>`;
const views = {
home: `<div class="bento">
${card('k s2',`<small>Clinical AI platforms</small><h4>10 platforms researched</h4><div class="seg">${seg}</div><div class="leg">${legend}</div>`)}
${card('o',`<small>Campus care pillars</small><b class="num">04</b><small>Clearance, fever, burnout and first aid</small>`)}
${card('w',`<small>Fever triage</small><svg viewBox="0 0 200 110" class="gauge"><path d="M20 100A80 80 0 0 1 180 100" fill="none" stroke="#e6e6e6" stroke-width="10" stroke-linecap="round"/><path d="M20 100A80 80 0 0 1 130 26" fill="none" stroke="#ff4a1c" stroke-width="10" stroke-linecap="round"/></svg><h4>38°C</h4><p>See the campus nurse right away if fever goes above this or lasts beyond 48 hours.</p>`)}
${card('k',`<small>24/7 digital triage info</small><h4>10 systems, 4 categories</h4><svg viewBox="-100 -100 200 200" class="ringm">${ticks}</svg>`)}
${card('w',`<small>Mandatory physician verification</small><div class="dr"><span>Dr</span>Licensed physician</div><p class="st">AI flags an urgent finding</p><p class="st">Physician reviews and confirms</p><p class="st">Student receives care</p>`)}
</div>`,
systems: `<div class="bento">
${card('k s2',`<small>Medical imaging</small><h4>3 systems</h4><p>Aidoc, Lunit, Gleamer</p>`)}${card('o',`<small>Heart &amp; vitals</small><h4>3 systems</h4><p>Eko SENSORA, Heartflow, Ultromics EchoGo</p>`)}
${card('w',`<small>Early screening</small><h4>3 systems</h4><p>LumineticsCore, Skin Analytics DERM, Ibex</p>`)}${card('k s2',`<small>Clinical assistant</small><h4>1 system</h4><p>Abridge turns doctor-patient conversations into structured notes.</p><a class="lnk" href="#ai-tools">Explore all 10 systems →</a>`)}</div>`,
guides: `<div class="bento">
${card('o s2',`<small>01</small><h4>Medical &amp; dental clearance</h4><p>Student ID, health record form, chest X-ray, CBC.</p>`)}${card('k',`<small>02</small><h4>Fever &amp; colds</h4><p>Rest, fluids. Nurse if above 38°C or beyond 48 hours.</p>`)}
${card('w',`<small>03</small><h4>Burnout &amp; eye strain</h4><p>20-20-20 rule, regular sleep, guidance counseling.</p>`)}${card('w s2',`<small>04</small><h4>First aid &amp; minor injuries</h4><p>Rinse with clean running water, then visit the Campus Health Services Office for free antiseptic and sterile dressing.</p>`)}</div>`,
safety: `<div class="bento">
${card('k s2',`<small>Non-diagnostic notice</small><h4>General health literacy only</h4><p>LAMBING does not replace professional medical advice.</p>`)}${card('o',`<small>Mandatory physician verification</small><h4>Doctors confirm every AI result</h4>`)}
${card('w',`<small>Clinical speed</small><h4>Earlier triage</h4><p>Urgent cases found sooner.</p>`)}${card('w s2',`<small>Human connection</small><h4>Less paperwork</h4><p>Doctors spend more time at the bedside.</p>`)}</div>`,
desk: `<div class="bento">
${card('k s2',`<small>Operating hours</small><h4>Mon – Fri</h4><p>8:00 AM – 5:00 PM</p>`)}${card('o',`<small>Location</small><h4>Ground Floor</h4><p>Student Wellness Building</p>`)}
${card('w',`<small>Emergency line</small><h4>(043) 425-0139</h4><p>Campus Health Services</p>`)}${card('k s2',`<small>Student inquiry form</small><h4>Send a question or concern</h4><a class="lnk" href="#contact">Open the form →</a>`)}</div>`
};
const tabs = [['home','Home','M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z'],['systems','AI systems','M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z'],['guides','Care guides','M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm-1 13l-4-4 1.4-1.4L11 13.2l4.6-4.6L17 10z'],['safety','Safety','M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z'],['desk','Clinic desk','M5 4h14v16H5zM8 8h8M8 12h8M8 16h5']];
const panel = document.getElementById('panel'), bar = document.querySelector('.pills');
bar.innerHTML = tabs.map(([k,n,d]) => `<button role="tab" data-t="${k}" aria-selected="false"><svg width="16" height="16" viewBox="0 0 24 24" fill="${k==='desk'||k==='systems'?'none':'currentColor'}" stroke="currentColor" stroke-width="2"><path d="${d}"/></svg>${n}</button>`).join('');
const pills = [...bar.children];
function showView(k){ panel.innerHTML = views[k]; panel.style.animation = 'none'; void panel.offsetWidth; panel.style.animation = ''; pills.forEach(b => b.setAttribute('aria-selected', b.dataset.t === k)); }
let idx = 0, auto = !still, seen = false;
pills.forEach((b, i) => b.addEventListener('click', () => { auto = false; idx = i; showView(b.dataset.t); }));
showView('home');
// While the tablet is on screen it steps through the tabs, until the visitor clicks one.
new IntersectionObserver(e => { seen = e[0].isIntersecting; }, {threshold: .5}).observe(document.getElementById('tablet'));
setInterval(() => { if (auto && seen) { idx = (idx + 1) % tabs.length; showView(tabs[idx][0]); } }, 4200);
// Scroll effects: ring rotation and the cards that fly in around "AI Health Hub".
const fly = document.querySelector('.fly'), rg = document.getElementById('rg');
function onScroll(){
  if (still) return;
  rg.setAttribute('transform', `rotate(${scrollY * .08})`);
  const box = fly.getBoundingClientRect(), p = Math.min(1, Math.max(0, -box.top / (box.height - innerHeight) * 1.6));
  fly.style.setProperty('--p', p);
}
addEventListener('scroll', onScroll, {passive:true}); onScroll();
// Guides slider arrows.
const sl = document.getElementById('slider');
document.getElementById('prev').onclick = () => sl.scrollBy({left: -sl.clientWidth * .6, behavior: 'smooth'});
document.getElementById('next').onclick = () => sl.scrollBy({left: sl.clientWidth * .6, behavior: 'smooth'});
// Glowing curve draws when it appears on screen.
const curve = document.getElementById('curve');
curve.style.setProperty('--len', curve.getTotalLength());
new IntersectionObserver((e, o) => { if (e[0].isIntersecting) { curve.classList.add('on'); o.disconnect(); } }, {threshold: .4}).observe(curve);
// Tablet follows the cursor: it tilts toward the pointer and a soft glare slides across the glass.
const tb = document.getElementById('tablet'), sc = tb.closest('.show');
let tx = 0, ty = 0, cx = 0, cy = 0, run = false;
function follow(){
  cx += (tx - cx) * .08; cy += (ty - cy) * .08;
  tb.style.transform = `perspective(1200px) rotateY(${cx * 14}deg) rotateX(${-cy * 10}deg) translate3d(${cx * 14}px,${cy * 10}px,0)`;
  tb.style.setProperty('--sx', (50 + cx * 60) + '%'); tb.style.setProperty('--lx', cx * 260 + 'px');
  sc.style.setProperty('--bx', cx); sc.style.setProperty('--by', cy);
  if (Math.abs(tx - cx) + Math.abs(ty - cy) > .001) requestAnimationFrame(follow); else run = false;
}
function kick(){ if (!run) { run = true; requestAnimationFrame(follow); } }
if (!still) {
  sc.addEventListener('pointermove', e => { if (e.pointerType === 'touch') return; const r = sc.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width - .5; ty = (e.clientY - r.top) / r.height - .5; kick(); });
  sc.addEventListener('pointerleave', () => { tx = 0; ty = 0; kick(); });
}
// How it works: each screen has a legend (dots + label) and a colored bar that fills in.
const dots = (n, c) => Array(n).fill(`<i style="background:${c}"></i>`).join('');
const screen = (legs, segs) => `<div class="legs">${legs.map(([n,c,t]) => `<div class="lg"><span class="dots">${dots(n,c)}</span><small>${t}</small></div>`).join('')}</div><div class="bar">${segs.map(([f,c],i) => `<i style="flex:${f};background:${c};--i:${i}"></i>`).join('')}</div>`;
const O = '#ff4a1c', Y = '#ffd08a', G = '#2fe0b0', P = '#a78bfa';
const steps = {
  1: screen([[1,O,'Student ID'],[1,G,'Health record form'],[1,Y,'Chest X-ray'],[1,P,'CBC results']], [[1,O],[1,G],[1,Y],[1,P]]),
  2: screen([[3,CAT.imaging,'Medical imaging · 3'],[3,CAT.heart,'Heart & vitals · 3'],[3,CAT.screening,'Early screening · 3'],[1,CAT.workflow,'Clinical assistant · 1']], order.map(c => [1, CAT[c]])),
  3: screen([[1,O,'AI flags an urgent finding'],[1,Y,'Physician reviews and confirms'],[1,G,'Student receives care']], [[1,O],[1.4,Y],[1,G]]),
  4: screen([[1,O,'Mon – Fri, 8:00 AM – 5:00 PM'],[1,G,'Ground Floor, Student Wellness Building'],[1,Y,'Emergency (043) 425-0139']], [[1,O],[1,O],[1,O],[1,O],[1,O],[1,'#333'],[1,'#333']])
};
document.querySelectorAll('.scr').forEach(el => el.innerHTML = steps[el.dataset.s]);
// Lines grow and screens rise when they scroll into view.
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } }), {threshold: .35});
document.querySelectorAll('.vl, .scr, .pic').forEach(el => io.observe(el));
