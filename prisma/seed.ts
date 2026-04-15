import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── User ───
  const passwordHash = await bcrypt.hash("demo123", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@collabflow.io" },
    update: {},
    create: {
      email: "demo@collabflow.io",
      passwordHash,
      name: "Kunal",
      avatarUrl: null,
    },
  });
  console.log("✅ User created:", user.email);

  // ─── Brands ───
  const brandsData = [
    { name: "Nike", industry: "Sportswear", contactName: "Sarah Chen", contactEmail: "sarah@nike.com", color: "#F97316", status: "Active", score: 92 },
    { name: "Glossier", industry: "Beauty", contactName: "Maya Patel", contactEmail: "maya@glossier.com", color: "#EC4899", status: "Active", score: 88 },
    { name: "Adobe", industry: "Technology", contactName: "James Wilson", contactEmail: "james@adobe.com", color: "#8B5CF6", status: "Active", score: 95 },
    { name: "Spotify", industry: "Entertainment", contactName: "Alex Rivera", contactEmail: "alex@spotify.com", color: "#22C55E", status: "Paused", score: 78 },
    { name: "Airbnb", industry: "Travel", contactName: "Lisa Nakamura", contactEmail: "lisa@airbnb.com", color: "#EF4444", status: "Active", score: 85 },
    { name: "Tesla", industry: "Automotive", contactName: "Elon's Team", contactEmail: "creators@tesla.com", color: "#3B82F6", status: "Negotiating", score: 70 },
  ];

  const brands: any[] = [];
  for (const b of brandsData) {
    const brand = await prisma.brand.create({ data: { ...b, userId: user.id } });
    brands.push(brand);
  }
  console.log(`✅ ${brands.length} brands created`);

  // ─── Campaigns ───
  const campaignsData = [
    { brandIdx: 0, title: "Summer Fitness 2026", status: "Active", budget: 25000, spent: 18500, startDate: new Date("2026-03-01"), endDate: new Date("2026-06-30"), platformType: "Instagram + YouTube" },
    { brandIdx: 1, title: "Clean Beauty Drop", status: "Active", budget: 15000, spent: 9200, startDate: new Date("2026-04-01"), endDate: new Date("2026-05-15"), platformType: "TikTok + Reels" },
    { brandIdx: 2, title: "Creative Cloud Q2", status: "Completed", budget: 30000, spent: 30000, startDate: new Date("2026-01-10"), endDate: new Date("2026-03-30"), platformType: "YouTube Series" },
    { brandIdx: 3, title: "Discover Weekly Promo", status: "Paused", budget: 12000, spent: 4000, startDate: new Date("2026-02-15"), endDate: new Date("2026-04-15"), platformType: "Instagram Stories" },
    { brandIdx: 4, title: "Wanderlust Series", status: "Upcoming", budget: 20000, spent: 0, startDate: new Date("2026-05-01"), endDate: new Date("2026-07-31"), platformType: "YouTube + Blog" },
    { brandIdx: 0, title: "Marathon Collab", status: "Active", budget: 18000, spent: 12000, startDate: new Date("2026-03-15"), endDate: new Date("2026-05-30"), platformType: "Reels + Stories" },
    { brandIdx: 2, title: "Firefly AI Launch", status: "Upcoming", budget: 35000, spent: 0, startDate: new Date("2026-05-15"), endDate: new Date("2026-08-15"), platformType: "Multi-Platform" },
  ];

  const campaigns: any[] = [];
  for (const c of campaignsData) {
    const { brandIdx, ...data } = c;
    const campaign = await prisma.campaign.create({
      data: { ...data, userId: user.id, brandId: brands[brandIdx].id },
    });
    campaigns.push(campaign);
  }
  console.log(`✅ ${campaigns.length} campaigns created`);

  // ─── Deliverables ───
  const deliverablesData = [
    { campaignIdx: 0, type: "Instagram Reel", dueDate: new Date("2026-04-10"), status: "Submitted", payment: 3000 },
    { campaignIdx: 0, type: "YouTube Video", dueDate: new Date("2026-04-20"), status: "Approved", payment: 5000 },
    { campaignIdx: 0, type: "IG Story Series", dueDate: new Date("2026-05-01"), status: "Not Started", payment: 2500 },
    { campaignIdx: 1, type: "TikTok Video", dueDate: new Date("2026-04-15"), status: "In Progress", payment: 2500 },
    { campaignIdx: 1, type: "IG Carousel", dueDate: new Date("2026-04-25"), status: "Draft", payment: 2000 },
    { campaignIdx: 1, type: "Reels x3", dueDate: new Date("2026-05-05"), status: "Not Started", payment: 4700 },
    { campaignIdx: 2, type: "YouTube Tutorial", dueDate: new Date("2026-03-15"), status: "Paid", payment: 8000 },
    { campaignIdx: 2, type: "YouTube Review", dueDate: new Date("2026-03-25"), status: "Paid", payment: 8000 },
    { campaignIdx: 2, type: "Blog Post", dueDate: new Date("2026-02-28"), status: "Paid", payment: 4000 },
    { campaignIdx: 5, type: "Story Series", dueDate: new Date("2026-04-18"), status: "In Progress", payment: 2500 },
    { campaignIdx: 5, type: "Reel: Race Day", dueDate: new Date("2026-05-10"), status: "Not Started", payment: 4000 },
    { campaignIdx: 4, type: "Vlog Episode 1", dueDate: new Date("2026-05-10"), status: "Not Started", payment: 4000 },
    { campaignIdx: 4, type: "Vlog Episode 2", dueDate: new Date("2026-06-10"), status: "Not Started", payment: 4000 },
    { campaignIdx: 6, type: "Demo Video", dueDate: new Date("2026-06-01"), status: "Not Started", payment: 6000 },
    { campaignIdx: 6, type: "Tutorial Series", dueDate: new Date("2026-07-01"), status: "Not Started", payment: 10000 },
  ];

  for (const d of deliverablesData) {
    const { campaignIdx, ...data } = d;
    await prisma.deliverable.create({ data: { ...data, campaignId: campaigns[campaignIdx].id } });
  }
  console.log(`✅ ${deliverablesData.length} deliverables created`);

  // ─── Payments ───
  const paymentsData = [
    { brandIdx: 2, campaignIdx: 2, amount: 30000, paymentDate: new Date("2026-03-31"), status: "Paid", method: "Wire Transfer" },
    { brandIdx: 0, campaignIdx: 0, amount: 12500, paymentDate: new Date("2026-04-05"), status: "Paid", method: "PayPal" },
    { brandIdx: 0, campaignIdx: 0, amount: 6000, paymentDate: new Date("2026-04-30"), status: "Pending", method: "PayPal" },
    { brandIdx: 1, campaignIdx: 1, amount: 9200, paymentDate: new Date("2026-04-20"), status: "Pending", method: "Wire Transfer" },
    { brandIdx: 0, campaignIdx: 5, amount: 12000, paymentDate: new Date("2026-05-01"), status: "Invoiced", method: "PayPal" },
    { brandIdx: 4, campaignIdx: 4, amount: 10000, paymentDate: new Date("2026-05-15"), status: "Scheduled", method: "Wire Transfer" },
    { brandIdx: 3, campaignIdx: 3, amount: 4000, paymentDate: new Date("2026-03-15"), status: "Paid", method: "Stripe" },
  ];

  for (const p of paymentsData) {
    const { brandIdx, campaignIdx, ...data } = p;
    await prisma.payment.create({
      data: { ...data, userId: user.id, brandId: brands[brandIdx].id, campaignId: campaigns[campaignIdx].id },
    });
  }
  console.log(`✅ ${paymentsData.length} payments created`);

  // ─── Calendar Events ───
  const eventsData = [
    { campaignIdx: 0, title: "Nike Reel Due", eventDate: new Date("2026-04-10"), eventType: "deliverable", color: "#F97316" },
    { campaignIdx: 1, title: "Glossier Sync Call", eventDate: new Date("2026-04-12"), eventType: "meeting", color: "#EC4899" },
    { campaignIdx: 1, title: "TikTok Post Due", eventDate: new Date("2026-04-15"), eventType: "deliverable", color: "#EC4899" },
    { campaignIdx: 5, title: "Nike Stories Due", eventDate: new Date("2026-04-18"), eventType: "deliverable", color: "#F97316" },
    { campaignIdx: 0, title: "YouTube Upload Due", eventDate: new Date("2026-04-20"), eventType: "deliverable", color: "#F97316" },
    { campaignIdx: 6, title: "Adobe Kickoff", eventDate: new Date("2026-04-22"), eventType: "meeting", color: "#8B5CF6" },
    { campaignIdx: 1, title: "Glossier Carousel Due", eventDate: new Date("2026-04-25"), eventType: "deliverable", color: "#EC4899" },
    { campaignIdx: 4, title: "Airbnb Kickoff", eventDate: new Date("2026-04-28"), eventType: "meeting", color: "#EF4444" },
    { campaignIdx: 0, title: "Nike Story Series Due", eventDate: new Date("2026-05-01"), eventType: "deliverable", color: "#F97316" },
    { campaignIdx: 4, title: "Airbnb Vlog 1 Due", eventDate: new Date("2026-05-10"), eventType: "deliverable", color: "#EF4444" },
  ];

  for (const e of eventsData) {
    const { campaignIdx, ...data } = e;
    await prisma.calendarEvent.create({
      data: { ...data, userId: user.id, campaignId: campaigns[campaignIdx].id },
    });
  }
  console.log(`✅ ${eventsData.length} calendar events created`);

  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
