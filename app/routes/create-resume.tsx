import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import Navbar from '~/components/Navbar'
import { useApiStore } from '~/lib/api'
import { generateResume, formatResumeForStorage, createResumeBlob } from '~/lib/resumeGenerator'
import { styleResumeContent } from '~/lib/resumeStyler'
import { RESUME_TEMPLATES } from '~/constants'
import ResumeEditor from '~/components/Editor/ResumeEditor'
import { useTranslation } from 'react-i18next'


function CreateResume() {
    const { auth, ai, resumes } = useApiStore()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const [searchParams] = useSearchParams()
    const resumeId = searchParams.get('id')

    const [isGenerating, setIsGenerating] = useState(false)
    const [statusText, setStatusText] = useState('')
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [generatedResume, setGeneratedResume] = useState<string | null>(null)
    const [editedResume, setEditedResume] = useState<string | null>(null)
    const [styledResume, setStyledResume] = useState<string | null>(null)
    const [step, setStep] = useState<'form' | 'editing' | 'preview'>('form')
    
    // Form states
    const [jobTitle, setJobTitle] = useState('')
    const [jobDescription, setJobDescription] = useState('')
    const [experience, setExperience] = useState('')
    const [skills, setSkills] = useState('')
    const [education, setEducation] = useState('')
    const [template, setTemplate] = useState('professional')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [linkedin, setLinkedin] = useState('')
    const [github, setGithub] = useState('')
    const [citizenship, setCitizenship] = useState('')
    const [currentId, setCurrentId] = useState<string | null>(resumeId)
    const [isLoadingExisting, setIsLoadingExisting] = useState(!!resumeId)

    useEffect(() => {
        if (!auth.isAuthenticated) {
            navigate('/auth')
        }
    }, [auth.isAuthenticated, navigate])

    // Load existing resume if ID provided
    useEffect(() => {
        if (resumeId) {
            console.log("Attempting to load resume with ID:", resumeId);
            const fetchResume = async () => {
                setIsLoadingExisting(true);
                try {
                    const resume = await resumes.get(resumeId);
                    console.log("Resume data received:", resume ? "Success" : "Nothing found");
                    
                    if (resume) {
                        setJobTitle(resume.job_title || '');
                        setJobDescription(resume.job_description || '');
                        setExperience(resume.experience || '');
                        setSkills(resume.skills || '');
                        setEducation(resume.education || '');
                        setTemplate(resume.template || 'professional');
                        
                        // Populate contact fields
                        setName(resume.name || '');
                        setEmail(resume.email || '');
                        setPhone(resume.phone || '');
                        setLinkedin(resume.linkedin || '');
                        setGithub(resume.github || '');
                        setCitizenship(resume.citizenship || '');
                        
                        const content = resume.resume_content || '';
                        setGeneratedResume(content);
                        setEditedResume(content);
                        setCurrentId(resumeId);
                        setStep('editing');
                    } else {
                        console.error("Resume not found:", resumeId);
                        setStep('form');
                    }
                } catch (error: any) {
                    console.error("Error loading resume:", error);
                    setStep('form');
                } finally {
                    setIsLoadingExisting(false);
                }
            };
            fetchResume();
        } else {
            setStep('form');
            setIsLoadingExisting(false);
        }
    }, [resumeId]);

    const saveResume = async (content: string, templateOverride?: string) => {
        if (!content || !jobTitle || isLoadingExisting) return;
        
        try {
            const resumeData = {
                job_title: jobTitle,
                job_description: jobDescription,
                experience,
                skills,
                education,
                template: templateOverride || template,
                name,
                email,
                phone,
                linkedin,
                github,
                citizenship,
                resume_content: content,
                updated_at: new Date().toISOString(),
            };

            if (currentId) {
                // Update existing
                await resumes.update(currentId, resumeData);
                console.log("Resume updated:", currentId);
            } else {
                // Create new
                const saved = await resumes.save({
                    ...resumeData,
                    created_at: new Date().toISOString(),
                });
                if (saved?.id) {
                    setCurrentId(saved.id);
                    console.log("Resume saved with ID:", saved.id);
                }
            }
        } catch (error) {
            console.error("Save Error:", error);
        }
    };

    const getRelativeTime = (dateString: string) => {
        if (!dateString) return 'Unknown date';
        const now = new Date();
        const date = new Date(dateString);
        
        if (isNaN(date.getTime())) return 'Invalid date';
        
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
        return date.toLocaleDateString();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsGenerating(true)
        setErrorMessage(null)
        setStatusText('Generating your optimized resume...')
        
        try {
            // Prepare resume data
            const resumeData = {
                jobTitle,
                jobDescription,
                experience,
                skills,
                education,
                template,
                name,
                email,
                phone,
                linkedin,
                github,
                citizenship
            };

            // Generate the AI prompt
            const prompt = await generateResume(resumeData);

            // Generate resume using AI via Django backend
            const resumeText = await ai.generate(prompt);
            
            if (resumeText) {
                setGeneratedResume(resumeText)
                setEditedResume(resumeText)
                
                // Auto-save the newly generated resume
                await saveResume(resumeText);
                
                setStatusText('Resume generated successfully!')
                setErrorMessage(null)
                setStep('editing')
            } else {
                throw new Error('Failed to generate resume content from AI')
            }
        } catch (error: any) {
            console.error("Generation Error:", error)
            const msg = error?.message || 'An unexpected error occurred. Please try again.'
            setErrorMessage(msg)
            setStatusText('')
        } finally {
            setIsGenerating(false)
        }
    }

    const handleEditSubmit = () => {
        if (editedResume) saveResume(editedResume);
        
        const styledHtml = styleResumeContent(editedResume || '', { theme: template as any })
        setStyledResume(styledHtml)
        setStep('preview')
    }

    const handleDownload = async (format: 'txt' | 'doc' | 'pdf', contentOverride?: string) => {
        if (format === 'pdf') {
            const rawContent = contentOverride || styledResume || styleResumeContent(editedResume || '', { theme: template as any });
            
            // If it's a fragment (missing <html>), wrap it in a proper document structure
            let contentToPrint = rawContent;
            if (!rawContent.includes('<html')) {
                contentToPrint = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Resume</title><style>${styleResumeContent(editedResume || '', { theme: template as any }).match(/<style>([\s\S]*?)<\/style>/)?.[1] || ''}</style></head><body>${rawContent}</body></html>`;
            }

            const opt = {
                margin: 0.5,
                filename: `resume-${new Date().toISOString().slice(0, 10)}.pdf`,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const }
            };

            const html2pdf = (await import('html2pdf.js')).default;
            html2pdf().set(opt).from(contentToPrint).save();
        } else if (editedResume) {
            const { download } = createResumeBlob(
                editedResume, 
                `resume-${new Date().toISOString().slice(0, 10)}.${format}`
            );
            download();
        }
    }

    const resetForm = () => {
        setStep('form')
        setGeneratedResume(null)
        setEditedResume(null)
        setStyledResume(null)
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover bg-center bg-no-repeat min-h-screen w-full">
            <Navbar />
            <section className='main-section'>
                <div className="page-heading max-w-7xl! w-full px-4">
                    <h1>{t('createResume.title')}</h1>
                    
                    {isLoadingExisting || isGenerating ? (
                        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
                            <h3 className="text-xl font-semibold text-primary">{statusText || (isLoadingExisting ? 'Loading existing resume...' : 'Generating ...')}</h3>
                            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : step === 'editing' ? (
                        <div className="w-screen h-[calc(100vh-64px)] fixed top-16 left-0 z-50 bg-white">
                             <ResumeEditor 
                                initialContent={editedResume ?? ''} 
                                template={template}
                                onBack={() => setStep('form')}
                                onSave={(content, templateOverride) => {
                                    setEditedResume(content);
                                    if (templateOverride) {
                                        setTemplate(templateOverride);
                                    }
                                    saveResume(content, templateOverride);
                                }}
                                onDownload={(html) => {
                                    setStyledResume(html);
                                    handleDownload('pdf', html);
                                }}
                             />
                        </div>
                    ) : step === 'preview' && styledResume ? (
                        <div className='flex flex-col gap-8 w-full max-w-5xl'>
                            <div className='gradient-border w-full'>
                                <div className='flex flex-col gap-4 p-6'>
                                    <h2 className="text-2xl font-bold text-slate-900">Resume Preview</h2>
                                    <p className="text-slate-600">Review your formatted resume before downloading</p>
                                    
                                    <div className='bg-white p-6 md:p-12 rounded-2xl border border-slate-200 overflow-x-auto shadow-sm'>
                                        <div 
                                            dangerouslySetInnerHTML={{ __html: styledResume }}
                                            className='w-full max-w-[850px] mx-auto min-h-[1100px] border-0 rounded-lg resume-preview'
                                        />
                                    </div>
                                    
                                    <div className='flex flex-col sm:flex-row gap-4 mt-4'>
                                        <button 
                                            onClick={() => handleDownload('pdf')}
                                            className='primary-button'
                                        >
                                            Download as PDF
                                        </button>
                                        <button 
                                            onClick={() => handleDownload('doc')}
                                            className='primary-button bg-green-600 hover:bg-green-700'
                                        >
                                            Download as DOC
                                        </button>
                                        <button 
                                            onClick={() => setStep('editing')}
                                            className='primary-button bg-gray-500 hover:bg-gray-600'
                                        >
                                            Edit Again
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2 className="px-4">{t('createResume.subtitle')}</h2>

                            {/* Error Alert Banner */}
                            {errorMessage && (
                                <div
                                    role="alert"
                                    className="flex items-start gap-3 mt-4 px-5 py-4 rounded-xl border border-red-300 bg-red-50 text-red-800 text-sm"
                                >
                                    <svg className="mt-0.5 shrink-0 w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                    </svg>
                                    <div className="flex-1">
                                        <p className="font-semibold">Resume generation failed</p>
                                        <p className="mt-0.5 text-red-700">{errorMessage}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setErrorMessage(null)}
                                        aria-label="Dismiss error"
                                        className="text-red-400 hover:text-red-600 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className='flex flex-col gap-6 mt-8 w-full max-w-4xl'>
                                {/* Contact Information */}
                                <div className='gradient-border w-full'>
                                    <div className='p-6'>
                                        <h3 className="text-xl font-bold text-slate-900 mb-4">{t('createResume.contactInfo')}</h3>
                                        
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                            <div className='form-div animate-in fade-in slide-in-from-bottom duration-1000'>
                                                <label htmlFor="name">{t('createResume.fullName')} *</label>
                                                <input 
                                                    type="text" 
                                                    id="name" 
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="John Doe" 
                                                    required
                                                />
                                            </div>
                                            
                                            <div className='form-div animate-in fade-in slide-in-from-bottom duration-1000'>
                                                <label htmlFor="email">{t('createResume.emailAddress')} *</label>
                                                <input 
                                                    type="email" 
                                                    id="email" 
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="john.doe@example.com" 
                                                    required
                                                />
                                            </div>
                                            
                                            <div className='form-div animate-in fade-in slide-in-from-bottom duration-1000'>
                                                <label htmlFor="phone">{t('createResume.phoneNumber')}</label>
                                                <input 
                                                    type="tel" 
                                                    id="phone" 
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    placeholder="(123) 456-7890" 
                                                />
                                            </div>
                                            
                                            <div className='form-div animate-in fade-in slide-in-from-bottom duration-1000'>
                                                <label htmlFor="citizenship">{t('createResume.citizenship')}</label>
                                                <input 
                                                    type="text" 
                                                    id="citizenship" 
                                                    value={citizenship}
                                                    onChange={(e) => setCitizenship(e.target.value)}
                                                    placeholder="U.S. Citizen" 
                                                />
                                            </div>
                                            
                                            <div className='form-div animate-in fade-in slide-in-from-bottom duration-1000'>
                                                <label htmlFor="linkedin">{t('createResume.linkedin')}</label>
                                                <input 
                                                    type="url" 
                                                    id="linkedin" 
                                                    value={linkedin}
                                                    onChange={(e) => setLinkedin(e.target.value)}
                                                    placeholder="https://linkedin.com/in/username" 
                                                />
                                            </div>
                                            
                                            <div className='form-div animate-in fade-in slide-in-from-bottom duration-1000'>
                                                <label htmlFor="github">{t('createResume.github')}</label>
                                                <input 
                                                    type="url" 
                                                    id="github" 
                                                    value={github}
                                                    onChange={(e) => setGithub(e.target.value)}
                                                    placeholder="https://github.com/username" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Job Information */}
                                <div className='gradient-border w-full'>
                                    <div className='p-6'>
                                        <h3 className="text-xl font-bold text-slate-900 mb-4">{t('createResume.jobInfo')}</h3>
                                        
                                        <div className='form-div animate-in fade-in slide-in-from-bottom duration-1000'>
                                            <label htmlFor="job-title">{t('createResume.jobTitle')} *</label>
                                            <input 
                                                type="text" 
                                                id="job-title" 
                                                value={jobTitle}
                                                onChange={(e) => setJobTitle(e.target.value)}
                                                placeholder="Software Engineer" 
                                                required
                                            />
                                        </div>
                                        
                                        <div className='form-div animate-in fade-in slide-in-from-bottom duration-1000'>
                                            <label htmlFor="job-description">{t('createResume.jobDescription')} *</label>
                                            <textarea 
                                                id="job-description" 
                                                value={jobDescription}
                                                onChange={(e) => setJobDescription(e.target.value)}
                                                rows={6} 
                                                placeholder="Paste the job description here to optimize your resume for this position..." 
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Background Information */}
                                <div className='gradient-border w-full'>
                                    <div className='p-6'>
                                        <h3 className="text-xl font-bold text-slate-900 mb-4">{t('createResume.background')}</h3>
                                        
                                        <div className='form-div animate-in fade-in slide-in-from-bottom duration-1000'>
                                            <label htmlFor="experience">{t('createResume.experience')} *</label>
                                            <textarea 
                                                id="experience" 
                                                value={experience}
                                                onChange={(e) => setExperience(e.target.value)}
                                                rows={5} 
                                                placeholder="Describe your relevant work experience, including company names, roles, dates, and achievements with metrics..." 
                                                required
                                            />
                                        </div>
                                        
                                        <div className='form-div animate-in fade-in slide-in-from-bottom duration-1000'>
                                            <label htmlFor="skills">{t('createResume.skills')} *</label>
                                            <textarea 
                                                id="skills" 
                                                value={skills}
                                                onChange={(e) => setSkills(e.target.value)}
                                                rows={3} 
                                                placeholder="List your technical skills (programming languages, frameworks, tools, etc.)..." 
                                                required
                                            />
                                        </div>
                                        
                                        <div className='form-div animate-in fade-in slide-in-from-bottom duration-1000'>
                                            <label htmlFor="education">{t('createResume.education')} *</label>
                                            <textarea 
                                                id="education" 
                                                value={education}
                                                onChange={(e) => setEducation(e.target.value)}
                                                rows={3} 
                                                placeholder="Your educational background, including institution names, degrees, dates, and relevant coursework..." 
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Template Selection */}
                                <div className='gradient-border w-full'>
                                    <div className='p-6'>
                                        <h3 className="text-xl font-bold text-slate-900 mb-4">{t('createResume.templates')}</h3>
                                        
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                            {Object.entries(RESUME_TEMPLATES).map(([key, templateData]) => (
                                                <div 
                                                    key={key}
                                                    className={`border rounded-2xl p-4 cursor-pointer transition ${
                                                        template === key 
                                                            ? 'border-blue-500 bg-blue-50' 
                                                            : 'border-slate-300 hover:border-slate-400'
                                                    }`}
                                                    onClick={() => setTemplate(key)}
                                                >
                                                    <h4 className="font-bold text-slate-900">{templateData.name}</h4>
                                                    <p className="text-sm text-slate-600 mt-1">{templateData.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                
                                <button type="submit" className='primary-button'>{t('createResume.generate')}</button>
                            </form>
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}

export default CreateResume