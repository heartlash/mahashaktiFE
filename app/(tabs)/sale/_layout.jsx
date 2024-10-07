import React from "react";
import { Stack } from "expo-router";

export default function MoneyLayout() {

  return (
    <Stack>
      <Stack.Screen 
        name="index"
        options={{
            headerShown: false, // Hides the header
          }}
      />
      <Stack.Screen 
        name="vendors"
        options={{
          headerShown: false, // Hides the header
        }}
      />
    </Stack>
  );
}