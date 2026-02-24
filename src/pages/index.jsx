import Head from 'next/head'

// import { CallToAction } from '@/components/CallToAction'
// import { Faqs } from '@/components/Faqs'
// import { Pricing } from '@/components/Pricing'
// import { Testimonials } from '@/components/Testimonials'
import { Footer } from '@/components/Footer'
import { HeaderDark } from '@/components/HeaderDark'
import { Hero } from '@/components/Hero'
import { SecondaryFeatures } from '@/components/SecondaryFeatures'
import { getSession } from 'next-auth/react'

export default function Home() {
  return (
    <>
      <Head>
        <title>Engineering Sleep</title>
        <meta
          name="description"
          content="To narrow the distance between people and science, with biopsychology."
        />
      </Head>
      <main>
        <div className="bg-black bg-[url('../images/hero-bg.svg')] bg-cover">
          <HeaderDark />
          <Hero />
        </div>
        <SecondaryFeatures />
      </main>
      <Footer />
    </>
  )
}

// export async function getServerSideProps(context) {
//   // Fetch data from external API
//   const session = await getSession(context)
//   // console.log('server session', session)
//   // let questions = null
//   if (session) {
//     // try {
//     //   const res = await getData('sd_question')
//     //   // console.log('mvc tcb res', res)
//     //   questions = res.data
//     // } catch (error) {
//     //   console.log('get guest error', error)
//     // }
//     // Pass data to the page via props
//     return {
//       props: {
//         userEmail: session.user.email,
//       },
//     }
//   } else {
//     console.log('no session', session)
//     return {
//       redirect: {
//         destination: '/login',
//         permanent: false,
//       },
//     }
//   }
// }
