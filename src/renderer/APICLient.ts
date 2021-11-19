import SwaggerClient from 'swagger-client';
import {
  Alliance,
  Character,
  Corporation,
  Killmail,
  KillmailId,
} from './types';

const Swagger = new SwaggerClient(
  'https://esi.evetech.net/latest/swagger.json'
);

export default class API {
  static async fetchKM(kmId: KillmailId): Promise<Killmail> {
    const client = await Swagger;
    const resp =
      await client.apis.Killmails.get_killmails_killmail_id_killmail_hash({
        killmail_id: kmId.killmail_id,
        killmail_hash: kmId.zkb.hash,
      });
    return resp.obj;
  }

  static async fetchCharacter(character_id: number): Promise<Character> {
    const client = await Swagger;
    const resp = await client.apis.Character.get_characters_character_id({
      character_id,
    });
    return { character_id, ...resp.obj };
  }

  static async fetchAlliance(alliance_id: number): Promise<Alliance> {
    const client = await Swagger;
    const result = await client.apis.Alliance.get_alliances_alliance_id({
      alliance_id,
    });
    return result.obj;
  }

  static async fetchCorporation(corporation_id: number): Promise<Corporation> {
    const client = await Swagger;
    const result =
      await client.apis.Corporation.get_corporations_corporation_id({
        corporation_id,
      });
    return result.obj;
  }

  static async fetchCharacterId(name: string): Promise<Character | null> {
    const client = await Swagger;
    const result = await client.apis.Search.get_search({
      categories: 'character',
      search: name,
      strict: true,
    }).catch(() => null);
    if (result?.obj.character) {
      return { name, character_id: result.obj.character[0] };
    }
    return null;
  }

  static async fetchKillsIds(character: number): Promise<KillmailId[]> {
    const respKills = await fetch(
      `https://zkillboard.com/api/kills/characterID/${character}/`
    );
    return respKills.json();
  }

  static async fetchLossesIds(character: number): Promise<KillmailId[]> {
    const respLosses = await fetch(
      `https://zkillboard.com/api/losses/characterID/${character}/`
    );
    return respLosses.json();
  }
}
