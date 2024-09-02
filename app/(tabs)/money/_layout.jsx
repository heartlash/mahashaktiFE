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
        name="vendorCredit"
        options={{
          headerShown: false, // Hides the header
        }}
      />
      <Stack.Screen 
        name="operationalExpenses"
        options={{
          headerShown: false, // Hides the header
        }}
      />
      <Stack.Screen 
        name="materialExpenses"
        options={{
          headerShown: false, // Hides the header
        }}
      />
      <Stack.Screen 
        name="operationalExpensesScreen"
        options={{
          headerShown: false, // Hides the header
        }}
      />
    </Stack>
  );
}