import { Oval } from 'react-loader-spinner'

export function WaitingSpinner() {
  return (
    <div className="my-auto flex h-full w-full items-center justify-center">
      <Oval color="#4F46E5" secondaryColor="EEF2FF" height={80} width={80} />
    </div>
  )
}
