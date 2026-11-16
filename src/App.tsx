import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'

const CODE_CLASS =
  'inline-flex rounded bg-code px-2 py-1 text-[15px] leading-[1.35] text-heading'

const H2_CLASS =
  'mb-2 text-[20px] font-medium leading-[1.18] tracking-[-0.24px] text-heading lg:text-[24px]'

const LIST_CLASS =
  'mt-5 flex flex-wrap justify-center gap-2 lg:mt-8 lg:flex-nowrap lg:justify-start'

const LINK_CLASS =
  'flex w-full items-center justify-center gap-2 rounded-md bg-social px-3 py-1.5 text-[16px] text-heading transition-shadow duration-300 hover:shadow-pop lg:w-auto lg:justify-start'

const LIST_ITEM_CLASS = 'flex-[1_1_calc(50%_-_8px)] lg:flex-initial'

const TICKS_CLASS =
  'relative w-full before:absolute before:-top-[4.5px] before:left-0 before:border-[5px] before:border-transparent before:border-l-border after:absolute after:-top-[4.5px] after:right-0 after:border-[5px] after:border-transparent after:border-r-border'

const DOC_LINKS = [
  { href: 'https://vite.dev/', label: 'Explore Vite', logo: viteLogo },
  { href: 'https://react.dev/', label: 'Learn more', logo: reactLogo },
] as const

const SOCIAL_LINKS = [
  { href: 'https://github.com/vitejs/vite', label: 'GitHub', icon: 'github-icon' },
  { href: 'https://x.com/vite_js', label: 'X.com', icon: 'x-icon' },
  {
    href: 'https://bsky.app/profile/vite.dev',
    label: 'Bluesky',
    icon: 'bluesky-icon',
  },
] as const

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-[1126px] flex-col border-x border-border text-center text-[18px] leading-[1.45] tracking-[0.18px] text-muted">
      <section className="flex grow flex-col items-center justify-center gap-[18px] px-5 pt-8 pb-6 lg:gap-[25px] lg:p-0">
        <div className="relative">
          <img
            src={heroImg}
            className="relative z-0 mx-auto w-[170px]"
            width="170"
            height="179"
            alt=""
          />
          <img
            src={reactLogo}
            className="absolute inset-x-0 top-[34px] z-[1] mx-auto h-7 [transform:perspective(2000px)_rotateZ(300deg)_rotateX(44deg)_rotateY(39deg)_scale(1.4)]"
            alt="React logo"
          />
          <img
            src={viteLogo}
            className="absolute inset-x-0 top-[107px] z-0 mx-auto h-[26px] w-auto [transform:perspective(2000px)_rotateZ(300deg)_rotateX(40deg)_rotateY(39deg)_scale(0.8)]"
            alt="Vite logo"
          />
        </div>
        <div>
          <h1 className="my-5 text-[36px] font-medium tracking-[-1.68px] text-heading lg:my-8 lg:text-[56px]">
            Get started
          </h1>
          <p>
            Edit <code className={CODE_CLASS}>src/App.tsx</code> and save to test{' '}
            <code className={CODE_CLASS}>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="mb-6 inline-flex rounded-[5px] border-2 border-transparent bg-accent-soft px-2.5 py-[5px] font-mono text-[16px] text-accent transition-colors duration-300 hover:border-accent-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className={TICKS_CLASS} />

      <section className="flex flex-col border-t border-border lg:flex-row lg:text-left">
        <div className="flex-1 border-b border-border px-5 py-6 lg:border-r lg:border-b-0 lg:p-8">
          <svg
            className="mb-4 h-[22px] w-[22px]"
            role="presentation"
            aria-hidden="true"
          >
            <use href="/icons.svg#documentation-icon" />
          </svg>
          <h2 className={H2_CLASS}>Documentation</h2>
          <p>Your questions, answered</p>
          <ul className={LIST_CLASS}>
            {DOC_LINKS.map(({ href, label, logo }) => (
              <li key={label} className={LIST_ITEM_CLASS}>
                <a href={href} target="_blank" className={LINK_CLASS}>
                  <img className="h-[18px]" src={logo} alt="" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 px-5 py-6 lg:p-8">
          <svg
            className="mb-4 h-[22px] w-[22px]"
            role="presentation"
            aria-hidden="true"
          >
            <use href="/icons.svg#social-icon" />
          </svg>
          <h2 className={H2_CLASS}>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul className={LIST_CLASS}>
            {SOCIAL_LINKS.map(({ href, label, icon }) => (
              <li key={label} className={LIST_ITEM_CLASS}>
                <a href={href} target="_blank" className={LINK_CLASS}>
                  <svg
                    className="h-[18px] w-[18px] dark:[filter:invert(1)_brightness(2)]"
                    role="presentation"
                    aria-hidden="true"
                  >
                    <use href={`/icons.svg#${icon}`} />
                  </svg>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className={TICKS_CLASS} />

      <section className="h-12 border-t border-border lg:h-[88px]" />
    </div>
  )
}

export default App
