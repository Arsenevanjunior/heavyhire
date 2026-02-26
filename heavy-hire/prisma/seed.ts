import { PrismaClient, Role, EquipmentCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding HeavyHire database...");

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 12);
    const admin = await prisma.user.upsert({
        where: { email: "admin@heavyhire.rw" },
        update: {},
        create: {
            name: "HeavyHire Admin",
            email: "admin@heavyhire.rw",
            password: adminPassword,
            role: Role.ADMIN,
            isVerified: true,
        },
    });

    // Create owner user
    const ownerPassword = await bcrypt.hash("owner123", 12);
    const owner = await prisma.user.upsert({
        where: { email: "owner@heavyhire.rw" },
        update: {},
        create: {
            name: "Jean Pierre Habimana",
            email: "owner@heavyhire.rw",
            password: ownerPassword,
            role: Role.OWNER,
            phone: "+250788123456",
            isVerified: true,
            ownerProfile: {
                create: {
                    businessName: " Heavy Equipment Ltd",
                    city: "Kigali",
                    country: "Rwanda",
                    walletBalance: 450000,
                    totalEarnings: 2350000,
                    totalBookings: 48,
                    subscriptionTier: "PROFESSIONAL",
                    isBadgeVerified: true,
                },
            },
        },
    });

    // Create client user
    const clientPassword = await bcrypt.hash("client123", 12);
    const client = await prisma.user.upsert({
        where: { email: "client@heavyhire.rw" },
        update: {},
        create: {
            name: "Alice Uwimana",
            email: "client@heavyhire.rw",
            password: clientPassword,
            role: Role.CLIENT,
            phone: "+250722654321",
            isVerified: true,
        },
    });

    // Create equipment listings
    const equipmentData = [
        {
            ownerId: owner.id,
            title: "Caterpillar 320 Hydraulic Excavator",
            category: EquipmentCategory.CONSTRUCTION,
            description:
                "Powerful 20-tonne hydraulic excavator ideal for large-scale construction, road building, and earthmoving projects. Features GPS, air-conditioned cab, and quick-coupler system.",
            specs: {
                make: "Caterpillar",
                model: "320",
                year: 2021,
                weight: "20,000 kg",
                engine: "Cat C4.4 ACERT, 103 kW",
                bucketCapacity: "0.5–1.19 m³",
                maxDepth: "6.55 m",
                operatingHours: "1,240",
            },
            pricePerDay: 85000,
            pricePerWeek: 500000,
            location: "Kigali Industrial Zone",
            city: "Kigali",
            images: [
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
                "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800",
            ],
            isAvailable: true,
            isFeatured: true,
            isApproved: true,
            rating: 4.8,
            reviewCount: 23,
        },
        {
            ownerId: owner.id,
            title: "Komatsu D65 Bulldozer",
            category: EquipmentCategory.CONSTRUCTION,
            description:
                "Heavy-duty bulldozer for land clearing, grading, and site preparation. Equipped with 6-way blade and ROPS cab. Ideal for mining and large construction projects.",
            specs: {
                make: "Komatsu",
                model: "D65EX-18",
                year: 2020,
                weight: "19,100 kg",
                engine: "Komatsu SAA6D114E-5, 168 kW",
                bladeCapacity: "4.3 m³",
                groundPressure: "0.078 MPa",
            },
            pricePerDay: 75000,
            pricePerWeek: 440000,
            location: "Gasabo District",
            city: "Kigali",
            images: [
                "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800",
                "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800",
            ],
            isAvailable: true,
            isFeatured: true,
            isApproved: true,
            rating: 4.6,
            reviewCount: 18,
        },
        {
            ownerId: owner.id,
            title: "John Deere 6130M Farm Tractor",
            category: EquipmentCategory.AGRICULTURAL,
            description:
                "Versatile mid-range farm tractor suitable for plowing, planting, and hauling. AutoTrac ready, PTO 540/1000 rpm, comfortable CommandView cab.",
            specs: {
                make: "John Deere",
                model: "6130M",
                year: 2022,
                horsepower: "130 HP",
                engine: "JD PowerTech 4.5L",
                transmission: "AutoQuad Plus 20/20",
                pto: "540/1000 rpm",
                liftCapacity: "6,100 kg",
            },
            pricePerDay: 45000,
            pricePerWeek: 268000,
            location: "Musanze",
            city: "Musanze",
            images: [
                "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
                "https://images.unsplash.com/photo-1592878849122-facb97ed9cdc?w=800",
            ],
            isAvailable: true,
            isFeatured: true,
            isApproved: true,
            rating: 4.9,
            reviewCount: 31,
        },
        {
            ownerId: owner.id,
            title: "Massey Ferguson 5713S Tractor",
            category: EquipmentCategory.AGRICULTURAL,
            description:
                "Compact utility tractor for small to medium farms. Front loader ready, excellent fuel economy, ideal for tea, coffee, and maize farming.",
            specs: {
                make: "Massey Ferguson",
                model: "5713S",
                year: 2021,
                horsepower: "130 HP",
                engine: "AGCO Power 4-cyl",
                transmission: "Dyna-6 24x24",
                liftCapacity: "5,900 kg",
            },
            pricePerDay: 38000,
            pricePerWeek: 220000,
            location: "Huye",
            city: "Huye",
            images: [
                "https://images.unsplash.com/photo-1592878849122-facb97ed9cdc?w=800",
                "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
            ],
            isAvailable: true,
            isFeatured: false,
            isApproved: true,
            rating: 4.5,
            reviewCount: 12,
        },
        {
            ownerId: owner.id,
            title: "Mercedes Actros 2546 Heavy Truck",
            category: EquipmentCategory.HEAVY_TRANSPORT,
            description:
                "Long-haul articulated truck with 46-tonne GVM. Ideal for transporting heavy construction materials, machinery, and bulk goods across Rwanda and East Africa.",
            specs: {
                make: "Mercedes-Benz",
                model: "Actros 2546",
                year: 2022,
                gvm: "46,000 kg",
                engine: "OM 470, 460 HP",
                transmission: "PowerShift 3 12-speed",
                wheelbase: "3,900 mm",
                payload: "30,000 kg",
            },
            pricePerDay: 120000,
            pricePerWeek: 700000,
            location: "Kigali Logistics Hub",
            city: "Kigali",
            images: [
                "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800",
                "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800",
            ],
            isAvailable: true,
            isFeatured: true,
            isApproved: true,
            rating: 4.7,
            reviewCount: 19,
        },
        {
            ownerId: owner.id,
            title: "Volvo FH16 750 Flatbed Truck",
            category: EquipmentCategory.HEAVY_TRANSPORT,
            description:
                "Premium heavy-haul truck with 750HP engine. Equipped with flatbed trailer for oversized load transport including construction equipment, steel beams, and containers.",
            specs: {
                make: "Volvo",
                model: "FH16 750",
                year: 2023,
                gvm: "44,000 kg",
                engine: "D16K, 750 HP",
                transmission: "I-Shift 12-speed",
                payload: "28,000 kg",
            },
            pricePerDay: 150000,
            pricePerWeek: 875000,
            location: "Kigali",
            city: "Kigali",
            images: [
                "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800",
                "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800",
            ],
            isAvailable: false,
            isFeatured: false,
            isApproved: true,
            rating: 4.9,
            reviewCount: 9,
        },
        {
            ownerId: owner.id,
            title: "Carrier Transicold 20ft Reefer Truck",
            category: EquipmentCategory.REFRIGERATED,
            description:
                "Temperature-controlled refrigerated truck for cold chain logistics. Maintains -25°C to +25°C. Ideal for pharmaceutical, fresh produce, dairy, and frozen food transport.",
            specs: {
                make: "Carrier Transicold",
                model: "Supra 850U",
                year: 2022,
                tempRange: "-25°C to +25°C",
                capacity: "20 m³",
                powerSource: "Diesel/Electric standby",
                bodyLength: "6.1 m",
                payload: "5,000 kg",
            },
            pricePerDay: 65000,
            pricePerWeek: 380000,
            location: "Kigali",
            city: "Kigali",
            images: [
                "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800",
                "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800",
            ],
            isAvailable: true,
            isFeatured: true,
            isApproved: true,
            rating: 4.8,
            reviewCount: 27,
        },
        {
            ownerId: owner.id,
            title: "Thermo King T-1000R Freezer Truck",
            category: EquipmentCategory.REFRIGERATED,
            description:
                "Industrial freezer truck maintaining deep-freeze temperatures down to -30°C. Equipped with GPS tracking, remote temp monitoring, and twin-evaporator cooling.",
            specs: {
                make: "Thermo King",
                model: "T-1000R",
                year: 2021,
                tempRange: "-30°C to +25°C",
                capacity: "40 m³",
                powerSource: "Diesel self-powered",
                bodyLength: "13.6 m",
                payload: "22,000 kg",
            },
            pricePerDay: 95000,
            pricePerWeek: 560000,
            location: "Kicukiro",
            city: "Kigali",
            images: [
                "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800",
                "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800",
            ],
            isAvailable: true,
            isFeatured: false,
            isApproved: true,
            rating: 4.6,
            reviewCount: 14,
        },
    ];

    for (const eq of equipmentData) {
        await prisma.equipment.create({ data: eq });
    }

    console.log("✅ Database seeded successfully!");
    console.log(`
  Test Accounts:
  ─────────────────────────────────
  Admin:  admin@heavyhire.rw  / admin123
  Owner:  owner@heavyhire.rw  / owner123
  Client: client@heavyhire.rw / client123
  `);
}

main()
    .catch((e) => {
        console.error("❌ Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
