import Head from 'next/head'
import { AppLayout } from '@/components/AppLayout'
import { List } from '@/components/List'
import { calculateDiagnosis } from '@/utils/formula'
import { TextField } from '@/components/Fields'
import { Button } from '@/components/Button'
// import {evaluate} from 'compute-polynomial'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { WaitingSpinner } from '@/components/WaitingSpinner'
import { LoadingDialog } from '@/components/LoadingDialog'
import toast, { Toaster } from 'react-hot-toast'
// import { getSession, useSession } from 'next-auth/react'
// import { WaitingSpinner } from '@/components/WaitingSpinner'
// import { Button } from '@/components/Button'
const testAnswersOfAlex = [
  {
    id: 1,
    psqiid: 10,
    question: 'What is your gender',
    answer: 'M',
    score: 0,
  },
  {
    id: 1,
    psqiid: 11,
    question: 'When were you born?',
    answer: 1996,
    score: 1996,
  },
  {
    id: 1,
    psqiid: 12,
    question: 'How tall are you?',
    answer: 183,
    score: 183,
  },
  {
    id: 1,
    psqiid: 13,
    question: 'What is your weight?',
    answer: 78,
    score: 78,
  },
  {
    id: 2,
    psqiid: '14a',
    question:
      'During the past month, how SEVERE was your Difficulty to fall asleep',
    answer: 'Mild',
    score: 1,
  },
  {
    id: 2,
    psqiid: '14b',
    question:
      'During the past month, how SEVERE was your Difficulty to remain asleep',
    answer: 'Mild',
    score: 0,
  },
  {
    id: 2,
    psqiid: '14c',
    question:
      'During the past month, how SEVERE was your Problems waking up too early',
    answer: 'None',
    score: 0,
  },
  {
    id: 3,
    psqiid: '14f',
    question:
      'During the past month, to what extent do you think that you Sleep too much at night?',
    answer: 'None',
    score: 0,
  },
  {
    id: 3,
    psqiid: '14d',
    question:
      'During the past month, to what extent do you think that you Have difficulty waking up in the morning?',
    answer: 'Mild',
    score: 2,
  },
  {
    id: 3,
    psqiid: '14e',
    question:
      'During the past month, to what extent do you think that you Feel sleepy during the daytime?',
    answer: 'Moderate',
    score: 1,
  },
  {
    id: 3,
    psqiid: '14g',
    question:
      'During the past month, to what extent do you think that you Sleep during the daytime?',
    answer: 'None',
    score: 0,
  },
  {
    id: 4,
    psqiid: 9,
    question:
      'During the past month, how SATISFIED/DISSATISFIED are you with your sleep pattern?',
    answer: 'Moderately satisfied',
    score: 1,
  },
  {
    id: 4,
    psqiid: 15,
    question:
      'During the past month, How WORRIED/DISTRESSED are you about your sleep patern?',
    answer: 'A little worried',
    score: 2,
  },
  {
    id: 4,
    psqiid: 91,
    question:
      'During the past month, How NOTICEABLE to others do you think your sleep patern is in terms of impairing the quality of your life?',
    answer: 'Not noticeable at all',
    score: 2,
  },
  {
    id: '',
    psqiid: 134,
    question:
      'To what extent do you consider your sleep problem to INTERFERE with your daily functioning (e.g. daytime fatigue, mood, ability to function at work/daily chores, concentration, memory, mood, etc.) CURRENTLY?',
    answer: '',
    score: 1,
  },
  {
    id: 4,
    psqiid: 132,
    question:
      'During the past month, before going to bed, How CONCERNED do you get about not being able to fall alseep?',
    answer: 'Somewhat',
    score: 1,
  },
  {
    id: 4,
    psqiid: 83,
    question: 'How long have you had this sleep pattern?',
    answer: 'More than a year',
    score: 2,
  },
  {
    id: 5,
    psqiid: 1,
    question: 'What time do you usually go to bed?',
    answer: '22:00',
    score: '22:00:00',
  },
  {
    id: 5,
    psqiid: 135,
    question: 'On weekends, when have you usually gone to bed at night week?',
    answer: '23:55',
    score: 0,
  },
  {
    id: 5,
    psqiid: 2,
    question:
      'How long do you usually need to fall asleep after turning off the light?',
    answer: '16 - 30 minutes',
    score: 0,
  },
  {
    id: 5,
    psqiid: 3,
    question: 'What time do you usually get in the morning?',
    answer: '5:30',
    score: '5:30:00',
  },
  {
    id: 5,
    psqiid: 136,
    question: 'On weekends, when have you usually gotten up in the morning?',
    answer: '7:40',
    score: '',
  },
  {
    id: 5,
    psqiid: 4,
    question: 'How many hours of actual sleep do you get at night on average?',
    answer: 7,
    score: 7,
  },
  {
    id: 6,
    psqiid: '5a',
    question:
      "During the past month, how often have you had trouble sleeping because you weren't able to get to sleep within 30 minutes",
    answer: 'Less than once a week',
    score: 0,
  },
  {
    id: 6,
    psqiid: '5b',
    question:
      'During the past month, how often have you had trouble sleeping because you woke up in the middle of the night or early morning?',
    answer: 'Less than once a week',
    score: 1,
  },
  {
    id: 6,
    psqiid: '5c',
    question:
      'During the past month, how often have you had trouble sleeping because you had to get up to use the bathroom?',
    answer: 'Not during the past month',
    score: 1,
  },
  {
    id: 6,
    psqiid: '5d',
    question:
      "During the past month, how often have you had trouble sleeping because you couldn't you breathe comfortably?",
    answer: 'Not during the past month',
    score: 1,
  },
  {
    id: 6,
    psqiid: '5e',
    question:
      'During the past month, how often have you had trouble sleeping because you caugh or snore?',
    answer: 'Not during the past month',
    score: 1,
  },
  {
    id: 6,
    psqiid: '5f',
    question:
      'During the past month, how often have you had trouble sleeping because you feel too cold or too hot?',
    answer: 'Once or twice a week',
    score: 2,
  },
  {
    id: 6,
    psqiid: '5h',
    question:
      'During the past month, how often have you had trouble sleeping because you bad dreams?',
    answer: 'Not during the past month',
    score: 2,
  },
  {
    id: 6,
    psqiid: '5i',
    question:
      'During the past month, how often have you had trouble sleeping because you have pain?',
    answer: 'Not during the past month',
    score: 0,
  },
  {
    id: 7,
    psqiid: 97,
    question:
      'How likely are you to doze off or fall asleep while sitting and reading?',
    answer: 'Would never dose',
    score: 2,
  },
  {
    id: 7,
    psqiid: 98,
    question: 'How likely are you to doze off or fall asleep while watching TV',
    answer: 'Would never dose',
    score: 3,
  },
  {
    id: 7,
    psqiid: 99,
    question:
      'How likely are you to doze off or fall asleep while sitting inactive in a public place?',
    answer: 'Would never dose',
    score: 2,
  },
  {
    id: 7,
    psqiid: 100,
    question:
      'How likely are you to doze off or fall asleep while as a passenger in a car for an hour without a break?',
    answer: 'Would never dose',
    score: 2,
  },
  {
    id: 7,
    psqiid: 101,
    question:
      'How likely are you to doze off or fall asleep while lying down to rest in the afternoon?',
    answer: 'High chance of dozing',
    score: 0,
  },
  {
    id: 7,
    psqiid: 102,
    question:
      'How likely are you to doze off or fall asleep while sitting quietly after lunch (when you’ve had no alcohol)?',
    answer: 'Slight chance of dozing',
    score: 0,
  },
  {
    id: 7,
    psqiid: 103,
    question:
      'How likely are you to doze off or fall asleep while sitting and talking with someone?',
    answer: 'Would never dose',
    score: 0,
  },
  {
    id: 7,
    psqiid: 104,
    question:
      'How likely are you to doze off or fall asleep while in a car, while stopped in traffic?',
    answer: 'Would never dose',
    score: 0,
  },
  {
    id: 7,
    psqiid: 78,
    question:
      'Do you ever have “sleep attacks,” defined as unintended sleep in inappropriate situations?',
    answer: 'Not during the past month',
    score: 1,
  },
  {
    id: 8,
    psqiid: 120,
    question: 'I am bothered by fatigue',
    answer: 'Sometimes',
    score: 2,
  },
  {
    id: 8,
    psqiid: 121,
    question: 'I get tired very quickly',
    answer: 'Sometimes',
    score: 2,
  },
  {
    id: 8,
    psqiid: 122,
    question: 'I don’t do much during the day',
    answer: 'Never',
    score: 2,
  },
  {
    id: 8,
    psqiid: 130,
    question: 'Physically, I feel exhausted',
    answer: 'Never',
    score: 2,
  },
  {
    id: 8,
    psqiid: 131,
    question: 'I have problems to start things',
    answer: 'Sometimes',
    score: 3,
  },
  {
    id: 8,
    psqiid: 126,
    question: 'I have problems to think clearly',
    answer: 'Sometimes',
    score: 3,
  },
  {
    id: 8,
    psqiid: 127,
    question: 'I feel no desire to do anything',
    answer: 'Sometimes',
    score: 1,
  },
  {
    id: 8,
    psqiid: 128,
    question: 'Mentally, I feel exhausted',
    answer: 'Sometimes',
    score: 1,
  },
  {
    id: 8,
    psqiid: 123,
    question: 'I have enough energy for everyday life',
    answer: 'Always',
    score: 4,
  },
  {
    id: 8,
    psqiid: 129,
    question: 'When I am doing something, I can concentrate quite well',
    answer: 'Always',
    score: 4,
  },
  {
    id: 9,
    psqiid: 26,
    question:
      'During the past month, have you had loud snoring (observed by yourself or someone else)',
    answer: 'Not during the past month',
    score: 0,
  },
  {
    id: 9,
    psqiid: 27,
    question:
      'During the past month, have you had long pauses between breath while alseep (observed by yourself or someone else)',
    answer: 'Not during the past month',
    score: 0,
  },
  {
    id: 9,
    psqiid: 28,
    question:
      'During the past month, have you had leg twitching (observed by yourself or someone else)',
    answer: 'Not during the past month',
    score: 0,
  },
  {
    id: 9,
    psqiid: 31,
    question:
      'During the past month, how often did you wake with a dry mouth or sore throats?',
    answer: 'Not during the past month',
    score: 1,
  },
  {
    id: 10,
    psqiid: 8,
    question:
      'During the past month, how often have you had trouble staying awake while driving, eating meals, or engaging in social activity??',
    answer: 'Not during the past month',
    score: 0,
  },
  {
    id: 10,
    psqiid: 6,
    question:
      'During the past month, how much of a problem has it been for you to keep up enough enthusiasm to get things done??',
    answer: 'No problem at all',
    score: 2,
  },
  {
    id: 11,
    psqiid: 7,
    question:
      'During the past month, how often did you take medicine to help you sleep (prescribed or “over the counter”)?',
    answer: 'Not during the past month',
    score: 0,
  },
  {
    id: 11,
    psqiid: 38,
    question:
      'During the past month, how often did you take any medicine to remain awake?',
    answer: 'Not during the past month',
    score: 0,
  },
  {
    id: 11,
    psqiid: 40,
    question:
      'During the past month, how often did you use alcohol drinks as a sedative to help you sleep or to relax before bedtime?',
    answer: 'Not during the past month',
    score: 2,
  },
  {
    id: 11,
    psqiid: 105,
    question:
      'During the past month, how often did you take medicine that promotes sleep as a side effect?',
    answer: 'Not during the past month',
    score: 0,
  },
  {
    id: 12,
    psqiid: 18,
    question: 'Is your wakeup time fixed or variable?',
    answer: 'Slightly variable (15 to 30mins)',
    score: 0,
  },
  {
    id: 12,
    psqiid: 16,
    question: 'Is the time you go to bed fixed or variable?',
    answer: 'Slightly variable (15 to 30mins)',
    score: 0,
  },
  {
    id: 12,
    psqiid: 46,
    question:
      'During the past month, how often did you do physical exercise 4 hours before bedtime?',
    answer: 'Not during the past month',
    score: 1,
  },
  {
    id: 12,
    psqiid: 49,
    question:
      'During the past month, how often did you do any more activity on your bed except sleeping and sex? (e.g. watch TV, play videogames, work/study, eat, read...)',
    answer: 'Not during the past month',
    score: 0,
  },
  {
    id: 12,
    psqiid: 50,
    question:
      'During the past month, how often did you watch a screen 2 hours before sleeping?',
    answer: 'Three or more times each week',
    score: 0,
  },
  {
    id: 12,
    psqiid: 51,
    question:
      'During the past month, how often did you use stimulant products 6 hours preceding bedtime? (e.g caffeine)?',
    answer: 'Not during the past month',
    score: 0,
  },
  {
    id: 12,
    psqiid: 52,
    question: 'During the past month, how often did you take a nap?',
    answer: 'Less than once a week',
    score: 1,
  },
  {
    id: 12,
    psqiid: 106,
    question:
      'During the past month, how often did you allow yourself to have mental activities to occur in bed (e.g. thinking, planning, reminiscing)?',
    answer: 'Once or twice each week',
    score: 2,
  },
  {
    id: 12,
    psqiid: 66,
    question:
      'During the past month, how often did you engage with emotionnally intense activities 2 hours before bedtime? (e.g. gaming)?',
    answer: 'Three or more times each week',
    score: 0,
  },
  {
    id: '',
    psqiid: 41,
    question:
      'During the past month, how often did you expose yourself to natural light in the morning for at least 15 minutes?',
    answer: 'Three or more times each week',
    score: 2,
  },
  {
    id: '',
    psqiid: 133,
    question:
      'During the past month, how bright is your light setup in your environment 3 hours before bedtime',
    answer: 'A little bright',
    score: 1,
  },
  {
    id: 13,
    psqiid: 25,
    question: 'Do you have a bed partner or room mate?',
    answer: 'Partner in same bed',
    score: 0,
  },
  {
    id: 14,
    psqiid: 62,
    question: 'Do you consider your bed comfortable?',
    answer: 'Somewhat comfortable',
    score: 1,
  },
  {
    id: 14,
    psqiid: 81,
    question: 'Do you feel like your bedroom is cluttered?',
    answer: 'Not at all',
    score: 1,
  },
  {
    id: 14,
    psqiid: 84,
    question: 'Do you consider your environment noisy while you sleep?',
    answer: 'Not at all',
    score: 0,
  },
  {
    id: 14,
    psqiid: 59,
    question:
      'Is your bedroom bright while you sleep (at night or in the morning)?',
    answer: 'Not at all',
    score: 1,
  },
  {
    id: 14,
    psqiid: 63,
    question: 'Does your bed partner disturb your sleep?',
    answer: "Not really, but it's more comfortable to sleep alone",
    score: 0,
  },
  {
    id: 14,
    psqiid: 76,
    question:
      'Is it easier to fall asleep outside of your bedroom? (e.g. on the coach, etc.)',
    answer: 'Slightly easier',
    score: 1,
  },
  {
    id: 15,
    psqiid: 60,
    question: 'What is your bedroom temperature?',
    answer: 25,
    score: 25,
  },
  {
    id: 7,
    psqiid: 79,
    question:
      'Do you sometimes experience sudden muscle weakness triggered by strong emotion?',
    answer: 'No',
    score: 1,
  },
  {
    id: 16,
    psqiid: 93,
    question: 'Have you been diagnosed with high blood pressure?',
    answer: 'No',
    score: 0,
  },
  {
    id: 16,
    psqiid: 70,
    question:
      'Have you been diagnosed with any other medical or mental disorder?',
    answer: 'No',
    score: 0,
  },
  {
    id: 16,
    psqiid: 107,
    question: 'Cardiovascular Disease or Dysfunction',
    answer: 'No',
    score: 0,
  },
  {
    id: 16,
    psqiid: 108,
    question:
      'Metabolic Disorder (e.g. Diabetes, Renal insufficiency, Hepatic encephalopathy, Pancreatic insufficience)',
    answer: 'No',
    score: 0,
  },
  {
    id: 16,
    psqiid: 109,
    question: 'Gastroesophageal Reflux Disease',
    answer: 'No',
    score: 0,
  },
  {
    id: 16,
    psqiid: 110,
    question:
      'Breathing Difficulty (e.g Asthma, Chronic obstructive pulmonary disease)',
    answer: 'No',
    score: 0,
  },
  {
    id: 16,
    psqiid: 111,
    question: 'Thyroid Disease',
    answer: 'No',
    score: 0,
  },
  {
    id: 16,
    psqiid: 112,
    question: 'Parkinson Disease',
    answer: 'No',
    score: 0,
  },
  {
    id: 16,
    psqiid: 114,
    question:
      'Central Nervous System Disorder (e.g., stroke, head trauma, epilepsy, inflammatory disease of the brain)',
    answer: 'No',
    score: 0,
  },
  {
    id: 16,
    psqiid: 115,
    question: 'Chronic Pain (e.g. Arthritis)',
    answer: 'No',
    score: 0,
  },
  {
    id: 16,
    psqiid: 116,
    question: 'Cancer',
    answer: 'No',
    score: 0,
  },
  {
    id: 17,
    psqiid: 72,
    question:
      'Do you have unusual (e.g. night shifts) or irregular working hours?',
    answer: 'No',
    score: 0,
  },
  {
    id: 17,
    psqiid: 96,
    question:
      'Have you been recently jet-travelling across at least two time zones?',
    answer: 'No',
    score: 0,
  },
  {
    id: 17,
    psqiid: 73,
    question:
      'During the past month, how often have you had at least three sleep episodes during a 24-hour period? (more than one hour each)',
    answer: 'Not during the past month',
    score: 0,
  },
  {
    id: 18,
    psqiid: 94,
    question:
      'Considering only your "feeling best" rhythm, at what time would you get up if you were entirely free to plan your day?',
    answer: '9:00',
    score: '9:00:00',
  },
  {
    id: 18,
    psqiid: 95,
    question:
      'During the first half-hour after having woken in the morning, how tired do you feel?',
    answer: 'Fairly refreshed',
    score: 0,
  },
  {
    id: 18,
    psqiid: 117,
    question:
      'At what time in the evening do you feel tired and as a result are in need of sleep?',
    answer: '22:00',
    score: '22:00:00',
  },
  {
    id: 18,
    psqiid: 118,
    question:
      'At what time do you think that you reach your "feeling best" peak?',
    answer: '10:00',
    score: '10:00:00',
  },
  {
    id: 18,
    psqiid: 119,
    question:
      'One hears about "morning" and "evening" types of people. Which one of these types do you consider yourself to be?',
    answer: 'Rather more a "evening" type than an "morning" type',
    score: 1,
  },
  {
    id: 19,
    psqiid: 139,
    question:
      'Do people say that you wake up during the night and engage in activities that you don’t remember? (e.g., Sleep walking, night terrors, confusional arousal, eating or sexual behaviors)',
    answer: '',
    score: 1,
  },
  {
    id: 17,
    psqiid: 44,
    question: 'Do you sleep in during the weekend?',
    answer: 'Never',
    score: 0,
  },
  {
    id: 17,
    psqiid: 45,
    question:
      'How many more hours of sleep do you get in the weekend compared to the average rest of the week?',
    answer: 1,
    score: 1,
  },
  {
    id: 17,
    psqiid: 137,
    question: 'Do you take breakfast upon awakening?',
    answer: 'Never',
    score: 0,
  },
  {
    id: 17,
    psqiid: 138,
    question: 'Do you have physical activity in the morning?',
    answer: 'Never',
    score: 0,
  },
]

