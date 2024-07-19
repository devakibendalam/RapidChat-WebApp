import {useInfiniteQuery} from 'react-query';

const fetchChats = async ({pageParam = 1}) => {
    const res = await fetch(`https://devapi.beyondchats.com/api/get_all_chats?page=${pageParam}`);
    if (!res.ok) {
        if (res.status === 429) {
            const retryAfter = res.headers.get('Retry-After') || 10;
            await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
            return fetchChats({pageParam});
        } else {
            const errorDetails = await res.json();
            throw new Error(`Network response was not ok: ${errorDetails.message}`);
        }
    }
    return res.json();
};

export const useChatsQuery = () => {
    return useInfiniteQuery('chats', fetchChats, {
        getNextPageParam: (lastPage) => {
            const {current_page, last_page} = lastPage.data;
            return current_page < last_page ? current_page + 1 : undefined;
        },
        retry: (failureCount, error) => {
            if (error.status === 429) {
                const baseDelay = 1000;
                const delaySeconds = Math.pow(2, failureCount) * baseDelay;
                return delaySeconds;
            }
            return false;
        },
        onError: (error) => {
            console.error('Error fetching chats:', error);
        }
    });
};
