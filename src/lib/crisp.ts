'use client';

import { Crisp } from 'crisp-sdk-web';

// Initialize Crisp only on the client side
export const initCrisp = () => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID) {
    Crisp.configure(process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID);
  }
};

export default Crisp; 