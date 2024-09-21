import bcrypt from "bcryptjs";
import { prisma } from "./db.server";

interface CreateUserArgs {
  username: string;
  password: string;
  email: string;
}

const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 7;

export function getExpirationTime() {
  return new Date(Date.now() + SESSION_EXPIRATION_TIME);
}

export async function genHashPassword(password: string) {
  const hash = await bcrypt.hash(password, 10);
  return hash;
}

export async function comparePassword(password: string, hashPassword: string) {
  const isValid = await bcrypt.compare(password, hashPassword);
  return isValid;
}

export async function createUser({
  username,
  email,
  password,
}: CreateUserArgs) {
  const hashPassword = await genHashPassword(password);
  const user = await prisma.user.create({
    select: { id: true },
    data: {
      username,
      email,
      password: {
        create: { hash: hashPassword },
      },
    },
  });
  return user;
}

export async function findExistingUser({ email }: { email: string }) {
  return await prisma.user.findFirst({
    where: { email },
  });
}
