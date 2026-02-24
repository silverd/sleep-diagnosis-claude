import ProgressBar from '@ramonak/react-progress-bar'
import { useRouter } from 'next/router'
import { ratingTable } from 'sdconfig'
const customColors = require('../../custom-color')
import Image from 'next/image'
import mentalFatigueExcellent from '@/images/mental-fatigue-excellent.png'
import mentalFatigueGood from '@/images/mental-fatigue-good.png'
import mentalFatigueFair from '@/images/mental-fatigue-fair.png'
import mentalFatiguePoor from '@/images/mental-fatigue-poor.png'
import mentalFatigueVerypoor from '@/images/mental-fatigue-verypoor.png'
import clsx from 'clsx'
import { RankingColorNote } from '@/components/RankingColorNote'
const iconTable = {
  // physicalFatigue: {
  //   excellent: sleepQualityExcellent,
  //   good: sleepQualityGood,
  //   fair: sleepQualityFair,
  //   poor: sleepQualityPoor,
  //   verypoor: sleepQualityVerypoor,
  // },
  mentalFatigue: {
    excellent: mentalFatigueExcellent,
    good: mentalFatigueGood,
    fair: mentalFatigueFair,
    poor: mentalFatiguePoor,
    verypoor: mentalFatigueVerypoor,
  },
}

export function RankingProgress({ item }) {
  const router = useRouter()
  const { locale } = router
  const { key: ratingKey, textColor } = ratingTable.find(
    (r) => r.label === item.rating
  )
  return (
    <div className="p-4">
      <div className="flex flex-row items-center justify-between">
        <div>
          <div className="font-semibold text-gray-900">
            {locale === 'en' ? item.title : item.title_cn}
          </div>
          <div className="text-sm text-gray-600">
            {locale === 'en' ? item.desc : item.desc_cn}
          </div>
        </div>
        <div
          className="ml-6 break-keep font-semibold"
          style={{
            color: customColors[ratingKey][500],
          }}
        >
          {locale === 'en' ? item.rating : item.rating_cn}
        </div>
      </div>
      {item.title === 'Physical Fatigue Scale' ? (
        <>
          <div className="flex w-full items-center justify-center p-8">
            <div className="relative h-[100px] w-[216px] rounded-2xl border border-black p-2">
              <div className="absolute inset-0 flex h-full w-full items-center justify-center">
                <div
                  className={clsx('text-center text-2xl font-black', textColor)}
                  style={{
                    WebkitTextStrokeColor: 'white',
                    WebkitTextStrokeWidth: '1px',
                  }}
                >
                  {item.value + '%'}
                </div>
              </div>
              <div
                className={clsx(
                  `flex h-full items-center justify-center rounded-l-2xl`,
                  item.value === 100 ? 'rounded-r-2xl' : ''
                )}
                style={{
                  backgroundColor: customColors[ratingKey][500],
                  width: 2 * item.value + 'px',
                }}
              ></div>
            </div>
            <div
              className="h-[48px] w-[6px] rounded-md border border-l-0 border-black"
              style={{
                boxShadow: `-2px 0px 10px ${customColors[ratingKey][500]}`,
              }}
            ></div>
          </div>
          <RankingColorNote />
        </>
      ) : item.title === 'Mental Fatigue Scale' ? (
        <>
          <div className="flex w-full justify-center p-8">
            {item.key ? (
              <div className="flex">
                <div className={clsx('p-8 text-4xl font-extrabold', textColor)}>
                  {item.value + '%'}
                </div>
                <Image
                  src={iconTable[item.key][ratingKey]}
                  alt="profile-logo"
                  width={145}
                  height={157}
                />
              </div>
            ) : null}
          </div>
          <RankingColorNote />
        </>
      ) : (
        <div className="mt-2 flex flex-row items-center justify-between">
          <ProgressBar
            className="w-full"
            isLabelVisible={false}
            completed={item.value}
            bgColor={
              customColors[
                ratingTable.find((r) => r.label === item.rating).key
              ][500]
            }
            height="12px"
          />
          <div
            className="ml-16 font-semibold"
            style={{
              color:
                customColors[
                  ratingTable.find((r) => r.label === item.rating).key
                ][500],
            }}
          >
            {item.value + '%'}
          </div>
        </div>
      )}
    </div>
  )
}
