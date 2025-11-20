import React from 'react';
import { cn } from '@/lib/utils';
import { Message } from '@/lib/types';

interface MessageBubbleProps {
    message: Message;
    isUser: boolean;
    showAvatar?: boolean;
    showSender?: boolean;
}

export function MessageBubble({ message, isUser, showAvatar = true, showSender = true }: MessageBubbleProps) {
    // Format time to HH:mm
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    return (
        <div className={cn("flex w-full mb-2", isUser ? "justify-end" : "justify-start")}>
            {!isUser && showAvatar && (
                <div className="w-10 h-10 rounded-[14px] bg-gray-200 flex-shrink-0 mr-2 overflow-hidden">
                    {/* Placeholder for avatar image */}
                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500 text-xs font-bold">
                        {message.sender[0]}
                    </div>
                </div>
            )}
            {!isUser && !showAvatar && <div className="w-10 mr-2" />} {/* Spacer for alignment */}

            <div className={cn("flex flex-col max-w-[70%]", isUser ? "items-end" : "items-start")}>
                {!isUser && showSender && (
                    <span className="text-xs text-gray-500 mb-1 ml-1">{message.sender}</span>
                )}

                <div className="flex items-end gap-1.5">
                    {isUser && (
                        <span className="text-[10px] text-gray-400 min-w-fit mb-1">
                            {formatTime(message.timestamp)}
                        </span>
                    )}

                    <div
                        className={cn(
                            "px-3 py-2 text-sm shadow-sm break-words",
                            isUser
                                ? "bg-[#FEE500] text-black rounded-l-xl rounded-tr-xl rounded-br-sm" // Kakao Yellow
                                : "bg-white text-black rounded-r-xl rounded-tl-xl rounded-bl-sm border border-gray-100"
                        )}
                    >
                        {message.content}
                    </div>

                    {!isUser && (
                        <span className="text-[10px] text-gray-400 min-w-fit mb-1">
                            {formatTime(message.timestamp)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
