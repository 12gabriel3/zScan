import SwaggerClient from 'swagger-client';

const Swagger = new SwaggerClient(
  'https://esi.evetech.net/latest/swagger.json'
);

export default Swagger;
