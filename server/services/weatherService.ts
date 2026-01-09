
interface WeatherData {
    current: {
        time: string;
        temperature_2m: number;
        relative_humidity_2m: number;
        apparent_temperature: number;
        is_day: number;
        precipitation: number;
        rain: number;
        showers: number;
        snowfall: number;
        weather_code: number;
        cloud_cover: number;
        pressure_msl: number;
        surface_pressure: number;
        wind_speed_10m: number;
        wind_direction_10m: number;
        wind_gusts_10m: number;
    };
    hourly: {
        time: string[];
        temperature_2m: number[];
        relative_humidity_2m: number[];
        precipitation_probability: number[];
        precipitation: number[];
    };
    daily: {
        time: string[];
        weather_code: number[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        sunrise: string[];
        sunset: string[];
        precipitation_sum: number[];
        rain_sum: number[];
        showers_sum: number[];
        snowfall_sum: number[];
        precipitation_probability_max: number[];
    };
    soil: {
        temperature_0cm: number;
        temperature_6cm: number;
        temperature_18cm: number;
        moisture_0_1cm: number;
        moisture_1_3cm: number;
    }
}

// Helper to map WMO weather codes to readable text
export function getWeatherDescription(code: number): string {
    const codes: Record<number, string> = {
        0: "Clear sky",
        1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
        45: "Fog", 48: "Depositing rime fog",
        51: "Light Drizzle", 53: "Moderate Drizzle", 55: "Dense Drizzle",
        56: "Light Freezing Drizzle", 57: "Dense Freezing Drizzle",
        61: "Slight Rain", 63: "Moderate Rain", 65: "Heavy Rain",
        66: "Light Freezing Rain", 67: "Heavy Freezing Rain",
        71: "Slight Snow Fall", 73: "Moderate Snow Fall", 75: "Heavy Snow Fall",
        77: "Snow grains",
        80: "Slight Rain Showers", 81: "Moderate Rain Showers", 82: "Violent Rain Showers",
        85: "Slight Snow Showers", 86: "Heavy Snow Showers",
        95: "Thunderstorm", 96: "Thunderstorm with slight hail", 99: "Thunderstorm with heavy hail"
    };
    return codes[code] || "Unknown";
}

export async function getWeatherData(lat: number, lng: number): Promise<WeatherData | null> {
    try {
        const params = new URLSearchParams({
            latitude: lat.toString(),
            longitude: lng.toString(),
            current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m",
            hourly: "temperature_2m,relative_humidity_2m,precipitation_probability,precipitation",
            daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_probability_max",
            timezone: "auto"
        });

        // Add soil API call (separate or combined? Open-Meteo has a generic API, let's use the main forecast one which includes some soil data if requested, or the specific soil API)
        // For simplicity and standard forecast, we'll check if the main API supports soil. 
        // Actually Open-Meteo standard API *does* support some soil vars in 'hourly'.
        // Let's stick to the main forecast API for now.

        // Wait, for "Micro-Climate" specifically for farming, soil temp/moisture is good.
        // Let's add hourly soil variables to the request.

        params.append("hourly", "soil_temperature_0cm,soil_temperature_6cm,soil_temperature_18cm,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm");

        const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);

        if (!response.ok) {
            throw new Error(`Open-Meteo API Error: ${response.statusText}`);
        }

        const data = await response.json();

        // Process and structure the data
        return {
            current: data.current,
            hourly: {
                time: data.hourly.time.slice(0, 24), // Next 24 hours
                temperature_2m: data.hourly.temperature_2m.slice(0, 24),
                relative_humidity_2m: data.hourly.relative_humidity_2m.slice(0, 24),
                precipitation_probability: data.hourly.precipitation_probability.slice(0, 24),
                precipitation: data.hourly.precipitation.slice(0, 24)
            },
            daily: data.daily,
            // Extract current soil conditions from the current hour index
            soil: {
                // Approximate "current" by taking the hour closest to current time
                // Since 'current' block doesn't have soil, we use hourly[0] (or find nearest)
                // For simplicity, we'll just take the first hourly element (which is usually the current hour)
                temperature_0cm: data.hourly.soil_temperature_0cm[0],
                temperature_6cm: data.hourly.soil_temperature_6cm[0],
                temperature_18cm: data.hourly.soil_temperature_18cm[0],
                moisture_0_1cm: data.hourly.soil_moisture_0_to_1cm[0],
                moisture_1_3cm: data.hourly.soil_moisture_1_to_3cm[0]
            }
        };

    } catch (error) {
        console.error("Weather Service Error:", error);
        return null;
    }
}
