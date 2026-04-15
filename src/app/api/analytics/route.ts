import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = Number((session.user as any).id);

  // Total revenue (paid payments)
  const paidPayments = await prisma.payment.findMany({
    where: { userId, status: "Paid" },
    select: { amount: true, paymentDate: true },
  });
  const totalRevenue = paidPayments.reduce((s, p) => s + p.amount, 0);

  // Pending payments
  const pendingPayments = await prisma.payment.findMany({
    where: { userId, status: { not: "Paid" } },
    select: { amount: true },
  });
  const totalPending = pendingPayments.reduce((s, p) => s + p.amount, 0);

  // Active campaigns
  const activeCampaigns = await prisma.campaign.count({
    where: { userId, status: "Active" },
  });

  // Total brands
  const totalBrands = await prisma.brand.count({ where: { userId } });

  // Monthly earnings (last 7 months)
  const monthlyEarnings = await prisma.$queryRaw<
    { month: string; earnings: number; campaigns: number }[]
  >`
    SELECT 
      TO_CHAR(p.payment_date, 'Mon') as month,
      COALESCE(SUM(p.amount), 0)::float as earnings,
      COUNT(DISTINCT p.campaign_id)::int as campaigns
    FROM payments p
    WHERE p.user_id = ${userId}
      AND p.status = 'Paid'
      AND p.payment_date >= NOW() - INTERVAL '7 months'
    GROUP BY TO_CHAR(p.payment_date, 'Mon'), DATE_TRUNC('month', p.payment_date)
    ORDER BY DATE_TRUNC('month', p.payment_date)
  `;

  // Revenue by brand
  const brandRevenue = await prisma.brand.findMany({
    where: { userId },
    select: {
      name: true,
      color: true,
      score: true,
      payments: { where: { status: "Paid" }, select: { amount: true } },
      _count: { select: { campaigns: true } },
    },
  });

  const brandData = brandRevenue.map((b) => ({
    name: b.name,
    color: b.color,
    score: b.score,
    revenue: b.payments.reduce((s, p) => s + p.amount, 0),
    campaigns: b._count.campaigns,
  }));

  // Platform distribution (from campaign platformType)
  const campaigns = await prisma.campaign.findMany({
    where: { userId },
    select: { platformType: true, budget: true },
  });

  const platformMap: Record<string, number> = {};
  campaigns.forEach((c) => {
    if (!c.platformType) return;
    const platforms = c.platformType.split(/[+,&]/).map((p) => p.trim());
    platforms.forEach((p) => {
      const key = p.includes("Instagram") || p.includes("IG") || p.includes("Reels") || p.includes("Stories")
        ? "Instagram"
        : p.includes("YouTube") || p.includes("YT")
        ? "YouTube"
        : p.includes("TikTok")
        ? "TikTok"
        : "Other";
      platformMap[key] = (platformMap[key] || 0) + c.budget / platforms.length;
    });
  });

  const totalPlatform = Object.values(platformMap).reduce((s, v) => s + v, 0);
  const platformColors: Record<string, string> = {
    Instagram: "#E1306C",
    YouTube: "#FF0000",
    TikTok: "#00F2EA",
    Other: "#6366F1",
  };
  const platformData = Object.entries(platformMap).map(([name, value]) => ({
    name,
    value: Math.round((value / totalPlatform) * 100),
    color: platformColors[name] || "#6366F1",
  }));

  // Upcoming deliverables
  const upcomingDeliverables = await prisma.deliverable.findMany({
    where: {
      campaign: { userId },
      status: { notIn: ["Paid", "Approved"] },
    },
    include: {
      campaign: { select: { title: true, brand: { select: { name: true, color: true } } } },
    },
    orderBy: { dueDate: "asc" },
    take: 5,
  });

  // Calendar events
  const calendarEvents = await prisma.calendarEvent.findMany({
    where: { userId },
    orderBy: { eventDate: "asc" },
  });

  return NextResponse.json({
    stats: { totalRevenue, totalPending, activeCampaigns, totalBrands },
    monthlyEarnings,
    brandData,
    platformData,
    upcomingDeliverables: upcomingDeliverables.map((d) => ({
      ...d,
      brandName: d.campaign.brand.name,
      brandColor: d.campaign.brand.color,
      campaignTitle: d.campaign.title,
    })),
    calendarEvents,
  });
}
