import { Tabs } from 'expo-router';
import { LayoutDashboard, ListTodo, Shield, User } from 'lucide-react-native';
import React from 'react';
import { Colors } from '../../constants/Colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textDim,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.border,
        },
        headerStyle: {
          backgroundColor: Colors.background,
          shadowColor: 'transparent', // Hide header shadow
        },
        headerTintColor: Colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <LayoutDashboard color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="quests"
        options={{
          title: 'Quests',
          tabBarIcon: ({ color }) => <ListTodo color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="attributes"
        options={{
          title: 'Attributes',
          tabBarIcon: ({ color }) => <Shield color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
