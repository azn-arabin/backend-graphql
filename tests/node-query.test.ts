import assert from "node:assert/strict";
import test from "node:test";
import { ApolloServer } from "@apollo/server";
import { gql } from "graphql-tag";
import { authenticate, generateToken } from "../src/auth.js";
import resolvers from "../src/resolvers.js";
import typeDefs from "../src/typeDefs.js";

void test("authenticate accepts generated token", () => {
  const token = generateToken({ sub: "unit-test-user" }, { expiresIn: "1h" });
  const payload = authenticate(`Bearer ${token}`);
  assert.equal(payload.sub, "unit-test-user");
});

void test("node query resolves nested fields", async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  const query = gql`
    query Node($nodeId: ID!) {
      node(nodeId: $nodeId) {
        name
        triggerId
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
  `;

  const nodeId = "6297164810f52524ba1a9300";

  const response = await server.executeOperation(
    {
      query,
      variables: { nodeId },
    },
    {
      contextValue: { user: { sub: "unit-test-user" } },
    }
  );

  assert.equal(response.body.kind, "single");
  const singleResult = response.body.singleResult;
  assert.equal(singleResult.errors, undefined);
  const node = singleResult.data?.node as
    | {
        name: string;
        parentIds: string[];
        parents: Array<{ name: string }>;
      }
    | null
    | undefined;
  assert(node);
  assert.equal(node.name, "Sign up Webinar");
  assert.deepEqual(node.parentIds, ["6296be3470a0c1052f89cccb"]);
  assert.equal(node.parents.length, 1);
  assert.equal(node.parents[0].name, "Greeting Message");

  await server.stop();
});
