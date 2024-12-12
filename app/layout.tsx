import type { Metadata } from 'next'
import { Noto_Sans_SC } from 'next/font/google'
import './global.css'

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  display: 'swap',
})

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
    <html lang="en" className={notoSansSC.className}>
      <body>{children}</body>
    </html>
  )
}
