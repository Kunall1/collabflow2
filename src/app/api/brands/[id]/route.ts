import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const brand = await prisma.brand.findUnique({
    where: { id: Number(params.id) },
    include: {
      campaigns: { orderBy: { startDate: "desc" } },
      payments: { orderBy: { paymentDate: "desc" } },
    },
  });

  if (!brand) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(brand);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const brand = await prisma.brand.update({
    where: { id: Number(params.id) },
    data: body,
  });

  return NextResponse.json(brand);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.brand.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ success: true });
}
