import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
import type { Route } from "./+types/home";
import { useApiStore } from "~/lib/api";
import { useNavigate } from "react-router";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "ResumeEly — AI Resume Builder & Analyzer" },
    { name: "description", content: "Create ATS-optimized resumes and get instant AI analysis. Land your dream job with ResumeEly." },
  ];
}

// Typing animation hook
function useTypingEffect(texts: string[], typingSpeed = 80, deletingSpeed = 50, pauseDuration = 2000) {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentText.slice(0, charIndex + 1));
        setCharIndex(prev => prev + 1);

        if (charIndex + 1 === currentText.length) {
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        setDisplayText(currentText.slice(0, charIndex - 1));
        setCharIndex(prev => prev - 1);

        if (charIndex - 1 === 0) {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts, typingSpeed, deletingSpeed, pauseDuration]);

  return displayText;
}

// Counter animation hook
function useCountUp(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [hasStarted, end, duration]);

  return { count, ref };
}

export default function Home() {
  const { auth } = useApiStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const typedText = useTypingEffect([
    t('home.heroTyped1'),
    t('home.heroTyped2'),
    t('home.heroTyped3'),
    t('home.heroTyped4')
  ]);

  const stat1 = useCountUp(10000);
  const stat2 = useCountUp(95);
  const stat3 = useCountUp(50);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate('/auth?next=/');
    }
  }, [auth.isAuthenticated]);

  return (
    <div className="home-page">
      <Navbar />

      {/* ───── HERO SECTION ───── */}
      <section className="hero-section">
        <div className="hero-container">
          {/* Left Content */}
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
              {t('home.heroBadge')}
            </div>
            <h1 className="hero-title">
              {t('home.heroTitle')}{' '}
              <span className="hero-typed">{typedText}<span className="cursor">|</span></span>
            </h1>
            <p className="hero-subtitle">
              {t('home.heroSubtitle')}
            </p>
            <div className="hero-actions">
              <Link to="/create-resume" className="hero-btn-primary">
                <span>Create My Resume</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link to="/upload" className="hero-btn-secondary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                </svg>
                Analyze Existing Resume
              </Link>
            </div>
            <div className="hero-trust">
              <div className="hero-avatars">
                <div className="hero-avatar" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>J</div>
                <div className="hero-avatar" style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)' }}>A</div>
                <div className="hero-avatar" style={{ background: 'linear-gradient(135deg, #4facfe, #00f2fe)' }}>M</div>
                <div className="hero-avatar" style={{ background: 'linear-gradient(135deg, #43e97b, #38f9d7)' }}>S</div>
              </div>
              <span className="hero-trust-text" dangerouslySetInnerHTML={{ __html: t('home.trustedByText', { count: '10,000+' }) }}></span>
            </div>
          </div>

          {/* Right Visual */}
          <div className="hero-visual">
            <div className="hero-image-wrapper">
              <img src="/images/hero-person.png" alt="Professional using ResumeEly" className="hero-person-img" />

              {/* Floating Resume Card */}
              <div className="floating-card floating-card-resume">
                <img src="/images/floating-resume.png" alt="Resume preview" />
              </div>

              {/* Floating Score Card */}
              <div className="floating-card floating-card-score">
                <div className="score-ring">
                  <svg viewBox="0 0 60 60">
                    <circle cx="30" cy="30" r="24" fill="none" stroke="#e2e8f0" strokeWidth="5"/>
                    <circle cx="30" cy="30" r="24" fill="none" stroke="#22c55e" strokeWidth="5" strokeDasharray="131" strokeDashoffset="20" strokeLinecap="round" transform="rotate(-90 30 30)"/>
                  </svg>
                  <span className="score-value">92</span>
                </div>
                <div className="score-info">
                  <span className="score-label">ATS Score</span>
                  <span className="score-status">Excellent</span>
                </div>
              </div>

              {/* Decorative Blobs */}
              <div className="hero-blob hero-blob-1"></div>
              <div className="hero-blob hero-blob-2"></div>
              <div className="hero-blob hero-blob-3"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── STATS BAR ───── */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item" ref={stat1.ref}>
            <span className="stat-number">{stat1.count.toLocaleString()}+</span>
            <span className="stat-label">{t('home.stats.resumesCreated')}</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item" ref={stat2.ref}>
            <span className="stat-number">{stat2.count}%</span>
            <span className="stat-label">{t('home.stats.atsPassRate')}</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item" ref={stat3.ref}>
            <span className="stat-number">{stat3.count}+</span>
            <span className="stat-label">{t('home.stats.templates')}</span>
          </div>
        </div>
      </section>

      {/* ───── WHY RESUMEELY ───── */}
      <section className="features-section">
        <div className="features-container">
          <div className="section-header">
            <span className="section-tag">Features</span>
            <h2 className="section-title-main">{t('home.features.title')}</h2>
            <p className="section-desc">{t('home.features.subtitle')}</p>
          </div>

          <div className="features-grid">
            {/* Feature 1 */}
            <div className="feature-card">
              <div className="feature-icon feature-icon-blue">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
              </div>
              <h3>{t('home.features.aiBuilder.title')}</h3>
              <p>{t('home.features.aiBuilder.description')}</p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card">
              <div className="feature-icon feature-icon-green">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                  <polyline points="22,4 12,14.01 9,11.01"/>
                </svg>
              </div>
              <h3>{t('home.features.atsAnalysis.title')}</h3>
              <p>{t('home.features.atsAnalysis.description')}</p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card">
              <div className="feature-icon feature-icon-purple">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <line x1="3" y1="9" x2="21" y2="9"/>
                  <line x1="9" y1="21" x2="9" y2="9"/>
                </svg>
              </div>
              <h3>{t('home.features.templates.title')}</h3>
              <p>{t('home.features.templates.description')}</p>
            </div>

            {/* Feature 4 */}
            <div className="feature-card">
              <div className="feature-icon feature-icon-coral">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"/>
                  <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
              </div>
              <h3>{t('home.features.editor.title')}</h3>
              <p>{t('home.features.editor.description')}</p>
            </div>

            {/* Feature 5 */}
            <div className="feature-card">
              <div className="feature-icon feature-icon-amber">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </div>
              <h3>{t('home.features.export.title')}</h3>
              <p>{t('home.features.export.description')}</p>
            </div>

            {/* Feature 6 */}
            <div className="feature-card">
              <div className="feature-icon feature-icon-teal">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                  <path d="M16 3.13a4 4 0 010 7.75"/>
                </svg>
              </div>
              <h3>{t('home.features.personalization.title')}</h3>
              <p>{t('home.features.personalization.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section className="how-section">
        <div className="how-container">
          <div className="section-header">
            <span className="section-tag">Simple Process</span>
            <h2 className="section-title-main">{t('home.howItWorks.title')}</h2>
            <p className="section-desc">{t('home.howItWorks.subtitle')}</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-visual">
                <img src="/images/resume-scan-2.gif" alt="Input your details" className="step-gif" />
              </div>
              <h3>{t('home.howItWorks.step1.title')}</h3>
              <p>{t('home.howItWorks.step1.description')}</p>
            </div>

            <div className="step-connector">
              <svg width="60" height="24" viewBox="0 0 60 24" fill="none">
                <path d="M0 12h50M44 6l6 6-6 6" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-visual">
                <img src="/images/resume_01.png" alt="AI generates resume" className="step-img" />
              </div>
              <h3>{t('home.howItWorks.step2.title')}</h3>
              <p>{t('home.howItWorks.step2.description')}</p>
            </div>

            <div className="step-connector">
              <svg width="60" height="24" viewBox="0 0 60 24" fill="none">
                <path d="M0 12h50M44 6l6 6-6 6" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-visual">
                <img src="/images/resume_02.png" alt="Download & apply" className="step-img" />
              </div>
              <h3>{t('home.howItWorks.step3.title')}</h3>
              <p>{t('home.howItWorks.step3.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ───── CTA SECTION ───── */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-blob cta-blob-1"></div>
          <div className="cta-blob cta-blob-2"></div>
          <h2>{t('home.cta.title')}</h2>
          <p>{t('home.cta.subtitle')}</p>
          <div className="cta-actions">
            <Link to="/create-resume" className="cta-btn-primary">
              {t('home.cta.getStarted')}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link to="/my-resumes" className="cta-btn-ghost">
              {t('home.cta.viewResumes')}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}