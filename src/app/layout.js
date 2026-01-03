import { Inter } from 'next/font/google';
import PropTypes from 'prop-types';
import ClientProvider from '@/utils/context/ClientProvider';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'GrindFind',
  description: 'Find skateparks and street spots near you',
  keywords: ['skateboarding', 'skateparks', 'street spots', 'skate spots'],
  openGraph: {
    title: 'GrindFind',
    description: 'Find skateparks and street spots near you',
    url: 'https://your-netlify-url.netlify.app',
    siteName: 'GrindFind',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
