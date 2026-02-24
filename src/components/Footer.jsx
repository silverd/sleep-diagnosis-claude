import { Container } from '@/components/Container'
import { Logo } from '@/components/Logo'

export function Footer() {
  return (
    <footer className="bg-slate-50">
      <Container>
        <div className="py-1">
          <Logo className="mx-auto h-10 w-auto" />{' '}
        </div>
        <div className="flex justify-center border-t border-slate-400/10 py-4">
          <p className="mt-6 text-sm text-slate-500 sm:mt-0">
            Copyright &copy; {new Date().getFullYear()} Engineering Sleep. All
            rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  )
}
