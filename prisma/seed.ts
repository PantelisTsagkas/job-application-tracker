import path from "node:path";
import process from "node:process";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { PrismaClient, type Status } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { addDays, subDays } from "date-fns";

neonConfig.webSocketConstructor = ws;

try {
  process.loadEnvFile(path.join(__dirname, "..", ".env.local"));
} catch {
  // .env.local optional when env vars are injected directly
}

type SeedApplication = {
  company: string;
  role: string;
  status: Status;
  location: string;
  url?: string;
  salaryMin?: number;
  salaryMax?: number;
  description?: string;
  daysAgo: number;
  followUpInDays?: number;
  notes?: string[];
};

const DEMO_APPLICATIONS: SeedApplication[] = [
  {
    company: "British Airways",
    role: "Graduate Data Engineer",
    status: "OFFER",
    location: "Heathrow, London",
    url: "https://careers.ba.com/",
    salaryMin: 32000,
    salaryMax: 38000,
    description: "Offer received for the Data Engineering graduate scheme.",
    daysAgo: 6,
    notes: [
      "Final interview: SQL case study and a chat about the data platform roadmap.",
      "Offer: £35k base + benefits. Start date in September.",
    ],
  },
  {
    company: "Revolut",
    role: "Junior Software Engineer",
    status: "OFFER",
    location: "Remote, UK",
    url: "https://www.revolut.com/careers/",
    salaryMin: 45000,
    salaryMax: 55000,
    description: "Final round went well — offer received, negotiating start date.",
    daysAgo: 18,
    notes: [
      "System design interview: design a rate-limiter.",
      "Offer: £52k base + equity. Decision deadline in 2 weeks.",
    ],
  },
  {
    company: "Monzo",
    role: "Backend Engineer Graduate",
    status: "INTERVIEWING",
    location: "London (hybrid)",
    url: "https://monzo.com/careers/",
    salaryMin: 42000,
    salaryMax: 48000,
    daysAgo: 12,
    followUpInDays: 3,
    notes: ["Technical interview scheduled — Go and distributed systems prep."],
  },
  {
    company: "Amazon",
    role: "SDE Graduate 2026",
    status: "INTERVIEWING",
    location: "London",
    url: "https://www.amazon.jobs/",
    salaryMin: 50000,
    salaryMax: 65000,
    daysAgo: 15,
    notes: ["Online assessment completed. Loop interview in two weeks."],
  },
  {
    company: "Barclays",
    role: "Graduate Technology Analyst",
    status: "PHONE_SCREEN",
    location: "London",
    url: "https://search.jobs.barclays/",
    salaryMin: 38000,
    salaryMax: 42000,
    daysAgo: 8,
    followUpInDays: 2,
  },
  {
    company: "Deloitte",
    role: "Technology Consultant Graduate",
    status: "PHONE_SCREEN",
    location: "Manchester",
    salaryMin: 34000,
    salaryMax: 38000,
    daysAgo: 10,
  },
  {
    company: "ARM",
    role: "Graduate Software Engineer",
    status: "PHONE_SCREEN",
    location: "Cambridge",
    salaryMin: 40000,
    salaryMax: 46000,
    daysAgo: 14,
  },
  {
    company: "Cisco",
    role: "Network Consulting Engineer Graduate",
    status: "PHONE_SCREEN",
    location: "Feltham",
    daysAgo: 20,
  },
  {
    company: "Sky",
    role: "DevOps Graduate Programme",
    status: "APPLIED",
    location: "Leeds",
    salaryMin: 32000,
    salaryMax: 36000,
    daysAgo: 5,
  },
  {
    company: "NatWest",
    role: "Technology Graduate Programme",
    status: "INTERVIEWING",
    location: "Edinburgh",
    url: "https://jobs.natwest.com/",
    salaryMin: 36000,
    salaryMax: 40000,
    daysAgo: 22,
    notes: ["Assessment centre completed — awaiting feedback."],
  },
  {
    company: "Sage",
    role: "Software Developer Graduate",
    status: "OFFER",
    location: "Newcastle",
    url: "https://www.sage.com/en-gb/company/careers/",
    salaryMin: 35000,
    salaryMax: 40000,
    daysAgo: 25,
    notes: ["Offer received but likely declining in favour of other opportunities."],
  },
  {
    company: "KPMG",
    role: "Data Analytics Graduate",
    status: "APPLIED",
    location: "Birmingham",
    daysAgo: 4,
  },
  {
    company: "Lloyds Banking Group",
    role: "Cloud Engineer Graduate",
    status: "APPLIED",
    location: "Leeds",
    salaryMin: 35000,
    salaryMax: 39000,
    daysAgo: 7,
  },
  {
    company: "Rolls-Royce",
    role: "Digital Technology Graduate",
    status: "APPLIED",
    location: "Derby",
    daysAgo: 9,
  },
  {
    company: "IBM",
    role: "Associate Developer",
    status: "APPLIED",
    location: "Hursley",
    url: "https://www.ibm.com/careers",
    daysAgo: 11,
  },
  {
    company: "Capgemini",
    role: "Graduate Cloud Consultant",
    status: "APPLIED",
    location: "London",
    daysAgo: 16,
  },
  {
    company: "GitHub",
    role: "Associate Support Engineer",
    status: "APPLIED",
    location: "Remote, UK",
    url: "https://github.com/about/careers",
    daysAgo: 19,
  },
  {
    company: "BT",
    role: "Network Engineer Graduate",
    status: "REJECTED",
    location: "Birmingham",
    daysAgo: 27,
    notes: ["Rejected after online assessment — will retry next intake."],
  },
  {
    company: "Vercel",
    role: "Developer Relations Intern",
    status: "REJECTED",
    location: "Remote",
    daysAgo: 24,
  },
  {
    company: "PwC",
    role: "Technology Graduate",
    status: "REJECTED",
    location: "Leeds",
    daysAgo: 21,
  },
  {
    company: "Spotify",
    role: "Associate Engineer",
    status: "WITHDRAWN",
    location: "London",
    url: "https://www.lifeatspotify.com/",
    daysAgo: 28,
    description: "Withdrew after accepting another offer closer to home.",
  },
  {
    company: "Red Hat",
    role: "Associate Technical Account Manager",
    status: "WITHDRAWN",
    location: "Remote, UK",
    daysAgo: 29,
  },
];

