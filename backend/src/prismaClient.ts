import { PrismaClient } from "@prisma/client";
let prismaClient: PrismaClient | undefined;

if (!prismaClient) {
  prismaClient = new PrismaClient();
} else {
  prismaClient = prismaClient;
}

export default prismaClient!;
