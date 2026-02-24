import { Button } from '@/components/Button'
import { HeroBackground } from '@/components/HeroBackground'
import { Container } from '@/components/Container'
import { useRouter } from 'next/router'
import en from '../locales/en'
import zh from '../locales/zh'

export function Hero() {
  const router = useRouter()
  const { locale } = router
  const t = locale === 'en' ? en : zh
  return (
    <div className="overflow-hidden">
      <Container className="relative pb-16 pt-16 lg:max-w-6xl lg:px-16 lg:pt-20">
        <HeroBackground className="absolute right-0 top-10 h-44 w-auto md:h-60 lg:right-40 lg:h-72" />
        <div className="relative z-10">
          <h1 className="max-w-4xl font-display text-3xl font-medium tracking-tight text-white sm:text-5xl">
            {t.sleepSimple}
          </h1>
          <h2 className="mt-4 max-w-4xl font-display text-xl font-medium tracking-tight text-white sm:text-2xl">
            {t.narrowDistance}
          </h2>
          <p className="mt-6 max-w-2xl text-lg tracking-tight text-slate-400">
            {t.weGuidePeople}
          </p>
          <div className="mt-10 flex justify-center gap-x-6 sm:justify-start">
            <Button
              href="/diagnosis"
              color="blue"
              style={{
                boxShadow: `0px 7px 30px #4184F780`,
              }}
            >
              <span className="px-10 py-1 text-lg">{t.continue}</span>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}
