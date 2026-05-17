import './globals.css'

export const metadata = {
  title: 'Notes App',
  description: 'Full-stack notes application',
}

// The root layout wraps EVERY page.
// 'use client' is NOT here — this is a Server Component.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}