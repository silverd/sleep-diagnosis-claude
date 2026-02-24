const customColors = require('../../custom-color')
import Image from 'next/image'
// import daytimeIcon from '@/images/daytime-bg-icon.svg'
// import sleepIcon from '@/images/sleep-bg-icon.svg'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import clsx from 'clsx'
import { ratingTable, chronoType } from 'sdconfig'
import { Button } from '@/components/Button'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/router'
import { RankingProgress } from '@/components/RankingProgress'
import { CheckListItem } from '@/components/CheckListItem'
import sleepAnxietyExcellent from '@/images/sleep-anxiety-excellent.png'
import sleepAnxietyGood from '@/images/sleep-anxiety-good.png'
import sleepAnxietyFair from '@/images/sleep-anxiety-fair.png'
import sleepAnxietyPoor from '@/images/sleep-anxiety-poor.png'
import sleepAnxietyVerypoor from '@/images/sleep-anxiety-verypoor.png'
import sleepHygieneExcellent from '@/images/sleep-hygiene-excellent.svg'
import sleepHygieneGood from '@/images/sleep-hygiene-good.svg'
import sleepHygieneFair from '@/images/sleep-hygiene-fair.svg'
import sleepHygienePoor from '@/images/sleep-hygiene-poor.svg'
import sleepHygieneVerypoor from '@/images/sleep-hygiene-verypoor.svg'
import breathingFunctionExcellent from '@/images/breathing-function-excellent.png'
import breathingFunctionGood from '@/images/breathing-function-good.png'
import breathingFunctionFair from '@/images/breathing-function-fair.png'
import breathingFunctionPoor from '@/images/breathing-function-poor.png'
import breathingFunctionVerypoor from '@/images/breathing-function-verypoor.png'
import chronoTypeExcellent from '@/images/chronotype-excellent.svg'
import chronoTypeGood from '@/images/chronotype-good.svg'
import chronoTypeFair from '@/images/chronotype-fair.svg'
import chronoTypePoor from '@/images/chronotype-poor.svg'
import chronoTypeVerypoor from '@/images/chronotype-verypoor.svg'
import synchronizersIcon from '@/images/synchronizers.svg'
const iconTable = {
  chronoType: {
    excellent: chronoTypeExcellent,
    good: chronoTypeGood,
    fair: chronoTypeFair,
    poor: chronoTypePoor,
    verypoor: chronoTypeVerypoor,
  },
  sleepHygiene: {
    excellent: sleepHygieneExcellent,
    good: sleepHygieneGood,
    fair: sleepHygieneFair,
    poor: sleepHygienePoor,
    verypoor: sleepHygieneVerypoor,
  },
  sleepAnxiety: {
    excellent: sleepAnxietyExcellent,
    good: sleepAnxietyGood,
    fair: sleepAnxietyFair,
    poor: sleepAnxietyPoor,
    verypoor: sleepAnxietyVerypoor,
  },
  breathingFunction: {
    excellent: breathingFunctionExcellent,
    good: breathingFunctionGood,
    fair: breathingFunctionFair,
    poor: breathingFunctionPoor,
    verypoor: breathingFunctionVerypoor,
  },
}

const bmiChart = [
  {
    classification: 'Underweight',
    classificationCn: '体重过轻',
    bgClass: 'bg-fair-500',
    borderLeftClass: 'border-b-fair-500 border-t-fair-500',
    borderRightClass: 'border-l-fair-500 ',
    range: '<18.5',
  },
  {
    classification: 'Normal',
    classificationCn: '正常范围',
    bgClass: 'bg-excellent-500',
    borderLeftClass: 'border-b-excellent-500 border-t-excellent-500',
    borderRightClass: 'border-l-excellent-500 ',
    range: '18.5-25',
  },
  {
    classification: 'Overweight',
    classificationCn: '超重',
    borderLeftClass: 'border-b-poor-500 border-t-poor-500',
    borderRightClass: 'border-l-poor-500 ',
    bgClass: 'bg-poor-500',
    range: '25-30',
  },
  {
    classification: 'Obese',
    classificationCn: '肥胖',
    bgClass: 'bg-verypoor-500',
    borderLeftClass: 'border-b-verypoor-500 border-t-verypoor-500',
    borderRightClass: 'border-l-verypoor-500 ',
    range: '>30',
  },
]

const sleepAnxietyLabelMapping = {
  excellent: {
    zh: '完全不',
    en: 'Not At All',
  },
  good: {
    zh: '有一点',
    en: 'Just a Little',
  },
  fair: {
    zh: '一般',
    en: 'Somewhat',
  },
  poor: {
    zh: '非常焦虑',
    en: 'Quite Anxious',
  },
  verypoor: {
    zh: '极度焦虑',
    en: 'Very Much Anxious',
  },
}

