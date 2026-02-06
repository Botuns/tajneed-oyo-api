"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const PDFDocument = require("pdfkit");
// Load environment variables
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), ".env.local") });
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), ".env") });
const officer_model_1 = require("../models/officer.model");
const enums_1 = require("../enums");
async function generateOfficerCodesPDF() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error("MONGODB_URI environment variable is not set");
        }
        console.log("Connecting to MongoDB...");
        await mongoose_1.default.connect(mongoUri);
        console.log("Connected to MongoDB successfully");
        // Fetch all officers sorted by position type and name
        const officers = await officer_model_1.Officer.find({ isDeleted: false })
            .sort({ positionType: 1, firstName: 1 })
            .exec();
        console.log(`Found ${officers.length} officers`);
        if (officers.length === 0) {
            console.log("No officers found. Please run the seed script first.");
            return;
        }
        // Create output directory if it doesn't exist
        const outputDir = path_1.default.resolve(process.cwd(), "output");
        if (!fs_1.default.existsSync(outputDir)) {
            fs_1.default.mkdirSync(outputDir, { recursive: true });
        }
        const outputPath = path_1.default.join(outputDir, "MKA-OYO-Officer-Attendance-Codes.pdf");
        // Create PDF document
        const doc = new PDFDocument({
            size: "A4",
            margins: { top: 50, bottom: 50, left: 50, right: 50 },
        });
        // Pipe to file
        const writeStream = fs_1.default.createWriteStream(outputPath);
        doc.pipe(writeStream);
        // Header
        doc
            .fontSize(10)
            .font("Helvetica")
            .text("IN THE NAME OF ALLAH THE GRACIOUS EVER MERCIFUL", { align: "center" })
            .moveDown(0.3);
        doc
            .fontSize(14)
            .font("Helvetica-Bold")
            .text("MAJLIS KHUDDAMUL AHMADIYYA NIGERIA", { align: "center" })
            .moveDown(0.2);
        doc
            .fontSize(12)
            .font("Helvetica-Bold")
            .text("OYO STATE", { align: "center" })
            .moveDown(0.2);
        doc
            .fontSize(10)
            .font("Helvetica")
            .text("(AHMADIYYA MUSLIM YOUTH ORGANIZATION)", { align: "center" })
            .moveDown(0.5);
        doc
            .fontSize(16)
            .font("Helvetica-Bold")
            .fillColor("#1a5f2a")
            .text("OFFICER ATTENDANCE CODES", { align: "center" })
            .moveDown(0.3);
        doc
            .fontSize(10)
            .font("Helvetica")
            .fillColor("black")
            .text("2025/2026 MKAN Year", { align: "center" })
            .moveDown(1);
        // Instructions
        doc
            .fontSize(10)
            .font("Helvetica-Oblique")
            .fillColor("#333")
            .text("Use your unique code below to sign attendance at meetings. Keep this code private.", { align: "center" })
            .moveDown(1.5);
        // Group officers by position type
        const grouped = {
            [enums_1.PositionType.EXECUTIVE]: officers.filter((o) => o.positionType === enums_1.PositionType.EXECUTIVE),
            [enums_1.PositionType.HEAD]: officers.filter((o) => o.positionType === enums_1.PositionType.HEAD),
            [enums_1.PositionType.ASSISTANT]: officers.filter((o) => o.positionType === enums_1.PositionType.ASSISTANT),
            [enums_1.PositionType.SPECIAL]: officers.filter((o) => o.positionType === enums_1.PositionType.SPECIAL),
        };
        const sectionTitles = {
            [enums_1.PositionType.EXECUTIVE]: "EXECUTIVE OFFICERS",
            [enums_1.PositionType.HEAD]: "DEPARTMENT HEADS (NAZIMS)",
            [enums_1.PositionType.ASSISTANT]: "ASSISTANT OFFICERS (NAIBS)",
            [enums_1.PositionType.SPECIAL]: "SPECIAL OFFICERS",
        };
        // Table settings
        const tableLeft = 50;
        const colWidths = {
            sn: 30,
            name: 200,
            position: 150,
            code: 100,
        };
        const rowHeight = 22;
        let currentY = doc.y;
        let pageNumber = 1;
        // Function to draw table header
        const drawTableHeader = () => {
            doc
                .fillColor("#1a5f2a")
                .rect(tableLeft, currentY, 495, rowHeight)
                .fill();
            doc
                .fillColor("white")
                .fontSize(9)
                .font("Helvetica-Bold");
            doc.text("S/N", tableLeft + 5, currentY + 6, { width: colWidths.sn });
            doc.text("NAME", tableLeft + colWidths.sn + 5, currentY + 6, { width: colWidths.name });
            doc.text("POSITION", tableLeft + colWidths.sn + colWidths.name + 5, currentY + 6, { width: colWidths.position });
            doc.text("UNIQUE CODE", tableLeft + colWidths.sn + colWidths.name + colWidths.position + 5, currentY + 6, { width: colWidths.code });
            currentY += rowHeight;
        };
        // Function to check if new page is needed
        const checkNewPage = (requiredHeight) => {
            if (currentY + requiredHeight > 750) {
                // Add page number
                doc
                    .fontSize(8)
                    .fillColor("#666")
                    .text(`Page ${pageNumber}`, 50, 780, { align: "center", width: 495 });
                doc.addPage();
                pageNumber++;
                currentY = 50;
                return true;
            }
            return false;
        };
        let globalSN = 1;
        // Draw each section
        for (const positionType of [enums_1.PositionType.EXECUTIVE, enums_1.PositionType.HEAD, enums_1.PositionType.ASSISTANT, enums_1.PositionType.SPECIAL]) {
            const sectionOfficers = grouped[positionType];
            if (sectionOfficers.length === 0)
                continue;
            // Check if we need a new page for section header + at least 2 rows
            checkNewPage(rowHeight * 3 + 30);
            // Section header
            doc
                .fillColor("#1a5f2a")
                .fontSize(11)
                .font("Helvetica-Bold")
                .text(sectionTitles[positionType], tableLeft, currentY);
            currentY += 20;
            // Draw table header
            drawTableHeader();
            // Draw rows
            for (let i = 0; i < sectionOfficers.length; i++) {
                const officer = sectionOfficers[i];
                // Check for new page
                if (checkNewPage(rowHeight + 10)) {
                    // Redraw section header on new page
                    doc
                        .fillColor("#1a5f2a")
                        .fontSize(11)
                        .font("Helvetica-Bold")
                        .text(`${sectionTitles[positionType]} (continued)`, tableLeft, currentY);
                    currentY += 20;
                    drawTableHeader();
                }
                // Alternate row background
                if (i % 2 === 0) {
                    doc
                        .fillColor("#f5f5f5")
                        .rect(tableLeft, currentY, 495, rowHeight)
                        .fill();
                }
                // Draw row border
                doc
                    .strokeColor("#ddd")
                    .rect(tableLeft, currentY, 495, rowHeight)
                    .stroke();
                // Format name with "Bro." or appropriate title
                let title = "Bro.";
                if (officer.firstName.toLowerCase().includes("miss") || officer.firstName.toLowerCase().includes("sis")) {
                    title = "Sis.";
                }
                const fullName = `${title} ${officer.firstName} ${officer.lastName}`;
                // Truncate position if too long
                let position = officer.position;
                if (position.length > 25) {
                    position = position.substring(0, 22) + "...";
                }
                doc
                    .fillColor("black")
                    .fontSize(9)
                    .font("Helvetica");
                doc.text(String(globalSN), tableLeft + 5, currentY + 6, { width: colWidths.sn });
                doc.text(fullName, tableLeft + colWidths.sn + 5, currentY + 6, { width: colWidths.name });
                doc.text(position, tableLeft + colWidths.sn + colWidths.name + 5, currentY + 6, { width: colWidths.position });
                // Unique code in bold
                doc
                    .font("Helvetica-Bold")
                    .fillColor("#1a5f2a")
                    .text(officer.uniqueCode || "N/A", tableLeft + colWidths.sn + colWidths.name + colWidths.position + 5, currentY + 6, { width: colWidths.code });
                currentY += rowHeight;
                globalSN++;
            }
            currentY += 15; // Space between sections
        }
        // Footer
        currentY += 20;
        if (currentY > 700) {
            doc.addPage();
            pageNumber++;
            currentY = 50;
        }
        doc
            .fontSize(9)
            .font("Helvetica")
            .fillColor("#666")
            .text("This document is confidential. Each officer should only use their own unique code.", tableLeft, currentY, { align: "center", width: 495 })
            .moveDown(0.5);
        doc
            .fontSize(8)
            .text(`Generated on: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`, {
            align: "center",
        });
        // Add final page number
        doc
            .fontSize(8)
            .fillColor("#666")
            .text(`Page ${pageNumber}`, 50, 780, { align: "center", width: 495 });
        // Finalize PDF
        doc.end();
        // Wait for write to complete
        await new Promise((resolve, reject) => {
            writeStream.on("finish", resolve);
            writeStream.on("error", reject);
        });
        console.log(`\nPDF generated successfully!`);
        console.log(`Location: ${outputPath}`);
        console.log(`\nTotal officers: ${officers.length}`);
        console.log(`  - Executive: ${grouped[enums_1.PositionType.EXECUTIVE].length}`);
        console.log(`  - Heads (Nazims): ${grouped[enums_1.PositionType.HEAD].length}`);
        console.log(`  - Assistants (Naibs): ${grouped[enums_1.PositionType.ASSISTANT].length}`);
        console.log(`  - Special: ${grouped[enums_1.PositionType.SPECIAL].length}`);
    }
    catch (error) {
        console.error("Error generating PDF:", error);
        process.exit(1);
    }
    finally {
        await mongoose_1.default.disconnect();
        console.log("\nDisconnected from MongoDB");
    }
}
// Run the function
generateOfficerCodesPDF();
