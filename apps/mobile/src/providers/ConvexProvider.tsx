import type React from 'react';
import { ConvexProvider as ConvexReactProvider, ConvexReactClient } from 'convex/react';

// In production, use something like process.env.EXPO_PUBLIC_CONVEX_URL
const convex = new ConvexReactClient("https://colorful-ox-590.convex.cloud");

export function ConvexProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConvexReactProvider client={convex}>
      {children}
    </ConvexReactProvider>
  );
} 