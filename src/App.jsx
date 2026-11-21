import React, {useState} from 'react';
import {flushSync} from 'react-dom';
import site from './content.js';
import {Count, Cycle, Marquee, Stats, Words} from './Flow.jsx';
import {findings, hhmm} from './data.js';
import {correlate} from './engine.js';
import {ACROSS, SERVICES, STAGES, WHY} from './aws.js';
import {PROGRESS} from './forms.js';
import {vt} from './fx.js';
import Console from './Console.jsx';
import PilotForm from './PilotForm.jsx';
import ContactForm from './ContactForm.jsx';

export function Logo({size = 30}) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <rect width="40" height="40" rx="9" fill="#11112b" />
      <g stroke="#5ef2ff" strokeWidth="1.6" opacity=".55"><path d="M10 12L20 20L30 11M10 12L12 29L20 20L29 29L30 11" fill="none" /></g>
      <circle cx="20" cy="20" r="4.2" fill="#9b7bff" /><circle cx="10" cy="12" r="2.4" fill="#5ef2ff" /><circle cx="30" cy="11" r="2.4" fill="#5ef2ff" /><circle cx="12" cy="29" r="2.4" fill="#5ef2ff" /><circle cx="29" cy="29" r="2.4" fill="#5ef2ff" />
    </svg>
  );
}

const INC = correlate(findings);
const P1 = INC.filter((i) => i.p === 'P1').length;

function Header() {
  const [open, setOpen] = useState(false);
  const links = [['Signal', '/#signal'], ['Capabilities', '/#capabilities'], ['Priority', '/#priority'], ['Pricing', '/#pricing'], ['Technology', '/#technology'], ['Contact', '/#contact']];
  return (
    <header className="hd">
      <a href="/" className="brand" aria-label="SecureMesh home"><Logo /><span>SecureMesh</span></a>
      <nav id="nav" className={open ? 'nav open' : 'nav'} aria-label="Main">
        {links.map(([t, h]) => <a key={t} href={h} onClick={() => setOpen(false)}>{t}</a>)}
        <a className="nav-app" href="/app" onClick={() => setOpen(false)}>Open the triage console</a>
      </nav>
      <a className="hd-cta" href="#demo" data-magnetic data-cursor="Demo">Request a demo</a>
      <button className="menu" aria-expanded={open} aria-controls="nav" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button>
    </header>
  );
}

// Node positions for the hero mesh (viewBox 0 0 520 440)
const NODES = [[80, 90], [210, 50], [360, 80], [470, 170], [420, 320], [280, 390], [120, 340], [40, 220], [260, 220], [170, 200], [350, 230], [250, 300]];
const EDGES = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0], [0, 9], [1, 8], [2, 10], [3, 10], [4, 10], [5, 11], [6, 11], [7, 9], [8, 9], [8, 10], [8, 11], [9, 11], [10, 11]];
const HOT = [8, 10, 2];

function Mesh() {
  return (
    <svg className="mesh" viewBox="0 0 520 440" role="img" aria-label="A mesh of monitored assets; signals travel between them and converge on one incident">
      <defs>
        <radialGradient id="smglow"><stop offset="0" stopColor="#9b7bff" stopOpacity=".55" /><stop offset="1" stopColor="#9b7bff" stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx="260" cy="220" r="150" fill="url(#smglow)" className="mesh-glow" />
      <g className="mesh-edges">{EDGES.map(([a, b], i) => <line key={i} x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]} style={{'--i': i}} />)}</g>
      <g className="mesh-pulses">{EDGES.filter((_, i) => i % 2 === 0).map(([a, b], i) => <circle key={i} r="2.6" style={{'--i': i, offsetPath: `path('M${NODES[a][0]} ${NODES[a][1]}L${NODES[b][0]} ${NODES[b][1]}')`}} />)}</g>
      <g className="mesh-nodes">{NODES.map(([x, y], i) => <g key={i} className={HOT.includes(i) ? 'hot' : ''} style={{'--i': i}}><circle cx={x} cy={y} r={HOT.includes(i) ? 7 : 4.5} />{HOT.includes(i) && <circle className="ring" cx={x} cy={y} r="7" />}</g>)}</g>
      <g className="mesh-lock"><path d="M236 196h-10v-10M284 196h10v-10M236 244h-10v10M284 244h10v10" /></g>
    </svg>
  );
}

