import React, { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import FileUploader from '~/components/FileUploader'
import Navbar from '~/components/Navbar'
import { AIResponseFormat, prepareInstructions } from '~/constants'
import { useApiStore } from '~/lib/api'
import { generateUUID } from '~/lib/utils'
import { useTranslation } from "react-i18next";

function Upload() {
    const { t } = useTranslation();
    const { auth, ai, upload, analyzed } = useApiStore()

    const navigate = useNavigate()

    const [isProcessing, setIsProcessing] = useState(false)
    const [status_text, setStatus_text] = useState('')
    const [file, setFile] = useState<File | null>(null)

    React.useEffect(() => {
        if (!auth.isAuthenticated) {
            navigate('/auth')
        }
    }, [auth.isAuthenticated, navigate])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const form = e.currentTarget.closest('form')
        if (!form) return

        const formData = new FormData(form)

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('description') as string;

        if (!file) return

        handleAnalyse({ companyName, jobTitle, jobDescription, file })
        setIsProcessing(true)
        setStatus_text(t('upload.status.uploading'))
    }

    const handleFileSelect = (file: File | null) => { setFile(file) }

    const handleAnalyse = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File }) => {
        try {
            // Upload file to Django backend → Supabase Storage + extract text
            setStatus_text(t('upload.status.uploading'))
            const uploadResult = await upload.uploadResume(file);

            if (!uploadResult || !uploadResult.extracted_text) {
                throw new Error('Failed to upload and extract text from PDF');
            }

            setStatus_text(t('upload.status.preparing'))

            const uuid = uploadResult.file_id;

            // Analyze the extracted text with AI via Django backend
            setStatus_text(t('upload.status.analyzing'))
            const instructions = prepareInstructions({ jobTitle, jobDescription, AIResponseFormat });
            const feedback = await ai.analyze(uploadResult.extracted_text, instructions);

            if (!feedback) throw new Error('Error, Failed to analyse resume. AI returned empty response.')

            // Save the analyzed resume to Supabase via Django
            setStatus_text(t('upload.status.saving'))

            const data = {
                company_name: companyName,
                job_title: jobTitle,
                job_description: jobDescription,
                resume_file_path: uploadResult.file_path,
                image_file_path: '',
                feedback: feedback,
                checked_tips: [],
            };

            // Create analyzed resume record via the store
            await analyzed.save(uuid, data);

            console.log("Analysis complete:", data)

            setStatus_text(t('upload.status.redirecting'))
            navigate(`/resume/${uuid}`)
        } catch (error: any) {
            console.error("Analysis Error:", error);
            alert(error.message || "An unexpected error occurred during analysis.");
            setIsProcessing(false);
            setStatus_text('');
        }
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />
            <section className='main-section'>
                <div className="page-heading">
                    <h1>{t('upload.title')}</h1>
                    {isProcessing ?

                        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
                            <h3 className="text-xl font-semibold text-primary">{status_text || t('upload.status.default')}</h3>
                            <img src="/images/resume-scan.gif" alt="upload" className="max-w-full h-auto rounded-2xl shadow-lg border border-slate-200" />
                        </div>
                        :
                        <div>
                            <h2 className="px-4">{t('upload.subtitle')}</h2>
                            <form id='upload-form' onSubmit={handleSubmit} className='flex flex-col gap-4 mt-8 w-full'>
                                <div className='form-div animate-in fade-in slide-in-from-bottom duration-1000'>
                                    <label htmlFor="company-name">{t('upload.form.company')}</label>
                                    <input type="text" name="company-name" id="company-name" placeholder={t('upload.form.companyPh')} />
                                </div>

                                <div className='form-div animate-in fade-in slide-in-from-bottom duration-1000'>
                                    <label htmlFor="job-title">{t('upload.form.jobTitle')}</label>
                                    <input type="text" name="job-title" id="job-title" placeholder={t('upload.form.jobTitlePh')} />
                                </div>

                                <div className='form-div animate-in fade-in slide-in-from-bottom duration-1000'>
                                    <label htmlFor="description">{t('upload.form.jobDesc')}</label>
                                    <textarea name="description" id="description" rows={6} placeholder={t('upload.form.jobDescPh')} />
                                </div>
                                <FileUploader onfileSelect={handleFileSelect} file={file} />
                                <button type="submit" className='primary-button'>{t('upload.form.btn')}</button>
                            </form>
                        </div>
                    }
                </div>

            </section>
        </main>
    )
}

export default Upload