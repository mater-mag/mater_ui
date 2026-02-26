import { Header, Footer } from '@/components/layout'
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider'
import { getNavigationCategories } from '@/lib/supabase/queries'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const categories = await getNavigationCategories()

  return (
    <SmoothScrollProvider>
      <div className="flex min-h-screen flex-col">
        <Header categories={categories} />
        <main className="flex-1">{children}</main>
        <Footer categories={categories} />
      </div>
    </SmoothScrollProvider>
  )
}
