import { Helmet } from 'react-helmet-async';
import { useLocation } from 'wouter';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
}

export function SEO({
    title,
    description = "Detect crop diseases instantly using AI-powered image analysis. Upload photos from your camera or gallery to identify diseases and get treatment recommendations.",
    image = "/cover-photo.png",
    type = "website"
}: SEOProps) {
    const [location] = useLocation();
    const siteUrl = "https://cropsdoctor.vercel.app"; // Using the domain we just verified
    const fullUrl = `${siteUrl}${location}`;
    const fullTitle = title ? `${title} | Crop Doctor AI` : "Crop Doctor - AI-Powered Disease Identification";
    const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

    return (
        <Helmet>
            {/* Basic Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={fullUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={fullUrl} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={fullImage} />
        </Helmet>
    );
}
