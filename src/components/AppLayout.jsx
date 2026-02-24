import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { BreadCrumbs } from '@/components/BreadCrumbs'

export function AppLayout({ children }) {
  return (
    <>
      <Header />
      <div className="mx-auto max-w-9xl p-4 sm:px-6 lg:px-8 lg:pt-8">
        <BreadCrumbs />
      </div>
      <div className="mx-auto max-w-9xl bg-pagebg-100 lg:flex lg:items-start lg:gap-x-8 lg:px-8 lg:py-8">
        {children}
      </div>
      <Footer />
    </>
  )
}
