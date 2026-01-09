// Test the regex pattern
const text = "৫০ কেজি ইউরিয়া প্রতি বিঘা";
const pattern = /([\d০-৯]+(?:[..][\d০-৯]+)?)\s*(kg|কেজি|কিলোগ্রাম)/gi;

console.log("Testing pattern on:", text);
const matches = text.match(pattern);
console.log("Matches found:", matches);

// Test conversion
function toEnglishNumber(text: string): string {
    const bengaliToEnglish: { [key: string]: string } = {
        '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
        '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
    };
    return text.replace(/[০-৯]/g, (digit) => bengaliToEnglish[digit]);
}

function toBengaliNumber(num: number | string): string {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/\d/g, (digit) => bengaliDigits[parseInt(digit)]);
}

const result = text.replace(pattern, (match, amount, unit) => {
    console.log("Match:", match, "Amount:", amount, "Unit:", unit);
    const englishAmount = toEnglishNumber(amount);
    console.log("English amount:", englishAmount);
    const numericAmount = parseFloat(englishAmount);
    console.log("Numeric:", numericAmount);
    const totalAmount = (numericAmount * 22.98).toFixed(2);
    console.log("Total:", totalAmount);
    const displayAmount = toBengaliNumber(totalAmount);
    console.log("Bengali total:", displayAmount);
    return `${displayAmount} ${unit}`;
});

console.log("\nOriginal:", text);
console.log("Result:", result);
