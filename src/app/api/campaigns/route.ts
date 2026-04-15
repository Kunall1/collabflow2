import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = Number((session.user as any).id);
  const campaigns = await prisma.campaign.findMany({
    where: { userId },
    include: {
      brand: { select: { name: true, color: true } },
      _count: { select: { deliverables: true } },
      deliverables: { select: { status: true } },
    },
    orderBy: { startDate: "desc" },
  });

  const result = campaigns.map((c) => ({
    ...c,
    brandName: c.brand.name,
    brandColor: c.brand.color,
    totalDeliverables: c._count.deliverables,
    completedDeliverables: c.deliverables.filter(
      (d) => d.status === "Approved" || d.status === "Paid"
    ).length,
  }));

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = Number((session.user as any).id);
  const body = await req.json();

  const campaign = await prisma.campaign.create({
    data: {
      userId,
      brandId: body.brandId,
      title: body.title,
      status: body.status || "Upcoming",
      budget: body.budget || 0,
      spent: body.spent || 0,
      startDate: body.startDate ? new Date(body.startDate) : null,
      endDate: body.endDate ? new Date(body.endDate) : null,
      platformType: body.platformType || null,
    },
  });

  return NextResponse.json(campaign, { status: 201 });
}
