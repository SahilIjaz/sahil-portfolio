'use client';

import React, { useCallback, useEffect, useState } from 'react';

// ─── Data ───────────────────────────────────────────────────────────────────

interface CaseStudy {
  kicker: string;
  name: string;
  description: string;
  outcome: string;
  tech: string[];
  links: { label: string; href: string; dim?: boolean }[];
  image?: string; // drop a real screenshot in /public/projects and set the path here
  panes: React.ReactNode;
}

interface MiniProject {
  name: string;
  description: string;
  href: string;
  linkLabel: string;
}

const caseStudies: CaseStudy[] = [
  {
    kicker: 'Mobile · Live on both stores',
    name: 'MulberryTree',
    description:
      'A community cooking platform connecting chefs, home cooks, and farmers — recipes, courses, and local events. Full stack: React Native app, Node.js backend, media pipeline on AWS S3.',
    outcome: 'Shipped to the App Store and Google Play; serving an active community on iOS and Android.',
    tech: ['React Native', 'Node.js', 'MongoDB', 'AWS S3'],
    links: [
      { label: 'App Store', href: 'https://apps.apple.com/us/app/mulberry-tree-cooking/id6746870204' },
      { label: 'Play Store', href: 'https://play.google.com/store/apps/details?id=com.mulberry_tree' },
    ],
    panes: (
      <>
        <div className="pane"><i className="hd" /><i className="img" /><i className="ln" /><i className="ln" style={{ width: '70%' }} /></div>
        <div className="pane" style={{ marginTop: '6%' }}><i className="hd" /><i className="ln" /><i className="img" /><i className="ln" style={{ width: '55%' }} /></div>
      </>
    ),
  },
  {
    kicker: 'Telehealth · Web + Mobile',
    name: 'MundoSalud',
    description:
      'A telehealth platform for real-time doctor consultations — live video via Agora, appointment scheduling, and an admin dashboard. I engineered the real-time backend and shipped the companion mobile app.',
    outcome: 'Live on Google Play; handles video consultations and scheduling in production.',
    tech: ['Node.js', 'Socket.io', 'Agora', 'React Native', 'MongoDB'],
    links: [
      { label: 'Play Store', href: 'https://play.google.com/store/apps/details?id=com.app.mundoSalud' },
    ],
    panes: (
      <>
        <div className="pane" style={{ flex: 2.2 }}><i className="hd" /><i className="ln" /><i className="ln" style={{ width: '80%' }} /><i className="img" /></div>
        <div className="pane"><i className="img" /><i className="ln" /></div>
      </>
    ),
  },
  {
    kicker: 'AI · Retrieval-augmented generation',
    name: 'StudyMate AI',
    description:
      'Chat with any PDF. Documents are chunked into a FAISS vector store; questions retrieve the relevant passages and Claude generates sourced answers. Python/FastAPI backend, Next.js frontend.',
    outcome: 'Full RAG pipeline in production — try it live with any PDF.',
    tech: ['Python', 'FastAPI', 'FAISS', 'Claude API', 'Next.js'],
    links: [{ label: 'Live demo', href: 'https://study-mate-frontend-three.vercel.app' }],
    panes: (
      <>
        <div className="pane" style={{ flex: 1.4 }}><i className="hd" /><i className="img" /></div>
        <div className="pane"><i className="ln" /><i className="ln" style={{ width: '75%' }} /><i className="ln" /><i className="ln" style={{ width: '60%' }} /><i className="ln" /></div>
      </>
    ),
  },
  {
    kicker: 'Web · Multi-tenant SaaS',
    name: 'Grocio',
    description:
      'A grocery delivery platform with role-based access for vendors, customers, and admins — Stripe payments, order flows, and tenant isolation across a shared Next.js + Node.js codebase.',
    outcome: 'Multi-tenant architecture with three distinct role experiences, live today.',
    tech: ['Next.js', 'Node.js', 'MongoDB', 'Stripe'],
    links: [{ label: 'Live demo', href: 'https://grocio-app-frontend.netlify.app/' }],
    panes: (
      <>
        <div className="pane"><i className="hd" /><i className="ln" /><i className="ln" style={{ width: '65%' }} /><i className="img" /></div>
        <div className="pane" style={{ flex: 1.6 }}><i className="img" /><i className="ln" /><i className="ln" style={{ width: '50%' }} /></div>
      </>
    ),
  },
];

