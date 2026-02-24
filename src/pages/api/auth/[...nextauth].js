import NextAuth from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '~/lib/prisma'
import { Resend } from 'resend'
// Email HTML body
function html({ url, host, email }) {
  // Insert invisible space into domains and email address to prevent both the
  // email address and the domain from being turned into a hyperlink by email
  // clients like Outlook and Apple mail, as this is confusing because it seems
  // like they are supposed to click on their email address to sign in.
  const escapedEmail = `${email.replace(/\./g, '&#8203;.')}`
  // const escapedHost = `${host.replace(/\./g, '&#8203;.')}`

  // Some simple styling options
  const backgroundColor = '#f9f9f9'
  const textColor = '#444444'
  const mainBackgroundColor = '#ffffff'
  const buttonBackgroundColor = '#346df1'
  const buttonBorderColor = '#346df1'
  const buttonTextColor = '#ffffff'

  return `
<body style="background: ${backgroundColor};">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        <strong>Sleep Diagnosis</strong>
      </td>
    </tr>
  </table>
  <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        Use Email <strong>${escapedEmail}</strong> to log in Sleep Diagnosis
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        使用邮箱 <strong>${escapedEmail}</strong> 登录 Sleep Diagnosis
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${buttonBackgroundColor}"><a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${buttonBorderColor}; display: inline-block; font-weight: bold;">Click here to log in / 点击登录</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        If you have not used this email to log in, please ignore this mail.
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        如果您没有使用此邮箱登录，请忽略本邮件。
      </td>
    </tr>
  </table>
</body>
`
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function text({ url, host }) {
  return `Login to ${host}\n${url}\n\n`
}

// const callbackUri = encodeURIComponent(
//   'www.heliskichina.cn/api/auth/callback/wechat'
// )

// const config = {
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
//   region: process.env.AWS_REGION,
// }

// const client = DynamoDBDocument.from(new DynamoDB(config), {
//   marshallOptions: {
//     convertEmptyValues: true,
//     removeUndefinedValues: true,
//     convertClassInstanceToMap: true,
//   },
// })
export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV !== 'production',
  pages: {
    signIn: '/login',
    error: '/login-error',
    verifyRequest: '/verify-request',
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/diagnosis`
    },
  },
  theme: {
    brandColor: '#4f46e5',
  },
  // callbacks: {
  //   // async signIn({ user, account, profile, email }) {
  //   //   console.log('sign in callback', email)
  //   //   if (!email.verificationRequest) {
  //   //     console.log('go to mytrip page')
  //   //     return {
  //   //       redirect: {
  //   //         destination: '/mytrip',
  //   //         permanent: false
  //   //       }
  //   //     }
  //   //   }
  //   //   return true
  //   // }
  //   async redirect({ url, baseUrl }) {
  //     console.log('redirect', url, baseUrl)
  //     // Allows relative callback URLs
  //     if (url.startsWith('/')) return `${baseUrl}${url}`
  //     // Allows callback URLs on the same origin
  //     else if (new URL(url).origin === baseUrl) return url
  //     return baseUrl
  //   }
  // },
  // Configure one or more authentication providers
  providers: [
    EmailProvider({
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({ identifier: email, url }) {
        const resend = new Resend(process.env.RESEND_API_KEY)
        const { host } = new URL(url)
        const { error } = await resend.emails.send({
          from: process.env.EMAIL_FROM,
          to: email,
          subject: `Login to Sleep Diagnosis / 登录Sleep Diagnosis`,
          text: text({ url, host }),
          html: html({ url, host, email }),
        })
        if (error) throw new Error(error.message)
      },
    }),
    // {
    //   id: 'wechat',
    //   name: 'WeChat Login',
    //   type: 'oauth',
    //   clientId: process.env.WC_APP_ID,
    //   clientSecret: process.env.WC_APP_SECRET,
    //   authorization: `https://open.weixin.qq.com/connect/qrconnect?appid=${process.env.WC_APP_ID}&redirect_uri=${callbackUri}&response_type=code&scope=snsapi_login&state=test#wechat_redirect`,
    //   token: `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${process.env.WC_APP_ID}&secret=${process.env.WC_APP_SECRET}&grant_type=authorization_code`,
    //   userinfo: 'https://api.weixin.qq.com/sns/userinfo',
    //   profile(profile) {
    //     return {
    //       id: profile.openid,
    //       name: profile.nickname,
    //       image: profile.headimgurl,
    //       unionid: profile.unionid
    //     }
    //   }
    // }
  ],
  adapter: PrismaAdapter(prisma),
}
export default NextAuth(authOptions)
