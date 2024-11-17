import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedPermissionsAndRoles() {
  console.time("🔑 Created permissions...");
  const entities = ["invoice", "user", "report"];
  const actions = ["create", "read", "update", "delete", "view"];
  const accesses = ["own", "any"];
  for (const entity of entities) {
    for (const action of actions) {
      for (const access of accesses) {
        await prisma.permission.create({ data: { entity, action, access } });
      }
    }
  }
  console.timeEnd("🔑 Created permissions...");

  console.time("👑 Created roles...");
  await prisma.role.create({
    data: {
      name: "admin",
      permissions: {
        connect: await prisma.permission.findMany({
          select: { id: true },
          where: { access: "any" },
        }),
      },
    },
  });

  await prisma.role.create({
    data: {
      name: "user",
      permissions: {
        connect: await prisma.permission.findMany({
          select: { id: true },
          where: {
            AND: [{ access: "own" }, { entity: { in: ["invoice", "user"] } }],
          },
        }),
      },
    },
  });

  await prisma.role.create({
    data: {
      name: "manager",
      permissions: {
        connect: await prisma.permission.findMany({
          select: { id: true },
          where: {
            OR: [
              {
                AND: [
                  { entity: "invoice" },
                  { action: { in: ["create", "update", "delete"] } },
                  { access: "own" },
                ],
              },
              {
                AND: [
                  { entity: "invoice" },
                  { action: "read" },
                  { access: "any" },
                ],
              },
              {
                AND: [
                  { entity: "user" },
                  { action: "read" },
                  { access: "any" },
                ],
              },
              {
                AND: [{ entity: "report" }, { access: "any" }],
              },
            ],
          },
        }),
      },
    },
  });
  console.timeEnd("👑 Created roles...");

  console.log("Permissions and roles have been seeded successfully.");
}

seedPermissionsAndRoles()
  .catch((error) => {
    console.log("🔥 Error seeding database for Roles and Permission: ", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
