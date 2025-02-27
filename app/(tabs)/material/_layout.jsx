import React from "react";
import { Stack } from "expo-router";

export default function MaterialLayout() {

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "",
          headerShown: false, // Hides the header
        }}
      />
      <Stack.Screen
        name="materialRestockHistory"
        options={{
          headerShown: false, // Hides the header
        }}
      />
      <Stack.Screen
        name="materialConsumptionHistory"
        options={{
          headerShown: false, // Hides the header
        }}
      />
      <Stack.Screen
        name="feedComposition"
        options={{
          headerShown: false, // Hides the header
        }}
      />
    </Stack>
  );
}