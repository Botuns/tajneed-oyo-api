"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), ".env.local") });
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), ".env") });
const officer_model_1 = require("../models/officer.model");
const office_model_1 = require("../models/office.model");
const enums_1 = require("../enums");
// Helper function to generate a placeholder email
function generateEmail(firstName, lastName) {
    const cleanFirst = firstName.toLowerCase().replace(/[^a-z]/g, "");
    const cleanLast = lastName.toLowerCase().replace(/[^a-z]/g, "");
    return `${cleanFirst}.${cleanLast}@mkaoyoilaqa.org`;
}
// Helper function to generate a unique code
function generateUniqueCode(index) {
    return `MKA-OYO-${String(index + 1).padStart(3, "0")}`;
}
// Map positions to office emails
const positionToOfficeEmail = {
    "State Qaid (President)": "oyoilaqaqaid@gmail.com",
    "Naib State Qaid (Administration)": "nsqaoyoilaqa@gmail.com",
    "Naib State Qaid (Special Duties)": "naibstateqaidsd1@gmail.com", // Will also link to SD2
    "Mut'amad": "mkaoyoilaqa@gmail.com",
    "Naib Mut'amad": "mkaoyoilaqa@gmail.com",
    "Muavin Qaid (Rishta Nata)": "mkaoyoilaqa@gmail.com",
    "Nazim Khidmat-E-Khalq": "khidmatekhalqoyoilaqa@gmail.com",
    "Naib Nazim Khidmat-E- Khalq": "khidmatekhalqoyoilaqa@gmail.com",
    "Naib Nazim Khidmat-E-Khalq": "khidmatekhalqoyoilaqa@gmail.com",
    "Nazim Ta'lim": "talimoyoilaqa@gmail.com",
    "Naib Nazim Ta'lim": "talimoyoilaqa@gmail.com",
    "Nazim Tarbiyya": "tarbiyyaoyoilaqa@gmail.com",
    "Naib Nazim Tarbiyya": "tarbiyyaoyoilaqa@gmail.com",
    "Nazim Tabligh": "tablighoyoilaqa@gmail.com",
    "Naib Nazim Tabligh": "tablighoyoilaqa@gmail.com",
    "Nazim Sihat E Jismani(Sport Secretary)": "sihatejismanioyoilaqa@gmail.com",
    "Nazim Sihat E Jismani (Sport Secretary)": "sihatejismanioyoilaqa@gmail.com",
    "Naib Nazim Sihat E Jismani( Sport Secretary)": "sihatejismanioyoilaqa@gmail.com",
    "Naib Nazim Sihat E Jismani (Sport Secretary)": "sihatejismanioyoilaqa@gmail.com",
    "Naib Nazim Sihat E Jismani ( Health)": "sihatejismanioyoilaqa@gmail.com",
    "Naib Nazim Sihat E Jismani (Health)": "sihatejismanioyoilaqa@gmail.com",
    "Nazim Waqar E Ammal": "waqareammaloyoilaqa@gmail.com",
    "Naib Nazim Waqar E Ammal": "waqareammaloyoilaqa@gmail.com",
    "Nazim Ishaat": "ishaatoyoilaqa@gmail.com",
    "Naib Nazim Ishaat (Publication)": "ishaatoyoilaqa@gmail.com",
    "Nazim Tajnid": "tajnidoyoilaqa@gmail.com",
    "Naib Nazim Tajnid": "tajnidoyoilaqa@gmail.com",
    "Nazim Maal(Finance)": "maaloyoilaqa@gmail.com",
    "Nazim Maal (Finance)": "maaloyoilaqa@gmail.com",
    "Naib Nazim Maal": "maaloyoilaqa@gmail.com",
    "Nazim Umur E Talaba": "omooretalabaoyoilaqa@gmail.com",
    "Naib Nazim Umur E Talaba": "omooretalabaoyoilaqa@gmail.com",
    "Nazim Nao Mubain": "naomubainoyoilaqa@gmail.com",
    "Naib Nazim Nao Mubain": "naomubainoyoilaqa@gmail.com",
    "Nazim Isha'at (Audio- Visual)": "samiawabasiraoyoilaqa@gmail.com",
    "Nazim Isha'at (Audio-Visual)": "samiawabasiraoyoilaqa@gmail.com",
    "Naib Nazim Isha'at ( Audio - Visual)": "samiawabasiraoyoilaqa@gmail.com",
    "Naib Nazim Isha'at (Audio-Visual)": "samiawabasiraoyoilaqa@gmail.com",
    "Muhasib": "muhasiboyoilaqa@gmail.com",
    "Nazim Tahrik E Jadid": "tahrikejadidoyoilaqa@gmail.com",
    "Naib Nazim Tahrik E Jadid": "tahrikejadidoyoilaqa@gmail.com",
    "Nazim Sanat O Tijarat": "sanatotijaratoyoilaqa@gmail.com",
    "Naib Nazim Sanat O Tijarat": "sanatotijaratoyoilaqa@gmail.com",
    "Nazim Atfal": "atfaloyoilaqa@gmail.com",
    "Naib Nazim Atfal": "atfaloyoilaqa@gmail.com",
    "Murabiy Atfal": "atfaloyoilaqa@gmail.com",
    "Nazim Umumi": "umoomioyoilaqa@gmail.com",
    "Naib Nazim Umumi": "umoomioyoilaqa@gmail.com",
};
// Determine position type from position title
function getPositionType(position) {
    const upperPos = position.toUpperCase();
    // Executive positions
    if (upperPos.includes("STATE QAID") ||
        upperPos.includes("MUT'AMAD") ||
        upperPos.includes("MUTAMAD") ||
        upperPos.includes("MUAVIN QAID")) {
        return enums_1.PositionType.EXECUTIVE;
    }
    // Special positions
    if (upperPos.includes("MUHASIB") || upperPos.includes("MURABIY")) {
        return enums_1.PositionType.SPECIAL;
    }
    // Assistant positions (Naib)
    if (upperPos.startsWith("NAIB")) {
        return enums_1.PositionType.ASSISTANT;
    }
    // Head positions (Nazim)
    if (upperPos.startsWith("NAZIM")) {
        return enums_1.PositionType.HEAD;
    }
    // Default to ASSISTANT if unclear
    return enums_1.PositionType.ASSISTANT;
}
// MKA Oyo State Aamila List for 2025/2026
const officialOfficers = [
    { name: "Bro. Badejo Taofeek", dila: "Ibadan", position: "State Qaid (President)" },
    { name: "Bro. Adeitan Ibrahim", dila: "Coca Cola", position: "Naib State Qaid (Administration)" },
    { name: "Bro. Abdullah Bashir", dila: "Monatan", position: "Naib State Qaid (Special Duties)" },
    { name: "Bro. Salaam Abdur Rahman", dila: "Oyo", position: "Naib State Qaid (Special Duties)" },
    { name: "Bro. Ajimoti Mubarak", dila: "Monatan", position: "Mut'amad" },
    { name: "Bro. Lawal Hammed", dila: "Oyo", position: "Naib Mut'amad" },
    { name: "Bro. Tajudeen Abdul Azeez", dila: "Ibadan", position: "Naib Mut'amad" },
    { name: "Bro. Abdul Raheem Abdul Lateef", dila: "Omi Adio", position: "Naib Mut'amad" },
    { name: "Bro. Olaitan Ibrahim", dila: "Ibadan", position: "Muavin Qaid (Rishta Nata)" },
    { name: "Bro. Yusuf Azeez", dila: "Oluyole Ona Ara", position: "Nazim Khidmat-E-Khalq" },
    { name: "Bro. Adeagbo Hammed", dila: "Coca Cola", position: "Naib Nazim Khidmat-E-Khalq" },
    { name: "Bro. Adeyemi Abdul Azeez", dila: "Akinyele", position: "Naib Nazim Khidmat-E-Khalq" },
    { name: "Bro. Adedeji Habeebullah", dila: "Ibadan", position: "Nazim Ta'lim" },
    { name: "Bro. Ademosu Muhammed", dila: "Monatan", position: "Naib Nazim Ta'lim" },
    { name: "Bro. Bayonle Naeem", dila: "Omi Adio", position: "Naib Nazim Ta'lim" }, // Corrected name
    { name: "Miss. Aliy Abduur Rasheed", dila: "Omi Adio", position: "Nazim Tarbiyya" },
    { name: "Bro. Akinwande Abdul Fatah", dila: "Apata", position: "Naib Nazim Tarbiyya" },
    { name: "Maulvi Shamsudeen Ojo", dila: "Monatan", position: "Nazim Tabligh" },
    { name: "Bro. Yusuff Abdul Raqeeb", dila: "Coca Cola", position: "Naib Nazim Tabligh" },
    { name: "Hafidh. Balogun Murtadho", dila: "Ibadan", position: "Naib Nazim Tabligh" },
    { name: "Bro. Olasinde Muideen", dila: "Monatan", position: "Nazim Sihat E Jismani (Sport Secretary)" },
    { name: "Bro. Salaudeen Abdul Fatai", dila: "Oyo", position: "Naib Nazim Sihat E Jismani (Sport Secretary)" },
    { name: "Dr. Fehintola Abdul Basit", dila: "Monatan", position: "Naib Nazim Sihat E Jismani (Health)" },
    { name: "Bro. Hassan Lukman", dila: "Apata", position: "Nazim Waqar E Ammal" },
    { name: "Bro. Kareem Maruf", dila: "Omi Adio", position: "Naib Nazim Waqar E Ammal" },
    { name: "Bro. Adebiyi Sulaiman", dila: "Ibadan", position: "Naib Nazim Waqar E Ammal" },
    { name: "Bro. Apooyin Toheeb", dila: "Oluyole/Onaara", position: "Nazim Ishaat" },
    { name: "Bro. Odubiyi Abdul Azeez", dila: "Ogbomosho", position: "Naib Nazim Ishaat (Publication)" },
    { name: "Bro. Onoade Awwal", dila: "Apata", position: "Naib Nazim Ishaat (Publication)" },
    { name: "Bro. Adenekan Abdul Ganiyy", dila: "Ibadan", position: "Naib Nazim Ishaat (Publication)" },
    { name: "Bro. Olajide Abdul Qahhar", dila: "Ogbomosho", position: "Nazim Tajnid" },
    { name: "Bro. Saheed Azeez", dila: "Apata", position: "Naib Nazim Tajnid" },
    { name: "Bro. Muhammed Abdur Roqeeb", dila: "Omi Adio", position: "Naib Nazim Tajnid" },
    { name: "Bro. Bakare Abdul Afeez", dila: "Ashipa Oleyo", position: "Nazim Maal (Finance)" },
    { name: "Bro. Salaudeen Ibrahim", dila: "Coca-Cola", position: "Naib Nazim Maal" },
    { name: "Bro. Babalola Sheriff", dila: "Ibadan", position: "Naib Nazim Maal" },
    { name: "Bro. Olayode Hammed", dila: "Monatan", position: "Nazim Umur E Talaba" },
    { name: "Bro. Badmus Abdul Wadud", dila: "Monatan", position: "Naib Nazim Umur E Talaba" },
    { name: "Bro. Adeleke Mahmud", dila: "Apata", position: "Naib Nazim Umur E Talaba" },
    { name: "Bro. Adeniran Abdul Gaffar", dila: "Ibadan", position: "Nazim Nao Mubain" },
    { name: "Bro. Ajayi Taofeek", dila: "Ashipa Oleyo", position: "Naib Nazim Nao Mubain" },
    { name: "Bro. Morohunranti Toyeeb", dila: "Oluyole Ona Ara", position: "Nazim Isha'at (Audio-Visual)" },
    { name: "Bro. Akinreti Mahmud", dila: "Monatan", position: "Naib Nazim Isha'at (Audio-Visual)" },
    { name: "Bro. Adeyemi Abdul Wakeel", dila: "Monatan", position: "Naib Nazim Isha'at (Audio-Visual)" },
    { name: "Bro. Ekundayo Sodiq", dila: "Coca Cola", position: "Muhasib" },
    { name: "Bro. Adeagbo Bashir", dila: "Coca Cola", position: "Nazim Tahrik E Jadid" },
    { name: "Bro. Ogunrinde Abdul Malik", dila: "Oyo", position: "Naib Nazim Tahrik E Jadid" },
    { name: "Bro. Ajao Habeeb", dila: "Oluyole Ona Ara", position: "Nazim Sanat O Tijarat" },
    { name: "Bro. Oladejo Abdul Hameed", dila: "Akinyele", position: "Nazim Sanat O Tijarat" },
    { name: "Bro. Ajetunmobi Abdul Samad", dila: "Omi Adio", position: "Naib Nazim Sanat O Tijarat" },
    { name: "Bro. Onaolapo Ridwan", dila: "Akinyele", position: "Nazim Atfal" },
    { name: "Bro. Abdulssalam Adetoro", dila: "Omi Adio", position: "Naib Nazim Atfal" },
    { name: "Bro. Oyediran Abdus Salaam", dila: "Coca Cola", position: "Naib Nazim Atfal" },
    { name: "Bro. Abdul Ganiyu Abdul Afeez", dila: "Oke Ogun", position: "Naib Nazim Atfal" },
    { name: "Bro. Aliu Yusuf", dila: "Ibadan", position: "Nazim Umumi" },
    { name: "Bro. Ajimoti Qareeb", dila: "Akinyele", position: "Naib Nazim Umumi" },
    { name: "Bro. Adebimpe Qazeem", dila: "Apata", position: "Naib Nazim Umumi" },
    { name: "Bro. Sulaiman Saheed", dila: "Oluyole Ona Ara", position: "Naib Nazim Umumi" },
    { name: "Alhaji Apooyin Abdul. Mujeeb", dila: "Omi Adio", position: "Murabiy Atfal" },
];
// Parse name into firstName and lastName
function parseName(fullName) {
    // Remove titles like Bro., Miss., Maulvi, Hafidh., Dr., Alhaji
    const cleanName = fullName
        .replace(/^(Bro\.|Miss\.|Maulvi|Hafidh\.|Dr\.|Alhaji)\s*/i, "")
        .trim();
    const parts = cleanName.split(" ");
    if (parts.length === 1) {
        return { firstName: parts[0], lastName: "" };
    }
    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ");
    return { firstName, lastName };
}
async function seedOfficers() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error("MONGODB_URI environment variable is not set");
        }
        console.log("Connecting to MongoDB...");
        await mongoose_1.default.connect(mongoUri);
        console.log("Connected to MongoDB successfully");
        // Get all offices for linking
        const offices = await office_model_1.Office.find({ isDeleted: false });
        console.log(`Found ${offices.length} offices`);
        // Create office email to ID map
        const officeEmailToId = {};
        offices.forEach((office) => {
            officeEmailToId[office.email] = new mongoose_1.default.Types.ObjectId(String(office._id));
        });
        // Delete all existing officers (hard delete)
        console.log("Deleting all existing officers...");
        const deleteResult = await officer_model_1.Officer.deleteMany({});
        console.log(`Deleted ${deleteResult.deletedCount} existing officers`);
        // Prepare officer documents
        const tenureStart = new Date("2025-01-01");
        const tenureEnd = new Date("2026-12-31");
        const officerDocuments = officialOfficers.map((officer, index) => {
            const { firstName, lastName } = parseName(officer.name);
            const positionType = getPositionType(officer.position);
            // Find the office ID for this position
            const officeEmail = positionToOfficeEmail[officer.position];
            const officeIds = [];
            if (officeEmail && officeEmailToId[officeEmail]) {
                officeIds.push(officeEmailToId[officeEmail]);
            }
            // Determine if this officer should be admin
            const isAdmin = positionType === enums_1.PositionType.EXECUTIVE ||
                positionType === enums_1.PositionType.HEAD;
            return {
                firstName,
                lastName,
                email: generateEmail(firstName, lastName),
                phoneNumber: "000-000-0000", // Placeholder - to be updated
                position: officer.position,
                positionType,
                dila: officer.dila,
                offices: officeIds,
                userType: enums_1.UserType.OFFICER,
                isAdmin,
                tenureStart,
                tenureEnd,
                uniqueCode: generateUniqueCode(index),
            };
        });
        // Insert officers
        console.log("Inserting official officers...");
        const insertResult = await officer_model_1.Officer.insertMany(officerDocuments);
        console.log(`Successfully inserted ${insertResult.length} official officers`);
        // Update office.officers arrays
        console.log("Updating office-officer relationships...");
        for (const officer of insertResult) {
            if (officer.offices && officer.offices.length > 0) {
                for (const officeId of officer.offices) {
                    await office_model_1.Office.findByIdAndUpdate(officeId, {
                        $addToSet: { officers: officer._id },
                        $inc: { totalOfficers: 1 },
                    }, { new: true });
                }
            }
        }
        // Display summary
        console.log("\n=== OFFICER SUMMARY ===");
        console.log("\nBy Position Type:");
        const executiveCount = insertResult.filter((o) => o.positionType === enums_1.PositionType.EXECUTIVE).length;
        const headCount = insertResult.filter((o) => o.positionType === enums_1.PositionType.HEAD).length;
        const assistantCount = insertResult.filter((o) => o.positionType === enums_1.PositionType.ASSISTANT).length;
        const specialCount = insertResult.filter((o) => o.positionType === enums_1.PositionType.SPECIAL).length;
        console.log(`  EXECUTIVE: ${executiveCount}`);
        console.log(`  HEAD (Nazim): ${headCount}`);
        console.log(`  ASSISTANT (Naib): ${assistantCount}`);
        console.log(`  SPECIAL: ${specialCount}`);
        console.log("\nInserted Officers:");
        insertResult.forEach((officer, index) => {
            const typeLabel = officer.positionType === enums_1.PositionType.ASSISTANT ? " [NAIB]" : "";
            console.log(`${index + 1}. ${officer.firstName} ${officer.lastName} - ${officer.position}${typeLabel} (${officer.dila})`);
        });
        console.log("\nSeed completed successfully!");
    }
    catch (error) {
        console.error("Error seeding officers:", error);
        process.exit(1);
    }
    finally {
        await mongoose_1.default.disconnect();
        console.log("Disconnected from MongoDB");
    }
}
// Run the seed function
seedOfficers();
