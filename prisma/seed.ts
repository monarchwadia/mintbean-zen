import { createUser } from "../lib/user/dao";
import { prismaClient } from "../prismaClient";
import fs from "fs";
import path from "path";

const testMarkdown = fs.readFileSync(path.join(__dirname, "testMarkdown.md")).toString();

async function seed() {
  const user = await createUser({
    email: "user@mintbean.io",
    name: "Mintbean User",
    password: "password",
    isAdmin: false
  });

  const admin = await createUser({
    email: "admin@mintbean.io",
    name: "Mintbean Admin",
    password: "password",
    isAdmin: true
  });

  // MUSICAL INSTRUMENT CHALLENGE 

  const musicalInstrumentChallenge = await prismaClient.challenge.create({
    data: {
      title: "Build a Musical Instrument",
      description: `
Browser APIs have gotten very powerful over the years. Put your creativity to use. Build a musical instrument that will wow your friends.

\`Javascript\`, \`Typescript\`, \`Web Audio API\`
      `,
      instructions: testMarkdown,
      thread: {
        create: {}
      },
    }
  })

  const musicComment1 = await prismaClient.comment.create({
    data: {
      threadId: musicalInstrumentChallenge.threadId,
      body: "This musical instrument thing is nice but what's the user of it?",
      userId: user.id
    }
  })
  const musicComment2 = await prismaClient.comment.create({
    data: {
      threadId: musicalInstrumentChallenge.threadId,
      body: "This comment is in violation of the Prime Directive! How dare you?!",
      userId: admin.id,
      parentId: musicComment1.id
    }
  });
  const musicComment3 = await prismaClient.comment.create({
    data: {
      threadId: musicalInstrumentChallenge.threadId,
      body: "Can I make a piano?",
      userId: user.id
    }
  })
  const musicComment4 = await prismaClient.comment.create({
    data: {
      threadId: musicalInstrumentChallenge.threadId,
      body: "Yes.",
      userId: admin.id,
      parentId: musicComment3.id
    }
  });
  const musicComment5 = await prismaClient.comment.create({
    data: {
      threadId: musicalInstrumentChallenge.threadId,
      body: "You can also make a death star.",
      userId: admin.id,
      parentId: musicComment3.id
    }
  });

  // MUSICAL INSTRUMENT PROJECT 0
  const project0 = await prismaClient.project.create({
    data: {
      deployedUrl: "https://google.com",
      githubUrl: "https://github.com",
      description: "This is a nice project.",
      title: "Something something something",
      user: {
        connect: {
          id: user.id
        }
      },
      challenge: {
        connect: {
          id: musicalInstrumentChallenge.id
        }
      },
      thread: {
        create: {}
      },
    }
  })
  // MUSICAL INSTRUMENT PROJECT 1
  const project1 = await prismaClient.project.create({
    data: {
      deployedUrl: "https://google.com",
      githubUrl: "https://github.com",
      description: "Some description about this project I just made.",
      title: "Something",
      user: {
        connect: {
          id: user.id
        }
      },
      challenge: {
        connect: {
          id: musicalInstrumentChallenge.id
        }
      },
      thread: {
        create: {}
      },
    }
  })
  const projectComment1 = await prismaClient.comment.create({
    data: {
      body: "This is my project and I admit, it sucks.",
      threadId: project1.threadId,
      userId: user.id,
    }
  })
  const projectComment2 = await prismaClient.comment.create({
    data: {
      body: "Nah, I like it.",
      threadId: project1.threadId,
      userId: admin.id,
      parentId: projectComment1.id
    }
  })
  const projectComment3 = await prismaClient.comment.create({
    data: {
      body: "No more submissions?",
      threadId: project1.threadId,
      userId: admin.id,
    }
  })

  await prismaClient.challenge.create({
    data: {
      title: "Create a paint app",
      description: `
Paint apps will help you understand click event handlers, the canvas API, and SVG elements.

\`JavaScript\`, \`Typescript\`, \`Canvas API\`, \`SVG\`
`,
      instructions: "These are sample instructions.",
      thread: {
        create: {
          comments: {
            create: {
              body: "This seems easy enough, right?",
              userId: user.id  
            }
          }
        }
      },
    }
  })
}

console.log("Starting seeds.");
seed().then(() => console.log("Done seeding"));