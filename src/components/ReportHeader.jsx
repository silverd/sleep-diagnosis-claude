import clsx from 'clsx'
import { ClockIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'
// import { useState, useEffect } from 'react'

export function ReportHeader({ header }) {
  const today = new Date()
  const router = useRouter()
  const { locale } = router
  return (
    <div className="flex flex-row">
      <div className="my-auto pr-3">
        <h3
          className={clsx(
            'text-xl font-semibold leading-6',
            header.title === 'Suspected Sleep Disorder'
              ? 'text-gray-900'
              : header.scoreColor
          )}
        >
          {locale === 'en' ? header.title : header.title_cn}
        </h3>
        {/* <p className="mt-1 text-sm leading-6 text-gray-800">
          {locale === 'en' ? header.desc : header.desc_cn}
        </p> */}
        <div className="mt-4 flex flex-row items-center py-2 text-sm text-gray-400">
          <ClockIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
          <span suppressHydrationWarning className="ml-a mr-4">
            {(today.getHours() > 9
              ? today.getHours()
              : '0' + today.getHours()) +
              ':' +
              (today.getMinutes() > 9
                ? today.getMinutes()
                : '0' + today.getMinutes())}
          </span>
          <CalendarIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
          <span suppressHydrationWarning className="ml-1">
            {today.toLocaleDateString('en-CA')}
          </span>
        </div>
      </div>
      {header.title === 'Suspected Sleep Disorder' ? (
        <div className="flex w-48 flex-col items-center gap-y-3 border-l border-gray-900/10 px-3">
          <div
            className={clsx(
              'flex h-20 w-20 flex-row items-center justify-center rounded-full text-3xl font-semibold',
              header.scoreBg,
              header.scoreColor
            )}
          >
            {header.score}
          </div>
          <div className={clsx('text-center text-sm', header.scoreColor)}>
            {locale === 'en' ? header.scoreNote : header.scoreNote_cn}
          </div>
        </div>
      ) : null}
    </div>
  )
}
