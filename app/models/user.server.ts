import type { User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      role: true,
      email: true,
    },
  });
}
//
export async function createUser(email: User["email"], password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      passwordHash: hashedPassword,
      //TODO fields
      firstName: "pupa",
      lastName: "pupa",
      surName: "pupa",
    },
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(email: User["email"], password: string) {
  const userWithPassword = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!userWithPassword || !userWithPassword.passwordHash) {
    return null;
  }

  const isValid = await bcrypt.compare(password, userWithPassword.passwordHash);

  if (!isValid) {
    return null;
  }

  const { passwordHash, id } = userWithPassword;

  return { passwordHash, id };
}
