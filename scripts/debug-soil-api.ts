
import { getSoilData } from "../server/services/soilService";

async function testSoilApi() {
    const coords = { lat: 25.695470, lng: 88.652380 };
    console.log(`Testing soil API with coords: ${JSON.stringify(coords)}`);

    try {
        const result = await getSoilData(coords.lat, coords.lng);
        console.log("Successfully fetched soil data:");
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error("Failed to fetch soil data:", error);
    }
}

testSoilApi();
