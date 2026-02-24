import { mvcDb } from './mvctcb'

const replaceId = (obj) => {
  const id = obj._id
  delete obj._id
  return {
    id,
    ...obj,
  }
}

export function TcbAdapter(client, options = {}) {
  return {
    async createUser(user) {
      console.log('createUser', user)
      const existingUser = await mvcDb
        .collection('sdauth_user')
        .where({
          email: user.email,
        })
        .limit(1)
        .get()
      if (existingUser.data && existingUser.data.length > 0) {
        return replaceId(existingUser.data[0])
      }

      const { id } = await mvcDb.collection('sdauth_user').add(user)

      return {
        id,
        ...user,
      }
    },
    async getUser(id) {
      const user = await mvcDb.collection('sdauth_user').doc(id).get()
      console.log('getUser res', user)
      return user.data && user.data.length > 0 && replaceId(user.data[0])
    },
    async getUserByEmail(email) {
      const user = await mvcDb
        .collection('sdauth_user')
        .where({
          email: email,
        })
        .limit(1)
        .get()
      console.log('getUserByEmail res', user)
      return user.data && user.data.length > 0 && replaceId(user.data[0])
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const account = await mvcDb
        .collection('sdauth_account')
        .where({
          provider,
          providerAccountId,
        })
        .get()
      if (!account.data || !account.data[0]) return
      const user = await mvcDb
        .collection('sdauth_user')
        .doc(account.data[0].userId)
        .get()
      return user.data && user.data.length > 0 && replaceId(user.data[0])
    },
    async updateUser(user) {
      const { id } = user
      const existingUser = await mvcDb.collection('sdauth_user').doc(id).get()
      if (!existingUser.data || !existingUser.data[0]) {
        throw new Error(
          `Can not update user ${updatedUser.id}; Unable to find user.`
        )
      }
      const updatedUser = { ...user }
      delete updatedUser.id
      const res = await mvcDb
        .collection('sdauth_user')
        .doc(id)
        .update(updatedUser)
      console.log('updated: ', res.updated)
      return { ...replaceId(existingUser.data[0]), ...updatedUser }
    },
    // async deleteUser(userId) {
    //   const res = await mvcDb.collection('sdauth_user').doc(userId).remove()
    //   return res.deleted
    // },
    async linkAccount(account) {
      await mvcDb.collection('sdauth_account').add(account)
      return account
    },
    // async unlinkAccount({ providerAccountId, provider }) {
    //   return
    // },
    async createSession(session) {
      console.log('createSession', session)
      await mvcDb.collection('sdauth_session').add(session)
      return session
    },
    async getSessionAndUser(sessionToken) {
      const session = await mvcDb
        .collection('sdauth_session')
        .where({
          sessionToken,
        })
        .limit(1)
        .get()
      if (!session.data || !session.data[0]) return
      const user = await mvcDb
        .collection('sdauth_user')
        .doc(session.data[0].userId)
        .get()
      if (!user.data || !user.data[0]) return
      // console.log('getSessionAndUser', session, user)
      return {
        session: session.data[0],
        user: user.data[0],
      }
    },
    async updateSession({ sessionToken }) {
      const existingSession = await mvcDb
        .collection('sdauth_session')
        .where({
          sessionToken,
        })
        .get()
      if (!existingSession.data || !existingSession.data[0]) {
        throw new Error(
          `Can not update sessesion ${sessionToken}; Unable to find session.`
        )
      }
      await mvcDb
        .collection('sdauth_session')
        .doc(existingSession.data[0]._id)
        .update({
          sessionToken,
        })
      return { ...replaceId(existingSession.data[0]), sessionToken }
    },
    async deleteSession(sessionToken) {
      await mvcDb.collection('sdauth_session').where({ sessionToken }).remove()
      return sessionToken
    },
    async createVerificationToken(token) {
      console.log('createVerificationToken', token)
      const res = await mvcDb.collection('sdauth_token').add(token)
      console.log('createVerificationToken res', res)
      return token
    },
    async useVerificationToken({ identifier, token }) {
      console.log('useVerificationToken', { identifier, token })
      const existingToken = await mvcDb
        .collection('sdauth_token')
        .where({
          identifier,
          token,
        })
        .get()
      if (!existingToken.data || !existingToken.data[0]) {
        throw new Error(
          `Can not find identifier ${identifier}, token ${token}.`
        )
      }
      const res = await mvcDb
        .collection('sdauth_token')
        .where({
          identifier,
          token,
        })
        .remove()
      console.log('useVerificationToken res', res)
      return existingToken.data[0]
    },
  }
}
