import Head from 'next/head'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { AuthLayout } from '@/components/AuthLayout'

export default function verifyRequest() {
  return (
    <>
      <Head>
        <title>Verify link sent - Engineering Sleep</title>
      </Head>
      <AuthLayout>
        <div className="flex flex-col">
          <Link href="/" aria-label="Home">
            <Logo className="h-16 w-auto" />
          </Link>
          <div className="mt-20">
            <h2 className="text-lg font-semibold text-gray-900">
              Verify link sent / 验证链接已发送
            </h2>
            <p className="mt-2 text-sm text-gray-700">
              Login link has been sent to your email. Please check your email
              and click the login link.
            </p>
            <p className="mt-2 text-sm text-gray-700">
              验证链接已经发送至您的电子邮箱，请登录您的邮箱查收后点击登录链接来登录。
            </p>
          </div>
        </div>
      </AuthLayout>
    </>
  )
}
