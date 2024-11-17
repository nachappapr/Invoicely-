import { execaCommand } from "execa";

async function main() {
  try {
    console.log("🌱 Running seedPermissionsAndRoles...");
    await execaCommand("npx tsx prisma/seedRolesAndPermission.ts", {
      stdio: "inherit",
    });

    console.log("🌱 Running seedUsers...");
    await execaCommand("npx tsx prisma/seedUserAndInvoice.ts", {
      stdio: "inherit",
    });

    console.log("✅ Seeding completed successfully.");
  } catch (error) {
    console.error("🔥 Error running seed scripts: ", error);
    process.exit(1);
  }
}

main();
