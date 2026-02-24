const polyval = require('compute-polynomial')
const polynomialParams = {
  GlobalPSQIScore: [1.42496e-5, -0.000760823, 0.014918651, -0.157353896, 1],
  SubjectiveSleepQuality: [-0.041666667, 0.25, -0.708333333, 1],
  SleepLatency: [0.001041667, 0.0125, -0.279166667, 1],
  SleepDuration: [
    6.05145e-5, -0.001838543, 0.019554154, -0.086667964, 0.154614199,
    -0.007629694, -0.167749073,
  ],
  SleepEfficiency: [6.35359116, -6.464088398, 1.410911602],
  SleepDisturbances: [-1.22779e-5, 0.000708733, -0.011556927, 0, 1],
  DaytimeDysfunction: [-0.005815972, 0.070833333, -0.243402778, 0, 1],
  GlobalESSScore: [5.17598e-5, -0.000793651, -0.052605245, 1],
  PhysicalFatigue: [0.003431373, -0.151470588, 1.671568627],
  MentalFatigue: [0.003431373, -0.151470588, 1.671568627],
  GlobalFSSScore: [4.78464e-5, -0.002625392, 0, 1.214692875],
  SleepTimeDifference: [3.64135e-7, -9.70445e-5, 0, 1.020606061],
  WakeTimeDifference: [3.64135e-7, -9.70445e-5, 0, 1.020606061],
  WakeTimeVariation: [0.041666667, -0.125, 0.333333333, -1.66533e-16],
  BedTimeVariation: [0.041666667, -0.125, 0.333333333, -1.66533e-16],
  SocialSleepTimeDifference: [3.64135e-7, -9.70445e-5, 0, 1.020606061],
  SocialWakeTimeDifference: [3.64135e-7, -9.70445e-5, 0, 1.020606061],
  BreathingFunctionScore: [0.005208333, -0.145833333, 1],
  BreathingFunctionBMI: [
    -1.20645e-5, 0.00151344, -0.073820163, 1.746050174, -20.06178682,
    90.83281734,
  ],
  SleepEnvironment: [0.00064706, -0.014733503, 0, 1],
  SleepHabits: [0.000762527, -0.057625272, 1],
  SleepHygiene: [0.000157445, -0.029307242, 1],
  SleepStress: [0.001566416, -0.082393484, 1],
  LightInTheMorning: [-0.013888889, 0.152777778, 0, 1.11022e-16],
  BrightEnvironment: [0.020833333, 0, -0.520833333, 1],
  BreakfastUponAwakening: [0.041666667, -0.125, 0.333333333, -1.66533e-16],
  PhysicalActivityInTheMorning: [
    0.041666667, -0.125, 0.333333333, -1.66533e-16,
  ],
}

const ratingTable = [
  {
    label: 'Excellent',
    upperLimit: 100,
    lowerLimit: 100,
  },
  {
    label: 'Good',
    upperLimit: 99,
    lowerLimit: 60,
  },
  {
    label: 'Fair',
    upperLimit: 59,
    lowerLimit: 50,
  },
  {
    label: 'Poor',
    upperLimit: 49,
    lowerLimit: 20,
  },
  {
    label: 'Very Poor',
    upperLimit: 19,
    lowerLimit: 0,
  },
]

function eveluateScore(id, value) {
  const evaluation = Math.round(polyval(polynomialParams[id], value) * 100)
  const ratingScore = evaluation < 0 ? 0 : evaluation > 100 ? 100 : evaluation
  const rating = ratingTable.find(
    (r) => ratingScore <= r.upperLimit && ratingScore >= r.lowerLimit
  ).label

  return {
    evaluation: ratingScore + '%',
    rating,
  }
}

function dateDiff(dateold, datenew) {
  const ynew = datenew.getFullYear()
  const mnew = datenew.getMonth()
  const dnew = datenew.getDate()
  const yold = dateold.getFullYear()
  const mold = dateold.getMonth()
  const dold = dateold.getDate()
  let diff = ynew - yold
  if (mold > mnew) diff--
  else {
    if (mold == mnew) {
      if (dold > dnew) diff--
    }
  }
  return diff
}

