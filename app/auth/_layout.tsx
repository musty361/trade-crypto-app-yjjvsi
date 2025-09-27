
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="phone-input" />
      <Stack.Screen name="verify-code" />
    </Stack>
  );
}
