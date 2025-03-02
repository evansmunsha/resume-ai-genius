import Script from 'next/script';
import React from 'react'

type AdsenseTypes = {
    pId: string;
}

const AdSense = ({ pId }: AdsenseTypes) => {
  
  try {
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${pId}`}
      crossOrigin='anonymous'
      strategy='afterInteractive'
    />
  } catch (error) {
    console.log(error)
  }
    
    
}

export default AdSense;