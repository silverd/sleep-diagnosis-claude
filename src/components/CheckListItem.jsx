import { useRouter } from 'next/router'
import Image from 'next/image'
import check from '@/images/check.svg'
import cross from '@/images/cross.svg'

export function CheckListItem({ ci }) {
  const router = useRouter()
  const { locale } = router
  return (
    <div className="mt-4 px-4" key={ci.key}>
      <div className="flex items-center justify-between">
        <div className="font-bold">
          {locale === 'en' ? ci.title : ci.title_cn}
        </div>
        <Image src={ci.checked ? check : cross} alt="check-mark" unoptimized />
      </div>
      {ci.desc ? (
        <div className="mt-2 text-sm text-gray-600">
          {locale === 'en' ? ci.desc : ci.desc_cn}
        </div>
      ) : null}
    </div>
  )
}
