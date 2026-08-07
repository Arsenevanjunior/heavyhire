import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, password, phone, role, businessName } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
        }

        const hashed = await bcrypt.hash(password, 12);

        // Only CLIENT/OWNER are self-selectable; ADMIN can never come from request input.
        const safeRole = role === "OWNER" ? "OWNER" : "CLIENT";

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashed,
                phone,
                role: safeRole,
                ...(safeRole === "OWNER" && {
                    ownerProfile: {
                        create: {
                            businessName: businessName || name,
                            country: "Rwanda",
                        },
                    },
                }),
            },
            select: { id: true, name: true, email: true, role: true },
        });

        return NextResponse.json({ user }, { status: 201 });
    } catch (error) {
        console.error("Register error:", error);
        return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
    }
}
