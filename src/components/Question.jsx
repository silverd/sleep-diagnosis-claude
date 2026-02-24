import {
  RadioField,
  DateField,
  NumberField,
  TimeField,
  TextField,
} from '@/components/Fields'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { medicalOrMentalDisorderQuestionList } from 'sdconfig'
const answerValidation = {
  psqi12: {
    min: 10,
    max: 250,
    errorMsg: {
      cn: '请输入10~250之间的数字',
      en: 'Height should be a number between 10 and 250',
    },
  },
  psqi13: {
    min: 1,
    max: 300,
    errorMsg: {
      cn: '请输入1~300之间的数字',
      en: 'Weight should be a number between 1 and 300',
    },
  },
  psqi4: {
    min: 0,
    max: 24,
    errorMsg: {
      cn: '请输入0~24之间的数字',
      en: 'Should be a number between 0 and 24',
    },
  },
  psqi60: {
    min: 0,
    max: 50,
    errorMsg: {
      cn: '请输入0~50之间的数字',
      en: 'Should be a number between 0 and 50',
    },
  },
  psqi45: {
    min: 0,
    max: 24,
    errorMsg: {
      cn: '请输入0~24之间的数字',
      en: 'Should be a number between 0 and 24',
    },
  },
}
const getMedicalOrMentalDisorderQuestionIdListByAnswers = (answers) => {
  const answerList = Object.values(answers)
  return answerList
    .filter((a) =>
      medicalOrMentalDisorderQuestionList.includes(a.psqiid.toString())
    )
    .map((a) => a.qid)
}

