import React from "react";
import { Stack } from "expo-router";

export default function ProductionLayout() {

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
        name="productionShedScreen"
        options={{
          headerShown: false, // Hides the header
        }}
      />
    </Stack>
  );
}