import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = Number((session.user as any).id);
  const { searchParams } = new URL(req.url);
  const campaignId = searchParams.get("campaignId");
  const status = searchParams.get("status");

  const deliverables = await prisma.deliverable.findMany({
    where: {
      campaign: { userId },
      ...(campaignId ? { campaignId: Number(campaignId) } : {}),
      ...(status ? { status } : {}),
    },
    include: {
      campaign: {
        select: { title: true, brand: { select: { name: true, color: true } } },
      },
    },
    orderBy: { dueDate: "asc" },
  });

  const result = deliverables.map((d) => ({
    ...d,
    campaignTitle: d.campaign.title,
    brandName: d.campaign.brand.name,
    brandColor: d.campaign.brand.color,
  }));

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const deliverable = await prisma.deliverable.create({
    data: {
      campaignId: body.campaignId,
      type: body.type,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      status: body.status || "Not Started",
      payment: body.payment || 0,
      notes: body.notes || null,
    },
  });

  return NextResponse.json(deliverable, { status: 201 });
}
