import { ReactNode } from 'react';

export interface Alliance {
  creator_corporation_id: number;
  creator_id: number;
  date_founded: string;
  executor_corporation_id?: number;
  faction_id?: number;
  name: string;
  ticker: string;
}

export interface Corporation {
  alliance_id?: number;
  ceo_id: number;
  creator_id: number;
  date_founded?: string;
  description?: string;
  faction_id?: number;
  home_station_id?: number;
  member_count: number;
  name: string;
  shares?: number;
  tax_rate: number;
  ticker: string;
  url?: string;
  war_eligible?: boolean;
}

export interface Character {
  character_id: number;
  name: string;
  portrait?: ReactNode;
  birthday?: string;
  corporation_id?: number;
  alliance_id?: number;
  corporation?: Corporation;
  alliance?: Alliance;
}

export interface KillmailId {
  killmail_id: number;
  zkb: {
    locationID: number;
    hash: string;
    fittedValue: number;
    droppedValue: number;
    destroyedValue: number;
    totalValue: number;
    points: number;
    npc: boolean;
    solo: boolean;
    awox: boolean;
  };
}
export interface Attacker {
  alliance_id: number;
  character_id: number;
  corporation_id: number;
  damage_done: number;
  final_blow: boolean;
  security_status: number;
  ship_type_id: number;
  weapon_type_id: number;
}

export interface Coordinates {
  x: number;
  y: number;
  z: number;
}

interface ItemCommon {
  flag: number;
  item_type_id: number;
  singleton: number;
}

interface ItemDropped extends ItemCommon {
  quatity_dropped: number;
}

interface ItemDestroyed extends ItemCommon {
  quantity_destroyed: number;
}

export type Item = ItemDestroyed | ItemDropped;

export interface Victim {
  alliance_id: number;
  character_id: number;
  corporation_id: number;
  damage_taken: number;
  items: Item[];
  position: Coordinates;
  ship_type_id: number;
}

export interface Killmail {
  attackers: Attacker[];
  killmail_id: number;
  killmail_time: string;
  solar_system_id: number;
  victim: Victim;
}
