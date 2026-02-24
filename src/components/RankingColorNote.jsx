import { useRouter } from 'next/router'
import { ratingTable } from 'sdconfig'
const customColors = require('../../custom-color')

export function RankingColorNote() {
  const router = useRouter()
  const { locale } = router
  return (
    <div className="mt-2 flex flex-row flex-wrap justify-center p-4">
      {ratingTable.map((rating) => (
        <div key={rating.key} className="my-1 flex flex-row items-center px-2">
          <div
            className="mr-2 h-4 w-4"
            style={{
              backgroundColor: customColors[rating.key][500],
            }}
          />
          <span className="font-semibold">
            {locale === 'en' ? rating.label : rating.label_cn}
          </span>
        </div>
      ))}
    </div>
  )
}
