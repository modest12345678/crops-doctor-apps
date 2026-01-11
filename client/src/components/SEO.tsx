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
    description = "Free AI Plant Disease Detection for farmers. Instantly identify crop diseases, calculate fertilizers, and analyze soil health with Crop Doctor.",
    image = "/cover-photo.png",
    type = "website",
    keywords = "crop doctor, plant disease detection, leaf disease detection, ai agriculture, fertilizer calculator, soil health, farming app, smart farming bangladesh"
}: SEOProps & { keywords?: string }) {
    const [location] = useLocation();
    const siteUrl = "https://cropsdoctor.vercel.app"; // Using the domain we just verified
    const fullUrl = `${siteUrl}${location}`;
    const fullTitle = title ? `${title} | Crop Doctor AI` : "Crop Doctor - AI Plant Disease Detection";
    const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Crop Doctor AI",
        "applicationCategory": "AgricultureApplication",
        "operatingSystem": "Web, Android",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "description": description,
        "image": fullImage,
        "url": fullUrl,
        "author": {
            "@type": "Organization",
            "name": "Crop Doctor AI Team",
            "url": siteUrl
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "1250"
        }
    };

    return (
        <Helmet>
            {/* Basic Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={fullUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImage} />
            <meta property="og:site_name" content="Crop Doctor AI" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={fullUrl} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={fullImage} />

            {/* Structured Data (JSON-LD) */}
            <script type="application/ld+json">
                {JSON.stringify(schemaData)}
            </script>
        </Helmet>
    );
}
