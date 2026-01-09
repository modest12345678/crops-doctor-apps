
import { getSoilData } from "../server/services/soilService.js";

async function test() {
    console.log("Testing Soil Service Response Shape...");
    try {
        const lat = 25.683558;
        const lng = 88.660378;
        const data = await getSoilData(lat, lng);
        console.log("Keys received:", Object.keys(data));
        console.log("Recommended Crops:", data.recommendedCrops);
    } catch (error) {
        console.error("Test Failed:", error);
    }
}

test();
