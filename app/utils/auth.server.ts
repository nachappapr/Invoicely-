import bcrypt from "bcryptjs";
import { prisma } from "./db.server";
import { getUserSession, sessionKey, sessionStorage } from "./session.server";
import { redirect } from "@remix-run/node";
import { END_POINTS } from "~/constants";
import { safeRedirect } from "remix-utils/safe-redirect";
import { type Password, type User } from "@prisma/client";

interface CreateUserArgs {
  username: string;
  password: string;
  email: string;
}

const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 7;

export const logout = async (request: Request, responseInit?: ResponseInit) => {
  const { userSession } = await getUserSession(request);
  const sessionId = userSession.get(sessionKey);

  if (sessionId) {
    void prisma.session
      .deleteMany({ where: { id: sessionId } })
      .catch(() => console.error("Failed to delete session"));
  }

  throw redirect(safeRedirect(END_POINTS.LOGIN), {
    ...responseInit,
    headers: {
      "set-cookie": await sessionStorage.destroySession(userSession),
    },
  });
};

/**
 * Retrieves the user ID from the request.
 *
 * This function extracts the user session from the request and attempts to find the user in the database.
 * If the user is not found, it redirects to the login endpoint and destroys the session.
 *
 * @param {Request} request - The request object containing the user session.
 * @returns {Promise<string | null>} - The user ID if found, otherwise null.
 * @throws {Response} - Redirects to the login endpoint if the user is not found.
 */
export const getUserId = async (request: Request) => {
  const { sessionId } = await getUserSession(request);
  if (!sessionId) return null;
  const session = await prisma.session.findUnique({
    select: { user: { select: { id: true } } },
    where: {
      id: sessionId,
      expirationTime: { gt: new Date() },
    },
  });
  if (!session?.user.id) {
    throw await logout(request);
  }
  return session.user.id;
};

/**
 * Ensures that the request is made by an unauthenticated user.
 * This function prevents authenticated users from accessing routes
 * that are intended for unauthenticated users, such as login and signup routes.
 *
 * @param {Request} request - The incoming request object.
 * @throws {Response} Redirects to the home page if the user is authenticated.
 */
export const requireAnonymous = async (request: Request) => {
  const userId = await getUserId(request);
  if (userId) throw redirect(safeRedirect(END_POINTS.HOME));
};

/**
 * Ensures that a user is authenticated by checking for a user ID in the request.
 * If the user is not authenticated, redirects to the login endpoint.
 *
 * @param {Request} request - The incoming request object.
 * @returns {Promise<string>} - The user ID if the user is authenticated.
 * @throws {Response} - Redirects to the login endpoint if the user is not authenticated.
 */
export const requireUserId = async (
  request: Request,
  { redirectTo }: { redirectTo?: string | null } = {}
) => {
  const userId = await getUserId(request);
  if (!userId) {
    const url = new URL(request.url);
    redirectTo =
      redirectTo === null ? null : redirectTo ?? `${url.pathname}${url.search}`;
    const loginParams = redirectTo ? new URLSearchParams({ redirectTo }) : null;
    const loginRedirects = [END_POINTS.LOGIN, loginParams?.toString()]
      .filter(Boolean)
      .join("?");
    throw redirect(safeRedirect(loginRedirects));
  }

  return userId;
};

/**
 * Requires a user to be authenticated and retrieves the user's information.
 *
 * This function checks if a user is authenticated by extracting the user ID from the request.
 * It then fetches the user's details from the database using the user ID.
 * If the user is not found, it logs out the user by invalidating the session.
 *
 * @param request - The HTTP request object.
 * @returns A promise that resolves to the user's information, including the user ID and username.
 * @throws Will throw an error if the user is not authenticated or not found.
 */
export const requireUser = async (request: Request) => {
  const userId = await requireUserId(request);
  const user = await prisma.user.findFirst({
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      createdAt: true,
      UserImage: true,
    },
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw await logout(request);
  }
  return user;
};

/**
 * Calculates the expiration time for a session.
 *
 * @returns {Date} The expiration time as a Date object.
 */
export function getExpirationTime() {
  return new Date(Date.now() + SESSION_EXPIRATION_TIME);
}

/**
 * Generates a hashed password using bcrypt.
 *
 * @param password - The plain text password to be hashed.
 * @returns A promise that resolves to the hashed password.
 */
export async function genHashPassword(password: string) {
  const hash = await bcrypt.hash(password, 10);
  return hash;
}

/**
 * Generates a hashed password synchronously using bcrypt.
 *
 * @param password - The plain text password to be hashed.
 * @returns The hashed password.
 */
export function genHashPasswordSync(password: string) {
  const hash = bcrypt.hashSync(password, 10);
  return hash;
}

/**
 * Compares a plain text password with a hashed password to determine if they match.
 *
 * @param password - The plain text password to compare.
 * @param hashPassword - The hashed password to compare against.
 * @returns A promise that resolves to a boolean indicating whether the passwords match.
 */
export async function verifyUserPassword(
  email: User["email"],
  hashPassword: Password["hash"]
) {
  const userWithPassword = await prisma.user.findFirst({
    select: { id: true, password: { select: { hash: true } } },
    where: { email },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    hashPassword,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }
  return userWithPassword.id;
}

/**
 * Creates a new user with the provided username, email, and password.
 * The password is hashed before being stored in the database.
 *
 * @param {Object} args - The arguments for creating a user.
 * @param {string} args.username - The username of the new user.
 * @param {string} args.email - The email of the new user.
 * @param {string} args.password - The password of the new user.
 * @returns {Promise<Object>} A promise that resolves to the created user's ID.
 */
export async function createUser({
  username,
  email,
  password,
}: CreateUserArgs) {
  const hashPassword = await genHashPassword(password);
  const session = await prisma.session.create({
    select: { id: true, expirationTime: true },
    data: {
      expirationTime: getExpirationTime(),
      user: {
        create: {
          username,
          email,
          password: {
            create: { hash: hashPassword },
          },
          roles: {
            connect: {
              name: "user",
            },
          },
        },
      },
    },
  });
  return session;
}

/**
 * Finds an existing user by their email address.
 *
 * @param {Object} param - The parameter object.
 * @param {string} param.email - The email address of the user to find.
 * @returns {Promise<User | null>} A promise that resolves to the user if found, otherwise null.
 */
export async function findExistingUser({ email }: { email: string }) {
  return await prisma.user.findFirst({
    where: { email },
  });
}

/**
 * Logs in a user by verifying their username and password, and creates a session if successful.
 *
 * @param {Object} params - The login parameters.
 * @param {string} params.username - The username of the user.
 * @param {string} params.password - The password of the user.
 * @returns {Promise<Object|null>} The created session object containing the session ID and expiration time, or null if login fails.
 */
export const login = async ({
  email,
  password,
}: {
  email: User["email"];
  password: string;
}) => {
  const userId = await verifyUserPassword(email, password);
  if (!userId) return null;
  const session = await prisma.session.create({
    select: { id: true, expirationTime: true },
    data: {
      userId,
      expirationTime: getExpirationTime(),
    },
  });
  return session;
};
