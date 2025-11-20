import { GoogleGenerativeAI } from "@google/generative-ai";

export class LLMClient {
    private apiKey: string;
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.genAI = new GoogleGenerativeAI(apiKey);
        // User indicated it is Nov 2025 and models < 2.0 are gone.
        // gemini-2.5-flash gave 503, so we try gemini-2.0-flash as a stable baseline.
        this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    }

    setModel(modelName: string) {
        this.model = this.genAI.getGenerativeModel({ model: modelName });
    }

    async listModels(): Promise<string[]> {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${this.apiKey}`);
            const data = await response.json();
            if (data.models) {
                return data.models.map((m: any) => m.name.replace('models/', ''));
            }
            return [];
        } catch (error) {
            console.error("Failed to list models", error);
            return [];
        }
    }

    async generateText(prompt: string, retries = 3): Promise<string> {
        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error: any) {
            console.error("Error generating text:", error);

            // Retry on 503 (Overloaded)
            if (error.message?.includes('503') && retries > 0) {
                console.log(`Model overloaded, retrying... (${retries} attempts left)`);
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s
                return this.generateText(prompt, retries - 1);
            }

            if (error.message?.includes('404') || error.message?.includes('not found')) {
                console.log("Attempting to list available models for debugging...");
                const models = await this.listModels();
                console.log("Available models:", models);
                throw new Error(`Model not found. Available models: ${models.join(', ')}`);
            }
            throw error;
        }
    }

    async chat(history: any[], message: string) {
        const chat = this.model.startChat({
            history: history,
        });
        const result = await chat.sendMessage(message);
        return result.response.text();
    }
}
