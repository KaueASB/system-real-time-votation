# Projeto de Votação Online

Este projeto implementa uma aplicação de votação online, onde os usuários podem criar enquetes, votar e acompanhar os resultados em tempo real.

## Tecnologias Utilizadas

- [Node.js](https://nodejs.org/): Plataforma de execução de código JavaScript do lado do servidor.
- [Fastify](https://www.fastify.io/): Framework web leve e eficiente para Node.js.
- [Prisma](https://www.prisma.io/): ORM (Object-Relational Mapping) para banco de dados SQL com suporte a TypeScript.
- [Redis](https://redis.io/): Banco de dados em memória para armazenamento de resultados de votação em tempo real.
- [Zod](https://github.com/colinhacks/zod): Biblioteca de validação de esquemas em TypeScript.
- WebSocket: Protocolo de comunicação bidirecional para transmissão de resultados em tempo real.

## Rotas Implementadas

### Criar Enquete

- **Parâmetros de Requisição**:
  - `title`: Título da enquete (string).
  - `options`: Lista de opções da enquete (array de strings).
- **Retorno**: ID da enquete recém-criada.

### Obter Enquete

- **Parâmetros de Requisição**:
  - `pollId`: ID da enquete (string).
- **Retorno**: Detalhes da enquete, incluindo ID, título, opções e contagem de votos para cada opção.

### Votar em uma Enquete

- **Parâmetros de Requisição**:
  - `pollId`: ID da enquete (string).
  - `pollOptionId`: ID da opção de voto (string).
- **Retorno**: Status HTTP 200 (OK) em caso de sucesso.

### Resultados da Enquete (WebSocket)

- Estabelece uma conexão WebSocket para receber os resultados em tempo real de uma enquete específica.

## Funcionamento do WebSocket e Redis

O WebSocket é utilizado para estabelecer uma comunicação bidirecional entre o servidor e o cliente, permitindo a transmissão de resultados de votação em tempo real. Na nossa aplicação, o WebSocket é utilizado em conjunto com a classe `VotingPubSub`, que atua como um sistema de publicação e assinatura para os resultados das enquetes.

### WebSocket (VotingPubSub)

A classe `VotingPubSub` é responsável por gerenciar as inscrições e publicações para canais específicos de enquetes. Ela possui os seguintes métodos:

- `subscribe(pollId: string, subscriber: Subscriber)`: Inscreve um novo cliente para receber atualizações dos resultados de uma enquete específica. A função de retorno `subscriber` será chamada sempre que houver uma atualização nos resultados da enquete.
- `publish(pollId: string, message: Message)`: Publica uma mensagem contendo os resultados atualizados de uma enquete específica para todos os clientes inscritos no canal da enquete.

Exemplo de uso da classe `VotingPubSub`:

```typescript
const voting = new VotingPubSub()

// Inscrever cliente para receber atualizações de uma enquete
voting.subscribe('enquete-01', (message) => {
  console.log('Nova mensagem recebida:', message)
})

// Publicar resultados atualizados de uma enquete
voting.publish('enquete-01', { pollOptionId: 'opcao-01', votes: 10 })
```

## Redis

O Redis é utilizado como um banco de dados em memória para armazenar os resultados de votação e notificar os clientes conectados sobre atualizações nos resultados. Na nossa aplicação, o Redis é utilizado para:

- Armazenar os resultados de votação em tempo real: Quando um cliente vota em uma enquete, o resultado é armazenado no Redis.
- Distribuir atualizações dos resultados: Quando os resultados de uma enquete são atualizados, o Redis notifica os clientes conectados por meio do WebSocket, permitindo que eles recebam as atualizações em tempo real.

Exemplo de uso do Redis na aplicação:

```typescript
// Exemplo de armazenamento de resultado de votação no Redis
await redis.zincrby('enquete-01', 1, 'opcao-01')

// Exemplo de notificação de atualização de resultado para os clientes conectados
voting.publish('enquete-01', { pollOptionId: 'opcao-01', votes: 10 })
```
