export interface Message {
    id: string;
    sender: string;
    content: string;
    timestamp: Date;
    isUser: boolean; // true if sent by the real user, false if by the persona
}

export interface Persona {
    name: string;
    description: string;
    systemPrompt: string;
}

export interface ChatSession {
    id: string;
    persona: Persona;
    messages: Message[];
}

export interface ParsedMessage {
    date: Date;
    sender: string;
    content: string;
}

export interface PersonaData {
    systemPrompt: string;
    traits: string[];
    frequentWords: string[];
    analysis: string;
}
