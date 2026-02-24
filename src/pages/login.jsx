import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { AuthLayout } from '@/components/AuthLayout'
import { Button } from '@/components/Button'
import { TextField } from '@/components/Fields'
import { Logo } from '@/components/Logo'
import { WaitingSpinner } from '@/components/WaitingSpinner'
import { LoadingDialog } from '@/components/LoadingDialog'
import {
  // useSession,
  signIn,
  useSession,
} from 'next-auth/react'
import en from '../locales/en'
import zh from '../locales/zh'

export default function Login() {
  const { status } = useSession()
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const { locale } = router
  const t = locale === 'en' ? en : zh
  useEffect(() => {
    if (status === 'authenticated') router.push('/diagnosis')
  }, [status])
  const handleSubmit = async (event) => {
    event.preventDefault()
    // console.log('login', email)
    setSubmitting(true)
    try {
      await signIn('email', {
        email,
        callbackUrl: locale === 'en' ? '/' : '/zh',
      })
      setSubmitting(false)
    } catch (error) {
      setSubmitting(false)
      console.log('login error', error)
    }
  }
  return (
    <>
      <Head>
        <title>Sign In - Engineering Sleep</title>
      </Head>
      <AuthLayout>
        {status === 'loading' ? (
          <WaitingSpinner />
        ) : (
          <>
            <LoadingDialog open={submitting} />
            <div className="flex flex-col">
              <Link href="/" aria-label="Home">
                <Logo className="h-16 w-auto" />
              </Link>
              <div className="mt-20">
                <h2 className="text-lg font-semibold text-gray-900">
                  {t.signInHeader}
                </h2>
                <p className="mt-2 text-sm text-gray-700">{t.signInTxt}</p>
              </div>
            </div>
            <form
              onSubmit={handleSubmit}
              className="mt-10 grid grid-cols-1 gap-y-8"
            >
              {/* <input name="csrfToken" type="hidden" defaultValue={csrfToken} /> */}
              <TextField
                label={t.email}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {/* <TextField
            label="Password"
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          /> */}
              <div>
                <Button
                  type="submit"
                  variant="solid"
                  color="blue"
                  className="w-full"
                >
                  <span>
                    {t.signIn} <span aria-hidden="true">&rarr;</span>
                  </span>
                </Button>
              </div>
            </form>
          </>
        )}
      </AuthLayout>
    </>
  )
}

// export async function getServerSideProps(context) {
//   const session = await getSession(context)
//   if (session) {
//     console.log('already logged in', session)
//     return {
//       redirect: {
//         destination: '/diagnosis',
//         permanent: false,
//       },
//     }
//   } else {
//     return {
//       props: {},
//     }
//   }
// }
