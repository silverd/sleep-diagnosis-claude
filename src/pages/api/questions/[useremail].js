import { authOptions } from '../auth/[...nextauth]'
import { getServerSession } from 'next-auth/next'
import { mvcDb } from '../../../utils/mvctcb'

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions)
    if (session) {
      const { useremail, page } = req.query
      console.log('useremail', useremail, 'page', page)
      const dbCmd = mvcDb.command
      const questions = await mvcDb
        .collection('sd_question')
        .where({
          publish: true,
          group_id: page ? parseInt(page) : 1,
        })
        // .limit(limit || 20)
        .orderBy('order', 'asc')
        // .field({
        //   content: false,
        // })
        .get()
      console.log('questions', questions)
      const choiceIds = []
      let choices
      questions.data.forEach((q) => {
        if (
          q.question_type === 'oneChoice' &&
          q.choice_options &&
          !choiceIds.includes(q.choice_options)
        )
          choiceIds.push(q.choice_options)
      })
      //   console.log('cid', choiceIds)
      if (choiceIds.length > 0) {
        choices = await mvcDb
          .collection('choiceOptions')
          .where({
            _id: dbCmd.in(choiceIds),
          })
          // .limit(limit || 20)
          // .orderBy(sort || '_updateTime', 'desc')
          // .field({
          //   content: false,
          // })
          .get()
      }
      //   console.log('choices', choices)
      const answers = await mvcDb
        .collection('sd_answers')
        .where({
          user_email: useremail,
          group_id: page ? parseInt(page) : 1,
        })
        // .limit(limit || 20)
        // .orderBy(sort || '_updateTime', 'desc')
        // .field({
        //   content: false,
        // })
        .get()
      console.log('answers', answers)
      const result =
        choices && choices.data
          ? questions.data.map((q) => {
              if (q.question_type === 'oneChoice') {
                const choice_obj = choices.data.find(
                  (c) => c._id === q.choice_options
                )
                const choice_list = []
                for (const [key, value] of Object.entries(choice_obj)) {
                  console.log(`${key}: ${value}`)
                  const params = key.split('_')
                  if (key.includes('score') && value)
                    choice_list.push({
                      id: q._id + key,
                      title: value,
                      language: params[1],
                      order: parseInt(params[2]),
                      score: parseInt(params[3]),
                    })
                }
                q.choice_list = {
                  zh: null,
                  en: null,
                }
                // console.log('reverse-order', choice_obj.reverse_order)
                q.choice_list.zh = choice_list
                  .filter((c) => c.language === 'cn')
                  .sort((a, b) =>
                    choice_obj.reverse_order
                      ? b.order - a.order
                      : a.order - b.order
                  )
                q.choice_list.en = choice_list
                  .filter((c) => c.language === 'en')
                  .sort((a, b) =>
                    choice_obj.reverse_order
                      ? b.order - a.order
                      : a.order - b.order
                  )
                // console.log('ordered list', q.choice_list.en)
              }

              return q
            })
          : questions.data
      if (answers.data && answers.data.length > 0) {
        answers.data.forEach((a) => {
          const qIndex = result.findIndex((r) => r._id === a.qid)
          if (qIndex !== -1) result[qIndex].currentAnswer = a
        })
      }
      return res.status(200).json(result)
    } else {
      return res.status(401).send({ error: 'Unauthorized' })
    }
  } catch (error) {
    console.log('get questions error', error)
    return res.status(500).send({ error: 'failed to fetch data' })
  }
}
