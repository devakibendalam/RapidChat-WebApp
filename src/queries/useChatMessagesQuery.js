import {useQuery} from 'react-query';

const fetchChatMessages = async (chatId) => {
    const res = await fetch(`https://devapi.beyondchats.com/api/get_chat_messages?chat_id=${chatId}`);
    if (!res.ok) {
        if (res.status === 429) {
            const retryAfter = res.headers.get('Retry-After') || 10;
            await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
            return fetchChatMessages(chatId);
        } else {
            const errorDetails = await res.json();
            throw new Error(`Network response was not ok: ${errorDetails.message}`);
        }
    }
    return res.json();
};

export const useChatMessagesQuery = (chatId) => {
    return useQuery(['chatMessages', chatId], () => fetchChatMessages(chatId), {
        retry: (failureCount, error) => {
            if (error.status === 429) {
                const baseDelay = 1000;
                const delaySeconds = Math.pow(2, failureCount) * baseDelay;
                return delaySeconds;
            }
            return false;
        },
        onError: (error) => {
            console.error(`Error fetching chat messages for chat ID ${chatId}:`, error);
        }
    });
};
