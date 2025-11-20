import React from 'react';
import { PersonaData } from '@/lib/types';
import { Brain, MessageSquare } from 'lucide-react';

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
                    {userName}
                </h2>
                <p className="text-sm text-[#391b1b]/70 mt-1">
                    사용자 특성을 분석한 결과입니다.
                </p>
            </div>

            <div className="p-6 space-y-6">
                {/* Analysis Summary */}
                <div className="space-y-2">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                        분석 결과
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                        {data.analysis}
                    </p>
                </div>

                {/* Traits */}
                <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                        특성
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
                        자주 사용하는 단어
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

            {/* Footer Watermark */}
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-center gap-1.5">
                <div className="p-1 bg-[#FEE500] rounded-md">
                    <MessageSquare className="w-3 h-3 text-[#391b1b]" />
                </div>
                <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">
                    Kakao Persona Profiler
                </span>
            </div>
        </div>
    );
}