const miniProjects: MiniProject[] = [
  { name: 'Anaya', description: 'Social platform — stories, messaging, custom feed algorithm', href: 'https://anaya-d9z9.vercel.app/', linkLabel: 'Live ↗' },
  { name: 'Connect Hub', description: 'Full-stack social app with real-time chat', href: 'https://connect-hub-git-main-sahil-ijazs-projects.vercel.app/', linkLabel: 'Live ↗' },
  { name: 'AI Resume Analyzer', description: 'Claude-powered resume scoring against target roles', href: 'https://ai-resume-analyzer-sepia-tau.vercel.app', linkLabel: 'Live ↗' },
  { name: 'FishScout', description: 'Real-time fishing community with live spots & weather', href: 'https://github.com/SahilIjaz/FishScout', linkLabel: 'Code ↗' },
  { name: 'CoachMaster', description: 'Match strategy & formation analysis for coaches', href: 'https://github.com/SahilIjaz/CoachMaster-Web', linkLabel: 'Code ↗' },
  { name: 'MulberryTree Web', description: 'Web companion to the MulberryTree mobile app', href: 'https://mulberry-tree.vercel.app', linkLabel: 'Live ↗' },
];

const timeline = [
  { when: 'Apr 2026 — now', org: 'Tinkerbyte Labs', role: 'Associate Full-Stack Developer', detail: 'Full-stack features across client products; scalable web applications' },
  { when: 'Mar 2026 — Apr 2026', org: 'Gamma Developers', role: 'Full-Stack Developer', detail: 'Custom CRMs, AI-powered chatbots, and cloud-enabled systems' },
  { when: 'Jul 2024 — Mar 2026', org: 'Bridge Zone', role: 'Backend Developer', detail: '5+ real-time backend services; Socket.IO, Stripe, Agora; AWS EC2/S3' },
  { when: '2023 — 2026', org: 'Bahria University', role: 'BS Information Technology', detail: 'Lahore, Pakistan' },
];

const skillGroups = [
  { title: 'Backend', items: ['Node.js · Express · Nest.js', 'Socket.io (real-time)', 'MongoDB · PostgreSQL'] },
  { title: 'Frontend & Mobile', items: ['Next.js · React', 'React Native', 'TypeScript · Tailwind'] },
  { title: 'Infra & Integrations', items: ['AWS EC2 · S3', 'Stripe · Agora', 'Claude API · FAISS'] },
];

const processSteps = [
  { title: 'Scope', text: 'We define the build together. You get a fixed quote and timeline within 48 hours.' },
  { title: 'Build', text: 'Weekly demo of working software — not status reports. You steer as we go.' },
  { title: 'Ship', text: 'Deployment, store submission if mobile, and a clean handover with docs.' },
  { title: 'Support', text: '30 days of post-launch fixes included. After that, I’m one message away.' },
];

