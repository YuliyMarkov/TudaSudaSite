import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";

async function createAdmin() {
  const email = "admin@tudasuda.uz";
  const password = "Admin@TudaSuda2026";

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    console.log("Админ уже существует");
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: "admin",
    },
  });

  console.log("Админ создан:");
  console.log(email, password);
  process.exit(0);
}

createAdmin().catch((e) => {
  console.error(e);
  process.exit(1);
});