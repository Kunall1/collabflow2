import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = Number((session.user as any).id);
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const payments = await prisma.payment.findMany({
    where: {
      userId,
      ...(status ? { status } : {}),
    },
    include: {
      brand: { select: { name: true, color: true } },
      campaign: { select: { title: true } },
    },
    orderBy: { paymentDate: "desc" },
  });

  const result = payments.map((p) => ({
    ...p,
    brandName: p.brand.name,
    brandColor: p.brand.color,
    campaignTitle: p.campaign.title,
  }));

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = Number((session.user as any).id);
  const body = await req.json();

  const payment = await prisma.payment.create({
    data: {
      userId,
      campaignId: body.campaignId,
      brandId: body.brandId,
      amount: body.amount,
      paymentDate: body.paymentDate ? new Date(body.paymentDate) : null,
      status: body.status || "Pending",
      method: body.method || null,
      invoiceUrl: body.invoiceUrl || null,
    },
  });

  return NextResponse.json(payment, { status: 201 });
}