export function calculateDiagnosis(answers) {
  function findAnswerById(id) {
    return answers.find((a) => a.psqiid === id || a.psqiid === id.toString())
  }

  function getPsqi() {
    const psqi = []
    const PSQI_C1 = findAnswerById(9)
    const SubjectiveSleepQuality =
      PSQI_C1.score > 0 ? PSQI_C1.score - 1 : PSQI_C1.score
    psqi.push({
      id: 'SubjectiveSleepQuality',
      key: 'Subjective Sleep Quality',
      value: SubjectiveSleepQuality,
      ...eveluateScore('SubjectiveSleepQuality', SubjectiveSleepQuality),
    })
    const PSQI_C2a = findAnswerById(2)
    const PSQI_C2b = findAnswerById('5a')
    const SleepLatency_Sum = PSQI_C2a.score + PSQI_C2b.score
    const SleepLatency =
      SleepLatency_Sum === 0
        ? 0
        : [1, 2].includes(SleepLatency_Sum)
        ? 1
        : [3, 4].includes(SleepLatency_Sum)
        ? 2
        : 3
    psqi.push({
      id: 'SleepLatency',
      key: 'Sleep Latency',
      value: SleepLatency,
      ...eveluateScore('SleepLatency', SleepLatency),
    })
    const PSQI_C3 = parseFloat(findAnswerById(4).answer) // not single choice question, use answer text or number
    const SleepDuration =
      PSQI_C3 >= 7
        ? 0
        : PSQI_C3 < 7 && PSQI_C3 >= 6
        ? 1
        : PSQI_C3 < 6 && PSQI_C3 >= 5
        ? 2
        : 3
    psqi.push({
      id: 'SleepDuration',
      key: 'Sleep Duration',
      value: SleepDuration,
      ...eveluateScore('SleepDuration', PSQI_C3),
    })
    const PSQI_C4a = findAnswerById(1).answer // not single choice question, use answer text or number
    const PSQI_C4c = findAnswerById(3).answer // not single choice question, use answer text or number
    const PSQI_C4d = findAnswerById(4).answer // not single choice question, use answer text or number
    const inBedHour = parseInt(PSQI_C4a.split(':')[0])
    const inBedMinute = parseInt(PSQI_C4a.split(':')[1])
    const TimeInBed = new Date(
      2023,
      0,
      inBedHour < 12 ? 2 : 1,
      inBedHour,
      inBedMinute
    )
    const awakeHour = parseInt(PSQI_C4c.split(':')[0])
    const awakeMinute = parseInt(PSQI_C4c.split(':')[1])
    const TimeAwake = new Date(2023, 0, 2, awakeHour, awakeMinute)
    const inBedMinuteCount = parseInt(
      (TimeAwake.getTime() - TimeInBed.getTime()) / (60 * 1000)
    )
    const BedHours = parseInt(inBedMinuteCount / 60)
    const BedMinutes = inBedMinuteCount % 60
    const Total_SleepTime = parseInt(parseFloat(PSQI_C4d) * 60)
    const SleepEfficiency = Math.round(
      (Total_SleepTime / inBedMinuteCount) * 100
    )
    const HabitualSleepEfficiency =
      SleepEfficiency >= 85
        ? 0
        : SleepEfficiency < 85 && SleepEfficiency >= 75
        ? 1
        : SleepEfficiency < 75 && SleepEfficiency >= 65
        ? 2
        : 3
    psqi.push({
      id: 'HabitualSleepEfficiency',
      key: 'Habitual Sleep Efficiency',
      value: HabitualSleepEfficiency,
    })
    const PSQI_C5b = ['5b', '5c', '5d', '5e', '5f', '5h', '5i']
    const TotalDis = answers
      .filter((a) => PSQI_C5b.includes(a.psqiid))
      .reduce(
        (accumulator, currentValue) => accumulator + currentValue.score,
        0
      )
    const SleepDisturbances =
      TotalDis === 0
        ? 0
        : TotalDis >= 1 && TotalDis < 10
        ? 1
        : TotalDis >= 10 && TotalDis < 19
        ? 2
        : 3
    psqi.push({
      id: 'SleepDisturbances',
      key: 'Sleep Disturbances',
      value: SleepDisturbances,
      ...eveluateScore('SleepDisturbances', TotalDis),
    })
    const UseofSleepMedication = findAnswerById(7).score
    psqi.push({
      id: 'UseofSleepMedication',
      key: 'Use of Sleep Medication',
      value: UseofSleepMedication,
    })
    const DaytimeDysfunction_Sum =
      findAnswerById(6).score + findAnswerById(8).score
    const DaytimeDysfunction =
      DaytimeDysfunction_Sum === 0
        ? 0
        : [1, 2].includes(DaytimeDysfunction_Sum)
        ? 1
        : [3, 4].includes(DaytimeDysfunction_Sum)
        ? 2
        : 3
    psqi.push({
      id: 'DaytimeDysfunction',
      key: 'Daytime Dysfunction',
      value: DaytimeDysfunction,
      ...eveluateScore('DaytimeDysfunction', DaytimeDysfunction),
    })
    psqi.push({
      id: 'TimeSpentInBed',
      key: 'Time Spent in Bed',
      value: `${BedHours}hrs ${BedMinutes}mins`,
    })
    psqi.push({
      id: 'TimeSlept',
      key: 'Time Slept',
      value: PSQI_C4d + 'hrs',
    })
    psqi.push({
      id: 'SleepEfficiency',
      key: 'Sleep Efficiency',
      value: SleepEfficiency + '%',
      ...eveluateScore('SleepEfficiency', SleepEfficiency / 100),
    })
    const CHeight = parseFloat(findAnswerById(12).answer)
    const CWeight = parseFloat(findAnswerById(13).answer)
    const CBMI = Math.round((CWeight / Math.pow(CHeight / 100, 2)) * 10) / 10
    const CBMIClassification =
      CBMI > 30
        ? 'Obese'
        : CBMI <= 30 && CBMI > 25
        ? 'Overweight'
        : CBMI <= 25 && CBMI > 18.5
        ? 'Normal'
        : 'Underweight'

    psqi.push(
      {
        id: 'Height',
        key: 'Height',
        value: CHeight + ' cm',
      },
      {
        id: 'Weight',
        key: 'Weight',
        value: CWeight + ' kg',
      },
      {
        id: 'BMI',
        key: 'BMI',
        value: CBMI,
      },
      {
        id: 'CBMIClassification',
        key: 'BMI Classification',
        value: CBMIClassification,
      }
    )
    const GlobalPSQIScore =
      SubjectiveSleepQuality +
      SleepLatency +
      SleepDuration +
      HabitualSleepEfficiency +
      SleepDisturbances +
      UseofSleepMedication +
      DaytimeDysfunction
    psqi.push({
      id: 'GlobalPSQIScore',
      key: 'Global PSQI Score',
      value: GlobalPSQIScore,
      ...eveluateScore('GlobalPSQIScore', GlobalPSQIScore),
    })
    return psqi
  }

  function getIsi() {
    const isi = []
    const Initiate = findAnswerById('14a').score
    const Middle = findAnswerById('14b').score
    const Termination = findAnswerById('14c').score
    const Satisfaction = findAnswerById(9).score
    const Noticeability = findAnswerById(91).score
    const Distress = findAnswerById(15).score
    const Interference = findAnswerById(134).score
    const TISI =
      Initiate +
      Middle +
      Termination +
      Noticeability +
      Satisfaction +
      Distress +
      Interference

    isi.push(
      {
        id: 'Initiate',
        key: 'Initiate',
        value: Initiate,
      },
      {
        id: 'Middle',
        key: 'Middle',
        value: Middle,
      },
      {
        id: 'Termination',
        key: 'Termination',
        value: Termination,
      },
      {
        id: 'Satisfaction',
        key: 'Satisfaction',
        value: Satisfaction,
      },
      {
        id: 'Noticeability',
        key: 'Noticeability',
        value: Noticeability,
      },
      {
        id: 'Distress',
        key: 'Distress',
        value: Distress,
      },
      {
        id: 'Interference',
        key: 'Interference',
        value: Interference,
      },
      { id: 'GlobalISIScore', key: 'Global ISI Score', value: TISI }
    )

    return isi
  }

  function getStopBang() {
    const SnoreAnswer = findAnswerById(26).score
    const Snore = SnoreAnswer >= 1 ? 1 : 0
    const ESSScore = getESS().value
    const FASScore = getFAS().find((s) => s.key === 'Global FSS Score').value
    const HSIScore = getHSI().value
    const Tired = ESSScore >= 10 || FASScore >= 22 || HSIScore >= 10 ? 1 : 0
    const ObservedAnswer = findAnswerById(27).score
    const Observed = ObservedAnswer >= 1 ? 1 : 0
    const PressureAnswer = findAnswerById(93).score
    const Pressure = PressureAnswer >= 1 ? 1 : 0
    const BMIScore = getPsqi().find((s) => s.key === 'BMI').score
    const BMI = BMIScore >= 30 ? 1 : 0
    const birthdayAnswer = findAnswerById(11).score
    const birthday =
      birthdayAnswer > 9999
        ? new Date(birthdayAnswer)
        : new Date(birthdayAnswer, 0)
    const ActualAge = dateDiff(birthday, new Date())
    const Age = ActualAge >= 50 ? 1 : 0
    const genderAnswer = findAnswerById(10).score // 0: Male, 1: Female
    const gender = genderAnswer === 0 ? 1 : 0

    const TStop = Snore + Tired + Observed + Pressure
    const TBang = BMI + Age + gender
    const TStopBang = TStop + TBang
    return [
      {
        id: 'Snore',
        key: 'Snore',
        value: Snore,
      },
      {
        id: 'Tired',
        key: 'Tired',
        value: Tired,
      },
      {
        id: 'Observed',
        key: 'Observed',
        value: Observed,
      },
      {
        id: 'Pressure',
        key: 'Pressure',
        value: Pressure,
      },
      {
        id: 'BodyMassIndex',
        key: 'Body Mass Index',
        value: BMI,
      },
      {
        id: 'Age',
        key: 'Age',
        value: Age,
      },
      {
        id: 'Gender',
        key: 'Gender',
        value: (genderAnswer === 0 ? 'Male' : 'Female') + `; + ${gender}`,
      },
      {
        id: 'STOP',
        key: 'STOP',
        value: TStop,
      },
      {
        id: 'BANG',
        key: 'BANG',
        value: TBang,
      },
      {
        id: 'GlobalStobBangScore',
        key: 'Global StobBang Score',
        value: TStopBang,
      },
    ]
  }

  function getHorne() {
    let Horne_Score = findAnswerById(95).score
    const IdealWakeTimeAnswer = findAnswerById(94).answer
    const IdealWakeTime = new Date(
      2023,
      0,
      1,
      parseInt(IdealWakeTimeAnswer.split(':')[0]),
      parseInt(IdealWakeTimeAnswer.split(':')[1])
    )
    if (
      IdealWakeTime >= new Date(2023, 0, 1, 4) &&
      IdealWakeTime <= new Date(2023, 0, 1, 6, 30)
    )
      Horne_Score += 5
    else if (
      IdealWakeTime > new Date(2023, 0, 1, 6, 30) &&
      IdealWakeTime <= new Date(2023, 0, 1, 7, 45)
    )
      Horne_Score += 4
    else if (
      IdealWakeTime > new Date(2023, 0, 1, 7, 45) &&
      IdealWakeTime <= new Date(2023, 0, 1, 9, 45)
    )
      Horne_Score += 3
    else if (
      IdealWakeTime > new Date(2023, 0, 1, 9, 45) &&
      IdealWakeTime <= new Date(2023, 0, 1, 11)
    )
      Horne_Score += 2
    else if (
      IdealWakeTime > new Date(2023, 0, 1, 11) &&
      IdealWakeTime <= new Date(2023, 0, 1, 14)
    )
      Horne_Score += 1

    const IdealSleepTimeAnswer = findAnswerById(117).answer
    const IdealSleepTime = new Date(
      2023,
      0,
      parseInt(IdealSleepTimeAnswer.split(':')[0]) < 12 ? 2 : 1,
      parseInt(IdealSleepTimeAnswer.split(':')[0]),
      parseInt(IdealSleepTimeAnswer.split(':')[1])
    )
    if (
      IdealSleepTime >= new Date(2023, 0, 1, 20) &&
      IdealSleepTime <= new Date(2023, 0, 1, 21)
    )
      Horne_Score += 5
    else if (
      IdealSleepTime > new Date(2023, 0, 1, 21) &&
      IdealSleepTime <= new Date(2023, 0, 1, 22, 15)
    )
      Horne_Score += 4
    else if (
      IdealSleepTime > new Date(2023, 0, 1, 22, 15) &&
      IdealSleepTime <= new Date(2023, 0, 2, 0, 30)
    )
      Horne_Score += 3
    else if (
      IdealSleepTime > new Date(2023, 0, 2, 0, 30) &&
      IdealSleepTime <= new Date(2023, 0, 2, 1, 45)
    )
      Horne_Score += 2
    else if (
      IdealSleepTime > new Date(2023, 0, 2, 1, 45) &&
      IdealSleepTime <= new Date(2023, 0, 2, 3)
    )
      Horne_Score += 1
    else Horne_Score += 3

    const FeelingPeakAnswer = findAnswerById(118).answer
    const FeelingPeakAnswerDate = new Date(
      2023,
      0,
      1,
      parseInt(FeelingPeakAnswer.split(':')[0]),
      parseInt(FeelingPeakAnswer.split(':')[1])
    )
    if (
      FeelingPeakAnswerDate >= new Date(2023, 0, 1, 0) &&
      FeelingPeakAnswerDate <= new Date(2023, 0, 1, 5)
    )
      Horne_Score += 1
    else if (
      FeelingPeakAnswerDate > new Date(2023, 0, 1, 5) &&
      FeelingPeakAnswerDate <= new Date(2023, 0, 1, 9)
    )
      Horne_Score += 5
    else if (
      FeelingPeakAnswerDate > new Date(2023, 0, 1, 9) &&
      FeelingPeakAnswerDate <= new Date(2023, 0, 1, 11)
    )
      Horne_Score += 4
    else if (
      FeelingPeakAnswerDate > new Date(2023, 0, 1, 11) &&
      FeelingPeakAnswerDate <= new Date(2023, 0, 1, 16)
    )
      Horne_Score += 3
    else if (
      FeelingPeakAnswerDate > new Date(2023, 0, 1, 16) &&
      FeelingPeakAnswerDate <= new Date(2023, 0, 1, 21)
    )
      Horne_Score += 2
    else if (FeelingPeakAnswerDate > new Date(2023, 0, 1, 21)) Horne_Score += 1
    const typeAnswer = findAnswerById(119).score
    if (typeAnswer === 0) Horne_Score += 6
    else if (typeAnswer === 1) Horne_Score += 4
    else if (typeAnswer === 2) Horne_Score += 2

    let Horne_Assessment
    let Horne_Code
    if (Horne_Score >= 22) {
      Horne_Assessment = 'Definitely Morning'
      Horne_Code = 1
    } else if (Horne_Score >= 18 && Horne_Score < 22) {
      Horne_Assessment = 'Morning'
      Horne_Code = 2
    } else if (Horne_Score >= 12 && Horne_Score < 18) {
      Horne_Assessment = 'Intermediate'
      Horne_Code = 3
    } else if (Horne_Score >= 8 && Horne_Score < 11) {
      Horne_Assessment = 'Evening'
      Horne_Code = 4
    } else {
      Horne_Assessment = 'Definitely Evening'
      Horne_Code = 5
    }

    return [
      {
        id: 'HorneScore',
        key: 'Horne Score',
        value: Horne_Score,
      },
      {
        id: 'HorneAssessment',
        key: 'Horne Assessment',
        value: Horne_Assessment,
      },
      {
        id: 'HorneCode',
        key: 'Horne Code',
        value: Horne_Code,
      },
      {
        id: 'IdealSleepTime',
        key: 'Ideal Sleep Time',
        value: IdealSleepTimeAnswer,
      },
      {
        id: 'IdealWakeTime',
        key: 'Ideal Wake Time',
        value: IdealWakeTimeAnswer,
      },
    ]
  }

  function getESS() {
    const ESSFactor = ['97', '98', '99', '100', '101', '102', '103', '104']
    const TESS = answers
      .filter(
        (a) =>
          ESSFactor.includes(a.psqiid.toString()) ||
          ESSFactor.includes(a.psqiid)
      )
      .reduce(
        (accumulator, currentValue) => accumulator + currentValue.score,
        0
      )

    return [
      {
        id: 'GlobalESSScore',
        key: 'Global ESS Score',
        value: TESS,
        ...eveluateScore('GlobalESSScore', TESS),
      },
    ]
  }

  function getHSI() {
    const HSIQuestion = [
      '14f',
      '14d',
      '14e',
      '14g',
      '9',
      '91',
      '15',
      '6',
      '8',
      '126',
    ]
    let HSI_Score = 0
    const HSIAnswer = answers.filter(
      (a) =>
        HSIQuestion.includes(a.psqiid.toString()) ||
        HSIQuestion.includes(a.psqiid)
    )
    // console.log('hsi a', HSIAnswer)
    for (let i = 1; i < HSIQuestion.length - 2; i++)
      HSI_Score += HSIAnswer[i - 1].score
    if (
      HSIAnswer[HSIQuestion.length - 1].score >=
        HSIAnswer[HSIQuestion.length - 2].score &&
      HSIAnswer[HSIQuestion.length - 1].score >=
        HSIAnswer[HSIQuestion.length - 3].score
    )
      HSI_Score = HSI_Score + HSIAnswer[HSIQuestion.length - 1].score
    else if (
      HSIAnswer[HSIQuestion.length - 2].score >=
        HSIAnswer[HSIQuestion.length - 1].score &&
      HSIAnswer[HSIQuestion.length - 2].score >=
        HSIAnswer[HSIQuestion.length - 3].score
    )
      HSI_Score = HSI_Score + HSIAnswer[HSIQuestion.length - 2].score
    else HSI_Score = HSI_Score + HSIAnswer[HSIQuestion.length - 3].score

    return [
      {
        id: 'GlobalHSIScore',
        key: 'Global HSI Score',
        value: HSI_Score,
      },
    ]
  }

  function getFAS() {
    const FASPQuestion = ['120', '121', '130', '123', '129']
    const FASMQuestion = ['122', '126', '127', '128', '131']
    const PhysicalFatigue = answers
      .filter(
        (a) =>
          FASPQuestion.includes(a.psqiid.toString()) ||
          FASPQuestion.includes(a.psqiid)
      )
      .reduce(
        (accumulator, currentValue) => accumulator + currentValue.score,
        0
      )

    const MentalFatigue = answers
      .filter(
        (a) =>
          FASMQuestion.includes(a.psqiid.toString()) ||
          FASMQuestion.includes(a.psqiid)
      )
      .reduce(
        (accumulator, currentValue) => accumulator + currentValue.score,
        0
      )
    const FASScore = PhysicalFatigue + MentalFatigue
    return [
      {
        id: 'PhysicalFatigue',
        key: 'Physical',
        value: PhysicalFatigue,
        ...eveluateScore('PhysicalFatigue', PhysicalFatigue),
      },
      {
        id: 'MentalFatigue',
        key: 'Mental',
        value: MentalFatigue,
        ...eveluateScore('MentalFatigue', MentalFatigue),
      },
      {
        id: 'GlobalFSSScore',
        key: 'Global FSS Score',
        value: FASScore,
        ...eveluateScore('GlobalFSSScore', FASScore),
      },
    ]
  }

  function getCircadian() {
    const actualSleepTimeAnswer = findAnswerById(1).answer
    const idealSleepTimeAnswer = findAnswerById(117).answer
    const actualSleepTime = new Date(
      2023,
      0,
      parseInt(actualSleepTimeAnswer.split(':')[0]) < 12 ? 2 : 1,
      parseInt(actualSleepTimeAnswer.split(':')[0]),
      parseInt(actualSleepTimeAnswer.split(':')[1])
    )
    const idealSleepTime = new Date(
      2023,
      0,
      parseInt(idealSleepTimeAnswer.split(':')[0]) < 12 ? 2 : 1,
      parseInt(idealSleepTimeAnswer.split(':')[0]),
      parseInt(idealSleepTimeAnswer.split(':')[1])
    )
    const SleepTimeDifference = Math.round(
      Math.abs(actualSleepTime.getTime() - idealSleepTime.getTime()) /
        (60 * 1000)
    ) // difference in minutes
    const SleepTimeDifferenceScore = parseInt(
      eveluateScore(
        'SleepTimeDifference',
        SleepTimeDifference
      ).evaluation.slice(0, -1)
    )

    const actualWakeTimeAnswer = findAnswerById(3).answer
    const idealWakeTimeAnswer = findAnswerById(94).answer
    const actualWakeTime = new Date(
      2023,
      0,
      1,
      parseInt(actualWakeTimeAnswer.split(':')[0]),
      parseInt(actualWakeTimeAnswer.split(':')[1])
    )
    const idealWakeTime = new Date(
      2023,
      0,
      1,
      parseInt(idealWakeTimeAnswer.split(':')[0]),
      parseInt(idealWakeTimeAnswer.split(':')[1])
    )
    const WakeTimeDifference = Math.round(
      Math.abs(actualWakeTime.getTime() - idealWakeTime.getTime()) / (60 * 1000)
    ) // difference in minutes
    const WakeTimeDifferenceScore = parseInt(
      eveluateScore('WakeTimeDifference', WakeTimeDifference).evaluation.slice(
        0,
        -1
      )
    )
    const CircadianAlignmentScore = parseInt(
      (SleepTimeDifferenceScore * 5 + WakeTimeDifferenceScore * 4) / 9
    )
    const CircadianAlignmentRating = ratingTable.find(
      (r) =>
        CircadianAlignmentScore <= r.upperLimit &&
        CircadianAlignmentScore >= r.lowerLimit
    ).label

    const WakeTimeScore = findAnswerById(18).score
    const WakeTimeVariationScore = parseInt(
      eveluateScore('WakeTimeVariation', WakeTimeScore).evaluation.slice(0, -1)
    )
    const BedTimeScore = findAnswerById(16).score
    const BedTimeVariationScore = parseInt(
      eveluateScore('BedTimeVariation', BedTimeScore).evaluation.slice(0, -1)
    )
    const SleepWakeRegularityScore = parseInt(
      100 - WakeTimeVariationScore - (1 / 2) * BedTimeVariationScore
    )
    const SleepWakeRegularityEvaluation =
      SleepWakeRegularityScore < 0 ? 0 : SleepWakeRegularityScore

    const SleepWakeRegularityRating = ratingTable.find(
      (r) =>
        SleepWakeRegularityEvaluation <= r.upperLimit &&
        SleepWakeRegularityEvaluation >= r.lowerLimit
    ).label

    // Social Jet Lag
    const WeekendSleepTimeAnswer = findAnswerById(135).answer
    const WeekendSleepTime = new Date(
      2023,
      0,
      parseInt(WeekendSleepTimeAnswer.split(':')[0]) < 12 ? 2 : 1,
      parseInt(WeekendSleepTimeAnswer.split(':')[0]),
      parseInt(WeekendSleepTimeAnswer.split(':')[1])
    )
    const SocialSleepTimeDifference = Math.round(
      Math.abs(actualSleepTime.getTime() - WeekendSleepTime.getTime()) /
        (60 * 1000)
    ) // difference in minutes

    const SocialSleepTimeDifferenceScore =
      SocialSleepTimeDifference > 180
        ? 100
        : parseInt(
            eveluateScore(
              'SocialSleepTimeDifference',
              SocialSleepTimeDifference
            ).evaluation.slice(0, -1)
          )

    const WeekendWakeTimeAnswer = findAnswerById(136).answer
    const WeekendWakeTime = new Date(
      2023,
      0,
      1,
      parseInt(WeekendWakeTimeAnswer.split(':')[0]),
      parseInt(WeekendWakeTimeAnswer.split(':')[1])
    )
    const SocialWakeTimeDifference = Math.round(
      Math.abs(actualWakeTime.getTime() - WeekendWakeTime.getTime()) /
        (60 * 1000)
    ) // difference in minutes

    const SocialWakeTimeDifferenceScore =
      SocialWakeTimeDifference > 180
        ? 100
        : parseInt(
            eveluateScore(
              'SocialWakeTimeDifference',
              SocialWakeTimeDifference
            ).evaluation.slice(0, -1)
          )
    // console.log(
    //   'social',
    //   SocialSleepTimeDifference,
    //   SocialSleepTimeDifferenceScore,
    //   SocialWakeTimeDifference,
    //   SocialWakeTimeDifferenceScore
    // )
    const SocialJetLagScore =
      Math.round(
        ((SocialSleepTimeDifferenceScore + SocialWakeTimeDifferenceScore * 2) /
          3) *
          10
      ) / 10

    const SocialJetLagRating = ratingTable.find(
      (r) =>
        SocialJetLagScore <= r.upperLimit && SocialJetLagScore >= r.lowerLimit
    ).label
    const IrregularWorkingHours = findAnswerById(72).score === 1 ? 0.5 : 1
    const CircadianTotalScore =
      (parseInt(
        ((CircadianAlignmentScore * 6 +
          SleepWakeRegularityEvaluation * 4 +
          SocialJetLagScore) /
          11) *
          10
      ) /
        10) *
      IrregularWorkingHours
    const CircadianTotalScoreRating = ratingTable.find(
      (r) =>
        CircadianTotalScore <= r.upperLimit &&
        CircadianTotalScore >= r.lowerLimit
    ).label
    return [
      {
        id: 'CircadianAlignment',
        key: 'Circadian Alignment',
        value: CircadianAlignmentScore + '%',
        rating: CircadianAlignmentRating,
      },
      {
        id: 'SleepWakeRegularity',
        key: 'Sleep Wake Regularity',
        value: SleepWakeRegularityEvaluation + '%',
        rating: SleepWakeRegularityRating,
      },
      {
        id: 'SocialJetLag',
        key: 'Social Jet Lag',
        value: SocialJetLagScore + '%',
        rating: SocialJetLagRating,
      },
      {
        id: 'IrregularWorkingHours',
        key: 'Irregular Working Hours',
        value: IrregularWorkingHours * 100 + '%',
      },
      {
        id: 'CircadianTotalScore',
        key: 'Circadian Total Score',
        value: CircadianTotalScore + '%',
        rating: CircadianTotalScoreRating,
      },
    ]
  }

  function getBreathingFunction() {
    const RegularSnoring = findAnswerById(26).score
    const StopBreathingGasping = findAnswerById(27).score
    const DryMouthOrSoreThroat = findAnswerById(31).score
    const HighBloodPressure = findAnswerById(93).score
    // const BreathingFunctionQuestions = ['26', '27', '31', '93']
    const BreathingFunctionScore =
      RegularSnoring +
      StopBreathingGasping +
      DryMouthOrSoreThroat +
      HighBloodPressure
    const BreathingFunctionEvaluation = parseInt(
      eveluateScore(
        'BreathingFunctionScore',
        BreathingFunctionScore
      ).evaluation.slice(0, -1)
    )
    const CHeight = parseFloat(findAnswerById(12).answer)
    const CWeight = parseFloat(findAnswerById(13).answer)
    const CBMI = Math.round((CWeight / Math.pow(CHeight / 100, 2)) * 10) / 10
    const BreathingFunctionBMI = parseInt(
      eveluateScore('BreathingFunctionBMI', CBMI).evaluation.slice(0, -1)
    )
    const BreathingFunctionTotalScore = Math.round(
      (4 * BreathingFunctionEvaluation + BreathingFunctionBMI) / 5
    )
    const BreathingFunctionRating = ratingTable.find(
      (r) =>
        BreathingFunctionTotalScore <= r.upperLimit &&
        BreathingFunctionTotalScore >= r.lowerLimit
    ).label

    return [
      {
        id: 'RegularSnoring',
        key: 'Regular Snoring',
        value: RegularSnoring,
        evaluation: RegularSnoring === 3,
      },
      {
        id: 'StopBreathingGasping',
        key: 'Stop Breathing Gasping',
        value: StopBreathingGasping,
        evaluation: StopBreathingGasping === 3,
      },
      {
        id: 'DryMouthOrSoreThroat',
        key: 'Dry Mouth Or Sore Throat',
        value: DryMouthOrSoreThroat,
        evaluation: DryMouthOrSoreThroat === 3,
      },
      {
        id: 'HighBloodPressure',
        key: 'High Blood Pressure',
        value: HighBloodPressure,
        evaluation: HighBloodPressure === 1,
      },
      {
        id: 'BreathingFunction',
        key: 'Breathing Function',
        value: BreathingFunctionTotalScore + '%',
        evaluation: BreathingFunctionRating,
      },
    ]
  }

  function getDaytimeEnergy() {
    const essScore = parseInt(getESS()[0].evaluation.slice(0, -1))
    const fasScore = parseInt(
      getFAS()
        .find((fas) => fas.id === 'GlobalFSSScore')
        .evaluation.slice(0, -1)
    )
    const CycleLength = 90
    const SleepinessLength = 20
    const DaytimeEnergyScore =
      essScore < fasScore
        ? Math.round(
            ((CycleLength - SleepinessLength) * fasScore +
              SleepinessLength * essScore) /
              CycleLength
          )
        : fasScore

    const DaytimeEnergyRating = ratingTable.find(
      (r) =>
        DaytimeEnergyScore <= r.upperLimit && DaytimeEnergyScore >= r.lowerLimit
    ).label
    return [
      {
        id: 'DaytimeEnergy',
        key: 'Daytime Energy',
        value: DaytimeEnergyScore + '%',
        evaluation: DaytimeEnergyRating,
      },
    ]
  }

  function getSleepEnvironmentHygieneStress() {
    const SleepEnvQuestions = ['62', '81', '84', '59', '63']
    const SleepEnvScore = answers
      .filter(
        (a) =>
          SleepEnvQuestions.includes(a.psqiid.toString()) ||
          SleepEnvQuestions.includes(a.psqiid)
      )
      .reduce(
        (accumulator, currentValue) => accumulator + currentValue.score,
        0
      )
    const BedroomTemperature = findAnswerById(60).answer
    const BedroomTemperatureScore =
      BedroomTemperature < 18
        ? 1
        : BedroomTemperature > 18 && BedroomTemperature <= 22
        ? 0
        : BedroomTemperature > 22 && BedroomTemperature <= 24
        ? 1
        : (BedroomTemperature > 24 && BedroomTemperature) <= 26
        ? 2
        : 3
    const SleepEnvironmentEvaluation = eveluateScore(
      'SleepEnvironment',
      SleepEnvScore + BedroomTemperatureScore
    )

    const SleepHabitsQuestions = [
      '46',
      '49',
      '50',
      '51',
      '106',
      '66',
      '133',
      '41',
    ]
    const SleepHabitsScore = answers
      .filter(
        (a) =>
          SleepHabitsQuestions.includes(a.psqiid.toString()) ||
          SleepHabitsQuestions.includes(a.psqiid)
      )
      .reduce(
        (accumulator, currentValue) => accumulator + currentValue.score,
        0
      )
    const SleepDifficulty =
      findAnswerById('14a').score > 0 &&
      findAnswerById('14b').score > 0 &&
      findAnswerById('14c').score > 0
    const TakeNap = findAnswerById(52) > 0
    const SleepDiffAndNapScore = !SleepDifficulty ? 0 : TakeNap ? 3 : 0
    const SleepHabitsEvaluation = eveluateScore(
      'SleepHabits',
      SleepHabitsScore + SleepDiffAndNapScore
    )
    const SleepHygieneScore =
      SleepEnvScore +
      BedroomTemperatureScore +
      SleepHabitsScore +
      SleepDiffAndNapScore

    const SleepHygieneEvaluation = eveluateScore(
      'SleepHygiene',
      SleepHygieneScore
    )

    const SleepStressQuestions = ['9', '15', '91', '132', '76']
    const SleepStressScore = answers
      .filter(
        (a) =>
          SleepStressQuestions.includes(a.psqiid.toString()) ||
          SleepStressQuestions.includes(a.psqiid)
      )
      .reduce(
        (accumulator, currentValue) => accumulator + currentValue.score,
        0
      )

    const SleepStressEvaluation = eveluateScore('SleepStress', SleepStressScore)
    return [
      {
        id: 'SleepEnvironment',
        key: 'Sleep Environment',
        value: SleepEnvScore + BedroomTemperatureScore,
        evaluation: SleepEnvironmentEvaluation.evaluation,
        rating: SleepEnvironmentEvaluation.rating,
      },
      {
        id: 'SleepHabits',
        key: 'Sleep Habits',
        value: SleepHabitsScore + SleepDiffAndNapScore,
        evaluation: SleepHabitsEvaluation.evaluation,
        rating: SleepHabitsEvaluation.rating,
      },
      {
        id: 'SleepHygiene',
        key: 'Sleep Hygiene',
        value: SleepHygieneScore,
        evaluation: SleepHygieneEvaluation.evaluation,
        rating: SleepHygieneEvaluation.rating,
      },
      {
        id: 'SleepStress',
        key: 'Sleep Stress',
        value: SleepStressScore,
        evaluation: SleepStressEvaluation.evaluation,
        rating: SleepStressEvaluation.rating,
      },
    ]
  }

  function getSynchronizers() {
    const LightInTheMorningScore = findAnswerById(41).score
    const LightInTheMorning =
      parseInt(
        eveluateScore(
          'LightInTheMorning',
          LightInTheMorningScore
        ).evaluation.slice(0, -1)
      ) / 100
    const LightAtHomeScore = findAnswerById(133).score
    const LightAtHome =
      parseInt(
        eveluateScore('BrightEnvironment', LightAtHomeScore).evaluation.slice(
          0,
          -1
        )
      ) / 100
    const BrightBedroomScore = findAnswerById(59).score
    const BrightBedroom =
      parseInt(
        eveluateScore('BrightEnvironment', BrightBedroomScore).evaluation.slice(
          0,
          -1
        )
      ) / 100
    const MelatoninFactorsScore = Math.round(
      LightInTheMorning * ((LightAtHome * 2 + BrightBedroom * 6) / 8) * 100
    )
    const MelatoninFactorsRating = ratingTable.find(
      (r) =>
        MelatoninFactorsScore <= r.upperLimit &&
        MelatoninFactorsScore >= r.lowerLimit
    ).label

    const BreakfastUponAwakeningScore = findAnswerById(137).score
    const BreakfastUponAwakening = parseInt(
      eveluateScore(
        'BreakfastUponAwakening',
        BreakfastUponAwakeningScore
      ).evaluation.slice(0, -1)
    )
    const PhysicalActivityInTheMorningScore = findAnswerById(138).score
    const PhysicalActivityInTheMorning = parseInt(
      eveluateScore(
        'PhysicalActivityInTheMorning',
        PhysicalActivityInTheMorningScore
      ).evaluation.slice(0, -1)
    )
    const MorningSynchronizerScore = Math.round(
      (BreakfastUponAwakening +
        PhysicalActivityInTheMorning +
        LightInTheMorning * 100) /
        3
    )
    const MorningSynchronizerRating = ratingTable.find(
      (r) =>
        MorningSynchronizerScore <= r.upperLimit &&
        MorningSynchronizerScore >= r.lowerLimit
    ).label

    const SynchronizersTotalScore = Math.round(
      (MelatoninFactorsScore + MorningSynchronizerScore) / 2
    )

    const SynchronizersTotalRating = ratingTable.find(
      (r) =>
        SynchronizersTotalScore <= r.upperLimit &&
        SynchronizersTotalScore >= r.lowerLimit
    ).label

    return [
      {
        id: 'MelatoninFactors',
        key: 'Melatonin Factors',
        value: MelatoninFactorsScore + '%',
        evaluation: MelatoninFactorsRating,
      },
      {
        id: 'MorningSynchronizer',
        key: 'Morning Synchronizer',
        value: MorningSynchronizerScore + '%',
        evaluation: MorningSynchronizerRating,
      },
      {
        id: 'SynchronizersTotal',
        key: 'Synchronizers Total',
        value: SynchronizersTotalScore + '%',
        evaluation: SynchronizersTotalRating,
      },
    ]
  }

  function getDiagnosis() {
    // Obstructive Sleep Apnea
    const ESS = getESS()[0].value
    const FAS = getFAS().find((i) => i.id === 'GlobalFSSScore').value
    const StopBangArray = getStopBang()
    const Stop = StopBangArray.find((i) => i.id === 'STOP').value
    const Bang = StopBangArray.find((i) => i.id === 'BANG').value
    const Tired = StopBangArray.find((i) => i.id === 'Tired').value
    const StopBang = StopBangArray.find(
      (i) => i.id === 'GlobalStobBangScore'
    ).value
    const DryMouth = findAnswerById(31).score
    const DifficultyBreathing = findAnswerById('5d').score
    const DryMouthOrDifficultyBreathing =
      DryMouth > 0 || DifficultyBreathing > 0
    const ESSFASTired = ESS >= 10 || (FAS >= 22 && Tired === 1)
    const ObstructiveSleepApnea =
      (Stop >= 3 && ESSFASTired) ||
      (Stop >= 2 &&
        ESSFASTired &&
        (Bang >= 1 || DryMouthOrDifficultyBreathing)) ||
      (StopBang >= 3 && ESSFASTired) ||
      (Bang >= 2 && DryMouthOrDifficultyBreathing)

    // Chronic Insomnia Disorder
    const ISI = getIsi().find((i) => i.id === 'GlobalISIScore').value
    const SleepDisturbancePerWeek =
      findAnswerById('5a').score === 3 || findAnswerById('5b').score === 3
    const SleepDisturbanceForMonths = findAnswerById(83).score
    const ConcernedAboutSleep = findAnswerById(15).score >= 1
    const SleepingMedication = findAnswerById(7).score === 3
    const ChronicInsomniaDisorder =
      (ISI >= 10 && SleepDisturbanceForMonths > 1 && SleepDisturbancePerWeek) ||
      (SleepingMedication &&
        ConcernedAboutSleep &&
        SleepDisturbanceForMonths > 1)

    // Short-Term Insomnia Disorder
    const ShortTermInsomniaDisorder =
      (ISI >= 10 && SleepDisturbanceForMonths <= 1) ||
      (SleepDisturbancePerWeek &&
        ConcernedAboutSleep &&
        SleepDisturbanceForMonths <= 1)

    // Other Insomnia Disorder
    const OtherInsomniaDisorder =
      ISI >= 10 && !ChronicInsomniaDisorder && !ShortTermInsomniaDisorder

    // Inadequate Sleep Hygiene
    const RecurrentNap = findAnswerById(52).score >= 1
    const VariableWakeupTime = findAnswerById(18).score > 1
    const VariableBedtime = findAnswerById(16).score > 1
    const RoutineUseOfStimulantPrecedingBedtime = findAnswerById(51).score > 1
    const ExercisingBeforeBedtime = findAnswerById(46).score > 1
    const FrequentUseBedForNonSleepActivities = findAnswerById(49).score > 1
    const EngagingEmotionallyIntenseActivities = findAnswerById(66).score > 1
    const WatchScreen2HoursBeforeSleep = findAnswerById(50).score > 1
    const SleepingOnUncomfortableBed = findAnswerById(62).score > 1
    const AllowingBedroomTooBright = findAnswerById(59).score >= 1 //maybe question 59 instead of 2?
    const AllowingBedroomStuffy = findAnswerById(81).score >= 1
    const AllowingBedroomHotOrCold =
      findAnswerById(60).answer < 18 || findAnswerById(60).answer > 22
    const AllowingMentalActivitiesInBed = findAnswerById(106).score >= 1
    const RoutineUseAlcoholOrTobaccoInBedtime = findAnswerById(40).score >= 1
    const InadequateSleepHygiene =
      (ChronicInsomniaDisorder || ShortTermInsomniaDisorder) &&
      (RecurrentNap ||
        VariableWakeupTime ||
        VariableBedtime ||
        RoutineUseOfStimulantPrecedingBedtime ||
        ExercisingBeforeBedtime ||
        FrequentUseBedForNonSleepActivities ||
        EngagingEmotionallyIntenseActivities ||
        WatchScreen2HoursBeforeSleep ||
        SleepingOnUncomfortableBed ||
        AllowingBedroomTooBright ||
        AllowingBedroomStuffy ||
        AllowingBedroomHotOrCold ||
        AllowingMentalActivitiesInBed ||
        RoutineUseAlcoholOrTobaccoInBedtime)

    // Psycho-Physiological Insomnia
    const WorriedAtBedtime = findAnswerById(131).score > 0
    const SleepBetterOutsideBedroom = findAnswerById(76).score > 0
    const PsychoPhysiologicalInsomnia =
      (ChronicInsomniaDisorder || ShortTermInsomniaDisorder) &&
      (WorriedAtBedtime || SleepBetterOutsideBedroom)

    // Insomnia due to Medical Disease
    const InsomniaDueToMedicalDiseaseQuestion = [
      '107',
      '108',
      '109',
      '110',
      '111',
      '112',
      '114',
      '115',
      '116',
    ]

    const MedicalDisorder = answers
      .filter(
        (a) =>
          InsomniaDueToMedicalDiseaseQuestion.includes(a.psqiid.toString()) ||
          InsomniaDueToMedicalDiseaseQuestion.includes(a.psqiid)
      )
      .reduce(
        (accumulator, currentValue) => accumulator + currentValue.score,
        0
      )

    const InsomniaDueToMedicalDisease =
      (ChronicInsomniaDisorder || ShortTermInsomniaDisorder) &&
      MedicalDisorder > 0

    // Insomnia due to Drug or Substance
    const InsomniaDueToDrugOrSubstance =
      (ChronicInsomniaDisorder || ShortTermInsomniaDisorder) &&
      findAnswerById(38).score > 0

    // Circadian Rhythm Sleep-Wake Disorder
    const Noticeability = findAnswerById(91).score > 0
    const Interference = findAnswerById(134).score > 0
    const Distress = findAnswerById(15).score > 0
    const CircadianRhythmSleepWakeDisorder =
      (ESS >= 10 || ISI >= 10 || FAS >= 22) &&
      (Noticeability || Interference || Distress)
    // Delayed Sleep-Wake Phase Disorder
    const HorneCode = getHorne().find((h) => h.id === 'HorneCode').value
    // const EveningType = HorneCode === 4 || HorneCode === 5 // for calculate bonus?
    const ActualWakeTimeAnswer = findAnswerById(3).answer
    const ActualWakeTime = new Date(
      2023,
      0,
      1,
      parseInt(ActualWakeTimeAnswer.split(':')[0]),
      parseInt(ActualWakeTimeAnswer.split(':')[1])
    )
    const IdealWakeTimeAnswer = findAnswerById(94).answer
    const IdealWakeTime = new Date(
      2023,
      0,
      1,
      parseInt(IdealWakeTimeAnswer.split(':')[0]),
      parseInt(IdealWakeTimeAnswer.split(':')[1])
    )
    const ActualSleepTimeAnswer = findAnswerById(1).answer
    const ActualSleepTime = new Date(
      2023,
      0,
      parseInt(ActualSleepTimeAnswer.split(':')[0]) < 12 ? 2 : 1,
      parseInt(ActualSleepTimeAnswer.split(':')[0]),
      parseInt(ActualSleepTimeAnswer.split(':')[1])
    )
    const IdealSleepTimeAnswer = findAnswerById(117).answer
    const IdealSleepTime = new Date(
      2023,
      0,
      parseInt(IdealSleepTimeAnswer.split(':')[0]) < 12 ? 2 : 1,
      parseInt(IdealSleepTimeAnswer.split(':')[0]),
      parseInt(IdealSleepTimeAnswer.split(':')[1])
    )
    const DelayedIdealWakeTime =
      ActualWakeTime.valueOf() - IdealWakeTime.valueOf()
    const DelayedIdealSleepTime =
      ActualSleepTime.valueOf() - IdealSleepTime.valueOf()
    const DifficultyFallAsleep = findAnswerById('14a').score
    const HighLatency5a = findAnswerById('5a').score
    const HighLatency2 = findAnswerById(2).score
    const DifficultyWakeUp = findAnswerById('14d').score > 0
    const NoProblemWakingEarly = findAnswerById('14c').score === 0
    const DelayedSleepWakePhaseDisorder =
      CircadianRhythmSleepWakeDisorder &&
      DelayedIdealWakeTime >= 2 * 60 * 60 * 1000 &&
      DelayedIdealSleepTime >= 2 * 60 * 60 * 1000 &&
      (DifficultyFallAsleep > 0 || HighLatency5a > 2 || HighLatency2 > 1) &&
      DifficultyWakeUp &&
      NoProblemWakingEarly

    // Advanced Sleep-Wake Phase Disorder
    const MorningType = HorneCode === 1 || HorneCode === 2
    const EarlyMorningInsomnia = findAnswerById('14c').score > 0
    const MaintenanceInsomnia = findAnswerById('14b').score > 0
    const AdvancedSleepWakePhaseDisorder =
      CircadianRhythmSleepWakeDisorder &&
      MorningType &&
      DelayedIdealWakeTime <= 2 * 60 * 60 * 1000 &&
      DelayedIdealSleepTime <= 2 * 60 * 60 * 1000 &&
      (EarlyMorningInsomnia || MaintenanceInsomnia) &&
      (DifficultyFallAsleep === 0 || HighLatency5a < 1 || HighLatency2 <= 1)

    // Shift Work Disorder
    // const NoPrimaryInsomnia = !( // is it Bonus to calculate Severity or Susbicion?
    //   ChronicInsomniaDisorder || ShortTermInsomniaDisorder
    // )
    const ShiftWorkDisorder =
      CircadianRhythmSleepWakeDisorder && findAnswerById(72).score === 1

    // Jet Lag Disorder
    const JetLagDisorder =
      CircadianRhythmSleepWakeDisorder && findAnswerById(96).score === 1

    // Irregular Sleep-Wake Disorder
    const IrregularSleepWakeDisorder =
      CircadianRhythmSleepWakeDisorder &&
      findAnswerById(73).score > 0 &&
      findAnswerById(83).score > 1

    // Social Jet Lag Disorder
    const SocialJetLagDisorder =
      CircadianRhythmSleepWakeDisorder &&
      findAnswerById(44).score > 0 &&
      findAnswerById(45).answer > 2

    // Global Hypersomnolence
    const HSI = getHSI()[0].value
    const GlobalHypersomnolence =
      (ESS >= 10 || HSI >= 10) &&
      findAnswerById('14a').score === 0 &&
      findAnswerById(2).score === 0
    // Narcolepsy Type 1
    const NarcolepsyType1 =
      GlobalHypersomnolence &&
      findAnswerById(79).score === 1 &&
      findAnswerById(78).score > 0
    // Narcolepsy Type 2
    const NarcolepsyType2 =
      GlobalHypersomnolence &&
      findAnswerById(79).score === 0 &&
      findAnswerById(78).score > 0
    // Insufficient Sleep Syndrome
    const InbedTimeAnswer = findAnswerById(1).answer // not single choice question, use answer text or number
    const AwakeTimeAnswer = findAnswerById(3).answer // not single choice question, use answer text or number
    const inBedHour = parseInt(InbedTimeAnswer.split(':')[0])
    const inBedMinute = parseInt(InbedTimeAnswer.split(':')[1])
    const TimeInBed = new Date(
      2023,
      0,
      inBedHour < 12 ? 2 : 1,
      inBedHour,
      inBedMinute
    )
    const awakeHour = parseInt(AwakeTimeAnswer.split(':')[0])
    const awakeMinute = parseInt(AwakeTimeAnswer.split(':')[1])
    const TimeAwake = new Date(2023, 0, 2, awakeHour, awakeMinute)
    const inBedMinuteCount = parseInt(
      (TimeAwake.getTime() - TimeInBed.getTime()) / (60 * 1000)
    )
    const NoMedicationsOrDiseasesQuestion = [
      '7',
      '38',
      '40',
      '105',
      '107',
      '108',
      '109',
      '110',
      '111',
      '112',
      '114',
      '115',
      '116',
    ]
    const NoMedicationsOrDiseasesScore = answers
      .filter(
        (a) =>
          NoMedicationsOrDiseasesQuestion.includes(a.psqiid.toString()) ||
          NoMedicationsOrDiseasesQuestion.includes(a.psqiid)
      )
      .reduce(
        (accumulator, currentValue) => accumulator + currentValue.score,
        0
      )

    const InsufficientSleepSyndrome =
      (GlobalHypersomnolence &&
        inBedMinuteCount < 6 * 60 &&
        !NarcolepsyType1 &&
        !NarcolepsyType2) ||
      (GlobalHypersomnolence &&
        inBedMinuteCount > 6 * 60 &&
        inBedMinuteCount < 10 * 60 &&
        !ObstructiveSleepApnea &&
        !NarcolepsyType1 &&
        !NarcolepsyType2 &&
        NoMedicationsOrDiseasesScore === 0 &&
        !CircadianRhythmSleepWakeDisorder)

    // Hypersomnia due to medication
    const HypersomniaDueToMedication =
      GlobalHypersomnolence &&
      findAnswerById(105).score > 0 &&
      findAnswerById(7).score > 0 &&
      !ObstructiveSleepApnea &&
      !NarcolepsyType1 &&
      !NarcolepsyType2 &&
      !CircadianRhythmSleepWakeDisorder

    // Hypersomnia due to medical disorder
    const HypersomniaDueToMedicalDisorder =
      GlobalHypersomnolence &&
      MedicalDisorder > 0 &&
      !ObstructiveSleepApnea &&
      !NarcolepsyType1 &&
      !NarcolepsyType2 &&
      !CircadianRhythmSleepWakeDisorder

    // Idiopathic Hypersomnia
    const IdiopathicHypersomnia =
      GlobalHypersomnolence &&
      inBedMinuteCount >= 11 * 60 &&
      !NarcolepsyType1 &&
      !NarcolepsyType2 &&
      !InsufficientSleepSyndrome &&
      !HypersomniaDueToMedication &&
      !HypersomniaDueToMedicalDisorder

    // Environmental Sleep Disorder
    const EnvironmentalSleepDisorder =
      ISI >= 8 &&
      findAnswerById(84).score > 0 &&
      findAnswerById(59).score > 0 &&
      findAnswerById(63).score > 0 &&
      findAnswerById('5f').score > 0

    return [
      {
        id: 'ObstructiveSleepApnea',
        key: 'Obstructive Sleep Apnea',
        key_cn: '阻塞性睡眠呼吸暂停综合症',
        value: ObstructiveSleepApnea,
        order: 1,
      },
      {
        id: 'NarcolepsyType1',
        key: 'Narcolepsy Type 1',
        key_cn: '1型发作性睡病(嗜睡症)',
        value: NarcolepsyType1,
        order: 2,
      },
      {
        id: 'NarcolepsyType2',
        key: 'Narcolepsy Type 2',
        key_cn: '2型发作性睡病(嗜睡症)',
        value: NarcolepsyType2,
        order: 3,
      },
      {
        id: 'InsufficientSleepSyndrome',
        key: 'Insufficient Sleep Syndrome',
        key_cn: '睡眠不足综合症',
        value: InsufficientSleepSyndrome,
        order: 4,
      },
      {
        id: 'HypersomniaDueToMedication',
        key: 'Hypersomnia Due To Medication',
        key_cn: '药物性过度嗜睡',
        value: HypersomniaDueToMedication,
        order: 5,
      },
      {
        id: 'HypersomniaDueToMedicalDisorder',
        key: 'Hypersomnia Due To Medical Disorder',
        key_cn: '由医学疾病引起的过度嗜睡',
        value: HypersomniaDueToMedicalDisorder,
        order: 6,
      },
      {
        id: 'IdiopathicHypersomnia',
        key: 'Idiopathic Hypersomnia',
        key_cn: '特发性嗜睡症',
        value: IdiopathicHypersomnia,
        order: 7,
      },
      // {
      //   id: 'CircadianRhythmSleepWakeDisorder',
      //   key: 'Circadian Rhythm Sleep Wake Disorder',
      //   key_cn: '昼夜节律性睡眠-觉醒障碍',
      //   value: CircadianRhythmSleepWakeDisorder,
      //   order: 1,
      // },
      {
        id: 'DelayedSleepWakePhaseDisorder',
        key: 'Delayed Sleep-Wake Phase Disorder',
        key_cn: '睡眠-觉醒时相延迟综合症',
        value: DelayedSleepWakePhaseDisorder,
        order: 8,
      },
      {
        id: 'AdvancedSleepWakePhaseDisorder',
        key: 'Advanced Sleep-Wake Phase Disorder',
        key_cn: '睡眠-觉醒时相提前综合症',
        value: AdvancedSleepWakePhaseDisorder,
        order: 9,
      },
      {
        id: 'IrregularSleepWakeDisorder',
        key: 'Irregular Sleep Wake Disorder',
        key_cn: '不规律睡眠-觉醒模式障碍',
        value: IrregularSleepWakeDisorder,
        order: 10,
      },
      {
        id: 'ChronicInsomniaDisorder',
        key: 'Chronic Insomnia Disorder',
        key_cn: '慢性失眠症',
        value: ChronicInsomniaDisorder,
        order: 11,
      },
      {
        id: 'SocialJetLagDisorder',
        key: 'Social Jet Lag Disorder',
        key_cn: '社会性时差综合症',
        value: SocialJetLagDisorder,
        order: 11,
      },
      {
        id: 'ShortTermInsomniaDisorder',
        key: 'Short-Term Insomnia Disorder',
        key_cn: '短期失眠症',
        value: ShortTermInsomniaDisorder,
        order: 12,
      },
      {
        id: 'ShiftWorkDisorder',
        key: 'Shift Work Disorder',
        key_cn: '轮班工作睡眠障碍',
        value: ShiftWorkDisorder,
        order: 12,
      },
      {
        id: 'OtherInsomniaDisorder',
        key: 'Other Insomnia Disorder',
        key_cn: '其他失眠症',
        value: OtherInsomniaDisorder,
        order: 13,
      },
      {
        id: 'JetLagDisorder',
        key: 'Jet Lag Disorder',
        key_cn: '时差综合症',
        value: JetLagDisorder,
        order: 13,
      },
      {
        id: 'InadequateSleepHygiene',
        key: 'Inadequate Sleep Hygiene',
        key_cn: '不良睡眠卫生',
        value: InadequateSleepHygiene,
        order: 14,
      },
      {
        id: 'PsychoPhysiologicalInsomnia',
        key: 'Psycho Physiological Insomnia',
        key_cn: '心理生理性失眠',
        value: PsychoPhysiologicalInsomnia,
        order: 15,
      },
      {
        id: 'InsomniaDueToMedicalDisease',
        key: 'Insomnia Due To MedicalDisease',
        key_cn: '由医学疾病引起的失眠',
        value: InsomniaDueToMedicalDisease,
        order: 16,
      },
      {
        id: 'InsomniaDueToDrugOrSubstance',
        key: 'Insomnia Due To Drug Or Substance',
        key_cn: '由药物或物质引起的失眠',
        value: InsomniaDueToDrugOrSubstance,
        order: 17,
      },
      // {
      //   id: 'GlobalHypersomnolence',
      //   key: 'Global Hypersomnolence',
      //   key_cn: '全身性过度嗜睡',
      //   value: GlobalHypersomnolence,
      //   order: 1,
      // },
      {
        id: 'EnvironmentalSleepDisorder',
        key: 'Environmental Sleep Disorder',
        key_cn: '环境性睡眠障碍',
        value: EnvironmentalSleepDisorder,
        order: 18,
      },
    ]
  }

  return {
    PSQI: getPsqi(),
    ISI: getIsi(),
    StopBang: getStopBang(),
    ESS: getESS(),
    HSI: getHSI(),
    FAS: getFAS(),
    HorneAssessment: getHorne(),
    CircadianRhythm: getCircadian(),
    BreathingFunction: getBreathingFunction(),
    DaytimeEnergy: getDaytimeEnergy(),
    SleepEnvironmentHygieneStress: getSleepEnvironmentHygieneStress(),
    Synchronizers: getSynchronizers(),
    Diagnosis: getDiagnosis(),
  }
}
