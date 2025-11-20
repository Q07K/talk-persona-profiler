'use client';

import React, { useState, useEffect } from 'react';
import { Key, Check, Eye, EyeOff } from 'lucide-react';

interface ApiKeyInputProps {
    onApiKeyChange: (apiKey: string) => void;
}

export function ApiKeyInput({ onApiKeyChange }: ApiKeyInputProps) {
    const [apiKey, setApiKey] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const storedKey = localStorage.getItem('gemini_api_key');
        if (storedKey) {
            setApiKey(storedKey);
            onApiKeyChange(storedKey);
            setIsSaved(true);
        }
    }, [onApiKeyChange]);

    const handleSave = () => {
        if (apiKey.trim()) {
            localStorage.setItem('gemini_api_key', apiKey);
            onApiKeyChange(apiKey);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000); // Reset saved state after 2s
        }
    };

    const handleClear = () => {
        localStorage.removeItem('gemini_api_key');
        setApiKey('');
        onApiKeyChange('');
    };

    return (
        <div className="w-full max-w-md mb-8">
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl opacity-30 group-hover:opacity-50 transition duration-200 blur"></div>
                <div className="relative flex items-center bg-white rounded-xl shadow-sm border border-gray-100 p-1">
                    <div className="pl-3 text-gray-400">
                        <Key className="w-5 h-5" />
                    </div>
                    <input
                        type={isVisible ? "text" : "password"}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Gemini API Key를 입력해주세요."
                        className="flex-1 p-3 outline-none text-gray-700 bg-transparent placeholder-gray-400 text-sm"
                    />
                    <button
                        onClick={() => setIsVisible(!isVisible)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={handleSave}
                        className={`mx-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isSaved
                            ? "bg-green-500 text-white shadow-md"
                            : "bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg"
                            }`}
                    >
                        {isSaved ? <Check className="w-4 h-4" /> : "저장"}
                    </button>
                </div>
            </div>
            <div className="flex justify-between mt-2 px-1">
                <p className="text-xs text-gray-400">
                    API Key는 브라우저 로컬에 저장됩니다.
                </p>
                {apiKey && (
                    <button onClick={handleClear} className="text-xs text-red-400 hover:text-red-500 underline">
                        Clear Key
                    </button>
                )}
            </div>
        </div>
    );
}
