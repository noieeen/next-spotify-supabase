import './globals.css'
import { Figtree } from 'next/font/google'

import Sidebar from '@/components/Sidebar'
// Providers
import SupabaseProvider from '@/providers/Supabase'
import UserProvider from '@/providers/userProvider'
import ModalProvider from '@/providers/ModalProvider'
import ToastProvider from '@/providers/ToastProvider'
import getSongsByUserId from '@/actions/getSongsByUserId'


const font = Figtree({ subsets: ['latin'] })

export const metadata = {
  title: 'Spotify',
  description: 'Listen to music!',
}

export const revalidate = 0

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const userSongs = await getSongsByUserId();

  return (
    <html lang="en">
      <body className={font.className}>
        <ToastProvider />
        <SupabaseProvider>
          <UserProvider>
            <ModalProvider />
            <Sidebar songs={userSongs}>
              {children}
            </Sidebar>
          </UserProvider>

        </SupabaseProvider>

      </body>
    </html>
  )
}
