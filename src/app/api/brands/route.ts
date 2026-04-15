import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = Number((session.user as any).id);
  const brands = await prisma.brand.findMany({
    where: { userId },
    include: {
      _count: { select: { campaigns: true, payments: true } },
      payments: { where: { status: "Paid" }, select: { amount: true } },
    },
    orderBy: { score: "desc" },
  });

  const result = brands.map((b) => ({
    ...b,
    campaignCount: b._count.campaigns,
    totalEarned: b.payments.reduce((sum, p) => sum + p.amount, 0),
  }));

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = Number((session.user as any).id);
  const body = await req.json();

  const brand = await prisma.brand.create({
    data: {
      userId,
      name: body.name,
      industry: body.industry || null,
      contactName: body.contactName || null,
      contactEmail: body.contactEmail || null,
      color: body.color || "#6366F1",
      status: body.status || "Active",
      score: body.score || 50,
      notes: body.notes || null,
    },
  });

  return NextResponse.json(brand, { status: 201 });
}
