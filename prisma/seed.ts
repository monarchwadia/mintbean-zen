import { getPrisma } from "../getPrisma";

const prisma = getPrisma();

async function seed() {
  await prisma.user.create({
    data: {
      email: "user@user.com",
      name: "User"
    }
  })
}

console.log("Starting seeds.");
seed().then(() => console.log("Done seeding"));