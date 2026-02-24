const customColors = require('../../custom-color')
import Image from 'next/image'
import daytimeIcon from '@/images/daytime-bg-icon.svg'
import sleepIcon from '@/images/sleep-bg-icon.svg'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import clsx from 'clsx'
import { ratingTable } from 'sdconfig'
import { Button } from '@/components/Button'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/router'
import { RankingProgress } from '@/components/RankingProgress'
import { CheckListItem } from '@/components/CheckListItem'

export function SleepDataDetails({ data }) {
  const router = useRouter()
  const { locale } = router
  const { key: ratingKey, textColor } = ratingTable.find(
    (item) => item.label === data.rating
  )
  return (
    <div className="mt-2 max-w-4xl bg-white">
      <div
        className={clsx(
          'bg-gradient-to-b to-white/30 p-4',
          data.key === 'nightSleepQuality'
            ? 'from-excellent-200/20'
            : 'from-fair-200/40'
        )}
      >
        <div
          className="relative flex flex-row items-center p-4"
          onClick={data.onNavi}
        >
          <Image
            className={clsx(
              'absolute top-0',
              data.key === 'nightSleepQuality' ? 'right-6' : 'right-0'
            )}
            src={data.key === 'nightSleepQuality' ? sleepIcon : daytimeIcon}
            alt="profile-bg-logo"
            unoptimized
          />
          <div className="h-16 w-16">
            <CircularProgressbar
              value={data.value}
              className="font-bold"
              text={`${data.value}%`}
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
              {locale === 'en' ? data.title : data.title_cn}
            </div>
            <div className={textColor}>
              {locale === 'en' ? data.rating : data.rating_cn}
            </div>
          </div>
          <Button
            variant="flat"
            color="transparent"
            onClick={data.onBack}
            className="ml-auto"
          >
            <div className="flex flex-row items-center text-gray-600">
              <ChevronLeftIcon
                className="h-4 w-4 flex-shrink-0"
                aria-hidden="true"
              />
              <span>{locale === 'en' ? 'Back' : '返回'}</span>
            </div>
          </Button>
        </div>
      </div>
      <p className="p-8 text-sm">
        {locale === 'en' ? data.desc : data.desc_cn}
      </p>
      <div className="mt-2 px-4 pb-8">
        {data.details.map((item) => (
          <RankingProgress key={item.title} item={item} />
        ))}
        {data.checkList.map((ci) => (
          <CheckListItem ci={ci} key={ci.key} />
        ))}
      </div>
    </div>
  )
}
