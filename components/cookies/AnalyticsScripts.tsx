'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { useCookieConsent, type CookiePreferences } from './CookieConsent'

interface AnalyticsScriptsProps {
  googleAnalyticsId?: string
  googleAdsId?: string
  metaPixelId?: string
}

export function AnalyticsScripts({
  googleAnalyticsId,
  googleAdsId,
  metaPixelId,
}: AnalyticsScriptsProps) {
  const preferences = useCookieConsent()
  const [analyticsLoaded, setAnalyticsLoaded] = useState(false)
  const [marketingLoaded, setMarketingLoaded] = useState(false)

  // Only render scripts after consent is given
  if (!preferences) return null

  return (
    <>
      {/* Google Analytics */}
      {preferences.analytics && googleAnalyticsId && !analyticsLoaded && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
            onLoad={() => setAnalyticsLoaded(true)}
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAnalyticsId}', {
                anonymize_ip: true
              });
            `}
          </Script>
        </>
      )}

      {/* Google Ads */}
      {preferences.marketing && googleAdsId && !marketingLoaded && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-ads" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAdsId}');
            `}
          </Script>
        </>
      )}

      {/* Meta Pixel */}
      {preferences.marketing && metaPixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  )
}