export function Question({ question, answers, updateAnswers }) {
  const [validAnswer, setValidAnswer] = useState(true)
  const router = useRouter()
  const { locale } = router
  const onSelect = (value) => {
    const currentAnswer = { ...answers }
    currentAnswer[question._id].selected = value
    currentAnswer[question._id].answer = question.choice_list[locale].find(
      (c) => c.id === value
    ).title
    currentAnswer[question._id].score = question.choice_list[locale].find(
      (c) => c.id === value
    ).score
    if (question.psqi.toString() === '70') {
      if (currentAnswer[question._id].score === 0) {
        // set all medicalOrMentalDisorderQuestion answers to No
        getMedicalOrMentalDisorderQuestionIdListByAnswers(answers).forEach(
          (qid) => {
            currentAnswer[qid].score = 0
            currentAnswer[qid].answer = locale === 'en' ? 'No' : '否'
            currentAnswer[qid].selected =
              qid + `score_${locale === 'en' ? 'en' : 'cn'}_1_0`
          }
        )
      } else if (currentAnswer[question._id].score === 1) {
        // set all medicalOrMentalDisorderQuestion answers to Not answered
        getMedicalOrMentalDisorderQuestionIdListByAnswers(answers).forEach(
          (qid) => {
            currentAnswer[qid].score = null
            currentAnswer[qid].answer = ''
            currentAnswer[qid].selected = ''
          }
        )
      }
    }

    if (
      medicalOrMentalDisorderQuestionList.includes(question.psqi.toString())
    ) {
      // check all medicalOrMentalDisorderQuestion answers, if all No, set psqi 70 answer to No
      const medicalOrMentalDisorderAnswerListNo = Object.values(answers).filter(
        (a) =>
          medicalOrMentalDisorderQuestionList.includes(a.psqiid.toString()) &&
          a.score === 0
      )
      if (
        medicalOrMentalDisorderAnswerListNo.length ===
        medicalOrMentalDisorderQuestionList.length
      ) {
        currentAnswer['80431f7a64bac13d01180c663d3c82dc'].score = 0
        currentAnswer['80431f7a64bac13d01180c663d3c82dc'].answer =
          locale === 'en' ? 'No' : '否'
        currentAnswer[
          '80431f7a64bac13d01180c663d3c82dc'
        ].selected = `80431f7a64bac13d01180c663d3c82dcscore_${
          locale === 'en' ? 'en' : 'cn'
        }_1_0`
      }
    }
    // console.log('onSelect', currentAnswer)
    updateAnswers(currentAnswer)
  }
  const onDateSelect = (value) => {
    const currentAnswer = { ...answers }
    const { startDate } = value
    currentAnswer[question._id].answer = startDate
    currentAnswer[question._id].score = new Date(startDate).getTime()
    // console.log('onDateSelect', currentAnswer)
    updateAnswers(currentAnswer)
  }
  const onTimeSelect = (value) => {
    const currentAnswer = { ...answers }
    currentAnswer[question._id].answer = value
    // console.log('onDateSelect', value, currentAnswer)
    updateAnswers(currentAnswer)
  }
  const onTextChange = (e) => {
    const currentAnswer = { ...answers }
    currentAnswer[question._id].answer = e.target.value
    updateAnswers(currentAnswer)
  }
  const onNumberInput = (e) => {
    const { value } = e.target
    const currentAnswer = { ...answers }
    if (
      answerValidation['psqi' + question.psqi] &&
      (parseFloat(value) < answerValidation['psqi' + question.psqi].min ||
        parseFloat(value) > answerValidation['psqi' + question.psqi].max)
    ) {
      setValidAnswer(false)
      currentAnswer[question._id].invalid = true
    } else {
      setValidAnswer(true)
      currentAnswer[question._id].invalid = false
    }
    currentAnswer[question._id].answer = value
    // console.log('onNumberInput', value, currentAnswer)
    updateAnswers(currentAnswer)
  }
  return (
    <>
      {question.header ? (
        <div className="block text-sm font-medium text-gray-700">
          {locale === 'en' ? question.header : question.header_cn}
        </div>
      ) : null}
      {question.question_type === 'oneChoice' ? (
        <RadioField
          label={locale === 'en' ? question.question : question.question_cn}
          id={question._id}
          choices={question.choice_list[locale]}
          selected={answers[question._id]?.selected}
          onSelect={onSelect}
        />
      ) : question.question_type === 'exactYear' ? (
        <DateField
          label={locale === 'en' ? question.question : question.question_cn}
          className="max-w-md"
          id={question.id}
          locale={locale}
          value={{
            startDate: answers[question._id].answer,
            endDate: answers[question._id].answer,
          }}
          handleValueChange={onDateSelect}
        />
      ) : question.question_type === 'exactHeight' ? (
        <NumberField
          id={question._id}
          label={locale === 'en' ? question.question : question.question_cn}
          value={answers[question._id].answer}
          className="max-w-md"
          suffix={locale === 'en' ? 'cm' : '厘米'}
          onNumberInput={onNumberInput}
          error={!validAnswer}
          errorMsg={answerValidation['psqi' + question.psqi]?.errorMsg?.[locale] ?? ''}
        />
      ) : question.question_type === 'exactWeight' ? (
        <NumberField
          id={question._id}
          label={locale === 'en' ? question.question : question.question_cn}
          value={answers[question._id].answer}
          className="max-w-md"
          suffix={locale === 'en' ? 'kg' : '公斤'}
          onNumberInput={onNumberInput}
          error={!validAnswer}
          errorMsg={answerValidation['psqi' + question.psqi]?.errorMsg?.[locale] ?? ''}
        />
      ) : question.question_type === 'exactNumber' ? (
        <NumberField
          id={question._id}
          label={locale === 'en' ? question.question : question.question_cn}
          value={answers[question._id].answer}
          className="max-w-md"
          suffix={
            question.psqi.toString() === '2'
              ? locale === 'en' ? 'mins' : '分钟'
              : question.psqi.toString() === '60'
              ? '°C'
              : locale === 'en'
              ? 'hrs'
              : '小时'
          }
          onNumberInput={onNumberInput}
          error={!validAnswer}
          errorMsg={answerValidation['psqi' + question.psqi]?.errorMsg?.[locale] ?? ''}
        />
      ) : question.question_type === 'exactTime' ? (
        <TimeField
          id={question._id}
          label={locale === 'en' ? question.question : question.question_cn}
          className="max-w-md"
          locale={locale}
          value={answers[question._id].answer}
          handleValueChange={onTimeSelect}
        />
      ) : question.question_type === 'freeText' ? (
        <TextField
          id={question._id}
          label={locale === 'en' ? question.question : question.question_cn}
          value={answers[question._id]?.answer ?? ''}
          onChange={onTextChange}
          placeholder={locale === 'en' ? 'Type your answer…' : '请输入您的回答…'}
          className="max-w-md"
        />
      ) : null}
    </>
  )
}
