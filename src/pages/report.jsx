import { useState, useEffect } from 'react'
import Head from 'next/head'
import { AppLayout } from '@/components/AppLayout'
import { ReportHeader } from '@/components/ReportHeader'
import clsx from 'clsx'
import { SleepProfileCard } from '@/components/SleepProfileCard'
import { SleepQualityCard } from '@/components/SleepQualityCard'
import { EnvelopeIcon } from '@heroicons/react/20/solid'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
// import { Button } from '@/components/Button'
import { SleepDataDetails } from '@/components/SleepDataDetails'
import { SleepQualityDetails } from '@/components/SleepQualityDetails'
import { WaitingSpinner } from '@/components/WaitingSpinner'
// import { LoadingDialog } from '@/components/LoadingDialog'
// import { List } from '@/components/List'
import { ratingTable } from 'sdconfig'

export default function Report() {
  const { data: session, status } = useSession()
  const [userEmail, setUserEmail] = useState('')
  const [currentContent, setCurrentContent] = useState('dashBoard')
  const [loadingReportData, setLoadingReportData] = useState(true)
  const [reportData, setReportData] = useState({})
  const router = useRouter()
  const { locale } = router

  function generateReport(result) {
    const diagnosisList = result.Diagnosis.filter((d) => d.value)
    const sleepQuality = result.PSQI.find((p) => p.id === 'GlobalPSQIScore')
    const daytimeFunction = result.PSQI.find(
      (p) => p.id === 'DaytimeDysfunction'
    )
    const sleepAnxiety = result.SleepEnvironmentHygieneStress.find(
      (p) => p.id === 'SleepStress'
    )
    const sleepHygiene = result.SleepEnvironmentHygieneStress.find(
      (p) => p.id === 'SleepHygiene'
    )

    const breathingFunction = result.BreathingFunction.find(
      (p) => p.id === 'BreathingFunction'
    )
    const circadianRhythm = result.CircadianRhythm.find(
      (p) => p.id === 'CircadianTotalScore'
    )
    const daytimeEnergy = result.DaytimeEnergy.find(
      (p) => p.id === 'DaytimeEnergy'
    )
    const SubjectiveSleepQuality = result.PSQI.find(
      (p) => p.id === 'SubjectiveSleepQuality'
    )
    const SleepLatency = result.PSQI.find((p) => p.id === 'SleepLatency')
    const SleepDuration = result.PSQI.find((p) => p.id === 'SleepDuration')
    const SleepEfficiency = result.PSQI.find((p) => p.id === 'SleepEfficiency')
    const SleepDisturbances = result.PSQI.find(
      (p) => p.id === 'SleepDisturbances'
    )
    const UseofSleepMedication = result.PSQI.find(
      (p) => p.id === 'UseofSleepMedication'
    )
    const PhysicalFatigue = result.FAS.find((p) => p.id === 'PhysicalFatigue')
    const MentalFatigue = result.FAS.find((p) => p.id === 'MentalFatigue')
    const Sleepiness = result.ESS.find((p) => p.id === 'GlobalESSScore')
    const CircadianAlignment = result.CircadianRhythm.find(
      (p) => p.id === 'CircadianAlignment'
    )
    const SleepWakeRegularity = result.CircadianRhythm.find(
      (p) => p.id === 'SleepWakeRegularity'
    )
    const SocialJetLag = result.CircadianRhythm.find(
      (p) => p.id === 'SocialJetLag'
    )
    const SleepHabits = result.SleepEnvironmentHygieneStress.find(
      (p) => p.id === 'SleepHabits'
    )
    const SleepEnvironment = result.SleepEnvironmentHygieneStress.find(
      (p) => p.id === 'SleepEnvironment'
    )
    const HorneAssessment = result.HorneAssessment.find(
      (p) => p.id === 'HorneAssessment'
    )
    const IrregularWorkingHours = result.CircadianRhythm.find(
      (p) => p.id === 'IrregularWorkingHours'
    )
    const RegularSnoring = result.BreathingFunction.find(
      (p) => p.id === 'RegularSnoring'
    )
    const StopBreathingGasping = result.BreathingFunction.find(
      (p) => p.id === 'StopBreathingGasping'
    )
    const DryMouthOrSoreThroat = result.BreathingFunction.find(
      (p) => p.id === 'DryMouthOrSoreThroat'
    )
    const HighBloodPressure = result.BreathingFunction.find(
      (p) => p.id === 'HighBloodPressure'
    )
    const Synchronizers = result.Synchronizers.find(
      (p) => p.id === 'SynchronizersTotal'
    )
    const MelatoninFactors = result.Synchronizers.find(
      (p) => p.id === 'MelatoninFactors'
    )
    const MorningSynchronizer = result.Synchronizers.find(
      (p) => p.id === 'MorningSynchronizer'
    )
    return {
      reportHeaders: [
        {
          title: 'Suspected Sleep Disorder',
          title_cn: '可能存在的睡眠障碍',
          desc: "You've been diagnosed with suspected sleep disorders",
          desc_cn: '您被诊断出患有 疑似睡眠障碍',
          score: diagnosisList.length,
          scoreNote: 'Suspected Sleep Disorder',
          scoreNote_cn: '可能存在的睡眠障碍',
          scoreBg: 'bg-poor-50',
          scoreColor: 'text-poor-500',
        },
        {
          title: 'Global Sleep Profile',
          title_cn: '睡眠整体概况',
          desc: "You've been diagnosed with suspected sleep disorders",
          desc_cn: '您被诊断出患有疑似睡眠障碍',
          score: 2,
          scoreNote: 'Global Sleep Profile',
          scoreNote_cn: '睡眠整体概况',
          scoreBg: 'bg-excellent-50',
          scoreColor: 'text-excellent-500',
        },
        {
          title: 'Sleep Quality Factors',
          title_cn: '影响睡眠质量的五大因素',
          desc: "You've been diagnosed with suspected sleep disorders",
          desc_cn: '您被诊断出患有疑似睡眠障碍',
          score: 5,
          scoreNote: 'Sleep Quality Factors',
          scoreNote_cn: '睡眠质量',
          scoreBg: 'bg-verypoor-50',
          scoreColor: 'text-verypoor-500',
        },
      ],
      diagnosisResult: diagnosisList.map((d) => {
        return {
          name: d.key,
          name_cn: d.key_cn,
          suspicion: 'Moderate',
          severity: 'Mild',
          color: 'text-good-500',
          bgColor: 'bg-good-50',
        }
      }),
      sleepQuality: [
        {
          key: 'sleepRhythm',
          title: 'Sleep Rhythm',
          title_cn: '睡眠昼夜节律',
          value: parseInt(circadianRhythm.value.slice(0, -1)),
          rating: circadianRhythm.rating,
          rating_cn: ratingTable.find((r) => r.label === circadianRhythm.rating)
            .label_cn,
          onNavi: () => setCurrentContent('sleepRhythm'),
          onBack: () => setCurrentContent('dashBoard'),
          desc: 'Chronotype is the natural inclination of your body to sleep at a certain time. In addition to regulating sleep and wake times, chronotype has an influence on appetite, exercise, and core body temperature. It is responsible for the fact that you feel more alert at certain periods of the day and sleepier at others.',
          desc_cn:
            '生物钟类型是指你的身体自然倾向于在特定时间休息或睡眠的内在倾向。它不仅影响睡眠和觉醒的周期，还会影响到食欲、运动习惯和核心体温等生理节律。生物钟类型解释了为什么你在一天中的某些时段感到更加清醒和警觉，而在其他时段则感到更加疲倦和需要休息。',
          chronotype: HorneAssessment.value,
          details: [
            {
              title: 'Circadian Alignment',
              title_cn: '生物节律同步',
              rating: CircadianAlignment.rating,
              rating_cn: ratingTable.find(
                (r) => r.label === CircadianAlignment.rating
              ).label_cn,
              value: parseInt(CircadianAlignment.value.slice(0, -1)),
              desc: 'Misalignment of circadian rhythms occur when the individual’s sleep/wake cycle is inappropriately timed relative to your biological night.',
              desc_cn:
                '昼夜节律不同步是指个人的睡眠和觉醒周期与自身的生物夜周期不匹配，即相对于生物钟所设定的夜间时间，个体的睡眠或觉醒时间安排不当。这种情况可能导致睡眠障碍和其他健康问题。',
            },
            {
              title: 'Sleep-Wake Regularity',
              title_cn: '睡眠-觉醒规律',
              rating: SleepWakeRegularity.rating,
              rating_cn: ratingTable.find(
                (r) => r.label === SleepWakeRegularity.rating
              ).label_cn,
              value: parseInt(SleepWakeRegularity.value.slice(0, -1)),
              desc: 'Irregular sleep schedules is characterized by high day-to-day variability in sleep duration or timing.',
              desc_cn:
                '不规律的睡眠模式是指一个人在不同日子的睡眠时间和醒来时间变化很大，缺乏一致性。',
            },
            {
              title: 'Social Jet Lag',
              title_cn: '社交性时差',
              rating: SocialJetLag.rating,
              rating_cn: ratingTable.find(
                (r) => r.label === SocialJetLag.rating
              ).label_cn,
              value: parseInt(SocialJetLag.value.slice(0, -1)),
              desc: 'Social Jetlag describes the habit of having two separate, distinct sleeping patterns, often between weekday and weekend routines.',
              desc_cn:
                '社交时差是指人们在工作日与周末之间，常常有着两种截然不同的睡眠模式，这种不一致的睡眠习惯导致了类似于时差反应的现象。',
            },
          ],
          checkList: [
            {
              key: 'irregularWorkingHours',
              title: 'Irregular Working Hours',
              title_cn: '不规律工作节奏',
              desc: '',
              desc_cn: '',
              checked: IrregularWorkingHours.value === '50%',
            },
          ],
        },
        {
          key: 'synchronizers',
          title: 'Synchronizers',
          title_cn: '生物钟同步性',
          value: parseInt(Synchronizers.value.slice(0, -1)),
          rating: Synchronizers.evaluation,
          rating_cn: ratingTable.find(
            (r) => r.label === Synchronizers.evaluation
          ).label_cn,
          onNavi: () => setCurrentContent('synchronizers'),
          onBack: () => setCurrentContent('dashBoard'),
          desc: 'Synchronizers or Time Givers for the circadian rhythm, also known as "zeitgebers" are environmental cues that help regulate and align the body’s internal clock with the 24-hour day',
          desc_cn:
            '生物节律的同步器，也称为“zeitgebers”，是环境中的提示信号，它们帮助调整并同步我们体内的生物钟，以适应24小时的日常生活周期。',
          details: [
            {
              title: 'Melatonin Triggers',
              title_cn: '褪黑激素触发因素',
              rating: MelatoninFactors.evaluation,
              rating_cn: ratingTable.find(
                (r) => r.label === MelatoninFactors.evaluation
              ).label_cn,
              value: parseInt(MelatoninFactors.value.slice(0, -1)),
              desc: 'A Melatonin trigger is any environmental cue, that signals the brain to produce or to stop the secretion of the Melatonin hormone',
              desc_cn:
                '褪黑激素触发因素指的是一系列环境提示，它们向大脑发出信号，促使其分泌褪黑激素或减少其分泌，从而调节睡眠和觉醒周期。',
            },
            {
              title: 'Morning Synchronizer',
              title_cn: '晨起同步器',
              rating: MorningSynchronizer.evaluation,
              rating_cn: ratingTable.find(
                (r) => r.label === MorningSynchronizer.evaluation
              ).label_cn,
              value: parseInt(MorningSynchronizer.value.slice(0, -1)),
              desc: 'A morning synchronizer is an environmental cue, that helps reset the circadian rhythm and signals the body to wake up and become alert',
              desc_cn:
                '早晨同步器是环境中的一个提示信号，它帮助调整人体生物钟，促使身体苏醒并进入警觉状态。',
            },
          ],
          checkList: [],
        },
        {
          key: 'sleepHygiene',
          title: 'Sleep Hygiene',
          title_cn: '睡眠卫生',
          value: parseInt(sleepHygiene.evaluation.slice(0, -1)),
          rating: sleepHygiene.rating,
          rating_cn: ratingTable.find((r) => r.label === sleepHygiene.rating)
            .label_cn,
          onNavi: () => setCurrentContent('sleepHygiene'),
          onBack: () => setCurrentContent('dashBoard'),
          desc: 'Your sleep hygiene represents all the habits and routines that affect sleep. Healthy sleep hygiene is a common component of efforts to resolve sleep problems. Keeping a stable sleep schedule, following a relaxing pre-bed routine, and building healthy habits during the day can all contribute to ideal sleep hygiene.',
          desc_cn:
            '良好的睡眠卫生涵盖了所有对睡眠有影响的生活习惯和日常安排。它是解决睡眠障碍的共同策略之一。维持固定的睡眠模式，执行舒缓的睡前仪式，以及在日间培养健康的生活习惯，都是实现优质睡眠卫生的关键要素。',
          details: [
            {
              title: 'Your Sleep Habits',
              title_cn: '您的睡眠习惯',
              rating: SleepHabits.rating,
              rating_cn: ratingTable.find((r) => r.label === SleepHabits.rating)
                .label_cn,
              value: parseInt(SleepHabits.evaluation.slice(0, -1)),
              desc: 'A sleep habit is a regular practice or routine related to sleep that helps maintain and stabilize the body’s internal clock.',
              desc_cn:
                '睡眠习惯是指定期进行的与睡眠相关的实践或例行公事，它有助于保持和调节我们体内的生物钟，从而促进睡眠的规律性和稳定性。',
            },
            {
              title: 'Your Sleep Environment',
              title_cn: '您的睡眠环境',
              rating: SleepEnvironment.rating,
              rating_cn: ratingTable.find(
                (r) => r.label === SleepEnvironment.rating
              ).label_cn,
              value: parseInt(SleepEnvironment.evaluation.slice(0, -1)),
              desc: 'The sleep environment refers to the overall physical setting and conditions in which a person sleeps, affecting the quality and continuity of rest.',
              desc_cn:
                '睡眠环境是指围绕个人睡眠的总体物理布局与条件，包括床铺舒适度、房间温度、光线和噪音水平等，这些因素共同决定了睡眠的质量和持续性。',
            },
          ],
          checkList: [],
        },
        {
          key: 'sleepAnxiety',
          title: 'Sleep Anxiety',
          title_cn: '睡眠焦虑',
          value: parseInt(sleepAnxiety.evaluation.slice(0, -1)),
          rating: sleepAnxiety.rating,
          rating_cn: ratingTable.find((r) => r.label === sleepAnxiety.rating)
            .label_cn,
          onNavi: () => setCurrentContent('sleepAnxiety'),
          onBack: () => setCurrentContent('dashBoard'),
          desc: 'Sleep anxiety is a psychological condition marked by persistent and excessive worry or fear about the quality or quantity of sleep, often coupled with a concern that others might notice or judge us for appearing tired or exhausted. This anxiety can create a cycle of stress and sleeplessness, making it difficult to fall asleep or maintain restful sleep, and ultimately impacting overall well-being',
          desc_cn:
            '睡眠焦虑是一种心理状态，表现为对睡眠的品质或时长感到持续且过度的担忧，往往还伴随着对他人可能注意到自己显得疲倦或耗尽的担忧。这种焦虑可能导致压力和失眠的恶性循环，使人难以入睡或维持安稳的睡眠，进而影响整体的健康状况和幸福感。',
          details: [],
          checkList: [],
        },
        {
          key: 'breathingFunction',
          title: 'Metabolic Functions',
          title_cn: '代谢功能',
          value: parseInt(breathingFunction.value.slice(0, -1)),
          rating: breathingFunction.evaluation,
          rating_cn: ratingTable.find(
            (r) => r.label === breathingFunction.evaluation
          ).label_cn,
          onNavi: () => setCurrentContent('breathingFunction'),
          onBack: () => setCurrentContent('dashBoard'),
          desc: 'Good breathing at night is crucial for maintaining optimal sleep quality and overall health. Proper breathing ensures adequate oxygen flow to the body and brain, which supports restorative sleep and helps regulate the body’s various physiological processes.',
          desc_cn:
            '夜间良好的呼吸对于保持最佳睡眠质量和整体健康极为重要。恰当的呼吸方式确保了身体和大脑获得足够的氧气供应，这有助于促进修复性的睡眠，并支持身体各种生理机能的正常运作。',
          details: [],
          bmi: result.PSQI.find((p) => p.id === 'BMI').value,
          bmiClassification: result.PSQI.find(
            (p) => p.id === 'CBMIClassification'
          ).value,
          checkList: [
            {
              key: 'regularSnoring',
              title: 'Regular Snoring',
              title_cn: '经常性打鼾',
              desc: 'Snoring can be associated with multiple sleep disorder',
              desc_cn:
                '经常性打鼾可能是睡眠障碍如睡眠呼吸暂停综合征的一个症状，也可能仅是个体生理结构或睡眠姿势导致的。',
              checked: RegularSnoring.evaluation,
            },
            {
              key: 'stopBreathingGasping',
              title: 'Stop Breathing / Gasping',
              title_cn: '呼吸暂停/喘息',
              desc: 'Sleep Apnea is often the cause of gasping at night, it is due to an obstruction of the airways',
              desc_cn:
                '睡眠呼吸暂停是导致夜间呼吸急促或喘气的常见原因，这种情况通常是因为气道阻塞造成的。',
              checked: StopBreathingGasping.evaluation,
            },
            {
              key: 'dryMouthOrSoreThroat',
              title: 'Dry Mouth or Sore Throat',
              title_cn: '口腔干燥或喉咙痛',
              desc: 'Sleep Apnea might lead to mouth breathing and cause dry mouth or sore throat',
              desc_cn:
                '睡眠呼吸暂停可能会导致患者通过口呼吸，进而引起口腔干燥或喉咙不适。',
              checked: DryMouthOrSoreThroat.evaluation,
            },
            {
              key: 'highBloodPressure',
              title: 'High Blood Pressure',
              title_cn: '血压升高',
              desc: 'Sudden drops in blood oxygen levels due to Sleep Apnea increase blood pressure and strain the cardiovascular system',
              desc_cn:
                '睡眠呼吸暂停引起的血氧水平急剧下降可能会导致血压升高，并对心血管系统造成负担。',
              checked: HighBloodPressure.evaluation,
            },
          ],
        },
      ],
      sleepProfile: [
        {
          key: 'nightSleepQuality',
          title: 'Night Sleep Quality',
          title_cn: '夜间睡眠质量',
          rating: sleepQuality.rating,
          rating_cn: ratingTable.find((r) => r.label === sleepQuality.rating)
            .label_cn,
          value: parseInt(sleepQuality.evaluation.slice(0, -1)),
          onNavi: () => setCurrentContent('sleepQuality'),
        },
        {
          key: 'daytimeEnergy',
          title: 'Daytime Energy',
          title_cn: '日间精力状况',
          rating: daytimeEnergy.evaluation,
          rating_cn: ratingTable.find(
            (r) => r.label === daytimeEnergy.evaluation
          ).label_cn,
          value: parseInt(daytimeEnergy.value.slice(0, -1)),
          onNavi: () => setCurrentContent('daytimeEnergy'),
        },
      ],
      nightSleepQuality: {
        key: 'nightSleepQuality',
        title: 'Night Sleep Quality',
        title_cn: '夜间睡眠质量',
        rating: sleepQuality.rating,
        rating_cn: ratingTable.find((r) => r.label === sleepQuality.rating)
          .label_cn,
        value: parseInt(sleepQuality.evaluation.slice(0, -1)),
        onBack: () => setCurrentContent('dashBoard'),
        desc: 'Sleep quality is the measurement of how well you’re sleeping—in other words, whether your sleep is restful and restorative. Having good sleep quality is essential to a good health. On the opposite, poor sleep quality and sleep deprivation can have many negative physiological effects, including increased risk for stroke, heart disease, and high blood pressure. Negative effects can also be psychological, such as increased irritability or development of anxiety or depression.',
        desc_cn:
          '睡眠质量是评价睡眠是否能够平静且有效恢复体力的关键标准。它对身体健康具有至关重要的影响。相反，如果睡眠质量不佳或睡眠时间不足，可能会导致生理上的多种问题，包括增加患中风、心脏病和高血压的风险。此外，这些不良的睡眠状况还可能引发心理上的问题，如情绪易怒、焦虑或抑郁的发展。',
        details: [
          {
            title: 'Subjective Sleep Quality',
            title_cn: '主观睡眠质量评估',
            rating: SubjectiveSleepQuality.rating,
            rating_cn: ratingTable.find(
              (r) => r.label === SubjectiveSleepQuality.rating
            ).label_cn,
            value: parseInt(SubjectiveSleepQuality.evaluation.slice(0, -1)),
            desc: 'Your own individual satisfaction with your sleep.',
            desc_cn: '针对个人的睡眠质量满意度',
          },
          {
            title: 'Sleep Onset Latency',
            title_cn: '睡眠潜伏期',
            rating: SleepLatency.rating,
            rating_cn: ratingTable.find((r) => r.label === SleepLatency.rating)
              .label_cn,
            value: parseInt(SleepLatency.evaluation.slice(0, -1)),
            desc: 'The amount of time from “lights out,” or bedtime, to actually falling asleep.',
            desc_cn:
              '衡量一个人从准备睡眠（关灯之后）到进入睡眠状态（睡着）所需的时间',
          },
          {
            title: 'Sleep Duration',
            title_cn: '睡眠持续时间',
            rating: SleepDuration.rating,
            rating_cn: ratingTable.find((r) => r.label === SleepDuration.rating)
              .label_cn,
            value: parseInt(SleepDuration.evaluation.slice(0, -1)),
            desc: 'The quantity of time you actually sleep.',
            desc_cn: '实际睡眠总时间',
          },
          {
            title: 'Sleep Efficiency',
            title_cn: '睡眠效率',
            rating: SleepEfficiency.rating,
            rating_cn: ratingTable.find(
              (r) => r.label === SleepEfficiency.rating
            ).label_cn,
            value: parseInt(SleepEfficiency.evaluation.slice(0, -1)),
            desc: 'Your sleep efficiency is calculated by dividing total sleep time by total time in bed.',
            desc_cn:
              '评估睡眠质量的一个重要指标，它反映了一个人在实际睡眠时间与总躺床时间之间的比例。',
          },
          {
            title: 'Sleep Disturbance',
            title_cn: '睡眠干扰',
            rating: SleepDisturbances.rating,
            rating_cn: ratingTable.find(
              (r) => r.label === SleepDisturbances.rating
            ).label_cn,
            value: parseInt(SleepDisturbances.evaluation.slice(0, -1)),
            desc: 'A disruption in sleep that causes arousal or awakening.',
            desc_cn: '各种因素造成睡眠中的觉醒',
          },
          {
            title: 'Daytime Dysfunction',
            title_cn: '日间功能障碍',
            rating: daytimeFunction.rating,
            rating_cn: ratingTable.find(
              (r) => r.label === daytimeFunction.rating
            ).label_cn,
            value: parseInt(daytimeFunction.evaluation.slice(0, -1)),
            desc: 'Negative effects of sleeping problems that occur during waking hours.',
            desc_cn: '夜间睡眠障碍对白天功能和整体健康的影响',
          },
        ],
        checkList: [
          {
            key: 'useHypontics',
            title: 'Use of Hypontics',
            title_cn: '选择催眠',
            desc: '',
            desc_cn: '',
            checked: UseofSleepMedication.value > 1,
          },
        ],
      },
      daytimeEnergy: {
        key: 'daytimeEnergy',
        title: 'Daytime Energy',
        title_cn: '日间精力状况',
        rating: daytimeEnergy.evaluation,
        rating_cn: ratingTable.find((r) => r.label === daytimeEnergy.evaluation)
          .label_cn,
        value: parseInt(daytimeEnergy.value.slice(0, -1)),
        onBack: () => setCurrentContent('dashBoard'),
        desc: 'Daytime Energy is the measurement of your daytime fatigue and sleepiness. For many people, feelings a lack of energy can be attributed to not getting enough sleep at night, but several sleep disorders can also cause daytime tiredness. Daytime energy is therefore not only related to sleep time, but to Sleep Quality as whole, which itself is a combination of several factors including your circadian rhythm, your sleep habits and environment, your level of sleep-related stress and breathing function.',
        desc_cn:
          '日间能量是评价个体白天疲劳和嗜睡水平的指标。许多人感到精力不足可能是因为夜间睡眠不足，但多种睡眠障碍同样可能引起日间疲倦。因此，日间能量不仅与睡眠时长相关，更与整体睡眠质量紧密相连，后者综合了包括昼夜节律、睡眠习惯与环境、睡眠相关压力水平以及呼吸功能在内的多个因素。',
        details: [
          {
            title: 'Your Sleepiness Scale',
            title_cn: '嗜睡量表',
            rating: Sleepiness.rating,
            rating_cn: ratingTable.find((r) => r.label === Sleepiness.rating)
              .label_cn,
            value: parseInt(Sleepiness.evaluation.slice(0, -1)),
            desc: 'The sleepiness scale measures the general level of daytime sleepiness. Daytime sleepiness is defined as difficulty staying awake or alert, or an increased desire to sleep during the day. It isn’t to be confused with fatigue. While both conditions are characterized by a lack of energy and may arise under similar circumstances, the principal difference is that people with fatigue may be unable to fall asleep despite feeling tired and sluggish.',
            desc_cn:
              '嗜睡量表用于评估个体在白天的嗜睡程度。日间嗜睡指的是在日间难以保持清醒或警觉，或有增强的睡眠需求。这与疲劳不同。虽然两者都表现为能量不足，可能在相似情况下发生，但关键区别在于，疲劳的人可能在感到疲倦和行动迟缓时仍然难以入睡。',
          },
          {
            title: 'Physical Fatigue Scale',
            title_cn: '身体疲劳量表',
            key: 'physicalFatigue',
            rating: PhysicalFatigue.rating,
            rating_cn: ratingTable.find(
              (r) => r.label === PhysicalFatigue.rating
            ).label_cn,
            value: parseInt(PhysicalFatigue.evaluation.slice(0, -1)),
            desc: 'Physical fatigue refers to (1) an acutely painful phenomenon which arises in over-stressed muscles after exercise, and (2) a symptom which emerges in circumstances such as prolonged physical exertion without sufficient rest or sleep disturbances due to medication',
            desc_cn:
              '评估个体身体疲劳程度的工具，通常用于测量由于疾病、治疗、工作或其他因素引起的身体疲劳感。通过一系列量表可以量化疲劳的严重性，帮助医生或研究人员了解个体的疲劳状况，并监测治疗或干预措施的效果。',
          },
          {
            title: 'Mental Fatigue Scale',
            title_cn: '精神疲劳量表',
            key: 'mentalFatigue',
            rating: MentalFatigue.rating,
            rating_cn: ratingTable.find((r) => r.label === MentalFatigue.rating)
              .label_cn,
            value: parseInt(MentalFatigue.evaluation.slice(0, -1)),
            desc: 'Mental fatigue reflects reduced psychological capacity and less willingness to act adequately due to earlier mental or physical effort. As a consequence, there is reduced competence and willingness to develop or maintain goal-directed behavior aimed at adequate performance',
            desc_cn:
              '评估个体心理或认知疲劳程度的工具，用于测量由于长时间工作、学习压力、情绪问题或其他因素引起的精神疲劳状态。通过量表中的项目，可以评估个体的注意力集中能力、思维清晰度、记忆力以及对持续精神活动的耐受性等方面的变化。',
          },
        ],
        checkList: [],
      },
    }
  }

  useEffect(() => {
    if (status !== 'loading') {
      if (session?.user?.email) setUserEmail(session?.user?.email)
      else router.push('/login')
    }
  }, [status])
  useEffect(() => {
    const getReportData = async (email) => {
      setLoadingReportData(true)
      const res = await fetch(`/api/report/${email}`)
      const data = await res.json()
      console.log('report', data)
      setReportData(generateReport(data))
      setLoadingReportData(false)
    }
    if (userEmail) getReportData(userEmail)
  }, [userEmail])

  const pageContent = {
    dashBoard: reportData.reportHeaders ? (
      <div className="grid max-w-9xl grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-md bg-white p-4">
          <div className="flex flex-col items-center p-8">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-good-500">
              <span className="text-xl font-medium leading-none text-white">
                {userEmail ? userEmail.slice(0, 1).toUpperCase() : ''}
              </span>
            </span>
            <div className="mt-8 flex flex-row items-center justify-center">
              {userEmail ? (
                <EnvelopeIcon
                  className="h-5 w-5 flex-shrink-0"
                  aria-hidden="true"
                />
              ) : null}
              <span className="ml-2 font-semibold">{userEmail}</span>
            </div>
          </div>
        </div>
        <div className="rounded-md border-t-[5px] border-poor-500 bg-white p-4">
          <ReportHeader header={reportData.reportHeaders[0]} />
          {reportData.diagnosisResult.map((result, index) => (
            <div key={result.name} className="my-8">
              <div
                className={clsx(
                  'mb-4 flex flex-row items-center rounded-l-full rounded-r-md px-4 py-2',
                  result.bgColor
                )}
              >
                <div className="mr-4 font-semibold">{index + 1}</div>
                <div className="text-lg font-semibold">
                  {locale === 'en' ? result.name : result.name_cn}
                </div>
              </div>
              {/* <div className="flex flex-row items-center justify-between px-4">
                <div className="flex flex-row items-center">
                  <span className={clsx('px-2', result.bgColor, result.color)}>
                    {result.suspicion}
                  </span>
                  <span className="ml-1">SUSPICION</span>
                </div>
                <div className="flex flex-row items-center">
                  <span className={clsx('px-2', result.bgColor, result.color)}>
                    {result.severity}
                  </span>
                  <span className="ml-1">SEVERITY</span>
                </div>
              </div> */}
            </div>
          ))}
        </div>
        <div className="rounded-md border-t-[5px] border-excellent-500 bg-white p-4">
          <ReportHeader header={reportData.reportHeaders[1]} />
          {reportData.sleepProfile.map((profile) => (
            <SleepProfileCard key={profile.key} profile={profile} />
          ))}
        </div>
        <div className="rounded-md border-t-[5px] border-verypoor-500 bg-white p-4">
          <ReportHeader header={reportData.reportHeaders[2]} />
          <SleepQualityCard quality={reportData.sleepQuality} />
        </div>
        {/* {reportData.useremail ? (
      <>
        <List title="PSQI Score" data={reportData.PSQI} />
        <List title="ISI Score" data={reportData.ISI} />
        <List title="StopBang Score" data={reportData.StopBang} />
      </>
    ) : null} */}
      </div>
    ) : null,
    sleepQuality: <SleepDataDetails data={reportData.nightSleepQuality} />,
    daytimeEnergy: <SleepDataDetails data={reportData.daytimeEnergy} />,
    sleepRhythm: reportData.sleepQuality ? (
      <SleepQualityDetails data={reportData.sleepQuality[0]} />
    ) : null,
    synchronizers: reportData.sleepQuality ? (
      <SleepQualityDetails data={reportData.sleepQuality[1]} />
    ) : null,
    sleepHygiene: reportData.sleepQuality ? (
      <SleepQualityDetails data={reportData.sleepQuality[2]} />
    ) : null,
    sleepAnxiety: reportData.sleepQuality ? (
      <SleepQualityDetails data={reportData.sleepQuality[3]} />
    ) : null,
    breathingFunction: reportData.sleepQuality ? (
      <SleepQualityDetails data={reportData.sleepQuality[4]} />
    ) : null,
  }
  return (
    <>
      <Head>
        <title>Report - Engineering Sleep</title>
      </Head>
      <AppLayout>
        <main className="mx-auto max-w-9xl pt-4 lg:pt-0">
          {status === 'loading' || loadingReportData ? (
            <WaitingSpinner />
          ) : (
            pageContent[currentContent]
          )}
        </main>
      </AppLayout>
    </>
  )
}
