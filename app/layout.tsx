import type { Metadata } from 'next'
import './global.css'

export const metadata: Metadata = {
  title: 'A.R.O.N.A',
  description: 'BlueArchive API Site',
  icons: '/arona.svg',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
