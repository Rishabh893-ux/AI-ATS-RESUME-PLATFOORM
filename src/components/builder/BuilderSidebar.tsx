'use client';

import { useState } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { useUIStore } from '@/store/uiStore';
import { 
  User, AlignLeft, Briefcase, GraduationCap, 
  Wrench, FolderGit2, Award, Trophy, ChevronDown, ChevronRight, Plus, Trash2, Sparkles, Loader2 
} from 'lucide-react';
import Button from '@/components/ui/Button';
import styles from './BuilderSidebar.module.css';

const SECTIONS = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'summary', label: 'Professional Summary', icon: AlignLeft },
  { id: 'experience', label: 'Work Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'certifications', label: 'Certifications', icon: Award },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
] as const;

export default function BuilderSidebar() {
  const { 
    resume, activeSection, setActiveSection,
    updatePersonalInfo, updateSummary,
    addExperience, updateExperience, removeExperience, addExpBullet, updateExpBullet, removeExpBullet,
    addEducation, updateEducation, removeEducation,
    addSkillCategory, updateSkillCategory, removeSkillCategory,
    addProject, updateProject, removeProject, addProjectBullet, updateProjectBullet, removeProjectBullet,
    addCertification, updateCertification, removeCertification,
    addAchievement, updateAchievement, removeAchievement
  } = useResumeStore();
  const { addToast } = useUIStore();

  const [enhancingField, setEnhancingField] = useState<string | null>(null);

  const handleEnhance = async (fieldId: string, type: 'summary' | 'bullet', text: string, context?: any) => {
    if (!text.trim()) return;
    setEnhancingField(fieldId);
    try {
      const payload = type === 'summary' 
        ? { action: 'summary', resumeData: resume }
        : { action: 'bullet', bullet: text, context };
        
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to enhance');
      
      const enhancedText = type === 'summary' ? data.result : data.result.improvedBullet;
      
      if (type === 'summary') {
        updateSummary(enhancedText);
      } else if (type === 'bullet') {
        const { itemId, bulletIndex, section } = context;
        if (section === 'experience') updateExpBullet(itemId, bulletIndex, enhancedText);
        if (section === 'projects') updateProjectBullet(itemId, bulletIndex, enhancedText);
        if (section === 'achievements') updateAchievement(itemId, { description: enhancedText });
      }
    } catch (err: any) {
      console.error(err);
      addToast({ type: 'error', message: err.message || 'AI enhancement failed' });
    } finally {
      setEnhancingField(null);
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.nav}>
        {SECTIONS.map((sec) => {
          const Icon = sec.icon;
          return (
            <button
              key={sec.id}
              className={`${styles.navItem} ${activeSection === sec.id ? styles.active : ''}`}
              onClick={() => setActiveSection(sec.id as any)}
            >
              <Icon size={16} />
              {sec.label}
              <ChevronRight size={14} className={styles.navArrow} />
            </button>
          );
        })}
      </div>

      <div className={styles.content}>
        {activeSection === 'personal' && (
          <div className={styles.form}>
            <div className={styles.field}>
              <label>Full Name</label>
              <input value={resume.personalInfo.name} onChange={e => updatePersonalInfo({ name: e.target.value })} />
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label>Email</label>
                <input value={resume.personalInfo.email} onChange={e => updatePersonalInfo({ email: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label>Phone</label>
                <input value={resume.personalInfo.phone} onChange={e => updatePersonalInfo({ phone: e.target.value })} />
              </div>
            </div>
            <div className={styles.field}>
              <label>Location (City, State)</label>
              <input value={resume.personalInfo.location} onChange={e => updatePersonalInfo({ location: e.target.value })} />
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label>LinkedIn URL</label>
                <input value={resume.personalInfo.linkedin} onChange={e => updatePersonalInfo({ linkedin: e.target.value })} />
              </div>
              <div className={styles.field}>
                <label>GitHub/Portfolio</label>
                <input value={resume.personalInfo.github} onChange={e => updatePersonalInfo({ github: e.target.value })} />
              </div>
            </div>
          </div>
        )}

        {activeSection === 'summary' && (
          <div className={styles.form}>
            <div className={styles.field}>
              <div className={styles.labelRow}>
                <label>Professional Summary</label>
                <button 
                  type="button"
                  className={styles.enhanceBtn}
                  onClick={(e) => { e.preventDefault(); handleEnhance('summary', 'summary', resume.summary); }}
                  disabled={enhancingField === 'summary' || !resume.summary}
                  title="Enhance with AI"
                >
                  {enhancingField === 'summary' ? <Loader2 size={14} className={styles.spin} /> : <Sparkles size={14} />}
                </button>
              </div>
              <textarea 
                rows={8} 
                value={resume.summary} 
                onChange={e => updateSummary(e.target.value)} 
                placeholder="Briefly summarize your professional background..."
              />
            </div>
          </div>
        )}

        {activeSection === 'experience' && (
          <div className={styles.form}>
            {resume.experience.map((exp, i) => (
              <div key={exp.id} className={styles.itemCard}>
                <div className={styles.itemHeader}>
                  <h4>{exp.jobTitle || 'New Experience'}</h4>
                  <button onClick={() => removeExperience(exp.id)} className={styles.deleteBtn}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label>Job Title</label>
                    <input value={exp.jobTitle} onChange={e => updateExperience(exp.id, { jobTitle: e.target.value })} />
                  </div>
                  <div className={styles.field}>
                    <label>Company</label>
                    <input value={exp.company} onChange={e => updateExperience(exp.id, { company: e.target.value })} />
                  </div>
                </div>
                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label>Start Date</label>
                    <input value={exp.startDate} onChange={e => updateExperience(exp.id, { startDate: e.target.value })} />
                  </div>
                  <div className={styles.field}>
                    <label>End Date</label>
                    <input value={exp.endDate} onChange={e => updateExperience(exp.id, { endDate: e.target.value })} disabled={exp.current} />
                  </div>
                </div>
                
                <div className={styles.bullets}>
                  <label>Bullets</label>
                  {exp.bullets.map((b, bi) => (
                    <div key={bi} className={styles.bulletRow}>
                      <textarea 
                        value={b} 
                        onChange={e => updateExpBullet(exp.id, bi, e.target.value)} 
                        rows={2}
                      />
                      <div className={styles.bulletActions}>
                        <button 
                          type="button"
                          onClick={(e) => { e.preventDefault(); handleEnhance(`exp-${exp.id}-${bi}`, 'bullet', b, { section: 'experience', itemId: exp.id, bulletIndex: bi, jobTitle: exp.jobTitle, company: exp.company }); }}
                          className={styles.enhanceBtn}
                          disabled={enhancingField === `exp-${exp.id}-${bi}` || !b}
                          title="Enhance with AI"
                        >
                          {enhancingField === `exp-${exp.id}-${bi}` ? <Loader2 size={14} className={styles.spin} /> : <Sparkles size={14} />}
                        </button>
                        <button type="button" onClick={(e) => { e.preventDefault(); removeExpBullet(exp.id, bi); }} className={styles.deleteBtn} title="Delete bullet">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="secondary" size="sm" onClick={(e) => { e.preventDefault(); addExpBullet(exp.id); }} leftIcon={<Plus size={14}/>}>
                    Add Bullet
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="primary" onClick={addExperience} leftIcon={<Plus size={16}/>}>
              Add Experience
            </Button>
          </div>
        )}

        {activeSection === 'education' && (
          <div className={styles.form}>
            {resume.education.map((edu) => (
              <div key={edu.id} className={styles.itemCard}>
                <div className={styles.itemHeader}>
                  <h4>{edu.degree || 'New Education'}</h4>
                  <button onClick={() => removeEducation(edu.id)} className={styles.deleteBtn}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className={styles.field}>
                  <label>Degree / Certificate</label>
                  <input value={edu.degree} onChange={e => updateEducation(edu.id, { degree: e.target.value })} />
                </div>
                <div className={styles.field}>
                  <label>School / Institution</label>
                  <input value={edu.institution} onChange={e => updateEducation(edu.id, { institution: e.target.value })} />
                </div>
                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label>Location (Optional)</label>
                    <input value={edu.location || ''} onChange={e => updateEducation(edu.id, { location: e.target.value })} />
                  </div>
                  <div className={styles.field}>
                    <label>GPA (Optional)</label>
                    <input value={edu.gpa || ''} onChange={e => updateEducation(edu.id, { gpa: e.target.value })} />
                  </div>
                </div>
                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label>Start</label>
                    <input value={edu.startDate} onChange={e => updateEducation(edu.id, { startDate: e.target.value })} />
                  </div>
                  <div className={styles.field}>
                    <label>End</label>
                    <input value={edu.endDate} onChange={e => updateEducation(edu.id, { endDate: e.target.value })} />
                  </div>
                </div>
              </div>
            ))}
            <Button variant="primary" onClick={addEducation} leftIcon={<Plus size={16}/>}>
              Add Education
            </Button>
          </div>
        )}

        {activeSection === 'skills' && (
          <div className={styles.form}>
            {resume.skills.map((cat) => (
              <div key={cat.id} className={styles.itemCard}>
                 <div className={styles.itemHeader}>
                  <input 
                    className={styles.catInput}
                    value={cat.category} 
                    onChange={e => updateSkillCategory(cat.id, { category: e.target.value })} 
                  />
                  <button onClick={() => removeSkillCategory(cat.id)} className={styles.deleteBtn}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className={styles.field}>
                  <label>Skills (comma separated)</label>
                  <textarea 
                    value={cat.items.join(', ')} 
                    onChange={e => updateSkillCategory(cat.id, { items: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    rows={3}
                  />
                </div>
              </div>
            ))}
            <Button variant="primary" onClick={() => addSkillCategory()} leftIcon={<Plus size={16}/>}>
              Add Skill Category
            </Button>
          </div>
        )}
        
        {activeSection === 'projects' && (
          <div className={styles.form}>
            {resume.projects.map((proj) => (
              <div key={proj.id} className={styles.itemCard}>
                <div className={styles.itemHeader}>
                  <h4>{proj.name || 'New Project'}</h4>
                  <button onClick={() => removeProject(proj.id)} className={styles.deleteBtn}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className={styles.field}>
                  <label>Project Name</label>
                  <input value={proj.name} onChange={e => updateProject(proj.id, { name: e.target.value })} />
                </div>
                <div className={styles.field}>
                  <label>Description (Optional)</label>
                  <input value={proj.description || ''} onChange={e => updateProject(proj.id, { description: e.target.value })} />
                </div>
                <div className={styles.field}>
                  <label>Technologies Used (comma separated)</label>
                  <input 
                    value={proj.technologies.join(', ')} 
                    onChange={e => updateProject(proj.id, { technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} 
                  />
                </div>
                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label>GitHub URL</label>
                    <input value={proj.githubUrl || ''} onChange={e => updateProject(proj.id, { githubUrl: e.target.value })} />
                  </div>
                  <div className={styles.field}>
                    <label>Live URL</label>
                    <input value={proj.liveUrl || ''} onChange={e => updateProject(proj.id, { liveUrl: e.target.value })} />
                  </div>
                </div>
                
                <div className={styles.bullets}>
                  <label>Highlights / Bullets</label>
                  {proj.bullets.map((b, bi) => (
                    <div key={bi} className={styles.bulletRow}>
                      <textarea 
                        value={b} 
                        onChange={e => updateProjectBullet(proj.id, bi, e.target.value)} 
                        rows={2}
                      />
                      <div className={styles.bulletActions}>
                        <button 
                          type="button"
                          onClick={(e) => { e.preventDefault(); handleEnhance(`proj-${proj.id}-${bi}`, 'bullet', b, { section: 'projects', itemId: proj.id, bulletIndex: bi, technologies: proj.technologies }); }}
                          className={styles.enhanceBtn}
                          disabled={enhancingField === `proj-${proj.id}-${bi}` || !b}
                          title="Enhance with AI"
                        >
                          {enhancingField === `proj-${proj.id}-${bi}` ? <Loader2 size={14} className={styles.spin} /> : <Sparkles size={14} />}
                        </button>
                        <button type="button" onClick={(e) => { e.preventDefault(); removeProjectBullet(proj.id, bi); }} className={styles.deleteBtn} title="Delete bullet">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="secondary" size="sm" onClick={(e) => { e.preventDefault(); addProjectBullet(proj.id); }} leftIcon={<Plus size={14}/>}>
                    Add Bullet
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="primary" onClick={addProject} leftIcon={<Plus size={16}/>}>
              Add Project
            </Button>
          </div>
        )}

        {activeSection === 'certifications' && (
          <div className={styles.form}>
            {resume.certifications.map((cert) => (
              <div key={cert.id} className={styles.itemCard}>
                <div className={styles.itemHeader}>
                  <h4>{cert.name || 'New Certification'}</h4>
                  <button onClick={() => removeCertification(cert.id)} className={styles.deleteBtn}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className={styles.field}>
                  <label>Certification Name</label>
                  <input value={cert.name} onChange={e => updateCertification(cert.id, { name: e.target.value })} />
                </div>
                <div className={styles.field}>
                  <label>Issuer / Organization</label>
                  <input value={cert.issuer} onChange={e => updateCertification(cert.id, { issuer: e.target.value })} />
                </div>
                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label>Date</label>
                    <input value={cert.date || ''} onChange={e => updateCertification(cert.id, { date: e.target.value })} />
                  </div>
                  <div className={styles.field}>
                    <label>Credential URL</label>
                    <input value={cert.credentialUrl || ''} onChange={e => updateCertification(cert.id, { credentialUrl: e.target.value })} />
                  </div>
                </div>
              </div>
            ))}
            <Button variant="primary" onClick={addCertification} leftIcon={<Plus size={16}/>}>
              Add Certification
            </Button>
          </div>
        )}

        {activeSection === 'achievements' && (
          <div className={styles.form}>
            {resume.achievements.map((ach) => (
              <div key={ach.id} className={styles.itemCard}>
                <div className={styles.itemHeader}>
                  <h4>{ach.title || 'New Achievement'}</h4>
                  <button onClick={() => removeAchievement(ach.id)} className={styles.deleteBtn}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className={styles.field}>
                  <label>Title</label>
                  <input value={ach.title} onChange={e => updateAchievement(ach.id, { title: e.target.value })} />
                </div>
                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label>Date</label>
                    <input value={ach.date || ''} onChange={e => updateAchievement(ach.id, { date: e.target.value })} />
                  </div>
                </div>
                <div className={styles.field}>
                  <div className={styles.labelRow}>
                    <label>Description (Optional)</label>
                    <button 
                      type="button"
                      className={styles.enhanceBtn}
                      onClick={(e) => { e.preventDefault(); handleEnhance(`ach-${ach.id}`, 'bullet', ach.description || '', { section: 'achievements', itemId: ach.id, bulletIndex: 0, title: ach.title }); }}
                      disabled={enhancingField === `ach-${ach.id}` || !ach.description}
                      title="Enhance with AI"
                    >
                      {enhancingField === `ach-${ach.id}` ? <Loader2 size={14} className={styles.spin} /> : <Sparkles size={14} />}
                    </button>
                  </div>
                   <textarea 
                    value={ach.description || ''} 
                    onChange={e => updateAchievement(ach.id, { description: e.target.value })} 
                    rows={2}
                  />
                </div>
              </div>
            ))}
            <Button variant="primary" onClick={addAchievement} leftIcon={<Plus size={16}/>}>
              Add Achievement
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}
