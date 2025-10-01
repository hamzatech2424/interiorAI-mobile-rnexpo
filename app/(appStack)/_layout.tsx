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
        name="home" 
        options={{ 
          title: "Home",
          headerShown: false,
        }} 
      />
   
    </Stack>
  );
}