function parseArgs() {
  const args = process.argv.slice(2);
  let email: string | undefined;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--email" && args[i + 1]) {
      email = args[i + 1];
    }
  }
  return {
    email,
    fresh: args.includes("--fresh"),
  };
}

async function main() {
  const { email, fresh } = parseArgs();

  const connectionString =
    process.env.DATABASE_URL_UNPOOLED ??
    process.env.POSTGRES_URL_NON_POOLING ??
    process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is required. Add it to .env.local before seeding."
    );
  }

  const prisma = new PrismaClient({
    adapter: new PrismaNeon({ connectionString }),
  });

  try {
    const user = email
      ? await prisma.user.findUnique({ where: { email } })
      : await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });

    if (!user) {
      console.error(
        email
          ? `No user found with email "${email}".`
          : "No users in the database."
      );
      console.error(
        "Sign in once via GitHub or Google, then run:\n  pnpm seed\n  pnpm seed -- --email you@example.com"
      );
      process.exit(1);
    }

    const existing = await prisma.application.count({
      where: { userId: user.id },
    });

    if (existing > 0 && !fresh) {
      console.log(
        `User "${user.email}" already has ${existing} application(s).`
      );
      console.log("Run with --fresh to replace them:\n  pnpm seed -- --fresh");
      return;
    }

    if (fresh && existing > 0) {
      await prisma.application.deleteMany({ where: { userId: user.id } });
      console.log(`Cleared ${existing} existing application(s).`);
    }

    const now = new Date();

    for (const app of DEMO_APPLICATIONS) {
      const appliedAt = subDays(now, app.daysAgo);
      const createdAt = subDays(now, app.daysAgo);

      const application = await prisma.application.create({
        data: {
          userId: user.id,
          company: app.company,
          role: app.role,
          status: app.status,
          location: app.location,
          url: app.url ?? null,
          salaryMin: app.salaryMin ?? null,
          salaryMax: app.salaryMax ?? null,
          description: app.description ?? null,
          appliedAt,
          followUpAt: app.followUpInDays
            ? addDays(now, app.followUpInDays)
            : null,
          createdAt,
          updatedAt: createdAt,
        },
      });

      if (app.notes?.length) {
        for (const [index, content] of app.notes.entries()) {
          await prisma.note.create({
            data: {
              applicationId: application.id,
              content,
              createdAt: addDays(appliedAt, index + 1),
            },
          });
        }
      }
    }

    console.log(
      `Seeded ${DEMO_APPLICATIONS.length} demo applications for ${user.email}.`
    );
    console.log("Open http://localhost:3000 to capture screenshots.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
