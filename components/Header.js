import {
  Gmail,
  Github,
  Twitter,
  Instagram,
} from "@icons-pack/react-simple-icons";

const icons = [
  {
    Component: Gmail,
    color: "#D14836",
    link: "mailto:vaibhavacharya111@gmail.com",
    noNewTab: true,
  },
  {
    Component: Github,
    color: "#181717",
    link: "https://github.com/VaibhavAcharya",
  },
  {
    Component: Twitter,
    color: "#1DA1F2",
    link: "https://twitter.com/VaibhavAcharya_",
  },
  {
    Component: Instagram,
    color: "#E4405F",
    link: "https://instagram.com/vaibhavacharya_",
  },
];

export default function Header() {
  return (
    <div className="text-center">
      <h2 className="text-xl md:text-4xl mb-4">
        Hey 👋,<br />I am{" "}
        <span className="text-blue-600 font-bold">Vaibhav Acharya</span>.
      </h2>
      <h1 className="text-2xl md:text-6xl mb-16">
        I design & <span className="underline">develop</span>{" "}
        <span className="bg-rose-500 text-white font-mono font-bold">websites</span>.
      </h1>
      <div className="flex items-center justify-center">
      <div className="flex items-center justify-start space-x-4">
        <button className="flex items-center justify-between space-x-2 bg-violet-600 hover:bg-violet-700 focus:outline-none focus-visible:bg-violet-800 px-4 py-2 font-bold text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>RESUME</span>
        </button> 
        <div className="flex items-center justify-start space-x-2">
          {icons.map(function ({ Component, color, link, noNewTab }, index) {
            return (
              <a
                href={link}
                rel="noopener"
                {...(!noNewTab ? { target: "_blank" } : {})}
                key={index}
                className="w-8 h-8 focus:outline-none transition-transform transform hover:scale-105 focus-visible:scale-110 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold"
                style={{ backgroundColor: color }}
              >
                <Component size={16} color="white" />
              </a>
            );
          })}
        </div>
      </div>
      </div>
    </div>
  );
}
