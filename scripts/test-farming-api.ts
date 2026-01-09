import * as fs from 'fs';

function log(msg: string) {
    console.log(msg);
    fs.appendFileSync('farming_test.log', msg + '\n');
}

async function testFarmingAPI() {
    fs.writeFileSync('farming_test.log', '');
    log("Testing Farming API on port 3001...");

    // 1. Create a Farming Cycle
    log("\n1. Creating Farming Cycle...");
    const cycleData = {
        farmerName: "Test Farmer",
        crop: "potato",
        location: "Test Location",
        startDate: new Date().toISOString(),
    };

    try {
        const createRes = await fetch("http://localhost:3001/api/farming-cycles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cycleData),
        });

        if (!createRes.ok) {
            log("Failed to create cycle: " + await createRes.text());
            return;
        }

        const cycle = await createRes.json();
        log("Cycle Created: " + JSON.stringify(cycle));

        // 2. Get Farming Cycles
        log("\n2. Fetching Farming Cycles...");
        const getRes = await fetch("http://localhost:3001/api/farming-cycles");
        const cycles = await getRes.json();
        log("Cycles List: " + JSON.stringify(cycles));

        if (cycles.length > 0 && cycles.find((c: any) => c.id === cycle.id)) {
            log("SUCCESS: Cycle found in list.");
        } else {
            log("FAILURE: Cycle NOT found in list.");
        }

        // 3. Add a Stage
        log("\n3. Adding Farming Stage...");
        const stageData = {
            cycleId: cycle.id,
            stageName: "Sowing",
            description: "Sowing seeds",
            date: new Date().toISOString(),
            imageUrl: "http://example.com/image.jpg",
            videoUrl: "http://example.com/video.mp4",
        };

        const stageRes = await fetch("http://localhost:3001/api/farming-stages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(stageData),
        });

        if (!stageRes.ok) {
            log("Failed to create stage: " + await stageRes.text());
            return;
        }

        const stage = await stageRes.json();
        log("Stage Created: " + JSON.stringify(stage));

        // 4. Get Cycle Details (with stages)
        log("\n4. Fetching Cycle Details...");
        const detailRes = await fetch(`http://localhost:3001/api/farming-cycles/${cycle.id}`);
        const detail = await detailRes.json();
        log("Cycle Detail: " + JSON.stringify(detail));

        if (detail.stages && detail.stages.length > 0) {
            log("SUCCESS: Stage found in cycle details.");
        } else {
            log("FAILURE: Stage NOT found in cycle details.");
        }

    } catch (error) {
        log("Test Failed: " + error);
    }
}

testFarmingAPI();
