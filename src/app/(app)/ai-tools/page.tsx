'use client';

import { useState, useEffect } from 'react';
import { Wand2, AlignLeft, Sparkles, Copy, Check, ArrowRight, RefreshCw, ChevronDown } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useUIStore } from '@/store/uiStore';
import styles from './ai-tools.module.css';

type Tool = 'bullet' | 'summary' | 'tailor';

interface Resume {
  _id: string;
  title: string;
}

const TOOLS = [
  {
    id: 'bullet' as Tool,
    label: 'Bullet Optimizer',
    icon: Wand2,
    color: '#4F46E5',
    bg: '#4F46E518',
    desc: 'Transform weak bullets into achievement-focused statements',
  },
  {
    id: 'summary' as Tool,
    label: 'Summary Generator',
    icon: AlignLeft,
    color: '#059669',
    bg: '#05966918',
    desc: 'Generate a professional summary from your resume',
  },
  {
    id: 'tailor' as Tool,
    label: 'Resume Tailor',
    icon: Sparkles,
    color: '#7C3AED',
    bg: '#7C3AED18',
    desc: 'Get AI suggestions to tailor your resume for a specific job',
  },
];

export default function AIToolsPage() {
  const { addToast } = useUIStore();
  const [activeTool, setActiveTool] = useState<Tool>('bullet');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState('');

  // Bullet tool
  const [bulletInput, setBulletInput] = useState('');
  const [bulletHistory, setBulletHistory] = useState<{ original: string; improvedBullet: string; problems: string[]; improvements: string[] }[]>([]);

  // Summary tool
  const [summaryOutput, setSummaryOutput] = useState('');

  // Tailor tool
  const [tailorOutput, setTailorOutput] = useState('');

  useEffect(() => {
    fetch('/api/resumes')
      .then(r => r.json())
      .then(d => {
        setResumes(d.resumes || []);
        if (d.resumes?.[0]) setSelectedResume(d.resumes[0]._id);
      })
      .catch(() => {});
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast({ type: 'success', message: 'Copied to clipboard!' });
  };

  const handleBulletOptimize = async () => {
    if (!bulletInput.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'bullet', bullet: bulletInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBulletHistory(prev => [{ original: bulletInput, ...data.result }, ...prev].slice(0, 3));
      setBulletInput('');
      addToast({ type: 'success', message: 'Bullet optimized!' });
    } catch (err: any) {
      addToast({ type: 'error', message: err.message || 'Failed to optimize bullet' });
    } finally {
      setLoading(false);
    }
  };

  const handleSummaryGenerate = async () => {
    if (!selectedResume) {
      addToast({ type: 'error', message: 'Please select a resume first' });
      return;
    }
    setLoading(true);
    setSummaryOutput('');
    try {
      // Fetch resume data first
      const rRes = await fetch(`/api/resumes/${selectedResume}`);
      const rData = await rRes.json();
      if (!rRes.ok) throw new Error('Failed to load resume');

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'summary', resumeData: rData.resume, targetRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSummaryOutput(data.result);
      addToast({ type: 'success', message: 'Summary generated!' });
    } catch (err: any) {
      addToast({ type: 'error', message: err.message || 'Failed to generate summary' });
    } finally {
      setLoading(false);
    }
  };

  const handleTailor = async () => {
    if (!selectedResume || !jobDescription.trim()) {
      addToast({ type: 'error', message: 'Please select a resume and paste a job description' });
      return;
    }
    setLoading(true);
    setTailorOutput('');
    try {
      const res = await fetch('/api/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId: selectedResume, jobDescription }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTailorOutput(data.suggestions || data.result || JSON.stringify(data, null, 2));
      addToast({ type: 'success', message: 'Tailoring suggestions ready!' });
    } catch (err: any) {
      addToast({ type: 'error', message: err.message || 'Failed to get tailoring suggestions' });
    } finally {
      setLoading(false);
    }
  };

  const activeToolObj = TOOLS.find(t => t.id === activeTool)!;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>AI Resume Tools</h1>
        <p className={styles.subtitle}>Supercharge your resume with AI-powered writing tools</p>
      </div>

      {/* Tool tabs */}
      <div className={styles.toolTabs}>
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              className={`${styles.toolTab} ${activeTool === tool.id ? styles.toolTabActive : ''}`}
              onClick={() => setActiveTool(tool.id)}
            >
              <div className={styles.toolTabIcon} style={{ background: tool.bg, color: tool.color }}>
                <Icon size={18} />
              </div>
              <div className={styles.toolTabContent}>
                <div className={styles.toolTabLabel}>{tool.label}</div>
                <div className={styles.toolTabDesc}>{tool.desc}</div>
              </div>
              {activeTool === tool.id && <div className={styles.toolTabActive} />}
            </button>
          );
        })}
      </div>

      {/* Tool workspace */}
      <div className={styles.workspace}>

        {/* ── Bullet Optimizer ── */}
        {activeTool === 'bullet' && (
          <div className={styles.toolPanel}>
            <div className={styles.toolPanelHeader}>
              <Wand2 size={20} color="#4F46E5" />
              <div>
                <h2 className={styles.toolPanelTitle}>Bullet Point Optimizer</h2>
                <p className={styles.toolPanelDesc}>Transform vague experience descriptions into powerful, action-oriented achievements</p>
              </div>
            </div>

            <div className={styles.columns}>
              <div className={styles.column}>
                <label className={styles.label}>Original Bullet</label>
                <textarea
                  className={styles.textarea}
                  value={bulletInput}
                  onChange={e => setBulletInput(e.target.value)}
                  placeholder="e.g. Worked on the frontend using React and fixed some bugs."
                  rows={5}
                />
                <Button
                  onClick={handleBulletOptimize}
                  loading={loading}
                  fullWidth
                  leftIcon={<Sparkles size={16} />}
                  disabled={!bulletInput.trim()}
                >
                  Optimize Bullet
                </Button>
              </div>

              <div className={styles.columnDivider}>
                <ArrowRight size={20} className={styles.arrow} />
              </div>

              <div className={styles.column}>
                <label className={styles.label}>Recent Optimizations (Last 3)</label>
                {bulletHistory.length > 0 ? (
                  <div className={styles.historyList}>
                    {bulletHistory.map((item, index) => (
                      <div key={index} className={styles.historyCard}>
                        <div className={styles.beforeAfterGrid}>
                          <div className={styles.beforeArea}>
                            <div className={styles.historyLabel}>Before</div>
                            <div className={styles.originalText}>{item.original}</div>
                          </div>
                          <div className={styles.afterArea}>
                            <div className={styles.historyLabel}>After</div>
                            <div className={styles.resultText}>{item.improvedBullet}</div>
                          </div>
                        </div>
                        <div className={styles.resultMeta}>
                          {item.improvements?.map((imp, i) => (
                            <span key={i} className={styles.improvement}>✓ {imp}</span>
                          ))}
                        </div>
                        <button className={styles.copyBtn} onClick={() => handleCopy(item.improvedBullet)}>
                          {copied ? <Check size={14} /> : <Copy size={14} />}
                          {copied ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.placeholder}>
                    <Wand2 size={32} className={styles.placeholderIcon} />
                    <p>Your optimized bullets will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Summary Generator ── */}
        {activeTool === 'summary' && (
          <div className={styles.toolPanel}>
            <div className={styles.toolPanelHeader}>
              <AlignLeft size={20} color="#059669" />
              <div>
                <h2 className={styles.toolPanelTitle}>Professional Summary Generator</h2>
                <p className={styles.toolPanelDesc}>Generate a compelling professional summary tailored to your experience and target role</p>
              </div>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label className={styles.label}>Select Resume</label>
                <select
                  className={styles.select}
                  value={selectedResume}
                  onChange={e => setSelectedResume(e.target.value)}
                >
                  {resumes.length === 0 && <option value="">No resumes yet — create one first</option>}
                  {resumes.map(r => (
                    <option key={r._id} value={r._id}>{r.title}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Target Role <span className={styles.optional}>(optional)</span></label>
                <input
                  className={styles.input}
                  placeholder="e.g. Senior Frontend Engineer"
                  value={targetRole}
                  onChange={e => setTargetRole(e.target.value)}
                />
              </div>
            </div>

            <Button
              onClick={handleSummaryGenerate}
              loading={loading}
              leftIcon={<AlignLeft size={16} />}
              disabled={!selectedResume}
            >
              Generate Summary
            </Button>

            {summaryOutput && (
              <div className={styles.summaryResult}>
                <div className={styles.summaryResultHeader}>
                  <label className={styles.label}>Generated Summary</label>
                  <button className={styles.copyBtn} onClick={() => handleCopy(summaryOutput)}>
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className={styles.summaryText}>{summaryOutput}</div>
                <p className={styles.summaryHint}>
                  Copy this summary and paste it into your Resume Builder → Summary section.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Resume Tailor ── */}
        {activeTool === 'tailor' && (
          <div className={styles.toolPanel}>
            <div className={styles.toolPanelHeader}>
              <Sparkles size={20} color="#7C3AED" />
              <div>
                <h2 className={styles.toolPanelTitle}>Resume Tailor</h2>
                <p className={styles.toolPanelDesc}>Get specific AI suggestions to customize your resume for a particular job description</p>
              </div>
            </div>

            <div className={styles.tailorInputs}>
              <div className={styles.field}>
                <label className={styles.label}>Select Resume</label>
                <select
                  className={styles.select}
                  value={selectedResume}
                  onChange={e => setSelectedResume(e.target.value)}
                >
                  {resumes.length === 0 && <option value="">No resumes yet — create one first</option>}
                  {resumes.map(r => (
                    <option key={r._id} value={r._id}>{r.title}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Job Description</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Paste the full job description here..."
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                  rows={8}
                />
              </div>
            </div>

            <Button
              onClick={handleTailor}
              loading={loading}
              leftIcon={<Sparkles size={16} />}
              disabled={!selectedResume || !jobDescription.trim()}
            >
              Tailor My Resume
            </Button>

            {tailorOutput && (
              <div className={styles.tailorResult}>
                <div className={styles.summaryResultHeader}>
                  <label className={styles.label}>Tailoring Suggestions</label>
                  <button className={styles.copyBtn} onClick={() => handleCopy(tailorOutput)}>
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy All'}
                  </button>
                </div>
                <pre className={styles.tailorText}>{tailorOutput}</pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className={styles.tips}>
        <h3 className={styles.tipsTitle}>💡 Tips for best results</h3>
        <ul className={styles.tipsList}>
          <li>Be specific in your input — the more context you give, the better the output</li>
          <li>AI tools work best when your resume has detailed experience and skills filled in</li>
          <li>Always review and personalize AI-generated content before using it</li>
          <li>Add your <a href="/settings">Gemini API key</a> in Settings for real AI responses</li>
        </ul>
      </div>
    </div>
  );
}
