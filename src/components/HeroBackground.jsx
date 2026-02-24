import Image from 'next/image'
import HomeLogo from '@/images/home-icon.svg'

export function HeroBackground(props) {
  return <Image {...props} src={HomeLogo} alt="logo" unoptimized />
}
