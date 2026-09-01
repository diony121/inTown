import { readFile } from "node:fs/promises";
import bcrypt from "bcrypt";
import client from "./client.js";

const seed = async () => {
  const schema = await readFile(
    new URL("./schema.sql", import.meta.url),
    "utf8",
  );

  await client.query(schema);

  // Users
  const hashedPassword = await bcrypt.hash("password123", 10);

  const usersResult = await client.query(
    `INSERT INTO users (name, last_name, email, password)
    VALUES 
    ($1, $2, $3, $4),
    ($5, $6, $7, $8)
    RETURNING id, email;
    `,
    [
      "Han",
      "Thu",
      "han@example.com",
      hashedPassword,
      "Alex",
      "Chen",
      "alex@example.com",
      hashedPassword,
    ],
  );

  const hanId = usersResult.rows.find(
    (user) => user.email === "han@example.com",
  ).id;

  const alexId = usersResult.rows.find(
    (user) => user.email === "alex@example.com",
  ).id;

  console.log("Users seeded successfully.");

  const locationsResult = await client.query(
    `INSERT INTO locations (name, address, city, state, zip)
    VALUES
    ($1, $2, $3, $4, $5),
    ($6, $7, $8, $9, $10),
    ($11, $12, $13, $14, $15)
    RETURNING id, name;
    `,
    [
      "Annandale Community Center",
      "7861-B Heritage Drive",
      "Annandale",
      "VA",
      22003,
      "Fairfax Regional Library",
      "10360 North Street",
      "Fairfax",
      "VA",
      22030,
      "Mosaic District",
      "2905 District Avenue",
      "Fairfax",
      "VA",
      22031,
    ],
  );

  const annandaleLocationId = locationsResult.rows.find(
    (location) => location.name === "Annandale Community Center",
  ).id;

  const fairfaxLocationId = locationsResult.rows.find(
    (location) => location.name === "Fairfax Regional Library",
  ).id;

  const mosaicLocationId = locationsResult.rows.find(
    (location) => location.name === "Mosaic District",
  ).id;

  console.log("Locations seeded successfully.");

  // Categories
  const categoriesResult = await client.query(
    `INSERT INTO categories (name)
    VALUES
      ('Business'),
      ('Cultural or Traditional'),
      ('Community'),
      ('Celebration'),
      ('Sales'), 
      ('Educational'), 
      ('Entertainment'), 
      ('Food & Drinks'), 
      ('Local Sports')
    RETURNING id, name;
    `,
  );

  const categoryIds = Object.fromEntries(
    categoriesResult.rows.map((category) => [category.name, category.id]),
  );

  const businessCategoryId = categoryIds["Business"];
  const culturalCategoryId = categoryIds["Cultural or Traditional"];
  const communityCategoryId = categoryIds["Community"];
  const celebrationCategoryId = categoryIds["Celebration"];
  const salesCategoryId = categoryIds["Sales"];
  const educationalCategoryId = categoryIds["Educational"];
  const entertainmentCategoryId = categoryIds["Entertainment"];
  const foodCategoryId = categoryIds["Food & Drinks"];
  const localSportsCategoryId = categoryIds["Local Sports"];

  console.log("Categories seeded successfully.");

  // Helper to generate near-future dates in YYYY-MM-DD format
  const addDays = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const events = [
    {
      title: "Sunset Yoga & Wellness Fair",
      description:
        "Join us for an evening of relaxation and rejuvenation at our Sunset Yoga & Wellness Fair. Certified yoga instructors will guide you through a gentle flow suitable for all levels, followed by guided meditation and mindfulness workshops. Explore booths featuring local wellness practitioners, organic products, and healthy snacks. Whether you're a seasoned yogi or just looking to unwind, this free community event offers the perfect way to end your day. Bring your own mat, water bottle, and a friend! Registration is encouraged but not required.",
      date: addDays(14), // Aug 28, 2026
      time: "18:00:00",
      locationId: annandaleLocationId,
      imageUrl:
        "https://images.stockcake.com/public/2/4/c/24ccfb5d-1e48-4cb4-9fa5-59895e029308_large/sunset-yoga-session-stockcake.jpg",
      organizerId: hanId,
      isFree: true,
      categories: [communityCategoryId],
    },
    {
      title: "Small Business Resource Exchange",
      description:
        "Are you a small business owner or aspiring entrepreneur? Don't miss this free networking and resource event designed to help your business thrive. Meet one-on-one with lenders, legal advisors, marketing experts, and representatives from local business development organizations. Attend mini-workshops on topics like business planning, social media marketing, and accessing capital. Connect with fellow entrepreneurs, share ideas, and leave with actionable strategies to grow your business. Light refreshments will be provided. This event is open to all, but registration is recommended.",
      date: addDays(21), // Sep 4, 2026
      time: "09:00:00",
      locationId: fairfaxLocationId,
      imageUrl:
        "https://michigansbdc.org/wp-content/uploads/2025/06/250507_SmallBusinessResourceFinancingFair_KSM-3463-scaled-2000x1349.jpg",
      organizerId: alexId,
      isFree: true,
      categories: [businessCategoryId, educationalCategoryId],
    },
    {
      title: "Lunar New Year Night Market",
      description:
        "Celebrate the Lunar New Year at our vibrant night market, filled with cultural performances, traditional crafts, and delicious food from across Asia. Enjoy lion dances, martial arts demonstrations, and live music throughout the evening. Browse vendor booths offering handmade decorations, clothing, and unique gifts. Sample a variety of authentic dishes from local restaurants and food trucks. Bring the whole family for an evening of festive fun, games, and community spirit. Admission is free; food and items are available for purchase.",
      date: addDays(28), // Sep 11, 2026
      time: "17:00:00",
      locationId: mosaicLocationId,
      imageUrl:
        "https://img.freepik.com/premium-photo/festive-lunar-new-year-night-market-with-traditional-foods_1277187-10378.jpg",
      organizerId: alexId,
      isFree: true,
      categories: [culturalCategoryId, foodCategoryId, celebrationCategoryId],
    },
    {
      title: "Community Coding Bootcamp for Teens",
      description:
        "Calling all teens aged 13–18! Join us for a hands-on coding bootcamp where you'll learn the fundamentals of JavaScript, one of the most popular programming languages. No prior experience is needed—our friendly instructors will guide you step-by-step as you build your very first interactive web app. You'll also meet local tech professionals and hear about career paths in technology. All equipment is provided, but you're welcome to bring your own laptop. Space is limited, so be sure to register early to secure your spot.",
      date: addDays(35), // Sep 18, 2026
      time: "10:00:00",
      locationId: fairfaxLocationId,
      imageUrl:
        "https://tse3.mm.bing.net/th/id/OIP.Au2sSuMZFUXAd0MJ9aoXagHaDe?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
      organizerId: hanId,
      isFree: true,
      categories: [educationalCategoryId, communityCategoryId],
    },
    {
      title: "Fairfax Farmers Market & Craft Fair",
      description:
        "Start your weekend right at the Fairfax Farmers Market & Craft Fair! Browse an array of fresh produce, baked goods, and artisanal products from local farmers and makers. Enjoy live music while you shop, and let the kids take part in fun activities like face painting and craft stations. Whether you're stocking up on groceries or looking for a unique gift, you'll find something special here. This free community event is open to everyone and takes place rain or shine. Don't forget to bring your reusable bags!",
      date: addDays(42), // Sep 25, 2026
      time: "08:00:00",
      locationId: mosaicLocationId,
      imageUrl: "https://awhspitch.com/wp-content/uploads/2025/09/IMG_0234.jpg",
      organizerId: alexId,
      isFree: true,
      categories: [salesCategoryId, foodCategoryId, communityCategoryId],
    },
    {
      title: "Diwali Celebration & Dance Performances",
      description:
        "Experience the magic of Diwali, the Festival of Lights, at our annual celebration featuring traditional dance, music, and a community candle-lighting ceremony. Marvel at performances by local dance troupes showcasing classical and contemporary Indian styles. Indulge in a variety of authentic Indian cuisine and sweets available for purchase. Participate in rangoli art activities and learn about the cultural significance of Diwali. This family-friendly event is perfect for all ages. General admission tickets are $5; VIP tickets include preferred seating and a gift bag.",
      date: addDays(49), // Oct 2, 2026
      time: "16:00:00",
      locationId: annandaleLocationId,
      imageUrl:
        "https://2.bp.blogspot.com/-3JJKTCRC6u4/WBcGZigMxvI/AAAAAAAAUUs/MUc1GewRFGYckBksXtXNR94BVWjcT4mnQCLcB/s1600/Deepawali.jpg",
      organizerId: hanId,
      isFree: false,
      categories: [
        culturalCategoryId,
        celebrationCategoryId,
        entertainmentCategoryId,
      ],
    },
    {
      title: "Local 5K Fun Run & Community Walk",
      description:
        "Lace up your running shoes and join us for the annual Local 5K Fun Run & Community Walk! This family-friendly event welcomes participants of all ages and fitness levels. The scenic route winds through Fairfax's beautiful parks and neighborhoods. All proceeds from registration fees support local parks and recreation programs. After the race, enjoy refreshments, music, and a small awards ceremony. Strollers and leashed dogs are welcome. Adult registration is $25, child registration (12 and under) is $10. Register online in advance to guarantee your spot and t-shirt.",
      date: addDays(56), // Oct 9, 2026
      time: "08:00:00",
      locationId: fairfaxLocationId,
      imageUrl:
        "https://images.squarespace-cdn.com/content/v1/5d9499d3b5e3a755aa30a8be/d2bf92ea-fd5f-4701-b5b1-1a19edb86b82/unnamed-6.jpg?format=1500w",
      organizerId: alexId,
      isFree: false,
      categories: [localSportsCategoryId, communityCategoryId],
    },
    {
      title: "Open Mic Coffeehouse Night",
      description:
        "Take the stage or sit back and enjoy an evening of local talent at our monthly Open Mic Coffeehouse Night. Musicians, poets, comedians, and storytellers are all welcome to share their craft in a cozy, supportive atmosphere. Sign up at the door for a 10-minute slot, or just come to watch and cheer. Enjoy freshly brewed coffee, tea, and homemade snacks while you soak in the creative vibes. General admission is $5 at the door and includes one drink. Doors open at 6:30 PM; performances begin at 7:00 PM.",
      date: addDays(63), // Oct 16, 2026
      time: "19:00:00",
      locationId: mosaicLocationId,
      imageUrl:
        "https://th.bing.com/th/id/OIP.Al7eloUEABc4PPMFu8sIgwHaEK?w=258&h=180&c=7&r=0&o=7&dpr=1.6&pid=1.7&rm=3",
      organizerId: hanId,
      isFree: false,
      categories: [entertainmentCategoryId, foodCategoryId],
    },
  ];

  // Insert events and store their returned IDs
  for (const event of events) {
    const result = await client.query(
      `INSERT INTO events (
        title,
        description,
        event_date,
        event_time,
        location_id,
        image_url,
        organizer_id,
        is_free
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, title;
      `,
      [
        event.title,
        event.description,
        event.date,
        event.time,
        event.locationId,
        event.imageUrl,
        event.organizerId,
        event.isFree,
      ],
    );

    event.id = result.rows[0].id;
  }

  console.log("Events seeded successfully.");

  // Assign categories to events
  for (const event of events) {
    for (const categoryId of event.categories) {
      await client.query(
        `INSERT INTO event_categories (event_id, category_id)
         VALUES ($1, $2);
        `,
        [event.id, categoryId],
      );
    }
  }

  console.log("Event categories seeded successfully.");

  // Ticket types for paid events
  const ticketGroups = [
    {
      eventTitle: "Diwali Celebration & Dance Performances",
      types: [
        { name: "General Admission", price: 5, quantity: 50 },
        { name: "VIP", price: 15, quantity: 20 },
      ],
    },
    {
      eventTitle: "Local 5K Fun Run & Community Walk",
      types: [
        { name: "Adult Registration", price: 25, quantity: 100 },
        { name: "Child Registration", price: 10, quantity: 50 },
      ],
    },
    {
      eventTitle: "Open Mic Coffeehouse Night",
      types: [{ name: "General Admission", price: 5, quantity: 40 }],
    },
  ];

  const ticketTypeIds = {};

  for (const group of ticketGroups) {
    const event = events.find((event) => event.title === group.eventTitle);

    if (!event) continue;

    for (const ticketType of group.types) {
      const result = await client.query(
        `INSERT INTO ticket_types (event_id, name, price, quantity)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name;
        `,
        [event.id, ticketType.name, ticketType.price, ticketType.quantity],
      );

      ticketTypeIds[`${event.title}:${result.rows[0].name}`] =
        result.rows[0].id;
    }
  }

  console.log("Ticket types seeded successfully.");

  // Orders
  const alexTicketTypeId =
    ticketTypeIds["Local 5K Fun Run & Community Walk:Adult Registration"];

  if (alexTicketTypeId) {
    await client.query(
      `INSERT INTO orders (
        event_id,
        user_id,
        ticket_types_id,
        quantity,
        total_price,
        order_status
      )
      VALUES ($1, $2, $3, $4, $5, $6);
      `,
      [7, alexId, alexTicketTypeId, 1, 25, "confirmed"],
    );
  }

  console.log("Orders seeded successfully.");

  console.log("🌱 Database seeded successfully.");
};

export default seed;
