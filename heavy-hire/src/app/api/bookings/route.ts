import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      equipmentId,
      startDate,
      endDate,
      notes,
      deliveryAddress,
    } = body;

    if (!equipmentId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const equipment = await prisma.equipment.findUnique({
      where: { id: equipmentId },
    });

    if (!equipment) {
      return NextResponse.json(
        { error: "Equipment not found" },
        { status: 404 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (totalDays < equipment.minHireDays) {
      return NextResponse.json(
        { error: `Minimum hire is ${equipment.minHireDays} days` },
        { status: 400 }
      );
    }

    const subtotal = equipment.pricePerDay * totalDays;
    const commissionAmount = subtotal * 0.1; // 10% commission
    const totalPrice = subtotal + commissionAmount;

    const booking = await prisma.booking.create({
      data: {
        equipmentId,
        clientId: user.id,
        startDate: start,
        endDate: end,
        totalDays,
        subtotal,
        commissionAmount,
        totalPrice,
        notes: notes || null,
        deliveryAddress: deliveryAddress || null,
      },
      include: {
        equipment: true,
        client: true,
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const bookings = await prisma.booking.findMany({
      where: {
        clientId: user.id,
      },
      include: {
        equipment: {
          include: {
            owner: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
        },
        payment: true,
        review: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
