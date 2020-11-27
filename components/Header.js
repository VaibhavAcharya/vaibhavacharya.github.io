import { Gmail, Github, Twitter, Instagram } from '@icons-pack/react-simple-icons'

const icons = [
  { Component: Gmail, color: '#D14836', link: 'mailto:vaibhavacharya111@gmail.com', noNewTab: true },
  { Component: Github, color: '#181717', link: 'https://github.com/VaibhavAcharya' },
  { Component: Twitter, color: '#1DA1F2', link: 'https://twitter.com/VaibhavAcharya_' },
  { Component: Instagram, color: '#E4405F', link: 'https://instagram.com/vaibhavacharya_' },
]

export default function Header() {
  return (
    <div className="pt-16">
      <h2 className="text-2xl md:text-4xl mb-2">Hey 👋, I am <span className="text-green-500 font-bold">Vaibhav Acharya</span>.</h2>
      <h1 className="text-4xl md:text-6xl">I design & <u>develop</u> <span className="text-lightBlue-500 font-bold">websites</span>.</h1>
      <br />
      <br />
      <div className="flex gap-x-4">
        <button className="bg-indigo-500 hover:bg-indigo-400 focus:outline-none focus-visible:bg-indigo-600 px-6 py-2 font-bold text-white">RESUME</button>
        <div className="flex items-center justify-start gap-x-2">
            {
              icons.map(function ({ Component, color, link, noNewTab }, index) {
                return (
                  <a href={link} { ...(!noNewTab ? {target: "_blank"} : {} ) } key={index} className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold" style={{ backgroundColor: color }}>
                    <Component size={16} color="white" />
                  </a>
                )
              })
            }
        </div>
      </div>
    </div>
  )
}
