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
}
// async function seed() {
//   const email = "rachel@remix.run";
//
//   // cleanup the existing database
//   await prisma.user.delete({ where: { email } }).catch(() => {
//     // no worries if it doesn't exist yet
//   });
//
//   const hashedPassword = await bcrypt.hash("racheliscool", 10);
//
//   const user = await prisma.user.create({
//     data: {
//       email,
//       password: {
//         create: {
//           hash: hashedPassword,
//         },
//       },
//     },
//   });
//
//   await prisma.note.create({
//     data: {
//       title: "My first note",
//       body: "Hello, world!",
//       userId: user.id,
//     },
//   });
//
//   await prisma.note.create({
//     data: {
//       title: "My second note",
//       body: "Hello, world!",
//       userId: user.id,
//     },
//   });
//
//   console.log(`Database has been seeded. 🌱`);
// }

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
