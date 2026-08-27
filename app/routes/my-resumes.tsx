import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import Navbar from '~/components/Navbar'
import ScoreCircle from '~/components/ScoreCircle'
import { useApiStore } from '~/lib/api'
import { createResumeBlob } from '~/lib/resumeGenerator'
import { styleResumeContent, getResumeFragment, printResumeAsPdf } from '~/lib/resumeStyler'
import { useTranslation } from 'react-i18next'

interface GeneratedResume {
  id: string;
  job_title: string;
  job_description: string;
  experience: string;
  skills: string;
  education: string;
  template: string;
  resume_content: string;
  created_at: string;
  updated_at: string;
}

function MyResumes() {
    const { t } = useTranslation();
    const { auth, resumes } = useApiStore()
    const navigate = useNavigate()
    const [resumeList, setResumeList] = useState<GeneratedResume[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!auth.isAuthenticated) {
            navigate('/auth')
        }
    }, [auth.isAuthenticated, navigate])

    const fetchResumes = async () => {
        try {
            const data = await resumes.list();
            if (data && data.length > 0) {
                // Data comes pre-sorted from the API
                setResumeList(data as GeneratedResume[]);
            } else {
                setResumeList([]);
            }
        } catch (error) {
            console.error("Error fetching resumes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResumes();
    }, []);

    const [deleteModal, setDeleteModal] = useState<{ show: boolean, id: string | 'all' | null }>({ show: false, id: null });

    const handleMakeCopy = async (resume: GeneratedResume) => {
        try {
            const newResume = {
                ...resume,
                job_title: `${resume.job_title} (Copy)`,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            // Remove the old id so the API generates a new one
            const { id, ...copyData } = newResume;
            await resumes.save(copyData as any);
            fetchResumes();
        } catch (error) {
            console.error("Error making copy:", error);
        }
    };

    const [isDeleting, setIsDeleting] = useState(false);

    const confirmDelete = async () => {
        if (!deleteModal.id) return;
        
        setIsDeleting(true);
        console.log("Starting delete for:", deleteModal.id);
        
        try {
            if (deleteModal.id === 'all') {
                await resumes.deleteAll();
            } else {
                await resumes.delete(deleteModal.id);
            }
            
            setDeleteModal({ show: false, id: null });
            await fetchResumes();
            console.log("List refreshed after delete");
        } catch (error) {
            console.error("Delete operation failed:", error);
            alert("Failed to delete. Please check console for details.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDownload = (resume: GeneratedResume) => {
        const styledResume = styleResumeContent(resume.resume_content, { theme: resume.template });
        try {
            printResumeAsPdf(styledResume);
        } catch (error) {
            console.error('Failed to prepare PDF print:', error);
            alert('An error occurred while preparing the PDF document.');
        }
    };

    const getRelativeTime = (dateString: string) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        if (diffInSeconds < 60) return t('myResumes.justNow');
        if (diffInSeconds < 3600) return t('myResumes.minutesAgo', { count: Math.floor(diffInSeconds / 60) });
        if (diffInSeconds < 86400) return t('myResumes.hoursAgo', { count: Math.floor(diffInSeconds / 3600) });
        if (diffInSeconds < 604800) return t('myResumes.daysAgo', { count: Math.floor(diffInSeconds / 86400) });
        return date.toLocaleDateString();
    };

    if (loading) {
        return (
            <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
                <Navbar />
                <div className="flex justify-center items-center h-[calc(100vh-64px)]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </main>
        );
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen pb-20">
            <Navbar />
            <section className="container mx-auto px-4 py-12">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">{t('myResumes.title')}</h1>
                            <p className="text-slate-500 font-bold">{t('myResumes.subtitle')}</p>
                        </div>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setDeleteModal({ show: true, id: 'all' })}
                                className="bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2 border border-rose-100"
                            >
                                <span className="text-xl">🗑️</span> {t('myResumes.clearAll')}
                            </button>
                            <Link 
                                to="/create-resume" 
                                className="bg-green-600 hover:bg-green-700 text-white font-black px-8 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2"
                            >
                                <span className="text-xl">+</span> {t('myResumes.addResume')}
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {resumeList.map((resume) => {
                            const previewHtml = getResumeFragment(resume.resume_content || '', { theme: resume.template });
                            const editorUrl = `/create-resume?id=${resume.id}`;
                            
                            return (
                                <div key={resume.id} className="bg-white/40 backdrop-blur-xl border border-white/60 p-6 rounded-4xl shadow-sm hover:shadow-xl transition-all group flex gap-6">
                                    <Link to={editorUrl} className="w-1/2 h-64 bg-white rounded-2xl border border-slate-100 overflow-hidden relative shadow-inner shrink-0 cursor-pointer block">
                                        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors z-10"></div>
                                        <div 
                                            className="origin-top-left transform scale-[0.24] pointer-events-none"
                                            style={{ width: '8.5in', height: '11in' }}
                                            dangerouslySetInnerHTML={{ __html: previewHtml }} 
                                        />
                                    </Link>

                                    <div className="flex flex-col justify-between py-1 flex-1">
                                        <Link to={editorUrl} className="block group/title">
                                            <h3 className="text-xl font-black text-slate-900 line-clamp-2 mb-1 leading-tight group-hover/title:text-blue-600 transition-colors">{resume.job_title}</h3>
                                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-none">{t('myResumes.edited', { time: getRelativeTime(resume.updated_at) })}</p>
                                        </Link>
                                        
                                        <div className="space-y-2 mt-4">
                                            <Link 
                                                to={editorUrl}
                                                className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 primary-gradient shadow-lg shadow-blue-100/50 hover:-translate-y-0.5 transition active:translate-y-0"
                                            >
                                                <span>📝</span> {t('myResumes.openEditor')}
                                            </Link>
                                            <button 
                                                onClick={() => handleMakeCopy(resume)}
                                                className="w-full py-2 bg-slate-50 text-slate-600 rounded-xl font-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-100 transition"
                                            >
                                                <span>📄</span> {t('myResumes.makeCopy')}
                                            </button>
                                            <button 
                                                onClick={() => handleDownload(resume)}
                                                className="w-full py-2 bg-slate-50 text-slate-600 rounded-xl font-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-100 transition"
                                            >
                                                <span>⬇️</span> {t('myResumes.downloadPdf')}
                                            </button>
                                            <button 
                                                onClick={() => setDeleteModal({ show: true, id: resume.id })}
                                                className="w-full py-2 bg-rose-50 text-rose-600 rounded-xl font-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-rose-100 transition"
                                            >
                                                <span>🗑️</span> {t('myResumes.delete')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <Link 
                            to="/create-resume"
                            className="bg-white/20 border-2 border-dashed border-slate-300 rounded-4xl h-[312px] flex flex-col items-center justify-center gap-4 hover:border-blue-400 hover:bg-blue-50/10 transition-all group"
                        >
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-4xl text-slate-300 font-light">+</span>
                            </div>
                            <span className="text-slate-400 font-black uppercase tracking-widest text-sm">{t('myResumes.addResume')}</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Delete Confirmation Modal */}
            {deleteModal.show && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div 
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
                        onClick={() => setDeleteModal({ show: false, id: null })}
                    ></div>
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full relative z-10 shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100">
                        <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-6">
                            <span className="text-3xl">🗑️</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">{t('myResumes.deleteModal.title')}</h3>
                        <p className="text-slate-500 font-bold mb-8 leading-relaxed">
                            {deleteModal.id === 'all' 
                                ? t('myResumes.deleteModal.descAll') 
                                : t('myResumes.deleteModal.descSingle')
                            }
                        </p>
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className={`w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black transition shadow-lg shadow-rose-100 cursor-pointer flex items-center justify-center gap-2 ${isDeleting ? 'opacity-70' : ''}`}
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        {t('myResumes.deleteModal.deleting')}
                                    </>
                                ) : (
                                    t('myResumes.deleteModal.confirm')
                                )}
                            </button>
                            <button 
                                onClick={() => setDeleteModal({ show: false, id: null })}
                                className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition cursor-pointer"
                            >
                                {t('myResumes.deleteModal.cancel')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}

export default MyResumes