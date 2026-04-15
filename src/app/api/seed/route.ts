import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    // Check if already seeded
    const existingUser = await prisma.user.findUnique({
      where: { email: "demo@collabflow.io" },
    });
    if (existingUser) {
      return NextResponse.json({ message: "Database already seeded", seeded: true });
    }

    const passwordHash = await bcrypt.hash("demo123", 12);
    const user = await prisma.user.create({
      data: { email: "demo@collabflow.io", passwordHash, name: "Rishabh" },
    });

    const brandsData = [
      { name: "Nike", industry: "Sportswear", contactName: "Sarah Chen", contactEmail: "sarah@nike.com", color: "#F97316", status: "Active", score: 92 },
      { name: "Glossier", industry: "Beauty", contactName: "Maya Patel", contactEmail: "maya@glossier.com", color: "#EC4899", status: "Active", score: 88 },
      { name: "Adobe", industry: "Technology", contactName: "James Wilson", contactEmail: "james@adobe.com", color: "#8B5CF6", status: "Active", score: 95 },
      { name: "Spotify", industry: "Entertainment", contactName: "Alex Rivera", contactEmail: "alex@spotify.com", color: "#22C55E", status: "Paused", score: 78 },
      { name: "Airbnb", industry: "Travel", contactName: "Lisa Nakamura", contactEmail: "lisa@airbnb.com", color: "#EF4444", status: "Active", score: 85 },
      { name: "Tesla", industry: "Automotive", contactName: "Creator Relations", contactEmail: "creators@tesla.com", color: "#3B82F6", status: "Negotiating", score: 70 },
    ];

    const brands = [];
    for (const b of brandsData) {
      brands.push(await prisma.brand.create({ data: { ...b, userId: user.id } }));
    }

    const campaignsData = [
      { bi: 0, title: "Summer Fitness 2026", status: "Active", budget: 25000, spent: 18500, startDate: "2026-03-01", endDate: "2026-06-30", platformType: "Instagram + YouTube" },
      { bi: 1, title: "Clean Beauty Drop", status: "Active", budget: 15000, spent: 9200, startDate: "2026-04-01", endDate: "2026-05-15", platformType: "TikTok + Reels" },
      { bi: 2, title: "Creative Cloud Q2", status: "Completed", budget: 30000, spent: 30000, startDate: "2026-01-10", endDate: "2026-03-30", platformType: "YouTube Series" },
      { bi: 3, title: "Discover Weekly Promo", status: "Paused", budget: 12000, spent: 4000, startDate: "2026-02-15", endDate: "2026-04-15", platformType: "Instagram Stories" },
      { bi: 4, title: "Wanderlust Series", status: "Upcoming", budget: 20000, spent: 0, startDate: "2026-05-01", endDate: "2026-07-31", platformType: "YouTube + Blog" },
      { bi: 0, title: "Marathon Collab", status: "Active", budget: 18000, spent: 12000, startDate: "2026-03-15", endDate: "2026-05-30", platformType: "Reels + Stories" },
      { bi: 2, title: "Firefly AI Launch", status: "Upcoming", budget: 35000, spent: 0, startDate: "2026-05-15", endDate: "2026-08-15", platformType: "Multi-Platform" },
    ];

    const campaigns = [];
    for (const c of campaignsData) {
      const { bi, ...data } = c;
      campaigns.push(await prisma.campaign.create({
        data: { ...data, startDate: new Date(data.startDate), endDate: new Date(data.endDate), userId: user.id, brandId: brands[bi].id },
      }));
    }

    const deliverables = [
      { ci: 0, type: "Instagram Reel", dueDate: "2026-04-10", status: "Submitted", payment: 3000 },
      { ci: 0, type: "YouTube Video", dueDate: "2026-04-20", status: "Approved", payment: 5000 },
      { ci: 0, type: "IG Story Series", dueDate: "2026-05-01", status: "Not Started", payment: 2500 },
      { ci: 1, type: "TikTok Video", dueDate: "2026-04-15", status: "In Progress", payment: 2500 },
      { ci: 1, type: "IG Carousel", dueDate: "2026-04-25", status: "Draft", payment: 2000 },
      { ci: 1, type: "Reels x3", dueDate: "2026-05-05", status: "Not Started", payment: 4700 },
      { ci: 2, type: "YouTube Tutorial", dueDate: "2026-03-15", status: "Paid", payment: 8000 },
      { ci: 2, type: "YouTube Review", dueDate: "2026-03-25", status: "Paid", payment: 8000 },
      { ci: 5, type: "Story Series", dueDate: "2026-04-18", status: "In Progress", payment: 2500 },
      { ci: 4, type: "Vlog Episode 1", dueDate: "2026-05-10", status: "Not Started", payment: 4000 },
      { ci: 6, type: "Demo Video", dueDate: "2026-06-01", status: "Not Started", payment: 6000 },
      { ci: 6, type: "Tutorial Series", dueDate: "2026-07-01", status: "Not Started", payment: 10000 },
    ];

    for (const d of deliverables) {
      const { ci, ...data } = d;
      await prisma.deliverable.create({ data: { ...data, dueDate: new Date(data.dueDate), campaignId: campaigns[ci].id } });
    }

    const payments = [
      { bi: 2, ci: 2, amount: 30000, paymentDate: "2026-03-31", status: "Paid", method: "Wire Transfer" },
      { bi: 0, ci: 0, amount: 12500, paymentDate: "2026-04-05", status: "Paid", method: "PayPal" },
      { bi: 0, ci: 0, amount: 6000, paymentDate: "2026-04-30", status: "Pending", method: "PayPal" },
      { bi: 1, ci: 1, amount: 9200, paymentDate: "2026-04-20", status: "Pending", method: "Wire Transfer" },
      { bi: 0, ci: 5, amount: 12000, paymentDate: "2026-05-01", status: "Invoiced", method: "PayPal" },
      { bi: 4, ci: 4, amount: 10000, paymentDate: "2026-05-15", status: "Scheduled", method: "Wire Transfer" },
      { bi: 3, ci: 3, amount: 4000, paymentDate: "2026-03-15", status: "Paid", method: "Stripe" },
    ];

    for (const p of payments) {
      const { bi, ci, ...data } = p;
      await prisma.payment.create({
        data: { ...data, paymentDate: new Date(data.paymentDate), userId: user.id, brandId: brands[bi].id, campaignId: campaigns[ci].id },
      });
    }

    const events = [
      { ci: 0, title: "Nike Reel Due", eventDate: "2026-04-10", eventType: "deliverable", color: "#F97316" },
      { ci: 1, title: "Glossier Sync Call", eventDate: "2026-04-12", eventType: "meeting", color: "#EC4899" },
      { ci: 1, title: "TikTok Post Due", eventDate: "2026-04-15", eventType: "deliverable", color: "#EC4899" },
      { ci: 5, title: "Nike Stories Due", eventDate: "2026-04-18", eventType: "deliverable", color: "#F97316" },
      { ci: 0, title: "YouTube Upload Due", eventDate: "2026-04-20", eventType: "deliverable", color: "#F97316" },
      { ci: 6, title: "Adobe Kickoff", eventDate: "2026-04-22", eventType: "meeting", color: "#8B5CF6" },
      { ci: 1, title: "Glossier Carousel Due", eventDate: "2026-04-25", eventType: "deliverable", color: "#EC4899" },
      { ci: 4, title: "Airbnb Kickoff", eventDate: "2026-04-28", eventType: "meeting", color: "#EF4444" },
    ];

    for (const e of events) {
      const { ci, ...data } = e;
      await prisma.calendarEvent.create({
        data: { ...data, eventDate: new Date(data.eventDate), userId: user.id, campaignId: campaigns[ci].id },
      });
    }

    return NextResponse.json({ message: "Database seeded successfully!", seeded: true });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
