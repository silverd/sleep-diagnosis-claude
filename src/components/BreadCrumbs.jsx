import { HomeIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/router'
import Link from 'next/link'

const pageName = {
  diagnosis: {
    en: 'Testings',
    zh: '测试问券',
  },
  report: {
    en: 'Reports',
    zh: '测试报告',
  },
  result: {
    en: 'Results',
    zh: '测试结果',
  },
}

export function BreadCrumbs() {
  const router = useRouter()
  const { locale, pathname } = router
  const pages = [
    {
      name: pageName[pathname.slice(1)][locale],
      href: pathname,
      current: true,
    },
  ]
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-2">
        <li key="home">
          <div className="flex items-center text-gray-500 hover:text-gray-700">
            <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
            <Link
              href="/"
              className="ml-2 text-sm font-medium"
              aria-current={false}
            >
              {locale === 'en' ? 'Home' : '首页'}
            </Link>
          </div>
        </li>
        {pages.map((page) => (
          <li key={page.name}>
            <div className="flex items-center">
              <svg
                className="h-5 w-5 flex-shrink-0 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              <Link
                href={page.href}
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
                aria-current={page.current ? 'page' : undefined}
              >
                {page.name}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}
