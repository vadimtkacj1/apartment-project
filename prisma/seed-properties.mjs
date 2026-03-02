import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Use DATABASE_URL from environment, fallback to default
const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db';
console.log('📦 Database URL:', databaseUrl);

const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
const prisma = new PrismaClient({ adapter });

const cities = ['holon', 'batyam', 'rishon', 'telaviv'];
const propertyTypes = ['apartment', 'garden-apartment', 'penthouse', 'cottage', 'duplex'];
const parkingOptions = ['none', 'single', 'double'];
const furnitureOptions = ['none', 'partial', 'full'];
const positionOptions = ['front', 'back', 'front-back', 'side', 'corner'];

const neighborhoods = {
  holon: ['רמת אפעל', 'רסקו', 'קריית שרת', 'קריית בן גוריון', 'מרכז העיר'],
  batyam: ['רמת יוסף', 'יוספטל', 'רמת הנשיא', 'נוה גולדה', 'מרכז העיר'],
  rishon: ['שיכון מזרח', 'שיכון מערב', 'נוה דקלים', 'רמת אליהו', 'מרכז העיר'],
  telaviv: ['רמת אביב', 'פלורנטין', 'נווה צדק', 'יפו העתיקה', 'רוטשילד']
};

const streets = {
  holon: ['אהרונוביץ\'', 'ירושלים', 'סוקולוב', 'ויצמן', 'גולומב'],
  batyam: ['בן גוריון', 'ויצמן', 'הרצל', 'ירושלים', 'רוטשילד'],
  rishon: ['הרצל', 'ז\'בוטינסקי', 'רוטשילד', 'ויצמן', 'דוד המלך'],
  telaviv: ['דיזנגוף', 'רוטשילד', 'בן יהודה', 'אלנבי', 'שנקר']
};

const sampleImages = [
  '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800"]',
  '["https://images.unsplash.com/photo-1502672260066-6bc35f0fad14?w=800", "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800", "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=800"]',
  '["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800", "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"]',
  '["https://images.unsplash.com/photo-1560185127-6a7f5c6e8de8?w=800", "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800", "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800"]'
];

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePrice(dealType, rooms) {
  if (dealType === 'sale') {
    const basePrice = 1500000 + (rooms * 300000) + randomInt(-200000, 500000);
    return `₪${basePrice.toLocaleString('en-US')}`;
  } else {
    const basePrice = 4000 + (rooms * 1500) + randomInt(-500, 2000);
    return `₪${basePrice.toLocaleString('en-US')}`;
  }
}

async function main() {
  console.log('🌱 Starting properties seed...');

  // Clear existing properties
  await prisma.property.deleteMany({});
  console.log('✨ Cleared existing properties');

  const properties = [];

  // Generate 20 properties
  for (let i = 0; i < 20; i++) {
    const dealType = i % 3 === 0 ? 'rent' : 'sale'; // 1/3 rent, 2/3 sale
    const city = randomElement(cities);
    const neighborhood = randomElement(neighborhoods[city]);
    const street = randomElement(streets[city]);
    const roomsOptions = [2, 2.5, 3, 3.5, 4, 4.5, 5];
    const rooms = randomElement(roomsOptions);
    const propertyType = randomElement(propertyTypes);
    const floor = randomInt(0, 10);
    const totalFloors = floor + randomInt(1, 5);
    const area = 60 + (rooms * 20) + randomInt(-10, 30);
    const builtArea = Math.floor(area * 0.85);

    const directionsArray = [];
    const allDirections = ['north', 'south', 'east', 'west'];
    const numDirections = randomInt(1, 4);
    for (let j = 0; j < numDirections; j++) {
      const dir = randomElement(allDirections);
      if (!directionsArray.includes(dir)) {
        directionsArray.push(dir);
      }
    }

    const cityNames = {
      telaviv: 'תל אביב',
      holon: 'חולון',
      batyam: 'בת ים',
      rishon: 'ראשון לציון'
    };

    const propertyTypeNames = {
      apartment: 'דירה',
      penthouse: 'פנטהאוז',
      'garden-apartment': 'דירת גן',
      cottage: 'קוטג\'',
      duplex: 'דופלקס'
    };

    const property = {
      // Deal Type
      dealType,

      // Location
      city,
      neighborhood,
      street,
      streetNumber: String(randomInt(1, 150)),
      apartmentNumber: String(randomInt(1, 20)),
      latitude: 32.0853 + Math.random() * 0.1, // Around Tel Aviv area
      longitude: 34.7818 + Math.random() * 0.1,

      // Property Details
      propertyType,
      floor,
      totalFloors,
      parking: randomElement(parkingOptions),
      position: randomElement(positionOptions),
      furniture: randomElement(furnitureOptions),
      directions: JSON.stringify(directionsArray),
      kitchen: Math.random() > 0.5 ? 'upgraded' : 'standard',

      // Measurements
      rooms: String(rooms),
      area,
      builtArea,
      balconySize: Math.random() > 0.3 ? randomInt(5, 20) : null,

      // Additional Info
      vacancyDate: Math.random() > 0.5 ? 'מיידי' : 'גמיש',

      // Features
      hasAirConditioning: Math.random() > 0.3,
      hasDisabledAccess: Math.random() > 0.7,
      hasSunBalcony: Math.random() > 0.5,
      hasStorage: Math.random() > 0.4,
      hasSunroom: Math.random() > 0.6,
      hasBoiler: Math.random() > 0.5,
      hasSafeRoom: Math.random() > 0.4,
      hasElevator: floor > 0 && Math.random() > 0.3,

      // Display Info
      title: `${propertyTypeNames[propertyType] || 'דירה'} ${rooms} חדרים ב${cityNames[city]}`,
      description: `${propertyTypeNames[propertyType] || 'דירה'} מרווחת בת ${rooms} חדרים בשכונת ${neighborhood}. הדירה ממוקמת בקומה ${floor} מתוך ${totalFloors} קומות, עם שטח כולל של ${area} מ"ר. ${Math.random() > 0.5 ? 'הדירה משופצת ומעוצבת בסטנדרט גבוה. ' : ''}${Math.random() > 0.5 ? 'מיקום מעולה קרוב לתחבורה ציבורית, בתי ספר וקניונים. ' : ''}${Math.random() > 0.5 ? 'חניה צמודה ומחסן. ' : ''}מתאימה למשפחות ולזוגות צעירים.`,
      price: generatePrice(dealType, rooms),
      originalPrice: Math.random() > 0.7 ? generatePrice(dealType, rooms + 0.5) : null,
      images: randomElement(sampleImages),
      status: Math.random() > 0.7 ? randomElement(['Exclusive', 'New', 'Opportunity']) : null,
      location: `${street}, ${neighborhood}, ${cityNames[city]}`,

      // For compatibility
      bedrooms: String(rooms),
      bathrooms: Math.floor(rooms / 2) + 1,

      // Category
      category: dealType === 'sale' ? 'sales' : 'rentals',

      // Status flags
      isActive: true,
      isSold: Math.random() > 0.85, // 15% sold
      isPinned: i < 3, // First 3 are pinned
      isHotProposition: i < 4, // First 4 are hot
      isNoCommission: Math.random() > 0.7 && dealType === 'sale',
    };

    properties.push(property);
  }

  // Insert all properties
  for (const property of properties) {
    await prisma.property.create({ data: property });
  }

  console.log(`✅ Created ${properties.length} properties`);
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
