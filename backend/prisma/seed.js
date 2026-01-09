const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 8);

  // Create Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@satyanews.com" },
    update: {},
    create: {
      email: "admin@satyanews.com",
      password: hashedPassword,
      name: "Admin User",
      role: "ADMIN",
    },
  });

  // Create Journalist
  const journalist = await prisma.user.upsert({
    where: { email: "journalist@satyanews.com" },
    update: {},
    create: {
      email: "journalist@satyanews.com",
      password: hashedPassword,
      name: "Journalist One",
      role: "JOURNALIST",
    },
  });

  // Create Article
  const article = await prisma.article.create({
    data: {
      headline: "SatyaNews Launches: A New Era of Truth-Only Journalism in Bangladesh",
      body: "Today marks the launch of SatyaNews, a revolutionary news portal dedicated to human-verified, transparent journalism. In an age of misinformation, SatyaNews prioritizes accuracy over virality...",
      category: "NATIONAL",
      location: "Dhaka",
      status: "PUBLISHED",
      authorId: journalist.id,
      publishedAt: new Date(),
      sources: {
        create: [
          { name: "Official Launch Statement", url: "https://satyanews.com/launch", description: "Primary source for the launch announcement." }
        ]
      }
    },
  });

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
