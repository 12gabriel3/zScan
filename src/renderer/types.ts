import { ReactNode } from 'react';

export interface Character {
  character_id?: string;
  id: number;
  name: string;
  portrait?: ReactNode;
  birthday?: string;
  corporation_id?: string;
  alliance_id?: string;
  corporation?: any;
  alliance?: any;
}