function Split({text, as: Tag = 'h1', className = ''}) {
  return <Tag className={`split ${className}`} data-r>{text.split(' ').map((w, i) => <React.Fragment key={i}><span className="w" style={{'--i': i}}><span>{w}</span></span>{' '}</React.Fragment>)}</Tag>;
}

const CYCLE = ["enterprise IT teams", "SaaS companies", "managed security providers"];
const MQ = ["Enterprise IT", "SaaS security teams", "Managed security providers", "Amazon GuardDuty", "AWS Security Hub", "Amazon CloudWatch", "Correlation", "Transparent priority", "Evidence summaries", "Case management", "Audit reporting", "Read-only by design"];

function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="kicker" data-r><span className="dot" aria-hidden="true" /> Defensive monitoring · read-only · analyst-reviewed</p>
        <Split text="Security alerts that deserve attention." />
        <p className="lede" data-r style={{'--d': '200ms'}}>SecureMesh is a proposed platform that consolidates authorised security findings, correlates them into incidents and drafts evidence-based summaries — so analysts spend their time on what matters, and decide every response.</p>
        <p className="fcy" data-r style={{'--d': '200ms'}}><Cycle lead="Built for" items={CYCLE} /></p>
        <div className="cta" data-r style={{'--d': '300ms'}}><a className="btn" href="#demo" data-magnetic data-cursor="Demo">Request a demo</a><a className="btn ghost" href="/app" data-cursor="Open">Try the triage console</a></div>
        <dl className="hero-stats" data-r style={{'--d': '400ms'}}>
          <div><dt>Findings in</dt><dd><Count to={findings.length} /></dd></div>
          <div><dt>Incidents out</dt><dd><Count to={INC.length} /></dd></div>
          <div><dt>Need attention now</dt><dd className="hot"><Count to={P1} /></dd></div>
        </dl>
        <p className="fine">Sample day from the prototype, synthetic data.</p>
      </div>
      <div className="hero-vis frame" data-r data-tilt>
        <span className="fr-label">mesh · 12 assets · 24h</span>
        <Mesh />
      </div>
    </section>
  );
}

function Signal() {
  const [mode, setMode] = useState('raw');
  const set = (m) => vt(() => flushSync(() => setMode(m)));
  return (
    <section className="sec" id="signal" aria-labelledby="sig-title">
      <div className="sec-head"><p className="tag">// from noise to signal</p><h2 id="sig-title">Sixteen alerts. Eight incidents. Two that can’t wait.</h2>
        <p className="intro">Findings from different tools describe the same event. SecureMesh groups them by shared resource, identity and time, removes duplicates and ranks what is left — each step shown, nothing hidden.</p></div>
      <div className="seg" role="tablist" aria-label="View">
        <button role="tab" aria-selected={mode === 'raw'} className={mode === 'raw' ? 'on' : ''} onClick={() => set('raw')}>Raw findings · {findings.length}</button>
        <button role="tab" aria-selected={mode === 'inc'} className={mode === 'inc' ? 'on' : ''} onClick={() => set('inc')}>Correlated incidents · {INC.length}</button>
      </div>
      <div className="frame stream">
        <span className="fr-label">{mode === 'raw' ? 'stream · unsorted · as received' : 'incidents · ranked by priority'}</span>
        {mode === 'raw' ? (
          <ol className="raw">{findings.map((f) => <li key={f.id} style={{viewTransitionName: `f-${f.id}`}}><time>{hhmm(f.t)}</time><span className={`src s-${f.source.replace(/\s/g, '').toLowerCase()}`}>{f.source}</span><b>{f.type}</b><code>{f.resource}</code></li>)}</ol>
        ) : (
          <ol className="incs">{INC.map((inc) => <li key={inc.id} className={`p-${inc.p}`}><div className="inc-h"><span className="pill">{inc.p}</span><b>{inc.types[0]}{inc.types.length > 1 ? ` + ${inc.types.length - 1} related` : ''}</b><span className="score">{inc.score}</span></div>
            <ul>{inc.findings.map((f) => <li key={f.id} style={{viewTransitionName: `f-${f.id}`}}><time>{hhmm(f.t)}</time><span className={`src s-${f.source.replace(/\s/g, '').toLowerCase()}`}>{f.source}</span>{f.type}</li>)}</ul></li>)}</ol>
        )}
      </div>
    </section>
  );
}

