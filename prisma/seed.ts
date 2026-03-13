import { AccessLevel, PrismaClient, Role, WorkspaceType } from ".prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString)
  throw new Error("DATABASE_URL environment variable is not set");

const adapter = new PrismaPg({ connectionString, ssl: {} });

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.$connect();
  await prisma.user.deleteMany();

  const user1 = await prisma.user.create({
    data: {
      name: "Максим",
      email: "mper06@mail.ru",
      emailVerified: new Date(),
      image: "https://avatars.githubusercontent.com/u/98224112?v=4",
      role: Role.User,
      workspaces_owned: {
        create: {
          name: "Максим's рабочая область",
          type: WorkspaceType.personal,
          accessLevel: AccessLevel.private,
        },
      },
    },
    include: {
      workspaces_owned: true,
    },
  });

  const user1_personal_board = user1.workspaces_owned[0];

  await prisma.workspace.createMany({
    data: [
      {
        ownerId: user1.id,
        name: "Private Максим's team workspace",
        type: WorkspaceType.team,
        accessLevel: AccessLevel.private,
      },
      {
        ownerId: user1.id,
        name: "Public Максим's view team workspace",
        type: WorkspaceType.team,
        accessLevel: AccessLevel.public_view,
      },
      {
        ownerId: user1.id,
        name: "Public Максим's edit team workspace",
        type: WorkspaceType.team,
        accessLevel: AccessLevel.public_edit,
      },
    ],
  });

  await prisma.board.createMany({
    data: [
      {
        ownerId: user1.id,
        name: "Private Максим's board",
        workspaceId: user1_personal_board.id,
        accessLevel: AccessLevel.private,
      },
      {
        ownerId: user1.id,
        name: "Public Максим's board",
        workspaceId: user1_personal_board.id,
        accessLevel: AccessLevel.public_view,
      },
      {
        ownerId: user1.id,
        name: "Public Максим's board",
        workspaceId: user1_personal_board.id,
        accessLevel: AccessLevel.public_edit,
      },
    ],
  });

  await prisma.user.create({
    data: {
      name: "Алексей",
      email: "alexey@example.com",
      emailVerified: new Date(),
      image: "https://avatars.githubusercontent.com/u/98224113?v=4",
      role: Role.User,
      workspaces_owned: {
        createMany: {
          data: [
            {
              name: "Алексей's рабочая область",
              type: WorkspaceType.personal,
              accessLevel: AccessLevel.private,
            },
            {
              name: "Public Алексей's view team workspace",
              type: WorkspaceType.team,
              accessLevel: AccessLevel.public_view,
            },
            {
              name: "Public Алексей's edit team workspace",
              type: WorkspaceType.team,
              accessLevel: AccessLevel.public_edit,
            },
            {
              name: "Private Алексей's team workspace",
              type: WorkspaceType.team,
              accessLevel: AccessLevel.private,
            },
          ],
        },
      },
    },
  });
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
