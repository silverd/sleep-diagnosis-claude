import clsx from 'clsx'
import Datepicker from 'react-tailwindcss-datepicker'
import { TimePicker } from '@/components/TimePicker'

const inputClass =
  'block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-bluebg-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-bluebg-500 sm:text-sm'

const numberInputClass =
  'block w-full rounded-md border border-gray-200 bg-gray-50 py-2 pr-14 pl-3 text-gray-900 placeholder-gray-400 focus:border-bluebg-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-bluebg-500 sm:text-sm'

const numberInputErrorClass =
  'block w-full rounded-md border border-red-300 bg-gray-50 py-2 pr-14 pl-3 text-red-900 placeholder-red-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 sm:text-sm'

function Label({ id, children }) {
  return (
    <label htmlFor={id} className="mb-2 block text-sm font-medium text-gray-800">
      {children}
    </label>
  )
}

export function TextField({ id, label, type = 'text', className = '', ...props }) {
  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <input id={id} type={type} {...props} className={inputClass} />
    </div>
  )
}

export function NumberField({
  id,
  label,
  value,
  type = 'number',
  className = '',
  suffix = '',
  onNumberInput,
  error = false,
  errorMsg = '',
  ...props
}) {
  return (
    <div className={clsx('w-full', className)}>
      {label && <Label id={id}>{label}</Label>}
      <div className="relative rounded-md shadow-sm">
        <input
          id={id}
          type={type}
          value={value}
          {...props}
          className={error ? numberInputErrorClass : numberInputClass}
          onChange={onNumberInput}
        />
        {suffix && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-500">
              {suffix}
            </span>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-600">{errorMsg}</p>
      )}
    </div>
  )
}

export function SelectField({ id, label, dark = false, className = '', ...props }) {
  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <select id={id} {...props} className={clsx(inputClass, 'pr-8 cursor-pointer')} />
    </div>
  )
}

export function RadioField({ id, label, choices, selected, onSelect, className = '' }) {
  const updateRadio = (e) => {
    onSelect(e.target.value)
  }
  return (
    <div className={className}>
      {label && (
        <p className="mb-3 text-sm font-medium text-gray-800">{label}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {choices.map((choice) => {
          const isChecked = selected && choice.id.slice(-3) === selected.slice(-3)
          return (
            <label
              key={choice.id}
              className={clsx(
                'flex cursor-pointer items-center rounded-lg border px-4 py-2.5 text-sm font-medium transition-all',
                isChecked
                  ? 'border-bluebg-500 bg-bluebg-50 text-bluebg-700 ring-1 ring-bluebg-500'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              )}
            >
              <input
                id={choice.id}
                name={id}
                value={choice.id}
                onChange={updateRadio}
                type="radio"
                checked={!!isChecked}
                className="sr-only"
              />
              {choice.title}
            </label>
          )
        })}
      </div>
    </div>
  )
}

export function DateField({ id, label, locale, value, handleValueChange, className = '' }) {
  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <p className="mb-2 text-sm font-medium text-gray-800">{label}</p>
      )}
      <Datepicker
        i18n={locale}
        useRange={false}
        asSingle={true}
        value={value}
        onChange={handleValueChange}
      />
    </div>
  )
}

export function TimeField({ id, label, value, handleValueChange, className = '' }) {
  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <p className="mb-2 text-sm font-medium text-gray-800">{label}</p>
      )}
      <TimePicker value={value} onChange={handleValueChange} />
    </div>
  )
}