const FEATURES = [
  ['0x01', 'Security event aggregation', 'Read-only ingestion of authorised findings from GuardDuty, Security Hub and CloudWatch into one normalised stream.'],
  ['0x02', 'Defensive anomaly detection', 'Flags behaviour that departs from each identity’s and asset’s baseline — new networks, sudden request spikes, unusual logins.'],
  ['0x03', 'Alert classification & prioritisation', 'Correlates related findings and ranks incidents P1–P4 from severity, asset criticality, corroboration and confidence.'],
  ['0x04', 'Evidence-based incident summaries', 'A plain-language timeline built only from the findings, with sources — drafted for an analyst to review, never sent on its own.'],
  ['0x05', 'Security monitoring dashboards', 'Open incidents by priority, source and asset; time to acknowledge; what was marked benign and why.'],
  ['0x06', 'Incident case management', 'Analysts open cases, add notes, move them through investigating, contained and closed, with a closing summary.'],
  ['0x07', 'Audit reporting & access controls', 'Analyst, lead, CISO and auditor roles; every decision logged with who and why; exportable reports.'],
];

function Capabilities() {
  return (
    <section className="sec" id="capabilities" aria-labelledby="cap-title">
      <div className="sec-head"><p className="tag">// capabilities</p><h2 id="cap-title">Everything an analyst needs to triage, nothing that acts without them.</h2></div>
      <div className="caps">{FEATURES.map(([n, t, d], i) => <article key={n} className="frame cap" data-r data-spot style={{'--d': `${(i % 3) * 70}ms`}}><span className="hex">{n}</span><h3>{t}</h3><p>{d}</p></article>)}
        <article className="frame cap diff" data-r data-spot><span className="hex">core</span><h3>The differentiator</h3><p>AI-assisted alert triage that combines event context with analyst-reviewed incident summaries. The machine does the gathering; people do the judging.</p></article>
      </div>
    </section>
  );
}

const pLevel = (s) => (s >= 60 ? 'P1' : s >= 35 ? 'P2' : s >= 15 ? 'P3' : 'P4');
function Priority() {
  const [v, setV] = useState({sev: 7, crit: 3, types: 3, conf: 80});
  const corr = 1 + 0.25 * (v.types - 1);
  const score = Math.min(100, Math.round((v.sev / 10) * (v.crit / 3) * corr * (v.conf / 100) * 100));
  const p = pLevel(score);
  const ctl = [['sev', 'Highest severity', 0, 10, 0.5, (x) => x.toFixed(1)], ['crit', 'Asset criticality', 1, 3, 1, (x) => ['', 'Low', 'Medium', 'Critical'][x]], ['types', 'Distinct corroborating signals', 1, 5, 1, (x) => x], ['conf', 'Average confidence', 10, 100, 5, (x) => `${x}%`]];
  return (
    <section className="sec" id="priority" aria-labelledby="pri-title">
      <div className="pri">
        <div><p className="tag">// transparent priority</p><h2 id="pri-title">A score you can argue with.</h2>
          <p className="intro">No black box. Every incident shows exactly why it ranks where it does. Move the inputs and watch the priority change — it’s the same formula the triage console uses.</p>
          <pre className="formula" aria-label="Priority formula">score = severity/10 × criticality/3{'\n'}      × (1 + 0.25 × (signals − 1)){'\n'}      × confidence</pre></div>
        <div className="frame pri-box" data-r>
          <span className="fr-label">priority calculator</span>
          {ctl.map(([k, l, min, max, step, fmt]) => <label key={k} className="rng"><span>{l}<b>{fmt(v[k])}</b></span><input type="range" min={min} max={max} step={step} value={v[k]} onChange={(e) => setV({...v, [k]: Number(e.target.value)})} /></label>)}
          <div className={`pri-out p-${p}`} aria-live="polite"><span className="pill big">{p}</span><div className="gauge"><i style={{width: `${score}%`}} /></div><b>{score}</b></div>
          <p className="fine">P1 ≥ 60 · P2 ≥ 35 · P3 ≥ 15 · otherwise P4. Thresholds are configurable per team.</p>
        </div>
      </div>
    </section>
  );
}

