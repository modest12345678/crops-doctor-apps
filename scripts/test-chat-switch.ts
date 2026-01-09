import * as fs from 'fs';

function log(msg: string) {
    console.log(msg);
    fs.appendFileSync('chat_switch_test.log', msg + '\n');
}

async function testLanguageSwitch() {
    fs.writeFileSync('chat_switch_test.log', '');
    log("Testing Language Switch...");

    // Test Case: User asks "can we takh in bangla?" (typo) in English mode
    log("\n1. Testing 'can we takh in bangla?' with English context...");
    const message = "can we takh in bangla?";
    const language = "en";

    try {
        const res = await fetch("http://localhost:3000/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message, language }),
        });

        if (!res.ok) {
            log("Failed to get response: " + await res.text());
            return;
        }

        const data = await res.json();
        log("User Query: " + message);
        log("AI Response: " + data.response);

        // Check if response contains Bengali characters
        const hasBengali = /[\u0980-\u09FF]/.test(data.response);
        if (hasBengali) {
            log("SUCCESS: AI responded in Bengali.");
        } else {
            log("OBSERVATION: AI responded in English (or no Bengali chars found).");
        }

    } catch (error) {
        log("Test Failed: " + error);
    }
}

testLanguageSwitch();
