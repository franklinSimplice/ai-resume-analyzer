import { useState } from "react";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

export default function Pricing() {
  const { t } = useTranslation();
  const [annual, setAnnual] = useState(false);

  const plans = [
    {
      name: t('pricing.plans.free.name'),
      price: annual ? "$0" : "$0",
      period: t('pricing.plans.free.period'),
      description: t('pricing.plans.free.desc'),
      features: [
        t('pricing.plans.free.f1'),
        t('pricing.plans.free.f2'),
        t('pricing.plans.free.f3'),
        t('pricing.plans.free.f4')
      ],
      cta: t('pricing.plans.free.btn'),
      popular: false,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      )
    },
    {
      name: t('pricing.plans.professional.name'),
      price: annual ? "$7.99" : "$9.99",
      period: annual ? t('pricing.plans.professional.periodMoAnn') : t('pricing.plans.professional.periodMo'),
      description: t('pricing.plans.professional.desc'),
      features: [
        t('pricing.plans.professional.f1'),
        t('pricing.plans.professional.f2'),
        t('pricing.plans.professional.f3'),
        t('pricing.plans.professional.f4'),
        t('pricing.plans.professional.f5'),
        t('pricing.plans.professional.f6')
      ],
      cta: t('pricing.plans.professional.btn'),
      popular: true,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      )
    },
    {
      name: t('pricing.plans.career.name'),
      price: annual ? "$24.99" : "$29.99",
      period: annual ? t('pricing.plans.career.periodMoAnn') : t('pricing.plans.career.periodMo'),
      description: t('pricing.plans.career.desc'),
      features: [
        t('pricing.plans.career.f1'),
        t('pricing.plans.career.f2'),
        t('pricing.plans.career.f3'),
        t('pricing.plans.career.f4'),
        t('pricing.plans.career.f5'),
        t('pricing.plans.career.f6')
      ],
      cta: t('pricing.plans.career.btn'),
      popular: false,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
          <polyline points="22,4 12,14.01 9,11.01"/>
        </svg>
      )
    }
  ];

  const faqs = [
    {
      q: t('pricing.faqs.q1'),
      a: t('pricing.faqs.a1')
    },
    {
      q: t('pricing.faqs.q2'),
      a: t('pricing.faqs.a2')
    },
    {
      q: t('pricing.faqs.q3'),
      a: t('pricing.faqs.a3')
    },
    {
      q: t('pricing.faqs.q4'),
      a: t('pricing.faqs.a4')
    }
  ];

  return (
    <div className="pricing-page">
      <Navbar />

      {/* ───── HERO ───── */}
      <section className="pricing-hero">
        <div className="pricing-hero-inner">
          <span className="section-tag">{t('pricing.monthly')}</span>
          <h1 className="pricing-hero-title" dangerouslySetInnerHTML={{ __html: t('pricing.title') }}></h1>
          <p className="pricing-hero-subtitle">
            {t('pricing.subtitle')}
          </p>

          {/* Toggle */}
          <div className="pricing-toggle">
            <span className={!annual ? 'active' : ''}>{t('pricing.monthly')}</span>
            <button 
              className={`pricing-toggle-switch ${annual ? 'is-annual' : ''}`}
              onClick={() => setAnnual(!annual)}
              aria-label="Toggle annual billing"
            >
              <span className="pricing-toggle-knob"></span>
            </button>
            <span className={annual ? 'active' : ''}>
              {t('pricing.annual')} <span className="pricing-save-badge">{t('pricing.save20')}</span>
            </span>
          </div>
        </div>
        <div className="pricing-blob pricing-blob-1"></div>
        <div className="pricing-blob pricing-blob-2"></div>
      </section>

      {/* ───── PRICING CARDS ───── */}
      <section className="pricing-cards-section">
        <div className="pricing-container">
          <div className="pricing-cards-grid">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`pricing-card ${plan.popular ? 'pricing-card-popular' : ''}`}
              >
                {plan.popular && (
                  <div className="pricing-popular-badge">{t('pricing.popular')}</div>
                )}
                
                <div className="pricing-card-icon">
                  {plan.icon}
                </div>
                
                <h2 className="pricing-card-name">{plan.name}</h2>
                <p className="pricing-card-desc">{plan.description}</p>

                <div className="pricing-card-price">
                  <span className="pricing-amount">{plan.price}</span>
                  <span className="pricing-period">/{plan.period}</span>
                </div>

                <ul className="pricing-features-list">
                  {plan.features.map((feature, fi) => (
                    <li key={fi}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20,6 9,17 4,12"/>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/create-resume"
                  className={`pricing-card-btn ${plan.popular ? 'pricing-card-btn-primary' : ''}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section className="pricing-faq-section">
        <div className="pricing-container">
          <div className="section-header">
            <span className="section-tag">FAQ</span>
            <h2 className="section-title-main">{t('pricing.faqTitle')}</h2>
            <p className="section-desc">{t('pricing.faqDesc')}</p>
          </div>

          <div className="pricing-faq-grid">
            {faqs.map((faq, i) => (
              <div key={i} className="pricing-faq-card">
                <h3>{faq.q}</h3>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-blob cta-blob-1"></div>
          <div className="cta-blob cta-blob-2"></div>
          <h2>{t('pricing.ctaTitle')}</h2>
          <p>{t('pricing.ctaDesc')}</p>
          <div className="cta-actions">
            <Link to="/create-resume" className="cta-btn-primary">
              {t('pricing.ctaBtn')}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