// ─── Motion hooks ───────────────────────────────────────────────────────────

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Scroll progress bar, nav hide/show, scroll reveals, counters, deck effect, tilt. */
function usePageMotion() {
  useEffect(() => {
    const reduced = prefersReducedMotion();
    const cleanups: (() => void)[] = [];

    // hero load choreography
    const raf = requestAnimationFrame(() => document.body.classList.add('loaded'));
    cleanups.push(() => cancelAnimationFrame(raf));

    // scroll progress bar
    const bar = document.getElementById('progress');
    const onProgress = () => {
      if (!bar) return;
      const h = document.documentElement;
      const p = h.scrollTop / Math.max(h.scrollHeight - h.clientHeight, 1);
      bar.style.transform = `scaleX(${p})`;
    };
    addEventListener('scroll', onProgress, { passive: true });
    cleanups.push(() => removeEventListener('scroll', onProgress));

    // nav: hide on scroll down, show on scroll up
    const nav = document.getElementById('site-nav');
    let lastY = 0;
    const onNav = () => {
      const y = scrollY;
      nav?.classList.toggle('nav-hidden', y > lastY && y > 240);
      lastY = y;
    };
    addEventListener('scroll', onNav, { passive: true });
    cleanups.push(() => removeEventListener('scroll', onNav));

    // scroll-in reveals
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());

    // animated counters
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const countIO = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          countIO.unobserve(e.target);
          const el = e.target as HTMLElement;
          const to = Number(el.dataset.to);
          if (reduced) {
            el.textContent = String(to);
            continue;
          }
          const dur = 1200;
          const t0 = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - t0) / dur, 1);
            el.textContent = String(Math.round(ease(p) * to));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.6 }
    );
    document.querySelectorAll('.count').forEach((el) => countIO.observe(el));
    cleanups.push(() => countIO.disconnect());

    // stacked deck: card underneath recedes as the next slides over it
    const cases = Array.from(document.querySelectorAll<HTMLElement>('.case'));
    if (cases.length > 1 && !reduced) {
      let deckRaf: number | null = null;
      const updateDeck = () => {
        deckRaf = null;
        const stickyTop = 92;
        const span = Math.max(innerHeight - stickyTop, 1);
        for (let i = 0; i < cases.length - 1; i++) {
          const inner = cases[i].querySelector<HTMLElement>('.case-card');
          if (!inner) continue;
          const nextTop = cases[i + 1].getBoundingClientRect().top;
          const p = Math.min(Math.max(1 - (nextTop - stickyTop) / span, 0), 1);
          inner.style.transform = `scale(${(1 - p * 0.06).toFixed(4)})`;
          inner.style.filter = `brightness(${(1 - p * 0.45).toFixed(3)})`;
        }
      };
      const onDeck = () => {
        if (!deckRaf) deckRaf = requestAnimationFrame(updateDeck);
      };
      addEventListener('scroll', onDeck, { passive: true });
      updateDeck();
      cleanups.push(() => removeEventListener('scroll', onDeck));
    }

    // subtle 3D tilt on case-study shots
    if (!reduced && matchMedia('(pointer: fine)').matches) {
      document.querySelectorAll<HTMLElement>('.tilt').forEach((card) => {
        let raf2: number | null = null;
        const onMove = (ev: MouseEvent) => {
          if (raf2) return;
          raf2 = requestAnimationFrame(() => {
            const r = card.getBoundingClientRect();
            const rx = ((ev.clientY - r.top) / r.height - 0.5) * -5;
            const ry = ((ev.clientX - r.left) / r.width - 0.5) * 5;
            card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
            raf2 = null;
          });
        };
        const onLeave = () => {
          card.style.transition = 'transform .5s cubic-bezier(0.22,1,0.36,1), box-shadow .35s, border-color .35s';
          card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
          setTimeout(() => (card.style.transition = ''), 500);
        };
        card.addEventListener('mousemove', onMove);
        card.addEventListener('mouseleave', onLeave);
        cleanups.push(() => {
          card.removeEventListener('mousemove', onMove);
          card.removeEventListener('mouseleave', onLeave);
        });
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);
}

// ─── Contact form ───────────────────────────────────────────────────────────

interface FormStatus {
  type: 'success' | 'error' | null;
  message: string;
}

function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<FormStatus>({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setStatus({ type: null, message: '' });
      setIsSubmitting(true);
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (response.ok) {
          setStatus({ type: 'success', message: 'Message sent — I’ll get back to you within 24 hours.' });
          setFormData({ name: '', email: '', message: '' });
        } else {
          setStatus({ type: 'error', message: data.error || 'Something went wrong. Please try again.' });
        }
      } catch {
        setStatus({ type: 'error', message: 'Failed to send. Email me directly at hssahil2913@gmail.com.' });
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData]
  );

  return (
    <form className="contact-form reveal" style={{ '--i': 4 } as React.CSSProperties} onSubmit={handleSubmit}>
      {status.type && <div className={`form-status ${status.type}`}>{status.message}</div>}
      <div className="row2">
        <div className="field">
          <label htmlFor="cf-name">Name</label>
          <input
            id="cf-name"
            type="text"
            required
            placeholder="Your name"
            value={formData.name}
            disabled={isSubmitting}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor="cf-email">Email</label>
          <input
            id="cf-email"
            type="email"
            required
            placeholder="you@company.com"
            value={formData.email}
            disabled={isSubmitting}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="cf-message">Project details</label>
        <textarea
          id="cf-message"
          rows={5}
          required
          placeholder="What are you building? Rough timeline and budget help too."
          value={formData.message}
          disabled={isSubmitting}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
      </div>
      <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <span className="spinner" /> Sending…
          </>
        ) : (
          <>
            Send message <span className="arrow">→</span>
          </>
        )}
      </button>
      <p className="reply-note">Replies within 24 hours · your details stay private</p>
    </form>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function Portfolio() {
  usePageMotion();

  return (
    <>
      <div id="progress" />

      <nav id="site-nav" className="site-nav">
        <div className="wrap nav-inner">
          <a className="logo" href="#">
            SAHIL IJAZ<span className="dot">.</span>
          </a>
          <div className="nav-links">
            <a className="link" href="#work">Work</a>
            <a className="link" href="#about">About</a>
            <a className="link" href="#process">Process</a>
            <a className="link" href="#contact">Contact</a>
            <a className="btn btn-primary small" href="#contact">Start a project</a>
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="aurora" />
        <div className="gridlines" />
        <div className="wrap hero-content">
          <div className="avail fade-up d0">
            <span className="pulse" />
            <span className="eyebrow">Available for projects · Lahore / Remote</span>
          </div>
          <h1>
            <span className="mask"><span>I build real-time</span></span>
            <span className="mask"><span>web &amp; mobile products</span></span>
            <span className="mask"><span><span className="accent">that ship.</span></span></span>
          </h1>
          <p className="sub fade-up d1">
            Full-stack developer specializing in Node.js and Next.js. I&apos;ve delivered{' '}
            <strong>11 production apps</strong> — including two live on the{' '}
            <strong>App&nbsp;Store and Play&nbsp;Store</strong> — across telehealth, marketplaces, and AI tools.
          </p>
          <div className="cta-row fade-up d2">
            <a className="btn btn-primary" href="#work">
              View my work <span className="arrow">→</span>
            </a>
            <a className="btn btn-ghost" href="#contact">Book a call</a>
          </div>
          <div className="socials fade-up d3">
            <a href="https://github.com/SahilIjaz" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/sahil-ijaz-a75b15281/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="/sahil-resume.pdf">Resume (PDF)</a>
          </div>
        </div>
      </header>

      <div className="proof">
        <div className="wrap proof-inner">
          <div className="proof-item">
            <div className="n"><span className="count" data-to="11">0</span></div>
            <div className="l">Products shipped</div>
          </div>
          <div className="proof-item">
            <div className="n"><span className="count" data-to="2">0</span></div>
            <div className="l">Apps in stores</div>
          </div>
          <div className="proof-item">
            <div className="n"><span className="count" data-to="2">0</span><span className="suffix">&nbsp;yrs</span></div>
            <div className="l">Production experience</div>
          </div>
          <div className="proof-item">
            <div className="n"><span className="suffix">&lt;</span><span className="count" data-to="24">0</span><span className="suffix">&nbsp;h</span></div>
            <div className="l">Reply time</div>
          </div>
        </div>
      </div>

      <section id="work" className="section wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">Selected work</span>
          <h2>Four products, start to finish</h2>
          <p>Case studies with outcomes — keep scrolling, each one slides in over the last.</p>
        </div>

        <div className="case-stack">
          {caseStudies.map((cs) => (
            <article className="case" key={cs.name}>
              <div className="case-card">
                <div className="case-grid">
                  <div className="case-shot tilt">
                    {cs.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cs.image} alt={`${cs.name} screenshot`} />
                    ) : (
                      <div className="screen">{cs.panes}</div>
                    )}
                  </div>
                  <div className="case-body">
                    <span className="kicker">{cs.kicker}</span>
                    <h3>{cs.name}</h3>
                    <p className="desc">{cs.description}</p>
                    <div className="outcome">{cs.outcome}</div>
                    <div className="stack">
                      {cs.tech.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                    <div className="case-links">
                      {cs.links.map((l) => (
                        <a key={l.label} className={l.dim ? 'dim' : undefined} href={l.href} target="_blank" rel="noopener noreferrer">
                          {l.label} <span className="arrow">↗</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="more">
          <h3 className="reveal">More projects</h3>
          {miniProjects.map((p, i) => (
            <div className="mrow reveal" style={{ '--i': i } as React.CSSProperties} key={p.name}>
              <b>{p.name}</b>
              <span className="d">{p.description}</span>
              <a href={p.href} target="_blank" rel="noopener noreferrer">{p.linkLabel}</a>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="section wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">About</span>
          <h2>The person behind the commits</h2>
        </div>
        <div className="about-grid">
          <div className="headshot reveal">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/sahil.jpg" alt="Sahil Ijaz" />
          </div>
          <div className="about-copy">
            <p className="reveal" style={{ '--i': 0 } as React.CSSProperties}>
              I&apos;m Sahil — a full-stack developer in Lahore, Pakistan. I&apos;m at my best on{' '}
              <strong>real-time systems</strong>: chat, live video, marketplaces, anything where the backend has to
              keep up with people. I work in Node.js, Next.js, and React Native, and I&apos;ve taken products all the
              way from first commit to the app stores.
            </p>
            <p className="reveal" style={{ '--i': 1 } as React.CSSProperties}>
              Working with me looks like this: <strong>weekly demos, honest estimates, and no surprises at handover.</strong>{' '}
              I&apos;ve shipped for a telehealth provider, a food community, and multiple startups — and every one of
              those products is still running.
            </p>
            <div className="timeline">
              {timeline.map((t, i) => (
                <div className="t-row reveal" style={{ '--i': i + 2 } as React.CSSProperties} key={t.org}>
                  <span className="when">{t.when}</span>
                  <div className="what">
                    <b>{t.org}</b> · {t.role}
                    <span>{t.detail}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="skills">
              {skillGroups.map((g, i) => (
                <div className="skill-group reveal" style={{ '--i': i + 5 } as React.CSSProperties} key={g.title}>
                  <h4>{g.title}</h4>
                  <ul>
                    {g.items.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="process" className="section wrap">
        <div className="sec-head reveal">
          <span className="eyebrow">Process</span>
          <h2>How a project runs</h2>
          <p>You always know where things stand — that&apos;s the whole system.</p>
        </div>
        <div className="steps">
          {processSteps.map((s, i) => (
            <div className="step reveal" style={{ '--i': i } as React.CSSProperties} key={s.title}>
              <span className="no">0{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <div id="contact" className="contact">
        <div className="aurora" />
        <div className="wrap contact-inner">
          <span className="eyebrow reveal">Contact</span>
          <h2 className="reveal" style={{ '--i': 1 } as React.CSSProperties}>Tell me about your project</h2>
          <p className="sub reveal" style={{ '--i': 2 } as React.CSSProperties}>
            Send a few lines about what you&apos;re building — rough timeline and budget help too. I reply within 24 hours.
          </p>
          <ContactForm />
          <p className="direct reveal" style={{ '--i': 5 } as React.CSSProperties}>
            or reach me at <a href="mailto:hssahil2913@gmail.com">hssahil2913@gmail.com</a> ·{' '}
            <a href="https://wa.me/923024891399" target="_blank" rel="noopener noreferrer">WhatsApp</a> ·{' '}
            <a href="https://www.linkedin.com/in/sahil-ijaz-a75b15281/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </p>
        </div>
      </div>

      <footer className="site-footer">
        <div className="wrap foot">
          <span className="c">© {new Date().getFullYear()} Sahil Ijaz · Full-Stack Developer, Lahore</span>
          <div className="links">
            <a href="https://github.com/SahilIjaz" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/sahil-ijaz-a75b15281/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="mailto:hssahil2913@gmail.com">Email</a>
          </div>
        </div>
      </footer>
    </>
  );
}