function Boundaries() {
  return (
    <section className="band" aria-labelledby="bd-title">
      <div className="band-in">
        <h2 id="bd-title" data-r>Defensive by design.</h2>
        <ul className="bd">{[['Read-only', 'SecureMesh reads findings from sources you authorise. It never changes your infrastructure.'], ['No automated response', 'No blocking, quarantining or account changes. Analysts decide and act in their own tools.'], ['Drafts, not verdicts', 'Summaries are built from the findings and labelled as drafts until an analyst reviews them.'], ['Every decision explained', 'Marking an incident benign or closing a case needs a written reason, kept for audit.']].map(([t, d], i) => <li key={t} data-r style={{'--d': `${i * 80}ms`}}><b>{t}</b><span>{d}</span></li>)}</ul>
      </div>
    </section>
  );
}

function Who() {
  return (
    <section className="sec" aria-labelledby="who-title">
      <div className="sec-head"><p className="tag">// built for</p><h2 id="who-title">Teams who watch production for a living.</h2></div>
      <div className="who">{[['Enterprise IT departments', 'One queue across accounts and tools, with priorities leadership can follow.', 'IT'], ['SaaS companies', 'Small security teams covering fast-changing cloud estates without drowning in alerts.', 'SaaS'], ['Managed security providers', 'Many customer environments, consistent triage and audit-ready reporting for each.', 'MSSP']].map(([t, d, k]) => <article key={t} className="frame" data-r data-tilt data-spot><span className="who-k">{k}</span><h3>{t}</h3><p>{d}</p></article>)}</div>
      <p className="decision"><span>Decision-makers</span> CISOs · security analysts · IT infrastructure managers</p>
    </section>
  );
}

function Pricing() {
  const [envs, setEnvs] = useState(3);
  const [gb, setGb] = useState(20);
  const base = envs * 240; const extra = Math.max(0, gb - envs * 5) * 6; const total = base + extra;
  return (
    <section className="sec" id="pricing" aria-labelledby="pr-title">
      <div className="pri">
        <div><p className="tag">// business model</p><h2 id="pr-title">Priced by environments and data volume.</h2><p className="intro">Subscriptions based on the number of monitored environments, with 5 GB/day of findings and logs included per environment and usage beyond that billed by volume. Illustrative pricing for a proposed product.</p></div>
        <div className="frame pri-box" data-r data-spot>
          <span className="fr-label">estimate</span>
          <label className="rng"><span>Monitored environments<b>{envs}</b></span><input type="range" min="1" max="20" value={envs} onChange={(e) => setEnvs(Number(e.target.value))} /></label>
          <label className="rng"><span>Security data per day<b>{gb} GB</b></span><input type="range" min="1" max="200" value={gb} onChange={(e) => setGb(Number(e.target.value))} /></label>
          <p className="price"><b>${total.toLocaleString()}</b><span>/ month · ${base.toLocaleString()} for environments{extra ? ` + $${extra.toLocaleString()} for ${gb - envs * 5} GB/day over the included volume` : ' · within included volume'}</span></p>
          <a className="btn" href="#demo" data-magnetic>Request a demo</a>
        </div>
      </div>
    </section>
  );
}

