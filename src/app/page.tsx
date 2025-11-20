'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { UserSelector } from '@/components/UserSelector';
import { ChatInterface } from '@/components/ChatInterface';
import { ApiKeyInput } from '@/components/ApiKeyInput';
import { PersonaVisualization } from '@/components/PersonaVisualization';
import { parseKakaoChat } from '@/lib/parser';
import { generatePersona } from '@/lib/personaGenerator';
import { ParsedMessage, PersonaData } from '@/lib/types';
import { Loader2, MessageSquare } from 'lucide-react';
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

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-[#f0f2f5]">
            <div className="w-full max-w-4xl flex flex-col items-center">
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-[#FEE500] rounded-[28px] mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
                        <MessageSquare className="w-10 h-10 text-[#391b1b]" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 tracking-tight">Kakao Persona Profiler</h1>
                    <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
                        Kakao Talk 채팅 텍스트 파일을 업로드해보세요.<br />AI가 대화를 분석하여 사용자의 특성을 분석해줍니다.
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
                            <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-2">Analyzing Chat History</h3>
                            <p className="text-gray-500">Extracting persona for <span className="font-semibold text-gray-800">{selectedUser}</span>...</p>
                        </div>
                    )}

                    {appState === 'CHAT' && personaData && (
                        <div className="flex flex-col items-center w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <button
                                onClick={() => setAppState('SELECT_USER')}
                                className="mb-6 text-sm text-gray-500 hover:text-gray-800 hover:underline transition-colors"
                            >
                                ← Select another user
                            </button>
                            <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl">
                                <ChatInterface
                                    personaName={selectedUser}
                                    systemPrompt={personaData.systemPrompt}
                                    apiKey={apiKey}
                                />
                                <PersonaVisualization
                                    data={personaData}
                                    userName={selectedUser}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