export function SleepQualityDetails({ data }) {
  const router = useRouter()
  const { locale } = router
  const { key: ratingKey, textColor } = ratingTable.find(
    (item) => item.label === data.rating
  )
  const chronoBg = data.chronotype
    ? chronoType.find((t) => t.type === data.chronotype)?.bg
    : 'excellent'

  return (
    <div className="mt-2 max-w-4xl bg-white">
      <div className="flex flex-row items-center p-4">
        <div className="h-6 w-2 rounded-full bg-black"></div>
        <div className="ml-4 text-xl font-semibold">
          {locale === 'en' ? data.title : data.title_cn}
        </div>
      </div>
      <div className="flex flex-row items-center p-4">
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
        <div className="ml-4 font-semibold">
          <div className="mt-2 text-gray-900">
            {locale === 'en' ? 'Your ' + data.title : '您的' + data.title_cn}
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
      {data.key &&
      (data.key === 'sleepAnxiety' ||
        data.key === 'sleepHygiene' ||
        data.key === 'breathingFunction') ? (
        <div className="flex flex-col items-center">
          <Image
            src={iconTable[data.key][ratingKey]}
            alt="quality-logo"
            unoptimized
          />
          <div className="mt-8 flex flex-wrap justify-center px-8">
            {ratingTable.map((r) => {
              return (
                <div key={r.key} className="mr-4 flex items-center">
                  <div
                    className="h-4 w-4"
                    style={{
                      backgroundColor: customColors[r.key][500],
                    }}
                  ></div>
                  <div className="ml-2 font-light">
                    {data.key === 'sleepAnxiety'
                      ? sleepAnxietyLabelMapping[r.key][locale]
                      : locale === 'en'
                      ? r.label
                      : r.label_cn}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : data.key &&
        (data.key === 'sleepRhythm' || data.key === 'synchronizers') ? (
        <>
          {data.chronotype ? (
            <div className="my-4 px-8 font-semibold">
              {locale === 'en' ? 'Your Chronotype' : '生物钟类型'}
            </div>
          ) : null}
          <div className="px-8">
            <div className="relative flex h-60 w-full flex-col items-center justify-center">
              <div className="absolute left-0 h-full w-1/2 bg-[#F9FCFE]"></div>
              <div className="absolute right-0 h-full w-1/2 bg-[#FFFAED]"></div>
              {data.chronotype
                ? chronoType.map((ct) => {
                    return (
                      <div
                        key={ct.type + '-label'}
                        className="absolute hidden font-semibold lg:block"
                        style={ct.position}
                      >
                        {locale === 'en'
                          ? ct.type + (ct.bg === 'fair' ? '' : ' Type')
                          : ct.type_cn}
                      </div>
                    )
                  })
                : null}
              <Image
                src={
                  data.key === 'sleepRhythm'
                    ? iconTable.chronoType[chronoBg]
                    : synchronizersIcon
                }
                alt={
                  data.key === 'sleepRhythm'
                    ? 'chrono-type-icon'
                    : 'synchronizers-icon'
                }
                unoptimized
                className="z-10"
              />
            </div>
            {data.chronotype ? (
              <div className="flex flex-col items-center lg:hidden">
                {chronoType.map((ct) => {
                  return (
                    <div
                      key={ct.type}
                      className="mt-4 flex w-1/2 flex-nowrap items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div
                          className="h-4 w-4"
                          style={{
                            backgroundColor: customColors[ct.bg][500],
                          }}
                        ></div>
                        <div className="ml-4 font-light">{ct.time}</div>
                      </div>
                      <div className="ml-4 font-semibold">
                        {locale === 'en'
                          ? ct.type + (ct.bg === 'fair' ? '' : ' Type')
                          : ct.type_cn}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : null}
          </div>
        </>
      ) : null}
      <p className="p-8 text-sm text-gray-600">
        {locale === 'en' ? data.desc : data.desc_cn}
      </p>
      {data.bmi ? (
        <div className="px-8">
          <div className="font-bold">
            {locale === 'en'
              ? 'Your Body Mass Index: ' + data.bmi
              : '您的体质指数：' + data.bmi}
          </div>
          <div className="my-10 flex flex-wrap">
            {bmiChart.map((item) => {
              return (
                <div
                  className={clsx(
                    'relative flex h-20 items-center justify-center',
                    item.bgClass,
                    item.classification === 'Underweight'
                      ? 'w-40'
                      : 'ml-10 w-32',
                    item.classification === data.bmiClassification
                      ? 'z-10 scale-[1.20]'
                      : 'text-white'
                  )}
                  key={item.classification}
                >
                  <div className="text-center text-sm font-semibold">
                    <div>{item.range}</div>
                    <div className="uppercase">
                      {locale === 'en'
                        ? item.classification
                        : item.classificationCn}
                    </div>
                  </div>
                  {item.classification !== 'Underweight' ? (
                    <div
                      className={clsx(
                        'absolute bottom-0 h-0 w-0 border-b-[40px] border-l-[40px] border-t-[40px] border-solid border-l-transparent',
                        item.borderLeftClass,
                        item.classification === data.bmiClassification
                          ? '-left-[39px]'
                          : '-left-10'
                      )}
                    ></div>
                  ) : null}
                  <div
                    className={clsx(
                      'absolute bottom-0 h-0 w-0 border-b-[40px] border-l-[40px] border-t-[40px] border-solid border-b-transparent border-t-transparent',
                      item.borderRightClass,
                      item.classification === data.bmiClassification
                        ? '-right-[39px]'
                        : '-right-10'
                    )}
                  ></div>
                </div>
              )
            })}
          </div>
          <div className="my-4 text-sm text-gray-600">
            {locale === 'en'
              ? 'People who are overweight are more likely to report insomnia or trouble sleeping than those who are not. It is also associated with increased daytime sleepiness and fatigue, even in people who sleep through the night undisturbed.'
              : '体重超重的人群相较于正常体重的人群，更倾向于报告失眠或其他睡眠障碍。此外，即使他们夜间睡眠未受打扰，也更可能出现日间嗜睡和感到疲劳的情况。'}
          </div>
        </div>
      ) : null}
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
