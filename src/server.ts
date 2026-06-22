import "dotenv/config";
import app from "./app";
import { prisma } from "./lib/prisma";
import config from "./config";

async function main() {
  const PORT = config.port;
  try {
    // await prisma.$connect()
    app.listen(PORT, () => {
      console.log(`server running on ${PORT}`);
    });
  } catch (error) {
    console.error("server starting error", error);
    // await prisma.$disconnect();
    process.exit(1);
  }
}

main();
