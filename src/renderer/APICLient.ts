import SwaggerClient from 'swagger-client';

const Swagger = new SwaggerClient(
  'https://esi.evetech.net/latest/swagger.json'
);

export default Swagger;

export class Zkill {
  static async kills(character: number) {
    const respKills = await fetch(
      `https://zkillboard.com/api/kills/characterID/${character}/`
    );
    return respKills.json();
  }

  static async losses(character: number) {
    const respLosses = await fetch(
      `https://zkillboard.com/api/losses/characterID/${character}/`
    );
    return respLosses.json();
  }
}
