const customColors = require('../../custom-color')
import Image from 'next/image'
import daytimeEnergyExcellent from '@/images/daytime-energy-excellent.svg'
import daytimeEnergyGood from '@/images/daytime-energy-good.svg'
import daytimeEnergyFair from '@/images/daytime-energy-fair.svg'
import daytimeEnergyPoor from '@/images/daytime-energy-poor.svg'
import daytimeEnergyVerypoor from '@/images/daytime-energy-verypoor.svg'
import sleepQualityExcellent from '@/images/sleep-quality-excellent.svg'
import sleepQualityGood from '@/images/sleep-quality-good.svg'
import sleepQualityFair from '@/images/sleep-quality-fair.svg'
import sleepQualityPoor from '@/images/sleep-quality-poor.svg'
import sleepQualityVerypoor from '@/images/sleep-quality-verypoor.svg'
import daytimeIcon from '@/images/daytime-bg-icon.svg'
import sleepIcon from '@/images/sleep-bg-icon.svg'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import clsx from 'clsx'
import { ratingTable } from 'sdconfig'
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/router'
import { RankingColorNote } from '@/components/RankingColorNote'

const iconTable = {
  nightSleepQuality: {
    excellent: sleepQualityExcellent,
    good: sleepQualityGood,
    fair: sleepQualityFair,
    poor: sleepQualityPoor,
    verypoor: sleepQualityVerypoor,
  },
  daytimeEnergy: {
    excellent: daytimeEnergyExcellent,
    good: daytimeEnergyGood,
    fair: daytimeEnergyFair,
    poor: daytimeEnergyPoor,
    verypoor: daytimeEnergyVerypoor,
  },
}
export function SleepProfileCard({ profile }) {
  const router = useRouter()
  const { locale } = router
  const { key: ratingKey, textColor } = ratingTable.find(
    (item) => item.label === profile.rating
  )
  return (
    <div className="mt-2">
      <div
        className={clsx(
          'relative flex cursor-pointer flex-row items-center bg-gradient-to-b to-white/30 p-4',
          profile.key === 'nightSleepQuality'
            ? 'from-excellent-200/20'
            : 'from-fair-200/40'
        )}
        onClick={profile.onNavi}
      >
        <Image
          className={clsx(
            'absolute top-0',
            profile.key === 'nightSleepQuality' ? 'right-6' : 'right-0'
          )}
          src={profile.key === 'nightSleepQuality' ? sleepIcon : daytimeIcon}
          alt="profile-bg-logo"
          unoptimized
        />
        <div className="h-16 w-16">
          <CircularProgressbar
            value={profile.value}
            className="font-bold"
            text={`${profile.value}%`}
            strokeWidth={12}
            styles={buildStyles({
              // Rotation of path and trail, in number of turns (0-1)
              // rotation: 0.25,

              // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
              // strokeLinecap: 'butt',

              // Text size
              textSize: '24px',

              // How long animation takes to go from one percentage to another, in seconds
              // pathTransitionDuration: 0.5,

              // Can specify path transition in more detail, or remove it entirely
              // pathTransition: 'none',

              // Colors
              pathColor: customColors[ratingKey][500],
              textColor: customColors[ratingKey][500],
              trailColor: customColors[ratingKey][50],
              // backgroundColor: '#3e98c7',
            })}
            // color={customColors[ratingKey][500]}
            // bgcolor={customColors[ratingKey][50]}
          />
        </div>
        <div className="ml-4 text-xl font-semibold">
          <div className="mt-2 text-gray-900">
            {locale === 'en' ? profile.title : profile.title_cn}
          </div>
          <div className={textColor}>
            {locale === 'en' ? profile.rating : profile.rating_cn}
          </div>
        </div>
        <ChevronRightIcon
          className="ml-auto h-4 w-4 flex-shrink-0"
          aria-hidden="true"
        />
      </div>
      <div className="mt-8 flex flex-row items-center justify-center">
        <Image
          src={iconTable[profile.key][ratingKey]}
          alt="profile-logo"
          unoptimized
        />
      </div>
      <RankingColorNote />
    </div>
  )
}
