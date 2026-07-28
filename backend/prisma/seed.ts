// ============================================================================
// Database Seed - Realistic Nigerian Rental Data
// ============================================================================

import { PrismaClient, UserRole, PropertyType, PropertyStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // ── Nigerian States & LGAs ────────────────────────────────────────────
  const statesData = [
    { name: 'Lagos', slug: 'lagos', lgas: ['Ikeja', 'Eti-Osa', 'Surulere', 'Alimosho', 'Kosofe', 'Ikorodu', 'Amuwo-Odofin', 'Ojo', 'Lagos Island', 'Lagos Mainland', 'Apapa', 'Agege', 'Ifako-Ijaiye', 'Mushin', 'Oshodi-Isolo', 'Somolu', 'Epe', 'Badagry', 'Ibeju-Lekki'] },
    { name: 'Abuja FCT', slug: 'abuja', lgas: ['AMAC', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali', 'Abaji'] },
    { name: 'Rivers', slug: 'rivers', lgas: ['Port Harcourt', 'Obio-Akpor', 'Eleme', 'Ikwerre', 'Etche'] },
    { name: 'Oyo', slug: 'oyo', lgas: ['Ibadan North', 'Ibadan South-West', 'Ibadan South-East', 'Ibadan North-East', 'Ibadan North-West', 'Akinyele', 'Lagelu', 'Egbeda', 'Ona-Ara', 'Oluyole'] },
    { name: 'Enugu', slug: 'enugu', lgas: ['Enugu East', 'Enugu North', 'Enugu South', 'Nsukka', 'Udi'] },
    { name: 'Anambra', slug: 'anambra', lgas: ['Awka South', 'Onitsha North', 'Onitsha South', 'Nnewi North', 'Idemili North'] },
    { name: 'Kaduna', slug: 'kaduna', lgas: ['Kaduna North', 'Kaduna South', 'Chikun', 'Igabi', 'Zaria'] },
    { name: 'Kano', slug: 'kano', lgas: ['Kano Municipal', 'Fagge', 'Nassarawa', 'Tarauni', 'Ungogo'] },
    { name: 'Delta', slug: 'delta', lgas: ['Warri South', 'Uvwie', 'Oshimili South', 'Sapele', 'Ethiope East'] },
    { name: 'Edo', slug: 'edo', lgas: ['Oredo', 'Egor', 'Ikpoba-Okha', 'Ovia North-East', 'Uhunmwonde'] },
  ];

  for (const stateData of statesData) {
    const state = await prisma.nigerianState.upsert({
      where: { slug: stateData.slug },
      update: {},
      create: { name: stateData.name, slug: stateData.slug },
    });

    for (const lgaName of stateData.lgas) {
      await prisma.nigerianLGA.upsert({
        where: { name_stateId: { name: lgaName, stateId: state.id } },
        update: {},
        create: { name: lgaName, slug: lgaName.toLowerCase().replace(/\s+/g, '-'), stateId: state.id },
      });
    }
  }
  console.log('✅ Nigerian states & LGAs seeded');

  // ── Users ─────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('Password123!', 12);

  // Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@rentnaija.com' },
    update: {},
    create: {
      email: 'admin@rentnaija.com',
      phone: '+2348000000000',
      passwordHash,
      role: UserRole.ADMIN,
      fullName: 'Admin User',
      isEmailVerified: true,
      isPhoneVerified: true,
    },
  });
  console.log('✅ Admin user created');

  // Landlords
  const landlords = [];
  const landlordData = [
    { email: 'adebayo.properties@gmail.com', fullName: 'Chief Adebayo Ogundimu', phone: '+2348012345678', agency: 'Adebayo Properties & Estates', about: 'Licensed real estate agent with over 15 years of experience in the Lagos property market. Specializing in luxury apartments and family homes in Lekki, Victoria Island, and Ikoyi.', years: 15 },
    { email: 'amaka.realty@gmail.com', fullName: 'Amaka Chukwuemeka', phone: '+2348023456789', agency: 'Amaka Realty Ltd', about: 'Professional property manager handling premium residential and commercial spaces in Abuja. Known for transparency and excellent tenant-landlord relationships.', years: 8 },
    { email: 'ibrahim.homes@gmail.com', fullName: 'Ibrahim Mohammed', phone: '+2348034567890', agency: null, about: 'Independent property owner with multiple units across Lagos and Port Harcourt. All properties are well-maintained with responsive management.', years: 5 },
    { email: 'chidinma.estates@gmail.com', fullName: 'Chidinma Okafor', phone: '+2348045678901', agency: 'C&C Estates', about: 'Award-winning estate developer focused on affordable housing solutions in Enugu and Anambra states.', years: 10 },
    { email: 'emeka.realtor@gmail.com', fullName: 'Emeka Nwosu', phone: '+2348056789012', agency: 'Nwosu Realtors', about: 'Trusted realtor in the South-East region. Specializing in self-contained apartments and mini flats for young professionals.', years: 6 },
  ];

  for (const ld of landlordData) {
    const user = await prisma.user.upsert({
      where: { email: ld.email },
      update: {},
      create: {
        email: ld.email,
        phone: ld.phone,
        passwordHash,
        role: UserRole.LANDLORD,
        fullName: ld.fullName,
        isEmailVerified: true,
        isPhoneVerified: true,
        landlordProfile: {
          create: {
            agencyName: ld.agency,
            about: ld.about,
            yearsOfExperience: ld.years,
            languages: ['English', 'Yoruba', 'Pidgin'],
            isVerified: true,
            verificationBadge: true,
            responseRate: 95 + Math.random() * 5,
            avgResponseTime: Math.floor(Math.random() * 30) + 5,
          },
        },
        subscriptions: { create: { plan: 'PREMIUM', status: 'ACTIVE', endDate: new Date('2027-12-31') } },
      },
      include: { landlordProfile: true },
    });
    landlords.push(user);
  }
  console.log('✅ Landlord users created');

  // House Hunters
  const hunters = [];
  const hunterData = [
    { email: 'tunde.seeker@gmail.com', fullName: 'Tunde Bakare', phone: '+2348067890123', occupation: 'Software Engineer', budgetMin: 500000, budgetMax: 2000000 },
    { email: 'ngozi.homes@gmail.com', fullName: 'Ngozi Eze', phone: '+2348078901234', occupation: 'Medical Doctor', budgetMin: 1000000, budgetMax: 5000000 },
    { email: 'bola.find@gmail.com', fullName: 'Bola Adeyemo', phone: '+2348089012345', occupation: 'Banker', budgetMin: 800000, budgetMax: 3000000 },
  ];

  for (const hd of hunterData) {
    const user = await prisma.user.upsert({
      where: { email: hd.email },
      update: {},
      create: {
        email: hd.email,
        phone: hd.phone,
        passwordHash,
        role: UserRole.HUNTER,
        fullName: hd.fullName,
        isEmailVerified: true,
        hunterProfile: {
          create: {
            occupation: hd.occupation,
            budgetMin: hd.budgetMin,
            budgetMax: hd.budgetMax,
            preferredStates: ['Lagos', 'Abuja FCT'],
            preferredCities: ['Lekki', 'Victoria Island', 'AMAC'],
          },
        },
      },
    });
    hunters.push(user);
  }
  console.log('✅ House hunter users created');

  // ── Properties ────────────────────────────────────────────────────────
  const properties = [
    {
      title: 'Exquisite 3-Bedroom Apartment in Lekki Phase 1',
      description: 'A stunning, fully furnished 3-bedroom apartment located in the heart of Lekki Phase 1. This premium unit features modern finishes, spacious rooms with en-suite bathrooms, a fully equipped kitchen with granite countertops, and a large living area with floor-to-ceiling windows offering panoramic views. The estate provides 24/7 security, swimming pool, gym, and ample parking. Walking distance to Shoprite, restaurants, and major banks.',
      propertyType: PropertyType.APARTMENT, bedrooms: 3, bathrooms: 3, toilets: 4, squareMeters: 150,
      rentAmount: 3500000, serviceCharge: 1000000, agencyFee: 350000, legalFee: 150000, cautionFee: 500000, agreementFee: 100000,
      address: '12 Admiralty Way, Lekki Phase 1', state: 'Lagos', lga: 'Eti-Osa', area: 'Lekki Phase 1', street: 'Admiralty Way',
      latitude: 6.4281, longitude: 3.4536,
      nearbyLandmarks: ['Shoprite Lekki', 'Lekki Toll Gate', 'Chevron Roundabout'],
      isFurnished: true, isNewlyBuilt: false, isRenovated: true,
      hasParking: true, hasWaterSupply: true, hasElectricity: true, hasGenerator: true, hasSecurity: true, hasInternet: true,
      hasSwimmingPool: true, hasGym: true, hasBalcony: true, hasPopCeiling: true, hasWardrobes: true,
      hasKitchenCabinets: true, hasAirConditioning: true, hasWaterHeater: true, hasCctv: true, isGatedEstate: true,
      isFeatured: true, landlordIdx: 0,
    },
    {
      title: 'Modern 4-Bedroom Duplex in Ajah',
      description: 'Brand new 4-bedroom semi-detached duplex in a serene estate in Ajah. Features include a boys quarter, spacious compound, modern fittings, and all rooms en-suite. The estate has excellent road network, drainage system, and 24-hour security with CCTV. Close to Abraham Adesanya roundabout and major shopping centers.',
      propertyType: PropertyType.DUPLEX, bedrooms: 4, bathrooms: 5, toilets: 6, squareMeters: 250,
      rentAmount: 5000000, serviceCharge: 1500000, agencyFee: 500000, legalFee: 200000, cautionFee: 1000000, agreementFee: 150000,
      address: 'Royal Gardens Estate, Ajah', state: 'Lagos', lga: 'Eti-Osa', area: 'Ajah', street: 'Abraham Adesanya Road',
      latitude: 6.4698, longitude: 3.5852,
      nearbyLandmarks: ['Abraham Adesanya Roundabout', 'Jubilee Bridge', 'Novare Mall'],
      isFurnished: false, isNewlyBuilt: true, isRenovated: false,
      hasParking: true, hasWaterSupply: true, hasElectricity: true, hasGenerator: true, hasSecurity: true,
      hasBalcony: true, hasPopCeiling: true, hasWardrobes: true, hasKitchenCabinets: true,
      hasWaterHeater: true, hasBorehole: true, hasCctv: true, isGatedEstate: true,
      isFeatured: true, landlordIdx: 0,
    },
    {
      title: 'Luxury Self-Contained Studio in Victoria Island',
      description: 'Premium self-contained studio apartment on Victoria Island, perfect for young professionals and expats. Fully furnished with designer furniture, smart TV, high-speed fiber internet, and a fully equipped kitchenette. Building amenities include concierge service, rooftop lounge, and underground parking.',
      propertyType: PropertyType.SELF_CONTAINED, bedrooms: 1, bathrooms: 1, toilets: 1, squareMeters: 45,
      rentAmount: 2000000, serviceCharge: 500000, agencyFee: 200000, legalFee: 100000, cautionFee: 300000, agreementFee: 50000,
      address: '24 Kofo Abayomi Street, Victoria Island', state: 'Lagos', lga: 'Eti-Osa', area: 'Victoria Island', street: 'Kofo Abayomi Street',
      latitude: 6.4264, longitude: 3.4152,
      nearbyLandmarks: ['Eko Atlantic', 'Bar Beach', 'Silverbird Galleria'],
      isFurnished: true, isNewlyBuilt: true,
      hasParking: true, hasWaterSupply: true, hasElectricity: true, hasGenerator: true, hasSecurity: true,
      hasInternet: true, hasAirConditioning: true, hasWaterHeater: true, hasCctv: true, isGatedEstate: true,
      isFeatured: true, landlordIdx: 0,
    },
    {
      title: 'Spacious 3-Bedroom Flat in Maitama, Abuja',
      description: 'Well-maintained 3-bedroom flat in the prestigious Maitama district of Abuja. The apartment offers generous living spaces, marble flooring, modern kitchen, and a balcony with city views. Located within a diplomatic zone with easy access to government offices, embassies, and shopping centers.',
      propertyType: PropertyType.APARTMENT, bedrooms: 3, bathrooms: 3, toilets: 4, squareMeters: 180,
      rentAmount: 6000000, serviceCharge: 2000000, agencyFee: 600000, legalFee: 200000, cautionFee: 1000000, agreementFee: 200000,
      address: '7 Libreville Crescent, Maitama', state: 'Abuja FCT', lga: 'AMAC', area: 'Maitama', street: 'Libreville Crescent',
      latitude: 9.0684, longitude: 7.5003,
      nearbyLandmarks: ['Hilton Abuja', 'Maitama Market', 'National Mosque'],
      isFurnished: false, isRenovated: true,
      hasParking: true, hasWaterSupply: true, hasElectricity: true, hasGenerator: true, hasSecurity: true,
      hasBalcony: true, hasPopCeiling: true, hasWardrobes: true, hasKitchenCabinets: true,
      hasAirConditioning: true, hasWaterHeater: true, isGatedEstate: true,
      isFeatured: true, landlordIdx: 1,
    },
    {
      title: 'Affordable 2-Bedroom Flat in Yaba',
      description: 'Clean and spacious 2-bedroom flat in the vibrant Yaba area, close to UNILAG and the tech hub. Ideal for students, young professionals, and small families. Tiled floors, modern bathroom fittings, and a well-ventilated layout. The neighborhood offers easy access to public transport, markets, and restaurants.',
      propertyType: PropertyType.APARTMENT, bedrooms: 2, bathrooms: 2, toilets: 2, squareMeters: 80,
      rentAmount: 800000, serviceCharge: 100000, agencyFee: 80000, legalFee: 50000, cautionFee: 100000, agreementFee: 50000,
      address: '15 Herbert Macaulay Way, Yaba', state: 'Lagos', lga: 'Lagos Mainland', area: 'Yaba', street: 'Herbert Macaulay Way',
      latitude: 6.5158, longitude: 3.3752,
      nearbyLandmarks: ['University of Lagos', 'Yaba Tech', 'Tejuosho Market'],
      isFurnished: false,
      hasParking: false, hasWaterSupply: true, hasElectricity: true, hasGenerator: false,
      hasPopCeiling: true, hasWardrobes: true,
      isFeatured: false, landlordIdx: 2,
    },
    {
      title: 'Mini Flat in Surulere - Budget Friendly',
      description: 'Neat mini flat in a quiet compound in Surulere. Features a bedroom, living room, kitchen, and bathroom. Suitable for single professionals or couples. Close to the National Stadium and Adeniran Ogunsanya shopping area.',
      propertyType: PropertyType.MINI_FLAT, bedrooms: 1, bathrooms: 1, toilets: 1, squareMeters: 40,
      rentAmount: 450000, serviceCharge: 50000, agencyFee: 45000, legalFee: 30000, cautionFee: 50000, agreementFee: 30000,
      address: '8 Bode Thomas Street, Surulere', state: 'Lagos', lga: 'Surulere', area: 'Surulere', street: 'Bode Thomas Street',
      latitude: 6.4969, longitude: 3.3570,
      nearbyLandmarks: ['National Stadium', 'Adeniran Ogunsanya Shopping Mall'],
      isFurnished: false,
      hasWaterSupply: true, hasElectricity: true, hasPopCeiling: true,
      isFeatured: false, landlordIdx: 2,
    },
    {
      title: '5-Bedroom Detached House in GRA, Port Harcourt',
      description: 'Massive 5-bedroom fully detached house in the Government Reservation Area of Port Harcourt. Features include a large compound, boys quarter, modern kitchen, all rooms en-suite, and a beautiful garden. Perfect for executive families and expatriates.',
      propertyType: PropertyType.DUPLEX, bedrooms: 5, bathrooms: 6, toilets: 7, squareMeters: 400,
      rentAmount: 8000000, serviceCharge: 2000000, agencyFee: 800000, legalFee: 300000, cautionFee: 2000000, agreementFee: 200000,
      address: '22 Forces Avenue, GRA Phase 2', state: 'Rivers', lga: 'Port Harcourt', area: 'GRA Phase 2', street: 'Forces Avenue',
      latitude: 4.8156, longitude: 7.0498,
      nearbyLandmarks: ['Port Harcourt Golf Club', 'Genesis Cinema'],
      isFurnished: true, isNewlyBuilt: false, isRenovated: true,
      hasParking: true, hasWaterSupply: true, hasElectricity: true, hasGenerator: true, hasSolar: true,
      hasSecurity: true, hasSwimmingPool: true, hasGym: true, hasBalcony: true, hasPopCeiling: true,
      hasWardrobes: true, hasKitchenCabinets: true, hasAirConditioning: true, hasWaterHeater: true,
      hasBorehole: true, hasCctv: true, isGatedEstate: true,
      isFeatured: true, landlordIdx: 2,
    },
    {
      title: 'Modern 2-Bedroom Apartment in Independence Layout, Enugu',
      description: 'Contemporary 2-bedroom apartment in the serene Independence Layout area of Enugu. Features quality finishes, cross ventilation, and a compact but functional kitchen. The neighborhood is quiet, safe, and close to Polo Park Mall.',
      propertyType: PropertyType.APARTMENT, bedrooms: 2, bathrooms: 2, toilets: 2, squareMeters: 90,
      rentAmount: 600000, serviceCharge: 100000, agencyFee: 60000, legalFee: 50000, cautionFee: 100000, agreementFee: 50000,
      address: '14 Chime Avenue, Independence Layout', state: 'Enugu', lga: 'Enugu East', area: 'Independence Layout', street: 'Chime Avenue',
      latitude: 6.4378, longitude: 7.5086,
      nearbyLandmarks: ['Polo Park Mall', 'Nike Lake Resort'],
      isFurnished: false, isNewlyBuilt: true,
      hasParking: true, hasWaterSupply: true, hasElectricity: true, hasSecurity: true,
      hasPopCeiling: true, hasWardrobes: true, hasKitchenCabinets: true, hasBorehole: true,
      isFeatured: false, landlordIdx: 3,
    },
    {
      title: 'Shared Apartment for Young Professionals - Ikeja GRA',
      description: 'Fully furnished shared apartment in the heart of Ikeja GRA. Your private bedroom with shared living room, kitchen, and bathroom. Ideal for young professionals working on the mainland. Fast WiFi, Netflix, and cleaning service included.',
      propertyType: PropertyType.SHARED_APARTMENT, bedrooms: 1, bathrooms: 1, toilets: 1, squareMeters: 25,
      rentAmount: 350000, serviceCharge: 50000, agencyFee: 35000,
      address: '4 Joel Ogunnaike Street, Ikeja GRA', state: 'Lagos', lga: 'Ikeja', area: 'Ikeja GRA', street: 'Joel Ogunnaike Street',
      latitude: 6.5833, longitude: 3.3475,
      nearbyLandmarks: ['Ikeja City Mall', 'MM2 Airport', 'Computer Village'],
      isFurnished: true,
      hasParking: false, hasWaterSupply: true, hasElectricity: true, hasGenerator: true,
      hasInternet: true, hasAirConditioning: true, hasSecurity: true,
      isFeatured: false, landlordIdx: 4,
    },
    {
      title: 'Newly Built 3-Bedroom Bungalow in Awka',
      description: 'Beautiful 3-bedroom bungalow with modern finishes in a quiet estate in Awka. Spacious compound, tiled floors throughout, POP ceiling, and well-designed kitchen. Perfect for families looking for comfort in a growing city.',
      propertyType: PropertyType.BUNGALOW, bedrooms: 3, bathrooms: 2, toilets: 3, squareMeters: 130,
      rentAmount: 500000, serviceCharge: 50000, agencyFee: 50000, legalFee: 30000, cautionFee: 100000,
      address: '6 Ezimezi Street, Ngozika Estate', state: 'Anambra', lga: 'Awka South', area: 'Ngozika Estate', street: 'Ezimezi Street',
      latitude: 6.2088, longitude: 7.0775,
      nearbyLandmarks: ['Nnamdi Azikiwe University', 'Eke Awka Market'],
      isFurnished: false, isNewlyBuilt: true, petsAllowed: true,
      hasParking: true, hasWaterSupply: true, hasElectricity: true,
      hasPopCeiling: true, hasWardrobes: true, hasKitchenCabinets: true, hasBorehole: true,
      isFeatured: false, landlordIdx: 3,
    },
  ];

  for (const p of properties) {
    const { landlordIdx, ...propertyData } = p;
    const landlord = landlords[landlordIdx];
    const totalMoveInCost = (p.rentAmount || 0) + (p.serviceCharge || 0) + (p.agencyFee || 0) + (p.legalFee || 0) + (p.cautionFee || 0) + (p.agreementFee || 0);

    await prisma.property.create({
      data: {
        ...(propertyData as any),
        landlordId: landlord.id,
        status: PropertyStatus.ACTIVE,
        totalMoveInCost,
        publishedAt: new Date(),
        viewCount: Math.floor(Math.random() * 500) + 50,
        savedCount: Math.floor(Math.random() * 50) + 5,
      },
    });
  }
  console.log('✅ Properties seeded');

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📋 Test Accounts:');
  console.log('  Admin:     admin@rentnaija.com / Password123!');
  console.log('  Landlord:  adebayo.properties@gmail.com / Password123!');
  console.log('  Hunter:    tunde.seeker@gmail.com / Password123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
