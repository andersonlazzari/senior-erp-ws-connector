# senior-ws-connector

Conector simples para consumir serviços SOAP do ERP Senior e expor endpoints HTTP via NestJS.

## Descrição

Projeto Node/NestJS que encapsula consumidores SOAP (via `strong-soap`) para o ERP Senior e oferece rotas HTTP para uso interno.

## Pré-requisitos

- Node.js >= 18
- npm

## Variáveis de ambiente (exemplo)

- `SENIOR_ERP_URL` — URL base do ERP (ex: `https://erp.example.com/`)
- `SENIOR_ERP_USER` — usuário do ERP
- `SENIOR_ERP_PASSWORD` — senha do ERP
- `SENIOR_ERP_ENCRYPTION` — modo de criptografia (ex: `0`)
- `SENIOR_ERP_TIMEOUT_MS` — timeout padrão em ms (ex: `180000`)
- `SENIOR_ERP_RETRIES` — número de tentativas em falhas transitórias

## Instalação

```bash
npm install
```

## Scripts úteis

- `npm run start:dev` — inicia em modo desenvolvimento (watch)
- `npm run build` — compila o projeto para `dist/`
- `npm run start:prod` — executa `node dist/main`
- `npm run test` — executa testes unitários
- `npm run test:cov` — executa testes com relatório de cobertura

## Testes e cobertura

Os testes usam Jest + ts-jest. Para gerar relatório de cobertura:

```bash
npm run test:cov
```

A configuração atual exclui arquivos `.spec.ts` do `collectCoverageFrom` e aplica thresholds conservadores para facilitar integração contínua. Recomenda-se aumentar as thresholds gradualmente enquanto amplia a suíte de testes.

## Estrutura principal

- `src/` — código fonte
  - `modules/senior` — módulo e cliente SOAP (registro dinâmico)
  - `modules/app` — controller e service que expõe endpoints

## Observações

- O módulo `SeniorModule` é registrado dinamicamente com `SeniorModule.register({...})` no `AppModule` e expõe `SeniorSoapClient`.
- Em testes unitários, é recomendado mockar `AppService`/`SeniorSoapClient` para evitar chamadas externas.

