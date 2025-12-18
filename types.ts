import * as React from 'react';

export interface GameConfig {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  component: React.FC<{ onBack: () => void }>;
  color: string;
}

export type GridPosition = {
  x: number;
  y: number;
};