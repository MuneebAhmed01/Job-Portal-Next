'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Exclude footer from login and signup pages
  const noFooterPaths = ['/signin', '/signup'];
  const shouldShowFooter = !noFooterPaths.some(path => pathname.startsWith(path));
  
  if (!shouldShowFooter) {
    return null;
  }
  
  return <Footer />;
}
