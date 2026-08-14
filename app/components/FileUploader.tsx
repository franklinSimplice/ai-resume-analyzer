import React, { useCallback, type FormEvent, type SubmitEvent } from 'react'
import { useDropzone } from 'react-dropzone'
import { formatSize } from '~/lib/utils'
import { useTranslation } from "react-i18next";

interface FileUploaderProps {
    onfileSelect?: (file: File | null) => void
    file: File | null
}

const fileSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    // getting access to the current form:
    const form = e.currentTarget.closest('form')
    if (!form) return;

    const formData = new FormData(form)
    const company_name = formData.get('company-name')
    const jobTitle = formData.get('job-title')
    const description = formData.get('description')

    console.log({
        company_name,
        jobTitle,
        description,
        form
    })

}

const FileUploader = ({ onfileSelect, file }: FileUploaderProps) => {
    const { t } = useTranslation();
    // const [file, setFile] = useState<File | undefined>()

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        onfileSelect?.(file)
        console.log(file)

    }, [onfileSelect])


    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf']
        },
        maxFiles: 1,
        maxSize: 20 * 1024 * 1024
    })

    return (
        <div className="w-full gradient-border">
            <div {...getRootProps()}>
                <input {...getInputProps()} />


                <div className='space-y-4 cursor-pointer'>
                    <div className="flex mx-auto w-16 h-10 items-center justify-center">

                    </div>

                    {file ? (
                        <div className='uploader-selected-file flex items-center justify-center w-full overflow-hidden' onClick={(e) => e.stopPropagation()}>
                            <div className="flex flex-col items-center gap-2 w-full max-w-full">
                                <h2 className="text-lg font-bold text-white tracking-tight leading-none uppercase">{t('upload.uploader.fileSelected')}</h2>
                                <div className="text-gray-400 font-medium flex items-center gap-2 w-full justify-center px-2">
                                    <img src='images/pdf.png' className='size-8 shrink-0' />
                                    <span className="truncate max-w-[120px] sm:max-w-[250px]">{file.name}</span>
                                    <span className="shrink-0 text-sm">({formatSize(file.size)})</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                className='cursor-pointer shrink-0'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onfileSelect?.(null);
                                }}>
                                <img src="icons/cross.svg" alt="remove" className='w-4 h-4' />
                            </button>
                        </div>

                    ) : (
                        <div className='flex flex-col items-center p-0 m-0'>
                            <img src='/icons/info.svg' className='size-20' />
                            <p className='text-lg text-gray-500'>
                                <span className='font-semibold'>{t('upload.uploader.clickUpload')}</span>
                                <span className='font-semibold'>{t('upload.uploader.dragDrop')}</span>
                            </p>
                            <p className='text-gray-500 text-lg'>{t('upload.uploader.maxSize')}</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

export default FileUploader