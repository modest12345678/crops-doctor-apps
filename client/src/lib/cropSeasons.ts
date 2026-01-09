// Crop season data for major crops in Bangladesh
export interface CropSeason {
    crop: string;
    cropBn: string;
    plantingMonths: number[]; // 0-11 (Jan-Dec)
    harvestingMonths: number[];
    color: string;
    icon: string; // Emoji icon for visual representation
}

export const cropSeasons: CropSeason[] = [
    {
        crop: "Aman Rice",
        cropBn: "আমন ধান",
        plantingMonths: [6, 7, 8], // Jul-Sep
        harvestingMonths: [10, 11], // Nov-Dec
        color: "#10b981", // green
        icon: "🌾",
    },
    {
        crop: "Boro Rice",
        cropBn: "বোরো ধান",
        plantingMonths: [11, 0, 1], // Dec-Feb
        harvestingMonths: [3, 4], // Apr-May
        color: "#22c55e", // light green
        icon: "🍚",
    },
    {
        crop: "Aus Rice",
        cropBn: "আউশ ধান",
        plantingMonths: [2, 3], // Mar-Apr
        harvestingMonths: [6, 7], // Jul-Aug
        color: "#84cc16", // lime
        icon: "🌾",
    },
    {
        crop: "Wheat",
        cropBn: "গম",
        plantingMonths: [10, 11], // Nov-Dec
        harvestingMonths: [2, 3], // Mar-Apr
        color: "#f59e0b", // amber
        icon: "🌾",
    },
    {
        crop: "Jute",
        cropBn: "পাট",
        plantingMonths: [2, 3, 4], // Mar-May
        harvestingMonths: [6, 7, 8], // Jul-Sep
        color: "#8b5cf6", // purple
        icon: "🌿",
    },
    {
        crop: "Mustard",
        cropBn: "সরিষা",
        plantingMonths: [9, 10], // Oct-Nov
        harvestingMonths: [1, 2], // Feb-Mar
        color: "#eab308", // yellow
        icon: "🌼",
    },
    {
        crop: "Potato",
        cropBn: "আলু",
        plantingMonths: [10, 11], // Nov-Dec
        harvestingMonths: [1, 2, 3], // Feb-Apr
        color: "#a78bfa", // violet
        icon: "🥔",
    },
    {
        crop: "Tomato",
        cropBn: "টমেটো",
        plantingMonths: [8, 9, 10], // Sep-Nov
        harvestingMonths: [0, 1, 2], // Jan-Mar
        color: "#ef4444", // red
        icon: "🍅",
    },
    {
        crop: "Onion",
        cropBn: "পেঁয়াজ",
        plantingMonths: [9, 10, 11], // Oct-Dec
        harvestingMonths: [2, 3, 4], // Mar-May
        color: "#ec4899", // pink
        icon: "🧅",
    },
    {
        crop: "Chili",
        cropBn: "মরিচ",
        plantingMonths: [8, 9], // Sep-Oct
        harvestingMonths: [0, 1, 2], // Jan-Mar
        color: "#dc2626", // dark red
        icon: "🌶️",
    },
];

export function getCropsForMonth(month: number): {
    planting: CropSeason[];
    harvesting: CropSeason[];
} {
    const planting = cropSeasons.filter(crop => crop.plantingMonths.includes(month));
    const harvesting = cropSeasons.filter(crop => crop.harvestingMonths.includes(month));

    return { planting, harvesting };
}
