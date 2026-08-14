import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation();
  return (
    <div className="about-page">
      <Navbar />

      {/* ───── HERO ───── */}
      <section className="about-hero">
        <div className="about-hero-inner">
          <span className="section-tag">{t('about.hero.tag')}</span>
          <h1 className="about-hero-title" dangerouslySetInnerHTML={{ __html: t('about.hero.title') }} />
          <p className="about-hero-subtitle">
            {t('about.hero.subtitle')}
          </p>
        </div>
        {/* Decorative blobs */}
        <div className="about-blob about-blob-1"></div>
        <div className="about-blob about-blob-2"></div>
      </section>

      {/* ───── MISSION ───── */}
      <section className="about-mission-section">
        <div className="about-container">
          <div className="about-mission-grid">
            <div className="about-mission-text">
              <span className="section-tag">{t('about.mission.tag')}</span>
              <h2 className="about-section-title">{t('about.mission.title')}</h2>
              <p className="about-body">
                {t('about.mission.p1')}
              </p>
              <p className="about-body">
                {t('about.mission.p2')}
              </p>
              <p className="about-body">
                {t('about.mission.p3')}
              </p>
            </div>
            <div className="about-mission-visual">
              <div className="about-mission-card">
                <div className="about-mission-stat">
                  <span className="about-stat-number">10K+</span>
                  <span className="about-stat-label">{t('about.mission.stats.jobSeekers')}</span>
                </div>
                <div className="about-mission-stat">
                  <span className="about-stat-number">95%</span>
                  <span className="about-stat-label">{t('about.mission.stats.atsPass')}</span>
                </div>
                <div className="about-mission-stat">
                  <span className="about-stat-number">3x</span>
                  <span className="about-stat-label">{t('about.mission.stats.interviews')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── VALUES ───── */}
      <section className="about-values-section">
        <div className="about-container">
          <div className="section-header">
            <span className="section-tag">{t('about.values.tag')}</span>
            <h2 className="section-title-main">{t('about.values.title')}</h2>
            <p className="section-desc">{t('about.values.desc')}</p>
          </div>

          <div className="about-values-grid">
            <div className="about-value-card">
              <div className="about-value-icon about-value-icon-blue">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3>{t('about.values.integrity.title')}</h3>
              <p>{t('about.values.integrity.desc')}</p>
            </div>

            <div className="about-value-card">
              <div className="about-value-icon about-value-icon-green">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
              </div>
              <h3>{t('about.values.innovation.title')}</h3>
              <p>{t('about.values.innovation.desc')}</p>
            </div>

            <div className="about-value-card">
              <div className="about-value-icon about-value-icon-purple">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                  <path d="M16 3.13a4 4 0 010 7.75"/>
                </svg>
              </div>
              <h3>{t('about.values.accessibility.title')}</h3>
              <p>{t('about.values.accessibility.desc')}</p>
            </div>

            <div className="about-value-card">
              <div className="about-value-icon about-value-icon-coral">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
              </div>
              <h3>{t('about.values.userFirst.title')}</h3>
              <p>{t('about.values.userFirst.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ───── TEAM ───── */}
      <section className="about-team-section">
        <div className="about-container">
          <div className="section-header">
            <span className="section-tag">{t('about.team.tag')}</span>
            <h2 className="section-title-main">{t('about.team.title')}</h2>
            <p className="section-desc">{t('about.team.desc')}</p>
          </div>

          <div className="about-team-grid">
            <div className="about-team-card">
              <div className="about-team-avatar" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                F
              </div>
              <h3>{t('about.team.members.founder.name')}</h3>
              <span className="about-team-role">{t('about.team.members.founder.role')}</span>
              <p>{t('about.team.members.founder.desc')}</p>
            </div>

            <div className="about-team-card">
              <div className="about-team-avatar" style={{ background: 'linear-gradient(135deg, #43e97b, #38f9d7)' }}>
                AI
              </div>
              <h3>{t('about.team.members.ai.name')}</h3>
              <span className="about-team-role">{t('about.team.members.ai.role')}</span>
              <p>{t('about.team.members.ai.desc')}</p>
            </div>

            <div className="about-team-card">
              <div className="about-team-avatar" style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)' }}>
                P
              </div>
              <h3>{t('about.team.members.puter.name')}</h3>
              <span className="about-team-role">{t('about.team.members.puter.role')}</span>
              <p>{t('about.team.members.puter.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-blob cta-blob-1"></div>
          <div className="cta-blob cta-blob-2"></div>
          <h2>{t('about.cta.title')}</h2>
          <p>{t('about.cta.subtitle')}</p>
          <div className="cta-actions">
            <Link to="/create-resume" className="cta-btn-primary">
              {t('about.cta.primaryBtn')}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link to="/pricing" className="cta-btn-ghost">
              {t('about.cta.ghostBtn')}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}