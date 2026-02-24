import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { Radar } from 'react-chartjs-2'
import { useRouter } from 'next/router'
import { ratingTable } from 'sdconfig'
const customColors = require('../../custom-color')
import { ChevronRightIcon } from '@heroicons/react/24/solid'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
  //   ChartDataLabels
)
// import { ratingTable } from 'sdconfig'

export function SleepQualityCard({ quality }) {
  const router = useRouter()
  const { locale } = router

  const data = {
    labels: quality.map((q) => {
      return locale === 'en' ? q.title.split(' ') : q.title_cn
    }),
    datasets: [
      {
        label: locale === 'en' ? 'Score' : '得分',
        data: quality.map((q) => q.value),
        backgroundColor: 'rgba(73, 120, 188, 0.3)',
        borderColor: '#659AD2',
        pointBackgroundColor: '#659AD2',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#659AD2',
        // clip: 0,
        // fill: {
        //   target: 25,
        //   above: 'rgb(255, 0, 0)', // Area will be red above the origin
        //   below: 'rgb(0, 0, 255)', // And blue below the origin
        // },
      },
    ],
  }
  const options = {
    scales: {
      r: {
        pointLabels: {
          display: true,
          //   centerPointLabels: true,
          font: {
            size: 12,
            weight: 600,
          },
        },
        angleLines: {
          display: false,
        },
        ticks: {
          stepSize: 25,
          //   display: false,
          callback: function (value, index, ticks) {
            return value + '%'
          },
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    plugins: {
      //   datalabels: {
      //     color: '#36A2EB',
      //   },
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || ''
            console.log('label context', context)

            if (label) {
              label += `: ${context.dataset.data[context.dataIndex]}%`
            }
            return label
          },
        },
      },
    },
  }

  return (
    <>
      <Radar data={data} options={options} />
      <div className="p-4 text-sm">
        {locale === 'en'
          ? 'The five factors crucial for optimal sleep quality are Synchronizers, which align the body’s internal clock with the environment; Sleep Anxiety, which affects the ability to fall and stay asleep; Sleep Hygiene, which encompasses practices that promote healthy sleep patterns; Metabolic function, which ensures adequate oxygen flow during rest; and Sleep Rhythm, which refers to the body’s internal sleep-wake cycle.'
          : '优化睡眠质量五个关键因素包括：1. 生物钟同步：调节身体内部的生物钟以与外部环境同步，确保睡眠-觉醒周期与日夜节律相匹配。2. 睡眠卫生：实施一系列促进健康睡眠习惯的措施，如保持睡眠环境的清洁、安静和适宜的温、湿度。3. 代谢功能：维持正常呼吸功能，保证在睡眠期间有充足的氧气供应，避免因呼吸障碍影响睡眠质量。4. 睡眠焦虑管理：通过心理干预和放松技巧减少睡眠焦虑，提高入睡和维持睡眠的能力。5. 睡眠-觉醒周期调节：调整和优化身体内部的睡眠-觉醒周期，以适应个体的生活习惯和工作需求。这些因素共同作用，有助于提高睡眠效率和睡眠质量，对维护整体健康和日常功能至关重要。'}
      </div>
      <div className="p-4">
        {quality.map((q) => (
          <div
            key={q.key}
            className="flex cursor-pointer flex-row items-center justify-between py-4 font-semibold"
            onClick={q.onNavi}
          >
            <div>
              {locale === 'en' ? 'Your ' + q.title : '您的' + q.title_cn}
            </div>
            <div
              className="ml-auto"
              style={{
                color:
                  customColors[
                    ratingTable.find((r) => r.label === q.rating).key
                  ][500],
              }}
            >
              {q.value + '%'}
            </div>
            <ChevronRightIcon
              className="h-4 w-4 flex-shrink-0"
              aria-hidden="true"
            />
          </div>
        ))}
      </div>
    </>
  )
}
