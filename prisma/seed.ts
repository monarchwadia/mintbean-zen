import { getPrisma } from "../getPrisma";

const prisma = getPrisma();

async function seed() {
  await prisma.user.create({
    data: {
      email: "user@user.com",
      name: "User"
    }
  })

  await prisma.challenge.create({
    data: {
      title: "Build a Musical Instrument",
      description: "JavaScript is versatile and friendly for all kinds of work. Today, we'll build a musical instrument Enjoy!",
      instructions: "These are sample instructions.",
      tags: ["JS", "React"]
    }
  })

  await prisma.challenge.create({
    data: {
      title: "Create a paint app",
      description: "Paint apps will help you understand click event handlers, the canvas API, and SVG elements.",
      instructions: "These are sample instructions.",
      tags: ["JS", "React"]
    }
  })
}

console.log("Starting seeds.");
seed().then(() => console.log("Done seeding"));