'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { useCookieConsent, type CookiePreferences } from './CookieConsent'

interface AnalyticsScriptsProps {
  googleTagManagerId?: string
  googleAnalyticsId?: string
  googleAdsId?: string
  metaPixelId?: string
}

export function AnalyticsScripts({
  googleTagManagerId,
  googleAnalyticsId,
  googleAdsId,
  metaPixelId,
}: AnalyticsScriptsProps) {
  const preferences = useCookieConsent()
  const [gtmLoaded, setGtmLoaded] = useState(false)
  const [analyticsLoaded, setAnalyticsLoaded] = useState(false)
  const [marketingLoaded, setMarketingLoaded] = useState(false)

  // Only render scripts after consent is given
  if (!preferences) return null

  return (
    <>
      {/* Google Tag Manager */}
      {preferences.analytics && googleTagManagerId && !gtmLoaded && (
        <Script id="google-tag-manager" strategy="afterInteractive" onLoad={() => setGtmLoaded(true)}>
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${googleTagManagerId}');
          `}
        </Script>
      )}

      {/* Google Analytics (standalone, use if not using GTM) */}
      {preferences.analytics && googleAnalyticsId && !googleTagManagerId && !analyticsLoaded && (
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
