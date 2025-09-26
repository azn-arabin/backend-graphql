import { generateToken } from "../src/auth.js";

function main(): void {
  const token = generateToken({
    sub: "coding-test-user",
    name: "GraphQL API Tester",
  });

  console.log(token);
}

main();
