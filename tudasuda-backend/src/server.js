import "dotenv/config";
import app from "./app.js";
import prisma from "./lib/prisma.js";

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();