function Technology() {
  return (
    <section className="sec" id="technology" aria-labelledby="tech-title">
      <div className="sec-head"><p className="tag">// planned AWS infrastructure</p><h2 id="tech-title">How we use Amazon Web Services.</h2><p className="intro">{WHY}</p></div>
      <ol className="pipe">{STAGES.map(([t, svcs, d], i) => <li key={t} className="frame" data-r style={{'--d': `${i * 80}ms`}}><span className="n">{String(i + 1).padStart(2, '0')}</span><h3>{t}</h3><p className="svcs">{svcs.map((s) => <span key={s}>{s}</span>)}</p><p>{d}</p></li>)}</ol>
      <div className="across" data-r><p className="tag">// across every stage</p><ul>{ACROSS.map(([a, b]) => <li key={a}><b>{a}</b> {b}</li>)}</ul></div>
      <h3 className="sub">Services and their role in SecureMesh</h3>
      <dl className="svc">{SERVICES.map(([a, b]) => <div key={a}><dt>{a}</dt><dd>{b}</dd></div>)}</dl>
      <div className="activate frame" data-r><span className="fr-label">AWS Activate · company description</span><p>SecureMesh is a proposed defensive cybersecurity monitoring platform for enterprise technology teams, SaaS businesses and managed security service providers. The planned application will consolidate authorised security findings, prioritise alerts and generate evidence-based investigation summaries for analyst review. We plan to use Amazon GuardDuty, AWS Security Hub and Amazon CloudWatch as sources of security and operational findings, alongside Amazon Bedrock for summarisation. Amazon S3 and AWS Lambda will support protected record storage and processing. Security professionals will evaluate findings and determine incident response actions.</p></div>
      <p className="fine">Planned, not yet deployed. This website and the triage console run in your browser on synthetic data.</p>
    </section>
  );
}

function Team() {
  return <section className="sec" id="team" aria-labelledby="team-title"><div className="team-head"><p className="tag">// founding team</p><h2 id="team-title">The people building {site.name}.</h2></div><div className="team-list">{site.team.map((p, i) => (<div key={p.name} style={{'--d': `${i * 90}ms`}} className="team frame" data-r><span className="av" aria-hidden="true">{p.initials}</span><div><p className="tag">// {p.role.toLowerCase()}</p><h3 className="tname">{p.name}</h3><p>{p.bio}</p><ul className="tags">{p.focus.map((f) => <li key={f}>{f}</li>)}</ul></div></div>))}</div></section>;
}

function Demo() {
  return (
    <section className="sec" id="demo" aria-labelledby="demo-title">
      <div className="pri top">
        <div><p className="tag">// progress & demos</p><h2 id="demo-title">See your alert queue get quieter.</h2><p className="intro">SecureMesh is a proposed product in its building stage. A demo walks through the review workflow: findings in, incidents ranked, a summary drafted and an analyst deciding. The MVP covers read-only ingestion of authorised findings, alert categorisation, evidence summaries and manually managed incident cases.</p>
          <ol className="progress">{PROGRESS.map(([st, t, d]) => <li key={t} className={st === 'Next' ? 'next' : ''}><span>{st}</span><div><b>{t}</b><p>{d}</p></div></li>)}</ol></div>
        <div className="frame card-form" data-r><PilotForm submitLabel="Request a demo" /></div>
      </div>
    </section>
  );
}

