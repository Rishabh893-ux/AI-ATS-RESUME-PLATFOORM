'use client';

import { useResumeStore } from '@/store/resumeStore';
import styles from './ResumePreview.module.css';

export default function ResumePreview() {
  const { resume } = useResumeStore();
  const template = resume.template || 'professional';

  if (template === 'modern') return <ModernTemplate resume={resume} />;
  if (template === 'minimal') return <MinimalTemplate resume={resume} />;
  return <ClassicTemplate resume={resume} />;
}

/* ══════════════════════════════════════════════
   CLASSIC TEMPLATE (default / professional)
══════════════════════════════════════════════ */
function ClassicTemplate({ resume }: { resume: any }) {
  return (
    <div className={`${styles.a4Page} ${styles.classic}`}>
      {/* Header */}
      <div className={styles.classicHeader}>
        <h1 className={styles.classicName}>{resume.personalInfo.name || 'Your Name'}</h1>
        <div className={styles.classicContact}>
          {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
          {resume.personalInfo.phone && <><span className={styles.sep}>•</span><span>{resume.personalInfo.phone}</span></>}
          {resume.personalInfo.location && <><span className={styles.sep}>•</span><span>{resume.personalInfo.location}</span></>}
        </div>
        <div className={styles.classicLinks}>
          {resume.personalInfo.linkedin && <a href={resume.personalInfo.linkedin}>{resume.personalInfo.linkedin.replace('https://www.','').replace('https://','')}</a>}
          {resume.personalInfo.github && <><span className={styles.sep}>•</span><a href={resume.personalInfo.github}>{resume.personalInfo.github.replace('https://','')}</a></>}
        </div>
      </div>

      {resume.summary && (
        <Section title="Summary" styles={styles}>
          <p className={styles.summaryText}>{resume.summary}</p>
        </Section>
      )}

      {resume.experience.length > 0 && (
        <Section title="Experience" styles={styles}>
          {resume.experience.map((exp: any) => (
            <div key={exp.id} className={styles.entry}>
              <div className={styles.entryHeader}>
                <div className={styles.entryTitle}><strong>{exp.jobTitle || 'Job Title'}</strong> — {exp.company || 'Company'}</div>
                <div className={styles.entryDate}>{exp.startDate}{exp.startDate ? ' – ' : ''}{exp.current ? 'Present' : exp.endDate}</div>
              </div>
              {exp.bullets.length > 0 && (
                <ul className={styles.bullets}>
                  {exp.bullets.filter(Boolean).map((b: string, i: number) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {resume.education.length > 0 && (
        <Section title="Education" styles={styles}>
          {resume.education.map((edu: any) => (
            <div key={edu.id} className={styles.entry}>
              <div className={styles.entryHeader}>
                <div className={styles.entryTitle}><strong>{edu.institution || 'University'}</strong>{edu.location ? `, ${edu.location}` : ''}</div>
                <div className={styles.entryDate}>{edu.startDate}{edu.startDate ? ' – ' : ''}{edu.endDate}</div>
              </div>
              <div className={styles.entrySubtitle}>{edu.degree}{edu.gpa ? ` • GPA: ${edu.gpa}` : ''}</div>
            </div>
          ))}
        </Section>
      )}

      {resume.skills.length > 0 && (
        <Section title="Skills" styles={styles}>
          {resume.skills.map((cat: any) => (
            <div key={cat.id} className={styles.skillRow}>
              <strong>{cat.category}:</strong> {cat.items.join(', ')}
            </div>
          ))}
        </Section>
      )}

      {resume.projects.length > 0 && (
        <Section title="Projects" styles={styles}>
          {resume.projects.map((proj: any) => (
            <div key={proj.id} className={styles.entry}>
              <div className={styles.entryHeader}>
                <div className={styles.entryTitle}><strong>{proj.name || 'Project Name'}</strong>{proj.technologies.length > 0 && <span className={styles.techBadge}>{proj.technologies.join(', ')}</span>}</div>
                <div className={styles.projectLinks}>
                  {proj.githubUrl && <a href={proj.githubUrl}>GitHub</a>}
                  {proj.liveUrl && <a href={proj.liveUrl}>Live</a>}
                </div>
              </div>
              {proj.description && <p className={styles.entrySubtitle}>{proj.description}</p>}
              {proj.bullets.filter(Boolean).length > 0 && (
                <ul className={styles.bullets}>
                  {proj.bullets.filter(Boolean).map((b: string, i: number) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {resume.certifications.length > 0 && (
        <Section title="Certifications" styles={styles}>
          {resume.certifications.map((cert: any) => (
            <div key={cert.id} className={styles.entry}>
              <div className={styles.entryHeader}>
                <div className={styles.entryTitle}><strong>{cert.name}</strong> — {cert.issuer}</div>
                <div className={styles.entryDate}>{cert.date}</div>
              </div>
              {cert.credentialUrl && <a href={cert.credentialUrl} className={styles.entrySubtitle}>View Credential</a>}
            </div>
          ))}
        </Section>
      )}

      {resume.achievements.length > 0 && (
        <Section title="Achievements" styles={styles}>
          {resume.achievements.map((ach: any) => (
            <div key={ach.id} className={styles.entry}>
              <div className={styles.entryHeader}>
                <div className={styles.entryTitle}><strong>{ach.title || 'Achievement'}</strong></div>
                <div className={styles.entryDate}>{ach.date}</div>
              </div>
              {ach.description && <p className={styles.entrySubtitle}>{ach.description}</p>}
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   MODERN TEMPLATE — Colored accent header
══════════════════════════════════════════════ */
function ModernTemplate({ resume }: { resume: any }) {
  return (
    <div className={`${styles.a4Page} ${styles.modern}`}>
      {/* Accent Header */}
      <div className={styles.modernHeader}>
        <h1 className={styles.modernName}>{resume.personalInfo.name || 'Your Name'}</h1>
        <div className={styles.modernContact}>
          {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
          {resume.personalInfo.phone && <><span className={styles.modernSep}>|</span><span>{resume.personalInfo.phone}</span></>}
          {resume.personalInfo.location && <><span className={styles.modernSep}>|</span><span>{resume.personalInfo.location}</span></>}
          {resume.personalInfo.linkedin && <><span className={styles.modernSep}>|</span><a href={resume.personalInfo.linkedin} className={styles.modernLink}>{resume.personalInfo.linkedin.replace('https://','')}</a></>}
          {resume.personalInfo.github && <><span className={styles.modernSep}>|</span><a href={resume.personalInfo.github} className={styles.modernLink}>{resume.personalInfo.github.replace('https://','')}</a></>}
        </div>
      </div>

      <div className={styles.modernBody}>
        {resume.summary && (
          <ModernSection title="Professional Summary">
            <p className={styles.summaryText}>{resume.summary}</p>
          </ModernSection>
        )}

        {resume.experience.length > 0 && (
          <ModernSection title="Work Experience">
            {resume.experience.map((exp: any) => (
              <div key={exp.id} className={styles.entry}>
                <div className={styles.entryHeader}>
                  <div>
                    <div className={styles.modernEntryTitle}>{exp.jobTitle || 'Job Title'}</div>
                    <div className={styles.modernEntryCompany}>{exp.company || 'Company'}{exp.location ? `, ${exp.location}` : ''}</div>
                  </div>
                  <div className={styles.modernDate}>{exp.startDate}{exp.startDate ? ' – ' : ''}{exp.current ? 'Present' : exp.endDate}</div>
                </div>
                {exp.bullets.filter(Boolean).length > 0 && (
                  <ul className={styles.bullets}>
                    {exp.bullets.filter(Boolean).map((b: string, i: number) => <li key={i}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </ModernSection>
        )}

        {resume.education.length > 0 && (
          <ModernSection title="Education">
            {resume.education.map((edu: any) => (
              <div key={edu.id} className={styles.entry}>
                <div className={styles.entryHeader}>
                  <div>
                    <div className={styles.modernEntryTitle}>{edu.degree || 'Degree'}</div>
                    <div className={styles.modernEntryCompany}>{edu.institution || 'Institution'}{edu.location ? `, ${edu.location}` : ''}</div>
                  </div>
                  <div className={styles.modernDate}>{edu.startDate}{edu.startDate ? ' – ' : ''}{edu.endDate}{edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</div>
                </div>
              </div>
            ))}
          </ModernSection>
        )}

        {resume.skills.length > 0 && (
          <ModernSection title="Skills">
            {resume.skills.map((cat: any) => (
              <div key={cat.id} className={styles.modernSkillRow}>
                <span className={styles.modernSkillCat}>{cat.category}</span>
                <div className={styles.modernSkillChips}>
                  {cat.items.map((item: string) => <span key={item} className={styles.modernChip}>{item}</span>)}
                </div>
              </div>
            ))}
          </ModernSection>
        )}

        {resume.projects.length > 0 && (
          <ModernSection title="Projects">
            {resume.projects.map((proj: any) => (
              <div key={proj.id} className={styles.entry}>
                <div className={styles.entryHeader}>
                  <div className={styles.modernEntryTitle}>{proj.name || 'Project Name'} {proj.technologies.length > 0 && <span className={styles.techBadge}>{proj.technologies.join(', ')}</span>}</div>
                  <div className={styles.projectLinks}>
                    {proj.githubUrl && <a href={proj.githubUrl} className={styles.modernLink}>GitHub</a>}
                    {proj.liveUrl && <a href={proj.liveUrl} className={styles.modernLink}>Live</a>}
                  </div>
                </div>
                {proj.description && <p className={styles.entrySubtitle}>{proj.description}</p>}
                {proj.bullets.filter(Boolean).length > 0 && (
                  <ul className={styles.bullets}>
                    {proj.bullets.filter(Boolean).map((b: string, i: number) => <li key={i}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </ModernSection>
        )}

        {resume.certifications.length > 0 && (
          <ModernSection title="Certifications">
            {resume.certifications.map((cert: any) => (
              <div key={cert.id} className={styles.entry}>
                <div className={styles.entryHeader}>
                  <div>
                    <div className={styles.modernEntryTitle}>{cert.name}</div>
                    <div className={styles.modernEntryCompany}>{cert.issuer}</div>
                  </div>
                  <div className={styles.modernDate}>{cert.date}</div>
                </div>
              </div>
            ))}
          </ModernSection>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MINIMAL TEMPLATE — Clean typography
══════════════════════════════════════════════ */
function MinimalTemplate({ resume }: { resume: any }) {
  return (
    <div className={`${styles.a4Page} ${styles.minimal}`}>
      <div className={styles.minimalHeader}>
        <h1 className={styles.minimalName}>{resume.personalInfo.name || 'Your Name'}</h1>
        <div className={styles.minimalContact}>
          {[resume.personalInfo.email, resume.personalInfo.phone, resume.personalInfo.location]
            .filter(Boolean).join(' · ')}
        </div>
        {(resume.personalInfo.linkedin || resume.personalInfo.github) && (
          <div className={styles.minimalLinks}>
            {resume.personalInfo.linkedin && <a href={resume.personalInfo.linkedin}>{resume.personalInfo.linkedin.replace('https://','')}</a>}
            {resume.personalInfo.github && <a href={resume.personalInfo.github}>{resume.personalInfo.github.replace('https://','')}</a>}
          </div>
        )}
      </div>

      {resume.summary && (
        <MinimalSection title="Summary">
          <p className={styles.summaryText}>{resume.summary}</p>
        </MinimalSection>
      )}

      {resume.experience.length > 0 && (
        <MinimalSection title="Experience">
          {resume.experience.map((exp: any) => (
            <div key={exp.id} className={styles.entry}>
              <div className={styles.minimalEntryHeader}>
                <div>
                  <span className={styles.minimalEntryTitle}>{exp.jobTitle || 'Job Title'}</span>
                  <span className={styles.minimalAt}> at </span>
                  <span className={styles.minimalEntryCompany}>{exp.company || 'Company'}</span>
                </div>
                <div className={styles.minimalDate}>{exp.startDate}{exp.startDate ? ' – ' : ''}{exp.current ? 'Present' : exp.endDate}</div>
              </div>
              {exp.bullets.filter(Boolean).length > 0 && (
                <ul className={styles.minimalBullets}>
                  {exp.bullets.filter(Boolean).map((b: string, i: number) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </MinimalSection>
      )}

      {resume.education.length > 0 && (
        <MinimalSection title="Education">
          {resume.education.map((edu: any) => (
            <div key={edu.id} className={styles.minimalEntryHeader}>
              <div>
                <span className={styles.minimalEntryTitle}>{edu.degree || 'Degree'}</span>
                <span className={styles.minimalAt}>, </span>
                <span className={styles.minimalEntryCompany}>{edu.institution}</span>
                {edu.location && <span className={styles.minimalAt}> · {edu.location}</span>}
                {edu.gpa && <span className={styles.minimalAt}> · GPA: {edu.gpa}</span>}
              </div>
              <div className={styles.minimalDate}>{edu.startDate}{edu.startDate ? ' – ' : ''}{edu.endDate}</div>
            </div>
          ))}
        </MinimalSection>
      )}

      {resume.skills.length > 0 && (
        <MinimalSection title="Skills">
          {resume.skills.map((cat: any) => (
            <div key={cat.id} className={styles.skillRow}>
              <span className={styles.minimalSkillCat}>{cat.category}: </span>
              {cat.items.join(', ')}
            </div>
          ))}
        </MinimalSection>
      )}

      {resume.projects.length > 0 && (
        <MinimalSection title="Projects">
          {resume.projects.map((proj: any) => (
            <div key={proj.id} className={styles.entry}>
              <div className={styles.minimalEntryHeader}>
                <div>
                  <span className={styles.minimalEntryTitle}>{proj.name}</span>
                  {proj.technologies.length > 0 && <span className={styles.minimalTech}> · {proj.technologies.join(', ')}</span>}
                </div>
                <div className={styles.projectLinks}>
                  {proj.githubUrl && <a href={proj.githubUrl}>GitHub</a>}
                  {proj.liveUrl && <a href={proj.liveUrl}>Demo</a>}
                </div>
              </div>
              {proj.description && <p className={styles.minimalDesc}>{proj.description}</p>}
              {proj.bullets.filter(Boolean).length > 0 && (
                <ul className={styles.minimalBullets}>
                  {proj.bullets.filter(Boolean).map((b: string, i: number) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </MinimalSection>
      )}

      {resume.certifications.length > 0 && (
        <MinimalSection title="Certifications">
          {resume.certifications.map((cert: any) => (
            <div key={cert.id} className={styles.minimalEntryHeader}>
              <div><span className={styles.minimalEntryTitle}>{cert.name}</span> — {cert.issuer}</div>
              <div className={styles.minimalDate}>{cert.date}</div>
            </div>
          ))}
        </MinimalSection>
      )}

      {resume.achievements.length > 0 && (
        <MinimalSection title="Achievements">
          {resume.achievements.map((ach: any) => (
            <div key={ach.id} className={styles.entry}>
              <div className={styles.minimalEntryHeader}>
                <span className={styles.minimalEntryTitle}>{ach.title}</span>
                <div className={styles.minimalDate}>{ach.date}</div>
              </div>
              {ach.description && <p className={styles.minimalDesc}>{ach.description}</p>}
            </div>
          ))}
        </MinimalSection>
      )}
    </div>
  );
}

/* ── Shared section wrappers ── */
function Section({ title, children, styles }: { title: string; children: React.ReactNode; styles: any }) {
  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.sectionBody}>{children}</div>
    </div>
  );
}

function ModernSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.modernSection}>
      <div className={styles.modernSectionTitle}>{title}</div>
      <div>{children}</div>
    </div>
  );
}

function MinimalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.minimalSection}>
      <div className={styles.minimalSectionTitle}>{title}</div>
      <div>{children}</div>
    </div>
  );
}
