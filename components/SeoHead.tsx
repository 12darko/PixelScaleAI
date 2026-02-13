import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SeoHeadProps {
    title?: string;
    description?: string;
    path?: string;
    schemaType?: 'FAQ' | 'Article' | 'App';
    faqData?: Array<{ question: string; answer: string }>;
}

const SITE_URL = 'https://pixelscaleai.com';
const BRAND_NAME = 'PixelScaleAI';
const DEFAULT_TITLE = 'PixelScaleAI - 4K AI Fotoğraf Netleştirme ve Yükseltme';
const DEFAULT_DESC = 'Bulanık fotoğraflarınızı yapay zeka ile 4K/8K kalitesine yükseltin. PixelScaleAI ile saniyeler içinde net, canlı ve profesyonel görseller elde edin.';

const SeoHead: React.FC<SeoHeadProps> = ({
    title,
    description = DEFAULT_DESC,
    path = '',
    schemaType = 'App',
    faqData
}) => {
    const metaTitle = title ? `${title} | ${BRAND_NAME}` : DEFAULT_TITLE;
    const canonicalUrl = `${SITE_URL}${path}`;

    // Organization Schema (Global)
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "PixelScaleAI",
        "url": SITE_URL,
        "logo": `${SITE_URL}/icon.svg`,
        "description": "Yapay zeka destekli fotoğraf iyileştirme ve 4K yükseltme aracı."
    };

    // Software Application Schema
    const appSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "PixelScaleAI",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Web",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "TRY"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "1250"
        }
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

            {/* Structured Data (JSON-LD) */}
            <script type="application/ld+json">
                {JSON.stringify(organizationSchema)}
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
