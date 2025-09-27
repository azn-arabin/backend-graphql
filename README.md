# Backend GraphQL API

## Overview

This project implements a GraphQL API using TypeScript, Apollo Server, and the provided JSON files as the persistent data source. The API exposes the `node` query with nested relationships between nodes, triggers, responses, actions, and resource templates.

## Prerequisites

- Node.js 18+
- npm 8+

## Environment

| Variable     | Default            | Description                                    |
| ------------ | ------------------ | ---------------------------------------------- |
| `PORT`       | `4000`             | Port where the GraphQL server listens          |
| `JWT_SECRET` | `dev-super-secret` | Secret used to sign and verify JSON Web Tokens |

Copy `.env.example` to `.env` before running the server:

```powershell
Copy-Item .env.example .env
```

Then customise the values as needed (for non-Windows shells, use `cp .env.example .env`). `dotenv` loads these variables automatically when the server starts.

## Installation

```powershell
git clone https://github.com/azn-arabin/backend-graphql.git
cd backend-graphql
npm install
```

## Running the server

```powershell
npm start
```

`npm start` compiles the TypeScript sources and launches the server at `http://localhost:4000/`.

For rapid feedback during development:

```powershell
npm run dev
```

## Authentication

All requests must include a Bearer token in the `Authorization` header. Example:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

Generate a new token anytime with:

```powershell
npm run generate:token
```

Ensure `JWT_SECRET` in your environment matches the secret used to sign tokens.

## Example Query

```
query Node($nodeId: ID!) {
  node(nodeId: $nodeId) {
    name
    triggerId
    trigger {
      _id
      resourceTemplateId
    }
    responseIds
    actionIds
    parentIds
    parents {
      name
      description
      actionIds
      parentIds
    }
  }
}
```

### Sample Variables

```
{
  "nodeId": "6297164810f52524ba1a9300"
}
```

## Testing

```powershell
npm test
```

This runs the automated checks for authentication and the `node` query.

## Project Structure

- `src/` – GraphQL schema, resolvers, authentication helper, and server bootstrap.
- `scripts/` – CLI utilities (e.g., JWT generation).
- `tests/` – Automated checks executed with `node --test`.
- `data/` – JSON datasets acting as the backing store for nodes, triggers, responses, actions, and resource templates.
