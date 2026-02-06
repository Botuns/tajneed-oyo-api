import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { Office } from "../models/office.model";

// Official MKA Oyo State Offices
const officialOffices = [
  {
    name: "State Qaid",
    email: "oyoilaqaqaid@gmail.com",
    description: "Office of the State Qaid - Chief Executive of MKA Oyo State",
    responsibilities: [
      "Overall leadership of MKA Oyo State",
      "Coordination of all departmental activities",
      "Representation at national level",
    ],
  },
  {
    name: "NSQ (Admin)",
    email: "nsqaoyoilaqa@gmail.com",
    description: "Naib State Qaid for Administration",
    responsibilities: [
      "Administrative oversight",
      "Coordination of secretariat activities",
      "Support to State Qaid",
    ],
  },
  {
    name: "NSQ SD1",
    email: "naibstateqaidsd1@gmail.com",
    description: "Naib State Qaid for Special Duties 1",
    responsibilities: [
      "Special duties as assigned",
      "Support to State Qaid",
      "Coordination of special projects",
    ],
  },
  {
    name: "NSQ SD2",
    email: "naibstateqaidsd2@gmail.com",
    description: "Naib State Qaid for Special Duties 2",
    responsibilities: [
      "Special duties as assigned",
      "Support to State Qaid",
      "Coordination of special projects",
    ],
  },
  {
    name: "Secretariat",
    email: "mkaoyoilaqa@gmail.com",
    description: "MKA Oyo State Secretariat",
    responsibilities: [
      "Record keeping and documentation",
      "Communication management",
      "Administrative support",
    ],
  },
  {
    name: "Publicity (Ishaat)",
    email: "ishaatoyoilaqa@gmail.com",
    description: "Publicity and Information Department",
    responsibilities: [
      "Media and publicity",
      "Information dissemination",
      "Social media management",
    ],
  },
  {
    name: "Children (Atfal)",
    email: "atfaloyoilaqa@gmail.com",
    description: "Atfal-ul-Ahmadiyya Department - Children Affairs",
    responsibilities: [
      "Children's training and education",
      "Atfal programs and activities",
      "Youth development",
    ],
  },
  {
    name: "Students' Affairs (Omo Ore Talaba)",
    email: "omooretalabaoyoilaqa@gmail.com",
    description: "Students' Affairs Department",
    responsibilities: [
      "Student welfare and support",
      "Academic programs",
      "Campus activities coordination",
    ],
  },
  {
    name: "Welfare (Khidmat-e-Khalq)",
    email: "khidmatekhalqoyoilaqa@gmail.com",
    description: "Welfare and Humanitarian Services Department",
    responsibilities: [
      "Community welfare programs",
      "Humanitarian aid",
      "Social support services",
    ],
  },
  {
    name: "Finance (Maal)",
    email: "maaloyoilaqa@gmail.com",
    description: "Finance Department",
    responsibilities: [
      "Financial management",
      "Budget planning",
      "Chanda collection and records",
    ],
  },
  {
    name: "New Converts (Nao Mubain)",
    email: "naomubainoyoilaqa@gmail.com",
    description: "New Converts Department",
    responsibilities: [
      "New convert support and integration",
      "Tarbiyyat of new members",
      "Follow-up programs",
    ],
  },
  {
    name: "Audio/Video (Samia Wa Basira)",
    email: "samiawabasiraoyoilaqa@gmail.com",
    description: "Audio/Video and Media Production Department",
    responsibilities: [
      "Audio/video production",
      "Event recording",
      "Media archiving",
    ],
  },
  {
    name: "Trade/Industry (Sanat-o-Tijarat)",
    email: "sanatotijaratoyoilaqa@gmail.com",
    description: "Trade and Industry Department",
    responsibilities: [
      "Business development",
      "Entrepreneurship programs",
      "Trade facilitation",
    ],
  },
  {
    name: "Outreach/Preaching (Tabligh)",
    email: "tablighoyoilaqa@gmail.com",
    description: "Tabligh (Preaching) Department",
    responsibilities: [
      "Dawah activities",
      "Outreach programs",
      "Religious education",
    ],
  },
  {
    name: "Census (Tajnid)",
    email: "tajnidoyoilaqa@gmail.com",
    description: "Census and Membership Records Department",
    responsibilities: [
      "Member registration",
      "Census data management",
      "Membership records",
    ],
  },
  {
    name: "Education (Talim)",
    email: "talimoyoilaqa@gmail.com",
    description: "Education Department",
    responsibilities: [
      "Educational programs",
      "Academic support",
      "Religious education coordination",
    ],
  },
  {
    name: "Morals (Tarbiyyat)",
    email: "tarbiyyaoyoilaqa@gmail.com",
    description: "Tarbiyyat (Moral Training) Department",
    responsibilities: [
      "Moral and spiritual training",
      "Character development programs",
      "Religious observance",
    ],
  },
  {
    name: "New Scheme (Tahrik-e-Jadid)",
    email: "tahrikejadidoyoilaqa@gmail.com",
    description: "Tahrik-e-Jadid Scheme Department",
    responsibilities: [
      "Tahrik-e-Jadid collections",
      "Scheme promotion",
      "Financial targets management",
    ],
  },
  {
    name: "Special Duties (Umoomi)",
    email: "umoomioyoilaqa@gmail.com",
    description: "General/Special Duties Department",
    responsibilities: [
      "General affairs",
      "Special assignments",
      "Cross-departmental coordination",
    ],
  },
  {
    name: "Dignity of Labour (Waqar-e-Amal)",
    email: "waqareammaloyoilaqa@gmail.com",
    description: "Waqar-e-Amal (Dignity of Labour) Department",
    responsibilities: [
      "Community service projects",
      "Voluntary work programs",
      "Environmental activities",
    ],
  },
  {
    name: "Sports/Health (Sihat-e-Jismani)",
    email: "sihatejismanioyoilaqa@gmail.com",
    description: "Sports and Physical Health Department",
    responsibilities: [
      "Sports activities",
      "Health awareness programs",
      "Physical fitness programs",
    ],
  },
  {
    name: "Audit (Muhasib)",
    email: "muhasiboyoilaqa@gmail.com",
    description: "Audit Department",
    responsibilities: [
      "Financial auditing",
      "Compliance verification",
      "Internal controls",
    ],
  },
];

async function seedOffices() {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI environment variable is not set");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB successfully");

    // Delete all existing offices (hard delete)
    console.log("Deleting all existing offices...");
    const deleteResult = await Office.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} existing offices`);

    // Insert new official offices
    console.log("Inserting official offices...");
    const insertResult = await Office.insertMany(officialOffices);
    console.log(`Successfully inserted ${insertResult.length} official offices`);

    // Display inserted offices
    console.log("\nInserted offices:");
    insertResult.forEach((office, index) => {
      console.log(`${index + 1}. ${office.name} - ${office.email}`);
    });

    console.log("\nSeed completed successfully!");
  } catch (error) {
    console.error("Error seeding offices:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the seed function
seedOffices();
