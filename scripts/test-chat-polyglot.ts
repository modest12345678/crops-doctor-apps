import * as fs from 'fs';

function log(msg: string) {
    console.log(msg);
    fs.appendFileSync('chat_test.log', msg + '\n');
}

async function testPolyglotChat() {
    fs.writeFileSync('chat_test.log', '');
    log("Testing Polyglot Chat...");

    // Test Case: User asks in Bengali, but system language is English
    log("\n1. Testing Bengali query with English context...");
    const message = "আমি কি বাংলায় কথা বলতে পারি?"; // "Can I speak in Bengali?"
    const language = "en"; // Simulating English UI mode

    try {
        const res = await fetch("http://localhost:3002/api/chat", {
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

        // Simple validation: Check if response contains Bengali characters
        const hasBengali = /[\u0980-\u09FF]/.test(data.response);
        if (hasBengali) {
            log("SUCCESS: AI responded in Bengali.");
        } else {
            log("FAILURE: AI did NOT respond in Bengali.");
        }

    } catch (error) {
        log("Test Failed: " + error);
    }
}

testPolyglotChat();
