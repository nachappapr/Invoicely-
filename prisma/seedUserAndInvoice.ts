import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { UniqueEnforcer } from "enforce-unique";
import fs from "node:fs";
import { genHashPasswordSync } from "~/utils/auth.server";

const prisma = new PrismaClient();
const uniqueUsernameEnforcer = new UniqueEnforcer();

export function createUser() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const username = uniqueUsernameEnforcer.enforce(() => {
    return (
      faker.string.alphanumeric({ length: 2 }) +
      "_" +
      faker.internet.userName({
        firstName: firstName.toLowerCase(),
        lastName: lastName.toLowerCase(),
      })
    )
      .slice(0, 20)
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "");
  });

  return {
    username,
    name: `${firstName} ${lastName}`,
    email: `${username}@example.com`,
  };
}

async function img({
  altText,
  filePath,
}: {
  altText?: string;
  filePath: string;
}) {
  return {
    altText,
    contentType: filePath.endsWith(".png") ? "image/png" : "image/jpeg",
    blob: await fs.promises.readFile(filePath),
  };
}

const paymentTerms = [
  "Net 1 Day",
  "Net 7 Days",
  "Net 14 Days",
  "Net 30 Days",
  "Net 60 Days",
];

const status = ["draft", "pending", "paid"];

async function seed() {
  console.log("🌱 Seeding database...");
  console.time("🌱 Database has been seeded");

  console.time("🧹 cleaning database...");
  await prisma.user.deleteMany();
  console.timeEnd("🧹 cleaning database...");

  const totalUsers = 10;
  console.time(`🌱 Creating ${totalUsers} users...`);
  const userImage = await Promise.all(
    Array.from({ length: totalUsers }, (_, index) =>
      img({ filePath: `./tests/images/fixtures/user/${index}.jpg` })
    )
  );

  for (let i = 0; i < totalUsers; i++) {
    const userData = createUser();

    // creating users with user role
    await prisma.user
      .create({
        data: {
          ...userData,
          roles: { connect: { name: "user" } },
          password: {
            create: {
              hash: genHashPasswordSync(userData.username),
            },
          },
          UserImage: {
            create: userImage[i % 10],
          },
          Invoice: {
            create: Array.from({
              length: faker.number.int({ min: 1, max: 10 }),
            }).map(() => {
              return {
                fromAddress: faker.location.streetAddress(),
                fromCity: faker.location.city(),
                fromCountry: faker.location.country(),
                fromPostalCode: faker.location.zipCode(),
                clientName: faker.company.name(),
                clientAddress: faker.location.streetAddress(),
                clientCity: faker.location.city(),
                clientCountry: faker.location.country(),
                clientPostalCode: faker.location.zipCode(),
                clientEmail: faker.internet.email(),
                invoiceDate: faker.date.recent(),
                paymentTerms: paymentTerms[Math.floor(Math.random() * 5)],
                projectDescription: faker.lorem.sentence(),
                items: {
                  create: Array.from({
                    length: faker.number.int({ min: 1, max: 10 }),
                  }).map(() => {
                    const quantity = faker.number.int({ min: 1, max: 10 });
                    const price = parseFloat(faker.commerce.price());

                    return {
                      name: faker.commerce.productName(),
                      quantity,
                      price,
                      total: quantity * price,
                    };
                  }),
                },
                status: status[Math.floor(Math.random() * 3)],
              };
            }),
          },
        },
      })
      .catch((error) => {
        console.log("🔥 Error creating user: ", error);
      });
  }

  // creating admin user
  await prisma.user
    .create({
      data: {
        username: "janesmith",
        name: "Jane Smith",
        email: "janesmith@test.com",
        roles: { connect: { name: "admin" } },
        password: {
          create: {
            hash: genHashPasswordSync("janesmith"),
          },
        },
        UserImage: {
          create: userImage[0],
        },
        Invoice: {
          create: Array.from({
            length: faker.number.int({ min: 1, max: 10 }),
          }).map(() => {
            return {
              fromAddress: faker.location.streetAddress(),
              fromCity: faker.location.city(),
              fromCountry: faker.location.country(),
              fromPostalCode: faker.location.zipCode(),
              clientName: faker.company.name(),
              clientAddress: faker.location.streetAddress(),
              clientCity: faker.location.city(),
              clientCountry: faker.location.country(),
              clientPostalCode: faker.location.zipCode(),
              clientEmail: faker.internet.email(),
              invoiceDate: faker.date.recent(),
              paymentTerms: paymentTerms[Math.floor(Math.random() * 5)],
              projectDescription: faker.lorem.sentence(),
              items: {
                create: Array.from({
                  length: faker.number.int({ min: 1, max: 10 }),
                }).map(() => {
                  const quantity = faker.number.int({ min: 1, max: 10 });
                  const price = parseFloat(faker.commerce.price());

                  return {
                    name: faker.commerce.productName(),
                    quantity,
                    price,
                    total: quantity * price,
                  };
                }),
              },
              status: status[Math.floor(Math.random() * 3)],
            };
          }),
        },
      },
    })
    .catch((error) => {
      console.log("🔥 Error creating user with admin role: ", error);
    });

  // creating manager user
  await prisma.user
    .create({
      data: {
        username: "johndoe",
        name: "John Doe",
        email: "johndoe@test.com",
        roles: { connect: { name: "manager" } },
        password: {
          create: {
            hash: genHashPasswordSync("johndoe"),
          },
        },
        UserImage: {
          create: userImage[0],
        },
        Invoice: {
          create: Array.from({
            length: faker.number.int({ min: 1, max: 10 }),
          }).map(() => {
            return {
              fromAddress: faker.location.streetAddress(),
              fromCity: faker.location.city(),
              fromCountry: faker.location.country(),
              fromPostalCode: faker.location.zipCode(),
              clientName: faker.company.name(),
              clientAddress: faker.location.streetAddress(),
              clientCity: faker.location.city(),
              clientCountry: faker.location.country(),
              clientPostalCode: faker.location.zipCode(),
              clientEmail: faker.internet.email(),
              invoiceDate: faker.date.recent(),
              paymentTerms: paymentTerms[Math.floor(Math.random() * 5)],
              projectDescription: faker.lorem.sentence(),
              items: {
                create: Array.from({
                  length: faker.number.int({ min: 1, max: 10 }),
                }).map(() => {
                  const quantity = faker.number.int({ min: 1, max: 10 });
                  const price = parseFloat(faker.commerce.price());

                  return {
                    name: faker.commerce.productName(),
                    quantity,
                    price,
                    total: quantity * price,
                  };
                }),
              },
              status: status[Math.floor(Math.random() * 3)],
            };
          }),
        },
      },
    })
    .catch((error) => {
      console.log("🔥 Error creating user with manager role: ", error);
    });

  console.timeEnd(`🌱 Creating ${totalUsers} users...`);
  console.timeEnd("🌱 Database has been seeded");
}

seed()
  .catch((error) => {
    console.log("🔥 Error seeding database for User and Invoice: ", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
