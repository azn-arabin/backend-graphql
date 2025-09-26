import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import type { AuthenticatedUser } from "./types.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-super-secret";

function authError(message: string): never {
  throw new GraphQLError(message, {
    extensions: { code: "UNAUTHENTICATED" },
  });
}

export function authenticate(
  authHeader: string | null | undefined
): AuthenticatedUser {
  if (!authHeader) {
    authError("Authorization header missing");
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    authError("Invalid authorization header");
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (typeof payload === "string") {
      authError("Invalid token payload");
    }

    if (!payload.sub || typeof payload.sub !== "string") {
      authError("Token missing subject claim");
    }

    return payload as AuthenticatedUser;
  } catch (error) {
    authError("Invalid or expired token");
  }
}

export function generateToken(
  payload: Record<string, unknown> = { sub: "coding-test-user" },
  options: jwt.SignOptions = {}
): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "2h", ...options });
}

export { JWT_SECRET };
