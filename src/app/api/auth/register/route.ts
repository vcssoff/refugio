import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, isShelter, shelterName, phone } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 });
    }

    const cleanEmail = String(email).toLowerCase().trim();

    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Este correo electrónico ya se encuentra registrado" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const isAdmin = cleanEmail === (process.env.ADMIN_EMAIL || "admin@refugio.com").toLowerCase();

    const user = await prisma.user.create({
      data: {
        name,
        email: cleanEmail,
        password: hashedPassword,
        role: isAdmin ? "ADMIN" : isShelter ? "REFUGIO" : "USUARIO",
        isVerifiedShelter: isAdmin || Boolean(isShelter),
        shelterName: isShelter ? shelterName || name : null,
        phone,
      },
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error("Error en POST /api/auth/register:", error);
    return NextResponse.json({ error: "Error al registrar el usuario" }, { status: 500 });
  }
}