const FAQ = [['Does SecureMesh respond to threats automatically?', 'No. It is read-only and never blocks, quarantines or changes anything. Analysts review incidents and decide every response in their own tools.'], ['What data does it read?', 'Only findings and logs from sources you explicitly authorise, such as GuardDuty, Security Hub and CloudWatch in your own AWS accounts.'], ['Are the summaries written by AI?', 'In the planned product, Amazon Bedrock would draft summaries strictly from the correlated findings. They are labelled as drafts until an analyst reviews them. The prototype uses a deterministic template.'], ['Is SecureMesh live?', 'Not yet. It is a proposed product; the triage console is a prototype running in your browser on synthetic findings.']];
function Faq() { return <section className="sec" aria-labelledby="faq-title"><div className="sec-head"><p className="tag">// faq</p><h2 id="faq-title">Questions security teams ask.</h2></div><div className="faq">{FAQ.map(([q, a]) => <details key={q} className="frame"><summary>{q}</summary><p>{a}</p></details>)}</div></section>; }

function Contact() {
  return (
    <section className="sec" id="contact" aria-labelledby="contact-title">
      <div className="pri top"><div><p className="tag">// contact</p><h2 id="contact-title">Talk to SecureMesh.</h2><p className="intro">Questions about the product, integrations, data handling or partnerships. Messages go directly to the founder.</p><p className="mail"><a href={`mailto:${site.email}`}>{site.email}</a></p></div><div className="frame card-form" data-r><ContactForm /></div></div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="ft">
      <div className="ft-row"><a href="/" className="brand" aria-label="SecureMesh home"><Logo /><span>SecureMesh</span></a><nav aria-label="Footer"><a href="/app">Triage console</a><a href="/#technology">Technology (AWS)</a><a href="/#pricing">Pricing</a><a href="/#contact">Contact</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></nav></div>
      <p className="ft-status"><span className="dot" aria-hidden="true" /> status: building · {site.url.replace('https://', '')}</p>
      <p className="fine">© 2026 SecureMesh · {site.email} · Founded by {site.team[0].name}. A proposed product: features, integrations and AWS services are planned, pricing is illustrative and the triage console uses synthetic findings.</p>
    </footer>
  );
}

function Home() { return (<><Hero /><Marquee items={MQ} label="Who and what it is built for" /><Signal /><Capabilities /><Priority /><Boundaries /><Who /><Pricing /><Technology /><Team /><Demo /><Faq /><Contact /></>); }

const LEGAL = {
  privacy: ['Privacy notice', [['This website', 'SecureMesh is a proposed product. This website and the triage console run in your browser on synthetic data.'], ['Triage console', 'Your changes are kept in your browser’s local storage (key securemesh-console-v1) and never leave your device.'], ['Forms', `Until a form service is connected, the demo and contact forms open a pre-filled email to ${site.email}; nothing is sent until you send it. Please do not send logs, credentials or security findings through the forms.`], ['Cookies & analytics', 'None.']]],
  terms: ['Terms of use', [['A proposed product', 'Nothing here is an offer of service. Pricing is illustrative.'], ['Demonstration only', 'The triage console uses synthetic findings and must not be used to assess real incidents.'], ['Defensive use', 'SecureMesh is designed for monitoring environments you are authorised to monitor. Analysts decide every response.']]],
};
function Legal({kind}) { const [title, items] = LEGAL[kind]; return <section className="sec legal"><p className="tag">// review draft</p><h1>{title}</h1>{items.map(([t, d]) => <div key={t}><h2>{t}</h2><p>{d}</p></div>)}</section>; }
function NotFound() { return <section className="sec legal"><p className="tag">// 404</p><h1>No finding at this address.</h1><p>We couldn’t find that page.</p><p><a className="btn" href="/">Back to SecureMesh</a></p></section>; }

export default function App({path = '/'}) {
  if (path.startsWith('/app')) return <Console />;
  const page = path === '/' ? <Home /> : path === '/privacy' ? <Legal kind="privacy" /> : path === '/terms' ? <Legal kind="terms" /> : <NotFound />;
  return (<><a className="skip" href="#main">Skip to content</a><Header /><main id="main">{page}</main><Footer /></>);
}
