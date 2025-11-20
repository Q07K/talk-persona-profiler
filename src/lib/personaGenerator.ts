import { ParsedMessage, PersonaData } from "./types";
import { LLMClient } from "./llmClient";

export async function generatePersona(
    messages: ParsedMessage[],
    targetUser: string,
    apiKey: string
): Promise<PersonaData> {
    const client = new LLMClient(apiKey);

    // Filter messages for the target user to analyze style
    // We take a mix of recent messages to capture current style
    const userMessages = messages
        .filter(m => m.sender === targetUser)
        .map(m => m.content)
        .filter(content => content.length > 1 && !content.includes("이모티콘") && !content.includes("사진")) // Filter out very short messages or system/sticker placeholders if possible
        .slice(-1000); // Analyze last 1000 messages

    console.log(`Found ${userMessages.length} messages for user ${targetUser}`);

    if (userMessages.length === 0) {
        throw new Error(`No suitable messages found for user ${targetUser} to analyze.`);
    }

    const prompt = `
    Analyze the following chat messages from a user named "${targetUser}".
    Identify their speaking style, tone, frequently used words, sentence structure, and personality traits.
    Response in Korean.
    
    Messages:
    ${userMessages.join('\n')}
    
    Based on this analysis, provide a JSON response with the following structure:
    {
        "systemPrompt": "A detailed system prompt for an AI to roleplay as this user. It should instruct the AI to mimic the user's tone, style, and habits exactly.",
        "traits": ["trait1", "trait2", "trait3"],
        "frequentWords": ["word1", "word2", "word3"],
        "analysis": "A brief summary of the user's personality and communication style."
    }
    
    Output ONLY the valid JSON string. Do not include markdown formatting like \`\`\`json.
  `;

    const response = await client.generateText(prompt);

    try {
        // Clean up response if it contains markdown code blocks
        const cleanResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanResponse) as PersonaData;
    } catch (e) {
        console.error("Failed to parse persona JSON:", e);
        // Fallback for backward compatibility or error handling
        return {
            systemPrompt: response,
            traits: [],
            frequentWords: [],
            analysis: "Failed to parse structured analysis."
        };
    }
}
