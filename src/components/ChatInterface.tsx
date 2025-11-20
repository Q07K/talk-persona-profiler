import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Menu, Search } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { Message } from '@/lib/types';
import { LLMClient } from '@/lib/llmClient';
import { cn } from '@/lib/utils';

interface ChatInterfaceProps {
    personaName: string;
    systemPrompt: string;
    apiKey: string;
}

export function ChatInterface({ personaName, systemPrompt, apiKey }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const clientRef = useRef<LLMClient | null>(null);
    const chatHistoryRef = useRef<any[]>([]);

    useEffect(() => {
        clientRef.current = new LLMClient(apiKey);
        // Initialize chat history with system prompt
        chatHistoryRef.current = [
            {
                role: "user",
                parts: [{ text: systemPrompt }],
            },
            {
                role: "model",
                parts: [{ text: `Okay, I will act as ${personaName}.` }],
            }
        ];
    }, [apiKey, systemPrompt, personaName]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading || !clientRef.current) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            sender: 'Me',
            content: input,
            timestamp: new Date(),
            isUser: true,
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const responseText = await clientRef.current.chat(chatHistoryRef.current, input);

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                sender: personaName,
                content: responseText,
                timestamp: new Date(),
                isUser: false,
            };

            setMessages(prev => [...prev, botMessage]);

            // Update history (The SDK handles history in the chat session object usually, 
            // but since we re-instantiate or if we want to be stateless we might need to manage it. 
            // However, the `client.chat` method in our implementation creates a NEW chat session every time 
            // with the provided history. So we need to update `chatHistoryRef` manually.)

            chatHistoryRef.current.push(
                { role: "user", parts: [{ text: input }] },
                { role: "model", parts: [{ text: responseText }] }
            );

        } catch (error) {
            console.error("Chat error:", error);
            alert("Failed to send message");
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col w-full max-w-md h-[600px] bg-[#bacee0] rounded-3xl overflow-hidden shadow-2xl border border-gray-200 mx-auto">
            {/* Header */}
            <div className="bg-[#bacee0] px-4 py-3 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <ArrowLeft className="w-6 h-6 text-gray-700 cursor-pointer" />
                    <div>
                        <h2 className="font-semibold text-gray-800 text-base">{personaName}</h2>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <span className="text-xs text-gray-500">Offline</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Search className="w-5 h-5 text-gray-700" />
                    <Menu className="w-6 h-6 text-gray-700" />
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-60">
                        <p className="text-sm">Start a conversation with</p>
                        <p className="font-bold text-lg">{personaName}</p>
                    </div>
                )}
                {messages.map((msg, index) => {
                    const isUser = msg.sender === 'Me';
                    const showAvatar = !isUser && (index === 0 || messages[index - 1].sender !== msg.sender);
                    const showSender = !isUser && (index === 0 || messages[index - 1].sender !== msg.sender);

                    return (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            isUser={isUser}
                            showAvatar={showAvatar}
                            showSender={showSender}
                        />
                    );
                })}
                {isLoading && (
                    <div className="flex w-full mb-2 justify-start">
                        <div className="w-10 mr-2" />
                        <div className="bg-white px-4 py-2 rounded-xl rounded-tl-sm shadow-sm">
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white p-3">
                <div className="flex items-end gap-2 bg-gray-100 rounded-[20px] px-4 py-2">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Message"
                        className="flex-1 bg-transparent border-none outline-none text-sm resize-none max-h-24 py-2"
                        rows={1}
                        style={{ minHeight: '24px' }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className={cn(
                            "p-2 rounded-full transition-colors mb-0.5",
                            input.trim() ? "bg-[#FEE500] text-black hover:bg-[#fdd835]" : "bg-gray-200 text-gray-400"
                        )}
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
