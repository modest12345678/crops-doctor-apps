import fetch from "node-fetch";
import fs from "fs";

async function testFertilizerAPI() {
    try {
        const response = await fetch("http://localhost:3000/api/fertilizer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                cropType: "rice",
                area: 22.98,
                unit: "bigha",
                language: "bn"
            })
        });

        console.log("Status:", response.status);
        const data: any = await response.json();

        // Save to file for better viewing
        fs.writeFileSync("fertilizer-result.json", JSON.stringify(data, null, 2), "utf-8");
        console.log("\n✅ Response saved to fertilizer-result.json");

        console.log("\n📊 Summary:");
        console.log("Crop:", data.cropName);
        console.log("Area:", data.area, data.unit);
        if (data.perUnitList && data.perUnitList.length > 0) {
            console.log("Per Unit List:", data.perUnitList.length, "items");
        }
        console.log("\nCheck fertilizer-result.json for full details!");
    } catch (error) {
        console.error("Error:", error);
    }
}

testFertilizerAPI();
