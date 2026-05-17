import { redirect } from 'next/navigation'

// Server component — no 'use client' needed.
// Visiting "/" redirects immediately to "/login".
export default function Home() {
  redirect('/login')
}