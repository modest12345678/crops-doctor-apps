import DiseaseDetector from "@/components/DiseaseDetector";
import { SEO } from "@/components/SEO";

export default function DetectPage() {
    return (
        <>
            <SEO
                title="Disease Detector"
                description="Upload photos of your crops to instantly detect diseases using AI and get organic treatment recommendations."
            />
            <DiseaseDetector />
        </>
    );
}
