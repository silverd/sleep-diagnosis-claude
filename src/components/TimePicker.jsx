export function TimePicker({ value, onChange }) {
  // Normalize old "--:--" dropdown format to empty string for native input
  const normalizedValue = value && !value.includes('--') ? value : ''

  return (
    <input
      type="time"
      value={normalizedValue}
      onChange={(e) => onChange(e.target.value)}
      className="block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 focus:border-bluebg-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-bluebg-500 sm:text-sm"
    />
  )
}
