import React, { useState } from 'react';
import { User, MessageCircle, Search } from 'lucide-react';

interface UserSelectorProps {
    users: string[];
    onSelect: (user: string) => void;
}

export function UserSelector({ users, onSelect }: UserSelectorProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredUsers = users.filter(user =>
        user.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-yellow-500" />
                        사용자 선택
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        분석할 대화 상대를 선택해주세요.
                    </p>
                    <div className="mt-4 relative">
                        <input
                            type="text"
                            placeholder="사용자 검색..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                </div>

                <div className="max-h-[400px] overflow-y-auto p-2">
                    {users.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">
                            추출된 파일에서 사용자 정보를 찾을 수 없습니다.
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">
                            검색 결과가 없습니다.
                        </div>
                    ) : (
                        <div className="grid gap-2">
                            {filteredUsers.map((user) => (
                                <button
                                    key={user}
                                    onClick={() => onSelect(user)}
                                    className="flex items-center gap-4 w-full p-4 rounded-2xl hover:bg-yellow-50 transition-all duration-200 group text-left border border-transparent hover:border-yellow-200"
                                >
                                    <div className="w-12 h-12 rounded-[18px] bg-gray-100 flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                                        <User className="w-6 h-6 text-gray-400 group-hover:text-yellow-700" />
                                    </div>
                                    <div>
                                        <span className="block font-bold text-gray-800 group-hover:text-gray-900">
                                            {user}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
