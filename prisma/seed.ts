import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "iowathe3rd@proton.me";
  const hashedPassword = await bcrypt.hash("password", 10);

  await prisma.user.create({
    data: {
      firstName: "Baurzhan",
      lastName: "Beglerov",
      surName: "Serikovicj",
      email: email,
      passwordHash: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });
  console.log(`Database has been seeded. 🌱`);
}
seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
