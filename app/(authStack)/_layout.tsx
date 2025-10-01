import { Stack } from "expo-router";
import { useTheme } from "../../hooks/useTheme";

export default function AuthStack() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="signin" 
        options={{ 
          title: "Sign In",
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="signup" 
        options={{ 
          title: "Sign Up",
          headerShown: false,
        }} 
      />
    </Stack>
  );
}
