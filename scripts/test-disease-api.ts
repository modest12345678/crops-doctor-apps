
import fetch from 'node-fetch';
import fs from 'fs';

async function testDiseaseDetection() {
    try {
        console.log("🧪 Testing Disease Detection API...");

        // Use a placeholder base64 image (doesn't matter for Groq text-only analysis)
        const base64Image = "data:image/jpeg;base64,/9j/4AAQSkZJRg...";

        const response = await fetch('http://localhost:3000/api/detect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                imageData: base64Image,
                cropType: 'rice',
                language: 'bn'
            }),
        });

        console.log("Status:", response.status);
        const data: any = await response.json();

        // Save to file for better viewing
        fs.writeFileSync("disease-result.json", JSON.stringify(data, null, 2), "utf-8");

        console.log("\n📊 Summary:");
        console.log("Disease:", data.diseaseName);
        console.log("Confidence:", data.confidence);

        if (Array.isArray(data.treatment)) {
            console.log("Treatment Steps:", data.treatment.length);
            data.treatment.forEach((step: string, i: number) => console.log(`  ${i + 1}. ${step.substring(0, 50)}...`));
        } else {
            console.log("Treatment:", data.treatment);
        }

        console.log("\nCheck disease-result.json for full details!");
    } catch (error) {
        console.error("Error:", error);
    }
}

testDiseaseDetection();
