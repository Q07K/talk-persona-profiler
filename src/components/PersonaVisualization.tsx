import React from 'react';
import { PersonaData } from '@/lib/types';
import { Brain, Sparkles, MessageSquareQuote } from 'lucide-react';

interface PersonaVisualizationProps {
    data: PersonaData;
    userName: string;
}

export function PersonaVisualization({ data, userName }: PersonaVisualizationProps) {
    return (
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 h-fit">
            <div className="bg-[#FEE500] px-6 py-4 border-b border-yellow-400/20">
                <h2 className="text-lg font-bold text-[#391b1b] flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Persona Analysis
                </h2>
                <p className="text-sm text-[#391b1b]/70 mt-1">
                    Insights for {userName}
                </p>
            </div>

            <div className="p-6 space-y-6">
                {/* Analysis Summary */}
                <div className="space-y-2">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                        Personality Summary
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                        {data.analysis}
                    </p>
                </div>

                {/* Traits */}
                <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                        Key Traits
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {data.traits.map((trait, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-yellow-50 text-yellow-800 text-xs font-semibold rounded-full border border-yellow-100"
                            >
                                #{trait}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Frequent Words */}
                <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                        <MessageSquareQuote className="w-4 h-4 text-gray-400" />
                        Frequent Words
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {data.frequentWords.map((word, index) => (
                            <span
                                key={index}
                                className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-lg"
                            >
                                {word}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
