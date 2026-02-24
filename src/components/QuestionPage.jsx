import { WaitingSpinner } from '@/components/WaitingSpinner'
import { Question } from '@/components/Question'
import { Button } from '@/components/Button'
import { medicalOrMentalDisorderQuestionList } from 'sdconfig'
import en from '../locales/en'
import zh from '../locales/zh'

export function QuestionPage({
  loadingQuestions,
  questions,
  answers,
  setAnswers,
  page,
  maxPage,
  prevPage,
  allowSubmit,
  nextPage,
  locale,
  sectionTitle,
}) {
  const medicalOrMentalDisorder =
    page === 11 && answers && answers['80431f7a64bac13d01180c663d3c82dc']
      ? answers['80431f7a64bac13d01180c663d3c82dc'].score
      : null
  const t = locale === 'en' ? en : zh

  const visibleQuestions =
    page === 11
      ? questions.filter((q) =>
          medicalOrMentalDisorder !== 1
            ? !medicalOrMentalDisorderQuestionList.includes(q.psqi.toString())
            : true
        )
      : questions

  return loadingQuestions ? (
    <WaitingSpinner />
  ) : (
    <div className="flex flex-col gap-6">
      {/* Section header */}
      {sectionTitle && (
        <div className="border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-bluebg-500 text-xs font-bold text-white">
              {page}
            </span>
            <h2 className="text-lg font-semibold text-gray-900">{sectionTitle}</h2>
          </div>
          <p className="mt-1 text-xs text-gray-400 pl-9">
            Section {page} of {maxPage}
          </p>
        </div>
      )}

      {/* Question cards */}
      <div className="space-y-4">
        {visibleQuestions.map((question) => (
          <div
            key={question._id}
            className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <Question
              question={question}
              answers={answers}
              updateAnswers={setAnswers}
            />
            {question.psqi.toString() === '70' && medicalOrMentalDisorder === 1 ? (
              <div className="mt-4 text-sm text-gray-500">{t.specifyDetails}</div>
            ) : null}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3 pt-2">
        <Button disabled={page === 1} onClick={prevPage} variant="outline" color="blue">
          {t.previous}
        </Button>
        <Button
          disabled={!allowSubmit}
          onClick={nextPage}
          variant="solid"
          color="blue"
          style={{ boxShadow: '0px 7px 20px #4184F73D' }}
        >
          <span className="px-2">{page === maxPage ? t.complete : t.next}</span>
        </Button>
      </div>
    </div>
  )
}