export default function Result() {
  const { data: session, status } = useSession()
  const [results, setResults] = useState(calculateDiagnosis(testAnswersOfAlex))
  const [currentPatient, setCurrentPatient] = useState('Test Patient Alex')
  const [email, setEmail] = useState('')
  const [validEmail, setValidEmail] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  useEffect(() => {
    if (status !== 'loading') {
      if (!session?.user?.email) router.push('/login')
    }
  }, [status])
  useEffect(() => {
    const isEmail = (value) =>
      /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(value)
    if (email && isEmail(email)) {
      setValidEmail(true)
    } else setValidEmail(false)
  }, [email])

  const onEmailInput = (e) => {
    const { value } = e.target
    // console.log('onEmailInput', value)
    setEmail(value)
  }

  const loadResults = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/report/${email}`)
      const data = await res.json()
      console.log('report data', data)
      if (data.completed) {
        setCurrentPatient(email)
        setResults(data)
        toast.success('Results loaded')
      } else {
        console.log('test not complete')
        setCurrentPatient('')
        setResults({
          PSQI: [],
          ISI: [],
          StopBang: [],
          ESS: [],
          HSI: [],
          FAS: [],
          HorneAssessment: [],
          CircadianRhythm: [],
          BreathingFunction: [],
          DaytimeEnergy: [],
          SleepEnvironmentHygieneStress: [],
          Diagnosis: [],
        })
        toast.error(
          `Test has not been completed, ${data.answerCount} out of 102 questions answered`
        )
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error('Can not load the result, please try again later')
      console.log('get result error', error)
    }
  }

  const resetToAlex = () => {
    setEmail('')
    setCurrentPatient('Test Patient Alex')
    setResults(calculateDiagnosis(testAnswersOfAlex))
  }

  return (
    <>
      <Head>
        <title>Result - Engineering Sleep</title>
      </Head>
      <AppLayout>
        {status === 'loading' ? (
          <WaitingSpinner />
        ) : (
          <>
            <Toaster />
            <LoadingDialog open={loading} />
            <main>
              <div className="rounded-md bg-white p-4">
                <TextField
                  id="email"
                  type="email"
                  label="Patient Email"
                  className="max-w-md"
                  value={email}
                  onChange={onEmailInput}
                />
                <div className="mt-4 flex flex-row items-center">
                  <Button
                    disabled={!validEmail}
                    // onClick={nextPage}
                    variant="solid"
                    color="blue"
                    onClick={loadResults}
                  >
                    <span className="px-3">Load Result</span>
                  </Button>
                  <Button
                    // disabled={!allowSubmit}
                    // onClick={nextPage}
                    className="ml-4"
                    variant="outline"
                    color="slate"
                    onClick={resetToAlex}
                  >
                    <span className="px-3">Reset to Test Patient Alex</span>
                  </Button>
                </div>
              </div>
              <h3 className="mb-4 mt-8 text-lg font-semibold">
                Results for {currentPatient}
              </h3>
              <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                <List title="PSQI Score" data={results.PSQI} />
                <List title="ISI Score" data={results.ISI} />
                <List title="StopBang Score" data={results.StopBang} />
                <List title="ESS Score" data={results.ESS} />
                <List title="HSI Score" data={results.HSI} />
                <List title="FAS Score" data={results.FAS} />
                <List title="Daytime Energy" data={results.DaytimeEnergy} />
                <List title="Horne Assessment" data={results.HorneAssessment} />
                <List title="Circadian Rhythm" data={results.CircadianRhythm} />
                <List
                  title="Breathing Function"
                  data={results.BreathingFunction}
                />
                <List title="Synchronizers" data={results.Synchronizers} />
                <List
                  title="Sleep Environment, Hygiene and Stress"
                  data={results.SleepEnvironmentHygieneStress}
                />
                <List title="Diagnosis" data={results.Diagnosis} />
              </div>
            </main>
          </>
        )}
      </AppLayout>
    </>
  )
}
