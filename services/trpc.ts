import { getCookie } from '@/helper/auth-client';
import { AppRouter } from '@interiorai/types';
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import Constants from 'expo-constants';
export const trpc = createTRPCReact<AppRouter>();

export const TRPCProvider = trpc.Provider;

export const createTrpcClient = () => {
  try {
    return trpc.createClient({
      links: [
        httpBatchLink({
          url: `http://${Constants.expoConfig?.hostUri?.split(':')[0]}:3000/api/trpc`,
          async headers() {
            const cookies = getCookie();
            return {
              Cookie: cookies || '',
            };
          },
        }),
      ],
    });
  } catch (error) {
    console.error('Failed to create TRPC client:', error);
    throw error;
  }
};