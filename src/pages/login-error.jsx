import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { AuthLayout } from '@/components/AuthLayout'
import { Button } from '@/components/Button'

const errors = {
  Signin: 'Try signing with a different account.',
  OAuthSignin: 'Try signing with a different account.',
  OAuthCallback: 'Try signing with a different account.',
  OAuthCreateAccount: 'Try signing with a different account.',
  EmailCreateAccount: 'Try signing with a different account.',
  Callback: 'Try signing with a different account.',
  OAuthAccountNotLinked:
    'To confirm your identity, sign in with the same account you used originally.',
  EmailSignin: 'Check your email address.',
  CredentialsSignin:
    'Sign in failed. Check the details you provided are correct.',
  Verification:
    'The sign in link is no longer valid. It may have been used already or it may have expired.',
  default: 'Sign in was not successful, please try again.',
}
const SignInError = ({ error }) => {
  const errorMessage = error && (errors[error] ?? errors.default)
  return <p className="mt-2 text-sm text-gray-700">{errorMessage}</p>
}
export default function LoginError() {
  const { error } = useRouter().query
  //   console.log('login error', useRouter().query)
  return (
    <>
      <Head>
        <title>Login error - Engineering Sleep</title>
      </Head>
      <AuthLayout>
        <div className="flex flex-col">
          <Link href="/" aria-label="Home">
            <Logo className="h-16 w-auto" />
          </Link>
          <div className="mt-20">
            <h2 className="text-lg font-semibold text-gray-900">
              Unable to sign in
            </h2>
            {error && <SignInError error={error} />}
          </div>
          <Button className="mt-10" href="/login" color="blue">
            <span>Try again</span>
          </Button>
        </div>
      </AuthLayout>
    </>
  )
}

// export async function getServerSideProps(context) {
//   return { props: { providers: await getProviders() } }
// }
