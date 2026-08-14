import React from 'react';
import Link from 'next/link';
import styles from './landing.module.css';

export const metadata = {
  title: 'ResumeAI — AI-Powered ATS Resume Platform',
  description: 'Build, optimize, and tailor your resume with AI. Get ATS compatibility scores, job match analysis, and AI-generated cover letters. Free to use.',
};

export default function LandingPage() {
  return (
    <div className={styles.page}>
      {/* Nav */}
      <nav className={styles.nav}>
        <div className={styles.navBrand}>
          <div className={styles.navLogo}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <span className={styles.navBrandText}>ResumeAI</span>
        </div>
        <div className={styles.navLinks}>
          <Link href="#features" className={styles.navLink}>Features</Link>
          <Link href="#how-it-works" className={styles.navLink}>How it works</Link>
          <Link href="#testimonials" className={styles.navLink}>Reviews</Link>
        </div>
        <div className={styles.navActions}>
          <Link href="/login" className={styles.navLogin}>Sign in</Link>
          <Link href="/login" className={styles.navCta}>
            Get Started Free
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        {/* Background layers */}
        <div className={styles.heroBgGrid} />
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.orb3} />
        <div className={styles.heroMesh} />

        <div className={styles.heroContent}>
          {/* Social proof pill */}
          <div className={styles.heroSocialProof}>
            <div className={styles.heroAvatarStack}>
              {['#4F46E5','#059669','#7C3AED','#D97706'].map((c,i) => (
                <div key={i} className={styles.heroAvatar} style={{ background: `linear-gradient(135deg, ${c}, ${c}aa)`, zIndex: 4 - i }} />
              ))}
            </div>
            <span className={styles.heroSocialText}>
              <strong>2,400+</strong> job seekers hired this month
            </span>
            <span className={styles.heroBadgeLive}>
              <span className={styles.badgeDot} />
              Live
            </span>
          </div>

          <h1 className={styles.heroTitle}>
            Land Your Dream Job
            <br />
            <span className={styles.heroGradient}>Faster with AI</span>
            <br />
            <span className={styles.heroAccent}>Resume Intelligence</span>
          </h1>

          <p className={styles.heroSub}>
            Beat ATS filters, match job descriptions, and generate tailored cover letters
            — all with one AI-powered platform built for modern job seekers.
          </p>

          {/* Hiring companies */}
          <div className={styles.heroCompanies}>
            <span className={styles.heroCompaniesLabel}>Our users hired at</span>
            <div className={styles.heroCompanyLogos}>
              {['Google','Stripe','Meta','Apple','Netflix'].map(name => (
                <span key={name} className={styles.heroCompanyChip}>{name}</span>
              ))}
            </div>
          </div>

          <div className={styles.heroCtas}>
            <Link href="/login" className={styles.ctaPrimary} id="hero-cta-primary">
              Start Building For Free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/login" className={styles.ctaSecondary} id="hero-cta-demo">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Watch Demo
            </Link>
          </div>

          <div className={styles.heroTrust}>
            <span><span className={styles.trustCheck}>✓</span> No signup friction</span>
            <span><span className={styles.trustCheck}>✓</span> Demo login in 1 click</span>
            <span><span className={styles.trustCheck}>✓</span> No credit card ever</span>
          </div>
        </div>

        {/* Enhanced resume card visual */}
        <div className={styles.heroVisual}>
          <div className={styles.visualGlow} />
          <div className={styles.visualRing1} />
          <div className={styles.visualRing2} />

          {/* Main resume mockup card */}
          <div className={styles.resumeCard}>
            {/* Card top bar */}
            <div className={styles.resumeCardTopBar}>
              <div className={styles.resumeCardDots}>
                <span className={styles.dot} style={{background:'#FF5F57'}} />
                <span className={styles.dot} style={{background:'#FEBC2E'}} />
                <span className={styles.dot} style={{background:'#28C840'}} />
              </div>
              <span className={styles.resumeCardTitle}>resume_final_v3.pdf</span>
            </div>

            <div className={styles.resumeCardHeader}>
              <div className={styles.resumeCardAvatar} />
              <div className={styles.resumeCardMeta}>
                <div className={styles.resumeCardName} />
                <div className={styles.resumeCardContact} />
                <div className={styles.resumeCardContact} style={{width:'40%', marginTop: 4}} />
              </div>
            </div>

            {/* Score bar inside card */}
            <div className={styles.resumeCardScoreRow}>
              <span className={styles.resumeCardScoreLabel}>ATS Compatibility</span>
              <div className={styles.resumeCardScoreTrack}>
                <div className={styles.resumeCardScoreFill} />
              </div>
              <span className={styles.resumeCardScoreNum}>87%</span>
            </div>

            <div className={styles.resumeCardSection}>
              <div className={styles.resumeCardLabel} />
              <div className={styles.resumeCardLine} style={{ width: '90%' }} />
              <div className={styles.resumeCardLine} style={{ width: '75%' }} />
              <div className={styles.resumeCardLine} style={{ width: '60%' }} />
            </div>
            <div className={styles.resumeCardSection}>
              <div className={styles.resumeCardLabel} />
              <div className={styles.resumeCardLine} style={{ width: '80%' }} />
              <div className={styles.resumeCardLine} style={{ width: '65%' }} />
            </div>
            <div className={styles.resumeCardSection}>
              <div className={styles.resumeCardLabel} />
              <div className={styles.resumeCardSkills}>
                <div className={styles.skillPill} />
                <div className={styles.skillPill} style={{ width: 48 }} />
                <div className={styles.skillPill} style={{ width: 60 }} />
                <div className={styles.skillPill} style={{ width: 44 }} />
              </div>
            </div>

            {/* ATS Score badge */}
            <div className={styles.atsBadge}>
              <div className={styles.atsRing}>
                <svg width="60" height="60" viewBox="0 0 60 60">
                  <circle cx="30" cy="30" r="24" fill="none" stroke="rgba(79,70,229,0.08)" strokeWidth="5"/>
                  <circle cx="30" cy="30" r="24" fill="none" stroke="url(#scoreGrad)" strokeWidth="5"
                    strokeDasharray="150.8" strokeDashoffset="20" strokeLinecap="round"
                    transform="rotate(-90 30 30)" className={styles.atsArc}/>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4F46E5"/>
                      <stop offset="100%" stopColor="#7C3AED"/>
                    </linearGradient>
                  </defs>
                </svg>
                <span className={styles.atsScore}>87</span>
              </div>
              <div>
                <div className={styles.atsLabel}>ATS Score</div>
                <div className={styles.atsSubLabel}>↑ from 52</div>
              </div>
            </div>

            {/* Keyword match chip */}
            <div className={styles.keywordChip}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              14 keywords matched
            </div>
          </div>

          {/* Floating badges */}
          <div className={`${styles.floatBadge} ${styles.floatBadge1}`}>
            <span className={styles.floatBadgeIcon}>⚡</span>
            <div className={styles.floatBadgeContent}>
              <span className={styles.floatBadgeTitle}>AI Optimized</span>
              <span className={styles.floatBadgeSub}>3 bullets improved</span>
            </div>
          </div>
          <div className={`${styles.floatBadge} ${styles.floatBadge2}`}>
            <span className={styles.floatBadgeIcon}>🎯</span>
            <div className={styles.floatBadgeContent}>
              <span className={styles.floatBadgeTitle}>92% Match</span>
              <span className={styles.floatBadgeSub}>vs. job description</span>
            </div>
          </div>
          <div className={`${styles.floatBadge} ${styles.floatBadge3}`}>
            <span className={styles.floatBadgeIcon}>📄</span>
            <div className={styles.floatBadgeContent}>
              <span className={styles.floatBadgeTitle}>PDF Ready</span>
              <span className={styles.floatBadgeSub}>ATS-friendly format</span>
            </div>
          </div>
          <div className={`${styles.floatBadge} ${styles.floatBadge4}`}>
            <span className={styles.floatBadgeIcon}>✉️</span>
            <div className={styles.floatBadgeContent}>
              <span className={styles.floatBadgeTitle}>Cover Letter</span>
              <span className={styles.floatBadgeSub}>Generated in 8s</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.stats}>
        {STATS.map(({ value, label, color, icon, sub }) => (
          <div key={label} className={styles.statItem}>
            <div className={styles.statIconWrap} style={{ background: `${color}14`, color }}>{icon}</div>
            <div className={styles.statValue} style={{ color }}>{value}</div>
            <div className={styles.statLabel}>{label}</div>
            {sub && <div className={styles.statSub}>{sub}</div>}
          </div>
        ))}
      </section>

      {/* Features */}
      <section className={styles.features} id="features">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>✦ Features</div>
          <h2 className={styles.sectionTitle}>Everything you need to get hired</h2>
          <p className={styles.sectionSub}>One powerful platform for your entire job search resume workflow</p>
        </div>
        <div className={styles.featureGrid}>
          {FEATURES.map((feature) => (
            <Link href="/login" key={feature.title} className={styles.featureCard} style={{ '--feature-color': feature.color, '--feature-bg': feature.bg } as React.CSSProperties}>
              <div className={styles.featureCardTopBar} style={{ background: feature.color }} />
              <div className={styles.featureCardInner}>
                <div className={styles.featureCardHeader}>
                  <div className={styles.featureIconWrap}>
                    <div className={styles.featureIcon} style={{ background: feature.bg, color: feature.color }}>
                      {feature.icon}
                    </div>
                    <div className={styles.featureIconGlow} style={{ background: feature.color }} />
                  </div>
                  {feature.badge && (
                    <span className={styles.featureBadge} style={{ background: feature.bg, color: feature.color }}>{feature.badge}</span>
                  )}
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDesc}>{feature.desc}</p>
                <ul className={styles.featureBullets}>
                  {feature.bullets.map((b) => (
                    <li key={b} className={styles.featureBullet}>
                      <span className={styles.featureBulletDot} style={{ background: feature.color }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.featureCardFooter}>
                <span className={styles.featureLink} style={{ color: feature.color }}>Explore feature</span>
                <span className={styles.featureArrow} style={{ color: feature.color }}>→</span>
              </div>
              <div className={styles.featureShimmer} />
            </Link>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className={styles.comparison}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>Why ResumeAI</div>
          <h2 className={styles.sectionTitle}>Stop guessing, start landing interviews</h2>
          <p className={styles.sectionSub}>See the difference AI makes in your job search</p>
        </div>
        <div className={styles.comparisonTable}>
          <div className={styles.comparisonHeader}>
            <div className={styles.comparisonFeature}></div>
            <div className={styles.comparisonColHeader}>
              <div className={styles.comparisonColBefore}>Without AI</div>
            </div>
            <div className={`${styles.comparisonColHeader} ${styles.comparisonColAfterHeader}`}>
              <div className={styles.comparisonColAfterLabel}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                With ResumeAI
              </div>
            </div>
          </div>
          {COMPARISON_ROWS.map((row) => (
            <div key={row.feature} className={styles.comparisonRow}>
              <div className={styles.comparisonFeature}>{row.feature}</div>
              <div className={styles.comparisonCell}>
                <span className={styles.comparisonNo}>✗</span>
                <span>{row.without}</span>
              </div>
              <div className={`${styles.comparisonCell} ${styles.comparisonCellAfter}`}>
                <span className={styles.comparisonYes}>✓</span>
                <span>{row.with}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className={styles.howItWorks} id="how-it-works">
        <div className={styles.howItWorksBg} />
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>⚡ Process</div>
          <h2 className={styles.sectionTitle}>How it works</h2>
          <p className={styles.sectionSub}>Get from resume to interview-ready in under 5 minutes</p>
        </div>
        <div className={styles.stepsWrapper}>
          <div className={styles.stepsTrack} />
          <div className={styles.steps}>
            {STEPS.map((step, i) => (
              <Link href="/login" key={step.title} className={styles.step} style={{ '--step-color': step.color, '--step-bg': step.bg, animationDelay: `${i * 120}ms` } as React.CSSProperties}>
                <div className={styles.stepTopSection}>
                  <div className={styles.stepNumBadge}>
                    <div className={styles.stepNum} style={{ background: `linear-gradient(135deg, ${step.color}, ${step.colorAlt})` }}>{i + 1}</div>
                    <div className={styles.stepNumRing} style={{ borderColor: step.color }} />
                  </div>
                  <div className={styles.stepIconWrap} style={{ background: step.bg, color: step.color }}>
                    {step.icon}
                  </div>
                </div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.desc}</p>
                  <ul className={styles.stepPerks}>
                    {step.perks.map((p) => (
                      <li key={p} className={styles.stepPerk}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ color: step.color, flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={styles.stepCta} style={{ color: step.color }}>
                  <span>Get started</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
                <div className={styles.stepGlow} style={{ background: step.bg }} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonials} id="testimonials">
        <div className={styles.testimonialsBg} />
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>★ Success Stories</div>
          <h2 className={styles.sectionTitle}>Trusted by job seekers worldwide</h2>
          <p className={styles.sectionSub}>Join thousands who improved their ATS scores and landed interviews</p>
        </div>

        {/* Rating Summary */}
        <div className={styles.ratingSummary}>
          <div className={styles.ratingSummaryStars}>
            {'★★★★★'.split('').map((s, i) => <span key={i} className={styles.ratingSummaryStar}>{s}</span>)}
          </div>
          <span className={styles.ratingSummaryScore}>4.9 out of 5</span>
          <span className={styles.ratingSummaryDivider} />
          <span className={styles.ratingSummaryCount}>2,400+ verified reviews</span>
          <span className={styles.ratingSummaryDivider} />
          <div className={styles.ratingSummaryBars}>
            {[5,4,3].map((n, i) => (
              <div key={n} className={styles.ratingSummaryBar}>
                <span className={styles.ratingSummaryBarLabel}>{n}★</span>
                <div className={styles.ratingSummaryBarTrack}>
                  <div className={styles.ratingSummaryBarFill} style={{ width: i === 0 ? '85%' : i === 1 ? '12%' : '3%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.testimonialGrid}>
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} className={styles.testimonialCard} style={{ '--t-color': t.color, animationDelay: `${i * 150}ms` } as React.CSSProperties}>
              <div className={styles.testimonialAccentBar} style={{ background: `linear-gradient(90deg, ${t.color}, transparent)` }} />
              <div className={styles.testimonialQuoteMark}>&ldquo;</div>
              <div className={styles.testimonialStars}>
                {'★★★★★'.split('').map((s, i) => (
                  <span key={i} className={styles.star}>{s}</span>
                ))}
                <span className={styles.testimonialVerified}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
                  Verified
                </span>
              </div>
              <p className={styles.testimonialText}>{t.quote}</p>
              <div className={styles.testimonialImpact} style={{ borderColor: `${t.color}33`, background: `${t.color}0a` }}>
                <span className={styles.testimonialImpactIcon} style={{ color: t.color }}>↑</span>
                <span className={styles.testimonialImpactText}>{t.impact}</span>
              </div>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar} style={{ background: `linear-gradient(135deg, ${t.color}, ${t.colorAlt})` }}>
                  {t.initials}
                </div>
                <div className={styles.testimonialMeta}>
                  <div className={styles.testimonialName}>{t.name}</div>
                  <div className={styles.testimonialRole}>{t.role}</div>
                </div>
                <div className={styles.testimonialScore} style={{ color: t.color }}>
                  <span className={styles.testimonialScoreNum}>{t.score}</span>
                  <span className={styles.testimonialScoreLabel}>ATS Score</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaBannerOrb1} />
        <div className={styles.ctaBannerOrb2} />
        <div className={styles.ctaBannerMesh} />
        <div className={styles.ctaBannerContent}>
          <div className={styles.ctaBannerBadge}>🚀 Start Free Today</div>
          <h2 className={styles.ctaBannerTitle}>Ready to land your dream job?</h2>
          <p className={styles.ctaBannerSub}>
            Join thousands of job seekers who improved their ATS scores and landed more interviews.
            No credit card required.
          </p>
          <Link href="/login" className={styles.ctaPrimary}>
            Get Started — It&apos;s Free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
          <div className={styles.ctaBannerTrust}>
            <span>✓ Free forever</span>
            <span>✓ No credit card</span>
            <span>✓ Ready in 5 minutes</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <div className={styles.navLogo}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <span className={styles.footerBrandName}>ResumeAI</span>
          </div>
          <div className={styles.footerLinks}>
            <Link href="/login">Dashboard</Link>
            <Link href="/login">Resume Builder</Link>
            <Link href="/login">ATS Checker</Link>
            <Link href="/login">Privacy</Link>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p className={styles.footerNote}>
            * ATS scores are generated by this application and do not represent the proprietary scoring system of any specific ATS vendor.
          </p>
          <p className={styles.footerCopy}>© 2026 ResumeAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const STATS = [
  { value: '95%', label: 'ATS Pass Rate', color: '#4F46E5', icon: '📊', sub: 'vs 41% average' },
  { value: '3×', label: 'More Interviews', color: '#059669', icon: '🚀', sub: 'within 30 days' },
  { value: '< 5 min', label: 'To Analyze', color: '#D97706', icon: '⚡', sub: 'instant optimization' },
  { value: '100%', label: 'Free to Use', color: '#7C3AED', icon: '🎁', sub: 'no card required' },
];

const FEATURES = [
  {
    title: 'ATS Resume Checker',
    desc: 'Upload your resume and instantly get a detailed ATS compatibility score with actionable recommendations.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
    color: '#4F46E5', bg: '#4F46E514',
    badge: 'Most Popular',
    bullets: ['Real-time ATS score', 'Section-by-section feedback', 'Keyword gap analysis'],
  },
  {
    title: 'Resume Builder',
    desc: 'Build ATS-optimized resumes with 3 professional templates. Live preview as you type.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    color: '#059669', bg: '#05966914',
    badge: null,
    bullets: ['3 professional templates', 'Live real-time preview', 'Drag-and-drop sections'],
  },
  {
    title: 'Job Description Matcher',
    desc: 'Compare your resume against any job posting and see exactly which skills and keywords are missing.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
    color: '#D97706', bg: '#D9770614',
    badge: null,
    bullets: ['Paste any job description', 'Missing keyword highlights', 'Match score percentage'],
  },
  {
    title: 'AI Bullet Optimizer',
    desc: 'Transform weak experience bullets into powerful, achievement-focused statements using AI.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    color: '#7C3AED', bg: '#7C3AED14',
    badge: 'AI-Powered',
    bullets: ['Strong action verbs', 'Quantified achievements', 'Industry-specific language'],
  },
  {
    title: 'Cover Letter Generator',
    desc: 'Generate tailored, professional cover letters that perfectly match your resume to the job.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    color: '#DC2626', bg: '#DC262614',
    badge: 'New',
    bullets: ['Auto-tailored to the role', 'Professional tone & format', 'Ready in under 10 seconds'],
  },
  {
    title: 'PDF & DOCX Export',
    desc: 'Export your polished resume as a professional PDF or Word document ready to submit.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    color: '#0891B2', bg: '#0891B214',
    badge: null,
    bullets: ['Pixel-perfect formatting', 'ATS-friendly PDF output', 'DOCX for further editing'],
  },
];

const STEPS = [
  {
    title: 'Upload or Build Your Resume',
    desc: 'Upload an existing PDF/DOCX or start fresh with our AI-powered builder and 3 professional templates.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
    color: '#4F46E5', colorAlt: '#7C3AED', bg: '#4F46E514',
    perks: ['Supports PDF & DOCX upload', '3 ATS-friendly templates', 'Instant live preview'],
  },
  {
    title: 'Get Your ATS Score',
    desc: 'Our engine analyzes formatting, keywords, and content quality, giving you a precise ATS score with detailed section feedback.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
    color: '#059669', colorAlt: '#0891B2', bg: '#05966914',
    perks: ['Detailed score breakdown', 'Formatting & keyword checks', 'Actionable fix suggestions'],
  },
  {
    title: 'Match Against Job Descriptions',
    desc: 'Paste any job description to see exactly which skills and keywords you are missing to maximize your match rate.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    color: '#D97706', colorAlt: '#DC2626', bg: '#D9770614',
    perks: ['Side-by-side comparison', 'Missing keyword highlights', 'Match percentage score'],
  },
  {
    title: 'Optimize & Export',
    desc: 'Use AI to strengthen bullet points, generate a professional summary, write a cover letter, then export a perfect PDF.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    color: '#7C3AED', colorAlt: '#4F46E5', bg: '#7C3AED14',
    perks: ['AI bullet point optimizer', 'Cover letter in seconds', 'Perfect PDF/DOCX export'],
  },
];

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer at Google',
    initials: 'SC',
    color: '#4F46E5',
    colorAlt: '#7C3AED',
    score: '94/100',
    impact: 'ATS score jumped from 58 → 94 in one afternoon',
    quote: 'ResumeAI helped me go from a 58 ATS score to 94 in one afternoon. The keyword analysis was spot-on — I got callbacks from 4 companies the following week.',
  },
  {
    name: 'Marcus Johnson',
    role: 'Product Manager at Stripe',
    initials: 'MJ',
    color: '#059669',
    colorAlt: '#0891B2',
    score: '91/100',
    impact: 'Landed 3 interviews in 2 weeks after months of silence',
    quote: 'I was applying for months with no responses. After using ResumeAI\'s job matcher, I tailored my resume to each role and landed 3 interviews in 2 weeks.',
  },
  {
    name: 'Priya Nair',
    role: 'Data Scientist at Meta',
    initials: 'PN',
    color: '#7C3AED',
    colorAlt: '#DC2626',
    score: '89/100',
    impact: 'Rewrote entire experience section in under 10 minutes',
    quote: 'The AI bullet optimizer transformed my experience section completely. Each bullet now starts with a strong action verb and quantifiable impact. Game changer!',
  },
];

const COMPARISON_ROWS = [
  { feature: 'ATS Score Visibility', without: 'Guessing in the dark', with: 'Real-time score with breakdown' },
  { feature: 'Keyword Matching', without: 'Manual, time-consuming', with: 'Instant JD keyword analysis' },
  { feature: 'Resume Quality', without: 'Generic bullets & formatting', with: 'AI-powered bullet optimization' },
  { feature: 'Job Tailoring', without: 'Same resume everywhere', with: 'Custom-fit for each role' },
  { feature: 'Cover Letters', without: 'Hours of writing', with: 'AI-generated in seconds' },
  { feature: 'Export Quality', without: 'Inconsistent formatting', with: 'Perfect PDF & DOCX output' },
];
