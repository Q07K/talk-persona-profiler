'use client';

import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { FileUpload } from '@/components/FileUpload';
import { UserSelector } from '@/components/UserSelector';
import { ChatInterface } from '@/components/ChatInterface';
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { PersonaVisualization } from '@/components/PersonaVisualization';
import { parseKakaoChat } from '@/lib/parser';
import { generatePersona } from '@/lib/personaGenerator';
import { ParsedMessage, PersonaData } from '@/lib/types';
import { Loader2, MessageSquare, RotateCcw, Download, Github } from 'lucide-react';
import { LLMClient } from '@/lib/llmClient';

type AppState = 'INIT' | 'UPLOAD' | 'SELECT_USER' | 'GENERATING' | 'CHAT';

export default function Home() {
    const [appState, setAppState] = useState<AppState>('INIT');
    const [apiKey, setApiKey] = useState('');
    const [parsedMessages, setParsedMessages] = useState<ParsedMessage[]>([]);
    const [users, setUsers] = useState<string[]>([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [personaData, setPersonaData] = useState<PersonaData | null>(null);
    const [availableModels, setAvailableModels] = useState<string[]>([]);
    const [isCheckingModels, setIsCheckingModels] = useState(false);
    const visualizationRef = useRef<HTMLDivElement>(null);

    const handleSaveImage = async () => {
        if (!visualizationRef.current) return;

        try {
            const dataUrl = await toPng(visualizationRef.current, { cacheBust: true });
            const link = document.createElement("a");
            link.download = `${selectedUser}_persona.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error("Error saving image:", error);
            alert("이미지 저장 중 오류가 발생했습니다.");
        }
    };

    const handleApiKeyChange = (key: string) => {
        setApiKey(key);
        if (key) {
            setAppState('UPLOAD');
        } else {
            setAppState('INIT');
        }
    };

    const checkModels = async () => {
        if (!apiKey) return;
        setIsCheckingModels(true);
        try {
            const client = new LLMClient(apiKey);
            const models = await client.listModels();
            setAvailableModels(models);
            if (models.length > 0) {
                alert(`Available models:\n${models.join('\n')}`);
            } else {
                alert("No models found or API key invalid.");
            }
        } catch (e) {
            alert("Error checking models");
        } finally {
            setIsCheckingModels(false);
        }
    };

    const handleFileSelect = (content: string) => {
        const messages = parseKakaoChat(content);
        if (messages.length === 0) {
            alert('No messages found in the file. Please check the format.');
            return;
        }
        setParsedMessages(messages);

        // Extract unique users
        const uniqueUsers = Array.from(new Set(messages.map(m => m.sender)));
        setUsers(uniqueUsers);
        setAppState('SELECT_USER');
    };

    const handleUserSelect = async (user: string) => {
        setSelectedUser(user);
        setAppState('GENERATING');

        try {
            const data = await generatePersona(parsedMessages, user, apiKey);
            setPersonaData(data);
            setAppState('CHAT');
        } catch (error: any) {
            console.error("Error generating persona:", error);
            alert(`Failed to generate persona: ${error.message || error}`);
            setAppState('SELECT_USER');
        }
    };



    const handleLogoClick = () => {
        setParsedMessages([]);
        setUsers([]);
        setSelectedUser('');
        setPersonaData(null);
        setAppState(apiKey ? 'UPLOAD' : 'INIT');
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-[#f0f2f5]">
            <div className="w-full max-w-4xl flex flex-col items-center">
                <div className="mb-10 text-center">
                    <div
                        onClick={handleLogoClick}
                        className="inline-flex items-center justify-center w-20 h-20 bg-[#FEE500] rounded-[28px] mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300 cursor-pointer"
                    >
                        <MessageSquare className="w-10 h-10 text-[#391b1b]" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 tracking-tight">Kakao Persona Profiler</h1>
                    <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
                        Kakao Talk 채팅 텍스트 파일을 업로드해보세요.
                        <br />
                        AI가 대화를 분석하여 사용자의 특성을 분석해줍니다.
                    </p>
                </div>

                <div className="w-full transition-all duration-500 ease-in-out">
                    {appState === 'INIT' && (
                        <div className="flex flex-col items-center w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <ApiKeyInput onApiKeyChange={handleApiKeyChange} />
                        </div>
                    )}

                    {appState === 'UPLOAD' && (
                        <div className="flex flex-col items-center w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <ApiKeyInput onApiKeyChange={handleApiKeyChange} />
                            <div className="w-full max-w-xl mb-6 flex justify-end">
                                <button
                                    onClick={checkModels}
                                    disabled={isCheckingModels}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                    {isCheckingModels ? "Checking..." : "Check Available Models"}
                                </button>
                            </div>
                            <FileUpload onFileSelect={handleFileSelect} />
                        </div>
                    )}

                    {appState === 'SELECT_USER' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <UserSelector users={users} onSelect={handleUserSelect} />
                        </div>
                    )}

                    {appState === 'GENERATING' && (
                        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500 py-12">
                            <div className="relative">
                                <div className="absolute inset-0 bg-yellow-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
                                <Loader2 className="w-16 h-16 text-[#FEE500] animate-spin relative z-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-2">사용자 특성을 분석하고 있습니다...</h3>
                            <p className="text-gray-500">{selectedUser} 분석 중...</p>
                        </div>
                    )}

                    {appState === 'CHAT' && personaData && (
                        <div className="flex flex-col items-center w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl justify-center items-center">
                                {/* <ChatInterface
                                    personaName={selectedUser}
                                    systemPrompt={personaData.systemPrompt}
                                    apiKey={apiKey}
                                /> */}
                                <div ref={visualizationRef} className="w-full max-w-md">
                                    <PersonaVisualization
                                        data={personaData}
                                        userName={selectedUser}
                                    />
                                </div>
                            </div>
                            <div className="w-full max-w-xl mb-6 flex justify-center gap-4 mt-8">
                                <button
                                    onClick={() => setAppState('SELECT_USER')}
                                    className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl font-medium shadow-sm border border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow transition-all duration-200 active:scale-95"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    다른 사용자 선택
                                </button>
                                <button
                                    onClick={handleSaveImage}
                                    className="flex items-center gap-2 px-6 py-3 bg-[#FEE500] text-[#391b1b] rounded-xl font-medium shadow-sm hover:bg-[#FDD835] hover:shadow transition-all duration-200 active:scale-95"
                                >
                                    <Download className="w-4 h-4" />
                                    결과 저장
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <a
                href="https://github.com/Q07K/talk-persona-profiler"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-8 right-8 z-50 flex items-center gap-0 hover:gap-3 bg-[#24292F] text-white p-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group hover:pr-6"
            >
                <Github className="w-6 h-6" />
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100 whitespace-nowrap text-sm font-medium">
                    마음에 드셨다면 Star⭐ 를 눌러주세요
                </span>
            </a>
        </main>
    );
}
