import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting StubbleLink seed...");

  // Clear existing demo data
  await prisma.impactRecord.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.pickupJob.deleteMany();
  await prisma.match.deleteMany();
  await prisma.residueListing.deleteMany();
  await prisma.transporterProfile.deleteMany();
  await prisma.processor.deleteMany();
  await prisma.farmerProfile.deleteMany();
  await prisma.user.deleteMany();

  // --------------------------------------------------
  // 1. FARMERS
  // --------------------------------------------------

  const farmerData = [
    ["Arjun Mehta", "arjun@example.com", "9876501001", "Karnal", "Haryana"],
    ["Ravi Kumar", "ravi@example.com", "9876501002", "Panipat", "Haryana"],
    ["Suresh Yadav", "suresh@example.com", "9876501003", "Meerut", "Uttar Pradesh"],
    ["Mohan Singh", "mohan@example.com", "9876501004", "Patiala", "Punjab"],
    ["Vikram Sharma", "vikram@example.com", "9876501005", "Ludhiana", "Punjab"],
    ["Deepak Verma", "deepak@example.com", "9876501006", "Hisar", "Haryana"],
    ["Amit Chauhan", "amit@example.com", "9876501007", "Rohtak", "Haryana"],
    ["Rajesh Patel", "rajesh@example.com", "9876501008", "Indore", "Madhya Pradesh"],
    ["Nitin Joshi", "nitin@example.com", "9876501009", "Alwar", "Rajasthan"],
    ["Manoj Das", "manoj@example.com", "9876501010", "Jaipur", "Rajasthan"],
    ["Karan Gill", "karan@example.com", "9876501011", "Bathinda", "Punjab"],
    ["Pankaj Mishra", "pankaj@example.com", "9876501012", "Bareilly", "Uttar Pradesh"],
  ];

  const farmers = [];

  for (const [name, email, phone, district, state] of farmerData) {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        role: "FARMER",
        farmerProfile: {
          create: {
            village: `${district} Rural`,
            district,
            state,
          },
        },
      },
    });

    farmers.push(user);
  }

  // --------------------------------------------------
  // 2. PROCESSORS
  // --------------------------------------------------

  const processorData = [
    {
      name: "GreenFuel BioEnergy",
      location: "Karnal, Haryana",
      acceptedMaterials: "Paddy Straw,Wheat Straw",
      capacity: 5000,
      currentAvailability: 3200,
      contact: "9876510001",
      status: "ACTIVE",
    },
    {
      name: "AgriCycle Industries",
      location: "Panipat, Haryana",
      acceptedMaterials: "Paddy Straw,Corn Residue",
      capacity: 4000,
      currentAvailability: 2100,
      contact: "9876510002",
      status: "ACTIVE",
    },
    {
      name: "BioHarvest Solutions",
      location: "Patiala, Punjab",
      acceptedMaterials: "Paddy Straw,Wheat Straw",
      capacity: 6000,
      currentAvailability: 4500,
      contact: "9876510003",
      status: "ACTIVE",
    },
    {
      name: "EcoResidue Energy",
      location: "Meerut, Uttar Pradesh",
      acceptedMaterials: "Wheat Straw,Corn Residue",
      capacity: 3500,
      currentAvailability: 1800,
      contact: "9876510004",
      status: "ACTIVE",
    },
    {
      name: "RenewAgri Fuels",
      location: "Bathinda, Punjab",
      acceptedMaterials: "Paddy Straw,Cotton Stalk",
      capacity: 4500,
      currentAvailability: 2500,
      contact: "9876510005",
      status: "ACTIVE",
    },
    {
      name: "CropCycle BioWorks",
      location: "Indore, Madhya Pradesh",
      acceptedMaterials: "Wheat Straw,Soybean Residue",
      capacity: 3000,
      currentAvailability: 1200,
      contact: "9876510006",
      status: "INACTIVE",
    },
  ];

  const processors = [];

  for (const data of processorData) {
    const processor = await prisma.processor.create({
      data,
    });

    processors.push(processor);
  }

  // --------------------------------------------------
  // 3. TRANSPORTERS
  // --------------------------------------------------

  const transporterData: [
  string,
  string,
  string,
  string,
  string,
  number,
  string
][] = [
    ["Raj Transport Services", "rajtrans@example.com", "9876520001", "Tractor Trolley", "HR-05-TR-101", 3000, "Karnal, Haryana"],
    ["FastAgri Logistics", "fastagri@example.com", "9876520002", "Truck", "HR-06-TR-202", 5000, "Panipat, Haryana"],
    ["Punjab Farm Movers", "pfm@example.com", "9876520003", "Tractor Trolley", "PB-11-TR-303", 2500, "Patiala, Punjab"],
    ["Rural Cargo Link", "ruralcargo@example.com", "9876520004", "Mini Truck", "UP-15-TR-404", 1800, "Meerut, Uttar Pradesh"],
    ["AgriMove Logistics", "agrimove@example.com", "9876520005", "Truck", "PB-03-TR-505", 4500, "Bathinda, Punjab"],
    ["Green Route Transport", "greenroute@example.com", "9876520006", "Mini Truck", "MP-09-TR-606", 2000, "Indore, Madhya Pradesh"],
  ];

  const transporters = [];

  for (const [
    name,
    email,
    phone,
    vehicleType,
    vehicleNumber,
    capacity,
    location,
  ] of transporterData) {
    const transporter = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        role: "TRANSPORTER",
        transporterProfile: {
          create: {
            vehicleType,
            vehicleNumber,
            capacity,
            location,
            status: "AVAILABLE",
          },
        },
      },
      include: {
        transporterProfile: true,
      },
    });

    transporters.push(transporter);
  }

  // --------------------------------------------------
  // 4. RESIDUE LISTINGS
  // --------------------------------------------------

  const residueTypes = [
    "Paddy Straw",
    "Wheat Straw",
    "Corn Residue",
  ];

  const listings = [];

  for (let i = 0; i < 18; i++) {
    const farmer = farmers[i % farmers.length];

    const listing = await prisma.residueListing.create({
      data: {
        cropType:
          residueTypes[i % residueTypes.length] === "Paddy Straw"
            ? "Rice"
            : residueTypes[i % residueTypes.length] === "Wheat Straw"
              ? "Wheat"
              : "Corn",

        residueType: residueTypes[i % residueTypes.length],

        quantity: 500 + (i * 125),

        location:
          farmer.name === "Arjun Mehta"
            ? "Karnal, Haryana"
            : farmer.name === "Ravi Kumar"
              ? "Panipat, Haryana"
              : `${farmer.name.split(" ")[0]} Farm, India`,

        availableFrom: new Date(`2026-09-${String(10 + (i % 10)).padStart(2, "0")}`),

        preferredPickupDate: new Date(
          `2026-09-${String(15 + (i % 10)).padStart(2, "0")}`
        ),

        status:
          i < 6
            ? "COMPLETED"
            : i < 12
              ? "SCHEDULED"
              : "AVAILABLE",

        farmerId: farmer.id,

        processorId:
          i % 3 === 0
            ? processors[0].id
            : i % 3 === 1
              ? processors[1].id
              : processors[2].id,
      },
    });

    listings.push(listing);
  }

  // --------------------------------------------------
  // 5. PICKUP JOBS
  // --------------------------------------------------

  const pickupJobs = [];

  for (let i = 0; i < 6; i++) {
    const listing = listings[i];
    const farmer = farmers[i % farmers.length];
    const processor = processors[i % 3];
    const transporter = transporters[i % transporters.length];

    const job = await prisma.pickupJob.create({
      data: {
        farmerId: farmer.id,
        listingId: listing.id,
        processorId: processor.id,
        transporterId: transporter.transporterProfile!.id,

        scheduledDate: new Date(
          `2026-09-${String(18 + i).padStart(2, "0")}`
        ),

        status: i < 3 ? "COMPLETED" : "SCHEDULED",

        notes:
          i < 3
            ? "Residue successfully collected and delivered."
            : "Pickup scheduled with transporter.",
      },
    });

    pickupJobs.push(job);
  }

  // --------------------------------------------------
  // 6. VERIFICATIONS
  // --------------------------------------------------

  for (let i = 0; i < 3; i++) {
    await prisma.verification.create({
      data: {
        pickupJobId: pickupJobs[i].id,
        userId: farmers[i].id,
        verifiedAt: new Date(`2026-09-${String(20 + i).padStart(2, "0")}`),
        method: "QR",
        status: "VERIFIED",
        notes: "Pickup verified successfully.",
      },
    });
  }

  // --------------------------------------------------
  // 7. IMPACT RECORDS
  // --------------------------------------------------

  for (let i = 0; i < 3; i++) {
    const quantity = listings[i].quantity;

    await prisma.impactRecord.create({
      data: {
        pickupJobId: pickupJobs[i].id,
        userId: farmers[i].id,
        residueQuantity: quantity,
        estimatedCO2Saved: quantity * 1.5,
      },
    });
  }

  // --------------------------------------------------
  // SUMMARY
  // --------------------------------------------------

  console.log("✅ Seed completed successfully!");
  console.log(`👨‍🌾 Farmers: ${farmers.length}`);
  console.log(`🏭 Processors: ${processors.length}`);
  console.log(`🚛 Transporters: ${transporters.length}`);
  console.log(`🌾 Residue listings: ${listings.length}`);
  console.log(`📦 Pickup jobs: ${pickupJobs.length}`);
  console.log("✅ Verifications: 3");
  console.log("🌱 Impact records: 3");
  console.log("🔗 Matches: 0 (matching comes in a later phase)");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });