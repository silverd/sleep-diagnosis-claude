import { Fragment } from 'react'
import Link from 'next/link'
import { Popover, Transition } from '@headlessui/react'
import clsx from 'clsx'
import { useRouter } from 'next/router'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { LogoDark } from '@/components/LogoDark'
// import { NavLink } from '@/components/NavLink'
import { SelectField } from '@/components/Fields'
import { useSession, signOut } from 'next-auth/react'

// function MobileNavLink({ href, children }) {
//   return (
//     <Popover.Button as={Link} href={href} className="block w-full p-2">
//       {children}
//     </Popover.Button>
//   )
// }

function MobileNavIcon({ open }) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-white"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path
        d="M0 1H14M0 7H14M0 13H14"
        className={clsx(
          'origin-center transition',
          open && 'scale-90 opacity-0'
        )}
      />
      <path
        d="M2 2L12 12M12 2L2 12"
        className={clsx(
          'origin-center transition',
          !open && 'scale-90 opacity-0'
        )}
      />
    </svg>
  )
}

function MobileNavigation() {
  const { data: session } = useSession()
  const router = useRouter()
  const { locale } = router
  const changeLanguage = (e) => {
    const locale = e.target.value
    router.push(router.pathname, router.asPath, { locale })
  }

  return (
    <Popover>
      <Popover.Button
        className="relative z-10 flex h-8 w-8 items-center justify-center [&:not(:focus-visible)]:focus:outline-none"
        aria-label="Toggle Navigation"
      >
        {({ open }) => <MobileNavIcon open={open} />}
      </Popover.Button>
      <Transition.Root>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Overlay className="fixed inset-0 bg-slate-900/50" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            as="div"
            className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-white p-4 text-lg tracking-tight text-slate-900 shadow-xl ring-1 ring-slate-900/5"
          >
            <SelectField
              className=""
              id="mb-language"
              name="language"
              onChange={changeLanguage}
              value={locale}
            >
              <option value="en">English</option>
              <option value="zh">简体中文</option>
            </SelectField>
            <hr className="m-2 border-slate-300/40" />
            {session ? (
              <Button variant="outline" onClick={() => signOut()}>
                <span>{locale === 'en' ? 'Log out' : '退出登录'}</span>
              </Button>
            ) : null}
          </Popover.Panel>
        </Transition.Child>
      </Transition.Root>
    </Popover>
  )
}

export function HeaderDark() {
  const { data: session } = useSession()
  const router = useRouter()
  const { locale } = router
  const changeLanguage = (e) => {
    const locale = e.target.value
    router.push(router.pathname, router.asPath, { locale })
  }

  return (
    <header className="border-b border-white/20 py-4">
      <Container className="lg:max-w-6xl">
        <nav className="relative z-50 flex justify-between">
          <div className="flex items-center md:gap-x-12">
            <Link href="/#" aria-label="Home">
              <LogoDark className="h-16 w-auto" />
            </Link>
          </div>
          <div className="flex items-center gap-x-5 md:gap-x-8">
            <SelectField
              className="hidden md:block"
              id="language"
              name="language"
              dark
              onChange={changeLanguage}
              value={locale}
            >
              <option className="bg-black" value="en">
                English
              </option>
              <option className="bg-black" value="zh">
                简体中文
              </option>
            </SelectField>
            <div className="hidden md:block">
              {session ? (
                <Button
                  variant="flat"
                  color="transparent"
                  onClick={() => signOut()}
                >
                  <span className="text-white">
                    {locale === 'en' ? 'Log out' : '退出登录'}
                  </span>
                </Button>
              ) : null}
            </div>
            <div className="-mr-1 md:hidden">
              <MobileNavigation />
            </div>
          </div>
        </nav>
      </Container>
    </header>
  )
}
