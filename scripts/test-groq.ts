import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Manually load .env to avoid dotenv package issues
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../.env");

console.log(`Reading .env from: ${envPath}`);

let apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
    try {
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, "utf-8");
            const match = envContent.match(/GROQ_API_KEY=(.*)/);
            if (match) {
                apiKey = match[1].trim();
                console.log("Found GROQ_API_KEY in .env file.");
            }
        }
    } catch (err) {
        console.error("Error reading .env file:", err);
    }
}

async function main() {
    const baseURL = "https://api.groq.com/openai/v1/chat/completions";

    if (!apiKey) {
        console.error("Error: GROQ_API_KEY not found in process.env or .env file.");
        return;
    }

    console.log(`Connecting to Groq API at ${baseURL}...`);
    console.log(`API Key found: ${apiKey.substring(0, 5)}...`);

    try {
        const response = await fetch(baseURL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "user", content: "Hello! What is 2 + 2?" }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        console.log("\nResponse from Groq API:");
        console.log("--------------------------------------------------");
        console.log(data.choices[0].message.content);
        console.log("--------------------------------------------------");
        console.log("\nTest passed successfully!");

    } catch (error) {
        console.error("\nError calling Groq API:", error);
    }
}

main();
