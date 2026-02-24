import clsx from 'clsx'

export function Container({ className, ...props }) {
  return (
    <div
      className={clsx(
        'mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-9xl lg:px-8',
        className
      )}
      {...props}
    />
  )
}
