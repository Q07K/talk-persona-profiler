import { ParsedMessage } from "./types";

export function parseKakaoChat(text: string): ParsedMessage[] {
    const lines = text.split('\n');
    const messages: ParsedMessage[] = [];
    let currentDate: Date | null = null;

    // Date Patterns
    // 1. 2023년 10월 25일 수요일
    // 2. --------------- 2023년 10월 25일 수요일 ---------------
    // 3. 2023. 10. 25.
    const datePatterns = [
        /(\d{4})년 (\d{1,2})월 (\d{1,2})일/,
        /(\d{4})\. (\d{1,2})\. (\d{1,2})\./
    ];

    // Message Patterns
    // 1. [User] [오전/오후 10:30] Message (PC)
    // 2. 2023년 10월 25일 오전 10:30, User : Message (Mobile CSV/Text one-liner)
    //    Note: This format includes date, so we might not need external date, but usually they are mixed? 
    //    Actually, some exports are "Date, User : Message".

    // Let's stick to the standard line-based parsing where date is a header.
    // But we should also check if the line itself contains the full date/time info.

    // Pattern 1: [User] [Time] Message
    const messagePattern1 = /^\[(.*?)\] \[(오전|오후|AM|PM)\s*(\d{1,2}):(\d{1,2})\] (.*)$/;

    // Pattern 2: User : Message (Time might be missing or on previous line? No, usually mobile export has time)
    // Mobile export text file often looks like:
    // 2023년 10월 25일 수요일
    // 2023. 10. 25. 오전 10:30, User : Message
    const messagePattern2 = /^(\d{4}\. \d{1,2}\. \d{1,2}\.) (오전|오후) (\d{1,2}):(\d{1,2}), (.*?) : (.*)$/;

    // Pattern 3: Date Time, User : Message (Korean format variation)
    const messagePattern3 = /^(\d{4}년 \d{1,2}월 \d{1,2}일) (오전|오후) (\d{1,2}):(\d{1,2}), (.*?) : (.*)$/;


    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        // Try parsing as Date Header
        let isDateHeader = false;
        for (const pattern of datePatterns) {
            const match = trimmedLine.match(pattern);
            if (match && (trimmedLine.includes("---------------") || !trimmedLine.includes(":"))) {
                // Ensure it's not a message line (messages usually have :)
                const year = parseInt(match[1]);
                const month = parseInt(match[2]) - 1;
                const day = parseInt(match[3]);
                currentDate = new Date(year, month, day);
                isDateHeader = true;
                break;
            }
        }
        if (isDateHeader) continue;

        // Try parsing as Message

        // Strategy 1: PC Format [User] [Time] Content
        const match1 = trimmedLine.match(messagePattern1);
        if (match1 && currentDate) {
            const [, sender, ampm, hourStr, minuteStr, content] = match1;
            const date = normalizeDate(currentDate, ampm, hourStr, minuteStr);
            messages.push({ date, sender, content });
            continue;
        }

        // Strategy 2: Mobile Format "Date Time, User : Content"
        const match2 = trimmedLine.match(messagePattern2);
        if (match2) {
            const [, dateStr, ampm, hourStr, minuteStr, sender, content] = match2;
            // Parse dateStr "2023. 10. 25."
            const dateParts = dateStr.match(/(\d{4})\. (\d{1,2})\. (\d{1,2})\./);
            if (dateParts) {
                const year = parseInt(dateParts[1]);
                const month = parseInt(dateParts[2]) - 1;
                const day = parseInt(dateParts[3]);
                const dateBase = new Date(year, month, day);
                const date = normalizeDate(dateBase, ampm, hourStr, minuteStr);
                messages.push({ date, sender, content });
                // Update currentDate just in case
                currentDate = dateBase;
                continue;
            }
        }

        // Strategy 3: Mobile Format 2 "Date Time, User : Content" (Korean chars)
        const match3 = trimmedLine.match(messagePattern3);
        if (match3) {
            const [, dateStr, ampm, hourStr, minuteStr, sender, content] = match3;
            // Parse dateStr "2023년 10월 25일"
            const dateParts = dateStr.match(/(\d{4})년 (\d{1,2})월 (\d{1,2})일/);
            if (dateParts) {
                const year = parseInt(dateParts[1]);
                const month = parseInt(dateParts[2]) - 1;
                const day = parseInt(dateParts[3]);
                const dateBase = new Date(year, month, day);
                const date = normalizeDate(dateBase, ampm, hourStr, minuteStr);
                messages.push({ date, sender, content });
                currentDate = dateBase;
                continue;
            }
        }

        // Multi-line handling
        if (messages.length > 0) {
            messages[messages.length - 1].content += '\n' + trimmedLine;
        }
    }

    return messages;
}

function normalizeDate(baseDate: Date, ampm: string, hourStr: string, minuteStr: string): Date {
    let hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);

    const isPm = ampm === '오후' || ampm === 'PM';
    const isAm = ampm === '오전' || ampm === 'AM';

    if (isPm && hour !== 12) {
        hour += 12;
    } else if (isAm && hour === 12) {
        hour = 0;
    }

    const date = new Date(baseDate);
    date.setHours(hour, minute);
    return date;
}
