import { createTrpcClient, TRPCProvider } from '@/services/trpc';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { useTheme } from '../hooks/useTheme';
import { store } from '../store';


export default function RootLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => createTrpcClient());


  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: '#00738A', backgroundColor: 'white' }}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        text1Style={{
          fontSize: 14,
          fontWeight: '400',
          fontFamily: 'Poppins-Regular',
        }}
      />
    ),
    error: (props: any) => (
      <ErrorToast
        {...props}
        style={{ borderLeftColor: 'red', backgroundColor: 'white' }}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        text1Style={{
          fontSize: 14,
          fontWeight: '400',
          fontFamily: 'Poppins-Medium',
        }}
      />
    ),
  };

  return (
    <TRPCProvider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Stack
            initialRouteName="index"
            screenOptions={{
              headerStyle: { backgroundColor: colors.background },
              headerTintColor: colors.text,
              headerTitleStyle: { fontWeight: 'bold' },
              headerShadowVisible: false,
              contentStyle: { backgroundColor: colors.background },
              headerShown: false,
            }}
          >
            <Stack.Screen name="index" options={{ title: 'Splash' }} />
            <Stack.Screen name="(authStack)" options={{ headerShown: false, title: 'Authentication' }} />
            <Stack.Screen name="(appStack)" options={{ title: 'App' }} />
          </Stack>
          <Toast visibilityTime={2000} autoHide config={toastConfig} topOffset={insets.top} />
        </Provider>
      </QueryClientProvider>
    </TRPCProvider>
  );
}
