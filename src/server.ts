import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import resolvers from "./resolvers.js";
import typeDefs from "./typeDefs.js";
import { authenticate } from "./auth.js";
import type { GraphQLContext } from "./types.js";

async function startServer(): Promise<void> {
  const server = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
  });

  const port = Number(process.env.PORT ?? 4000);

  const { url } = await startStandaloneServer(server, {
    listen: { port },
    context: async ({
      req,
    }: {
      req: { headers: { authorization?: string } };
    }): Promise<GraphQLContext> => {
      const authHeader = req.headers.authorization ?? "";
      const user = authenticate(authHeader);
      return { user } satisfies GraphQLContext;
    },
  });

  console.log(`🚀 GraphQL server ready at ${url}`);
}

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
