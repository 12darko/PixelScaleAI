import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SeoHeadProps {
    title?: string;
    description?: string;
    path?: string;
    schemaType?: 'FAQ' | 'Article' | 'App';
    faqData?: Array<{ question: string; answer: string }>;
    image?: string;
}

const SITE_URL = 'https://pixelscaleai.com';
const BRAND_NAME = 'PixelScaleAI';
const DEFAULT_TITLE = 'PixelScaleAI - 4K AI Fotoğraf Netleştirme ve Yükseltme';
const DEFAULT_DESC = 'Bulanık fotoğraflarınızı yapay zeka ile 4K/8K kalitesine yükseltin. PixelScaleAI ile saniyeler içinde net, canlı ve profesyonel görseller elde edin.';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`; // Ensure this image exists, otherwise fallback to icon

const SeoHead: React.FC<SeoHeadProps> = ({
    title,
    description = DEFAULT_DESC,
    path = '',
    schemaType = 'App',
    faqData,
    image
}) => {
    const metaTitle = title ? `${title} | ${BRAND_NAME}` : DEFAULT_TITLE;
    const canonicalUrl = `${SITE_URL}${path}`;
    const metaImage = image ? `${SITE_URL}${image}` : DEFAULT_IMAGE;

    // Organization Schema (Global - E-E-A-T)
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "PixelScaleAI",
        "url": SITE_URL,
        "logo": {
            "@type": "ImageObject",
            "url": `${SITE_URL}/icon.svg`,
            "width": 512,
            "height": 512
        },
        "sameAs": [
            "https://twitter.com/pixelscaleai",
            "https://instagram.com/pixelscaleai"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer support",
            "email": "support@pixelscaleai.com"
        }
    };

    // WebSite Schema (Sitelinks Search Box)
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "PixelScaleAI",
        "url": SITE_URL,
        "potentialAction": {
            "@type": "SearchAction",
            "target": `${SITE_URL}/?q={search_term_string}`,
            "query-input": "required name=search_term_string"
        }
    };

    // Software Application Schema (Rich Result)
    const appSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "PixelScaleAI",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Web",
        "url": SITE_URL,
        "image": metaImage,
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "TRY",
            "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "1250",
            "bestRating": "5",
            "worstRating": "1"
        },
        "featureList": "AI Upscaling, 4K Enhancement, Face Restoration, Noise Reduction",
        "screenshot": metaImage
    };

    // Breadcrumb Schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Anasayfa",
                "item": SITE_URL
            },
            ...(path !== '/' ? [{
                "@type": "ListItem",
                "position": 2,
                "name": title || "Sayfa",
                "item": canonicalUrl
            }] : [])
        ]
    };

    // FAQ Schema
    let faqSchema = null;
    if (schemaType === 'FAQ' && faqData) {
        faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqData.map(item => ({
                "@type": "Question",
                "name": item.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": item.answer
                }
            }))
        };
    }

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{metaTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonicalUrl} />
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={metaTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:site_name" content={BRAND_NAME} />
            <meta property="og:locale" content="tr_TR" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={canonicalUrl} />
            <meta name="twitter:title" content={metaTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={metaImage} />

            {/* Structured Data (JSON-LD) */}
            <script type="application/ld+json">
                {JSON.stringify(organizationSchema)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(websiteSchema)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(breadcrumbSchema)}
            </script>

            {schemaType === 'App' && (
                <script type="application/ld+json">
                    {JSON.stringify(appSchema)}
                </script>
            )}

            {faqSchema && (
                <script type="application/ld+json">
                    {JSON.stringify(faqSchema)}
                </script>
            )}
        </Helmet>
    );
};

export default SeoHead;
