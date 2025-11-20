import React, { useCallback, useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
    onFileSelect: (content: string) => void;
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const processFile = (file: File) => {
        setError(null);
        if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
            setError('Please upload a valid text file (.txt)');
            return;
        }

        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            onFileSelect(content);
        };
        reader.readAsText(file);
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            processFile(file);
        }
    }, [onFileSelect]);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
                className={cn(
                    "relative group cursor-pointer flex flex-col items-center justify-center w-full h-64 rounded-3xl border-2 border-dashed transition-all duration-300 ease-in-out",
                    isDragging
                        ? "border-blue-500 bg-blue-50 scale-105 shadow-xl"
                        : "border-gray-300 bg-white hover:border-blue-400 hover:bg-gray-50 hover:shadow-md",
                    error ? "border-red-300 bg-red-50" : ""
                )}
            >
                <input
                    id="file-upload"
                    type="file"
                    accept=".txt"
                    onChange={handleFileInput}
                    className="hidden"
                />

                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                    <div className={cn(
                        "p-4 rounded-full mb-4 transition-colors duration-300",
                        isDragging ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-500"
                    )}>
                        {fileName ? <CheckCircle className="w-8 h-8 text-green-500" /> : <Upload className="w-8 h-8" />}
                    </div>

                    {fileName ? (
                        <div>
                            <p className="mb-2 text-sm font-semibold text-gray-900">{fileName}</p>
                            <p className="text-xs text-green-600 font-medium">Ready to process</p>
                        </div>
                    ) : (
                        <div>
                            <p className="mb-2 text-lg font-semibold text-gray-700">
                                추출된 KakaoTalk 파일을 여기에 올려주세요.
                            </p>
                            <p className="text-sm text-gray-500">
                                또는 <span className="text-blue-500 font-medium">파일 선택</span>
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 flex items-center text-red-500 text-sm font-medium bg-red-100 px-3 py-1 rounded-full">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {error}
                        </div>
                    )}
                </div>
            </div>
            <p className="mt-4 text-center text-xs text-gray-400">
                PC 또는 Mobile에서 추출된 .txt 파일을 지원합니다.
            </p>
        </div >
    );
}
