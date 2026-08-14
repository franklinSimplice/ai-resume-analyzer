import React, { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router';
import { useApiStore } from '~/lib/api';
import Navbar from '~/components/Navbar';
import ScoreCircle from '~/components/ScoreCircle';
import CategoryScore from '~/components/CategoryScore';
import AnalysisSidebar from '~/components/AnalysisSidebar';

const Resume = () => {
    const { id } = useParams();
    const { analyzed } = useApiStore();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeSection, setActiveSection] = useState('impact');
    const [checkedTips, setCheckedTips] = useState<string[]>([]);
    
    // Refs for scroll-spy functionality
    const sectionRefs = {
        impact: useRef<HTMLDivElement>(null),
        brevity: useRef<HTMLDivElement>(null),
        style: useRef<HTMLDivElement>(null),
        'soft-skills': useRef<HTMLDivElement>(null),
    };

    useEffect(() => {
        const fetchResume = async () => {
            if (!id) return;
            try {
                const result = await analyzed.get(id);
                if (result) {
                    setData(result);
                    if (result.checked_tips) {
                        setCheckedTips(result.checked_tips);
                    }
                } else {
                    setError('Resume not found.');
                }
            } catch (err: any) {
                setError(err.message || 'Failed to get resume data.');
            } finally {
                setLoading(false);
            }
        };
        
        const timer = setTimeout(() => {
            fetchResume();
        }, 500);
        return () => clearTimeout(timer);
    }, [id]);

    const handleCheckTip = async (tipId: string) => {
        const newChecked = checkedTips.includes(tipId)
            ? checkedTips.filter(id => id !== tipId)
            : [...checkedTips, tipId];
        
        setCheckedTips(newChecked);
        
        // Persist to Supabase via API
        if (data && id) {
            await analyzed.update(id, { checked_tips: newChecked });
        }
    };

    const scrollToSection = (sectionId: string) => {
        setActiveSection(sectionId);
        const ref = sectionRefs[sectionId as keyof typeof sectionRefs];
        if (ref && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    if (loading) {
        return (
            <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
                <Navbar />
                <div className="flex flex-col justify-center items-center h-[80vh]">
                    <div className="relative w-24 h-24 mb-8">
                        <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 animate-pulse tracking-tight">Analyzing Your Success...</h3>
                    <p className="text-slate-500 mt-2 font-medium">Generating premium insights</p>
                </div>
            </main>
        )
    }

    if (error || !data) {
        return (
            <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
                <Navbar />
                <div className="flex flex-col justify-center items-center h-[60vh] gap-6">
                    <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center">
                        <span className="text-3xl">⚠️</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{error || 'Something went wrong.'}</div>
                    <Link to="/upload" className="primary-button bg-blue-600 hover:bg-blue-700 shadow-lg px-8 py-3 rounded-2xl transition-all">Try again</Link>
                </div>
            </main>
        )
    }

    const { feedback, company_name, job_title, resume_file_path } = data;

    const renderFeedbackSection = (sectionId: string, tips: any[], title: string, score: number) => (
        <div key={sectionId} ref={sectionRefs[sectionId as keyof typeof sectionRefs]} className="mb-12 scroll-mt-24">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Score</span>
                    <span className={`text-lg font-black ${score >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>{score}</span>
                </div>
            </div>
            
            <div className="space-y-4">
                {tips && tips.length > 0 ? (
                    tips.map((tip) => (
                        <div 
                            key={tip.id} 
                            onClick={() => handleCheckTip(tip.id)}
                            className={`group p-6 rounded-3xl border transition-all duration-300 cursor-pointer ${
                                checkedTips.includes(tip.id) 
                                    ? 'bg-blue-50/50 border-blue-200 opacity-60' 
                                    : 'bg-white border-white shadow-sm hover:shadow-xl hover:border-blue-100 hover:-translate-y-1'
                            }`}
                        >
                            <div className="flex gap-5 items-start">
                                <div className={`mt-1 shrink-0 w-8 h-8 flex items-center justify-center rounded-xl transition-colors ${
                                    checkedTips.includes(tip.id)
                                        ? 'bg-blue-600 text-white'
                                        : tip.type === 'good' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                                }`}>
                                    {checkedTips.includes(tip.id) ? '✓' : tip.type === 'good' ? '✓' : '!'}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className={`text-lg font-bold tracking-tight ${
                                            checkedTips.includes(tip.id) ? 'text-slate-500 line-through' : 'text-slate-900'
                                        }`}>{tip.tip}</h4>
                                        <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
                                            tip.type === 'good' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                        }`}>
                                            {tip.type === 'good' ? 'Positive' : 'Improvement'}
                                        </div>
                                    </div>
                                    {tip.explanation && !checkedTips.includes(tip.id) && (
                                        <p className="text-slate-500 mt-2 leading-relaxed text-sm font-medium">{tip.explanation}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-center text-slate-400 font-medium">
                        Excellent work! No identified issues in this section.
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <main className="bg-[#f8f9fc] min-h-screen">
            <Navbar />
            
            {/* Header Summary Area */}
            <div className="bg-white border-b border-slate-100 py-10 px-4">
                <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-8">
                        <div className="relative group">
                            <div className="absolute -inset-2 bg-linear-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                            <ScoreCircle score={feedback.overallScore} />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter mb-2">
                                Resume Score: {feedback.overallScore}
                            </h1>
                            <p className="text-slate-500 text-lg font-medium">
                                Target: <span className="text-slate-900 font-bold">{job_title}</span> at <span className="text-slate-900 font-bold">{company_name}</span>
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex gap-4 flex-wrap justify-center overflow-x-auto pb-2 scrollbar-none">
                        <CategoryScore score={feedback.ATS.score} label="ATS Match" size="sm" />
                        <CategoryScore score={feedback.content.score} label="Impact" size="sm" />
                        <CategoryScore score={feedback.structure.score} label="Brevity" size="sm" />
                        <CategoryScore score={feedback.toneAndStyle.score} label="Style" size="sm" />
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-4 py-12 flex flex-col lg:flex-row gap-12">
                
                {/* Fixed Sidebar Navigation */}
                <AnalysisSidebar 
                    activeSection={activeSection} 
                    onSectionClick={scrollToSection} 
                    scores={{
                        impact: feedback.content.score,
                        brevity: feedback.structure.score,
                        style: feedback.toneAndStyle.score,
                        softSkills: feedback.skills.score
                    }}
                />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col xl:flex-row gap-12">
                    
                    {/* Left side: Resume Info */}
                    <div className="flex-1 xl:max-w-[500px]">
                        <div className="sticky top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Document Info</h3>
                            </div>
                            <div className="bg-white p-6 rounded-4xl shadow-2xl shadow-blue-900/10 border border-white">
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <span className="text-4xl">📄</span>
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-900 mb-1">{job_title}</h4>
                                    <p className="text-slate-500 font-medium">{company_name}</p>
                                    <p className="text-slate-400 text-sm mt-2">Analyzed with AI-powered insights</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side: Detailed Analysis */}
                    <div className="flex-1 max-w-3xl">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Growth Report</h3>
                                <p className="text-slate-600 font-medium">Step-by-step guidance to perfect your resume.</p>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-xs font-black text-slate-400 uppercase mb-1">Tasks Completed</span>
                                <span className="text-lg font-black text-blue-600">{checkedTips.length} / { 
                                    (feedback.ATS.tips.length + 
                                     feedback.content.tips.length + 
                                     feedback.structure.tips.length + 
                                     feedback.toneAndStyle.tips.length + 
                                     feedback.skills.tips.length) 
                                }</span>
                            </div>
                        </div>
                        
                        {renderFeedbackSection('impact', feedback.content.tips, 'Impact & Achievements', feedback.content.score)}
                        {renderFeedbackSection('brevity', feedback.structure.tips, 'Brevity & Conciseness', feedback.structure.score)}
                        {renderFeedbackSection('style', feedback.toneAndStyle.tips, 'Style & Formatting', feedback.toneAndStyle.score)}
                        {renderFeedbackSection('soft-skills', feedback.skills.tips, 'Soft Skills & Keywords', feedback.skills.score)}
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Resume