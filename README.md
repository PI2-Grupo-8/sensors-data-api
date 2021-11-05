# Sensors Data API

Microsserviço de dados do sensores do Strongberry. Esse serviço é responsável por manter os dados coletados pelo veículo, emitir alertas em casos criticos e formatar os dados para alimentar os gráficos do frontend.

## Como rodar

Crie um arquivo `.env` com as variaveis de `example.env` e rode com o comando abaixo

```
docker-compose up
```

## Como testar

Para testar a aplicação rode o comando abaixo:

```
docker-compose run --rm -e NODE_ENV=test sensors_data_api bash -c  "yarn && yarn jest --coverage --forceExit --runInBand"
```

## Script para adicionar dados ao veículo

Foi feito um script para adicionar dados dos sensores ao veículo, para conseguir testar a aplicação sem a coleta de dados pelo sistema embarcado e o gateway.

Para executar o script, use o comando abaixo, trocando `[ID DO VEÍICULO]` pelo id do veículo criado

```sh
docker-compose run --rm sensors_data_api bash -c  "node scripts/populate_sensors_data.js [ID DO VEÍICULO]"
```