import { BsFillBootstrapFill, BsRobot } from 'react-icons/bs';
import {
  SiCss3,
  SiExpress,
  SiFirebase,
  SiJavascript,
  SiJquery,
  SiMui,
  SiNextdotjs,
  SiNginx,
  SiNodedotjs,
  SiPrisma,
  SiReact,
  SiStyledcomponents,
  SiTailwindcss,
  SiTypescript,
  SiVuedotjs,
  SiWordpress,
  SiPowerapps,
  SiPowerautomate,
  SiPowerbi,
  SiMicrosoftsharepoint,
  SiVercel,
  SiOpenai,
} from 'react-icons/si';

export type stacksProps = {
  [key: string]: JSX.Element;
};

const iconSize = 20;

export const STACKS: stacksProps = {
  JavaScript: <SiJavascript size={iconSize} className='text-yellow-400' />,
  TypeScript: <SiTypescript size={iconSize} className='text-blue-400' />,
  'Next.js': <SiNextdotjs size={iconSize} />,
  'React.js': <SiReact size={iconSize} className='text-sky-500' />,
  TailwindCSS: <SiTailwindcss size={iconSize} className='text-cyan-300' />,
  Bootstrap: (
    <BsFillBootstrapFill size={iconSize} className='text-purple-500' />
  ),
  WordPress: <SiWordpress size={iconSize} />,
  'Material UI': <SiMui size={iconSize} className='text-sky-400' />,
  Prisma: <SiPrisma size={iconSize} className='text-emerald-500' />,
  Firebase: <SiFirebase size={iconSize} className='text-yellow-500' />,
  'Artificial Intelligence': (
    <BsRobot size={iconSize} className='text-rose-500' />
  ),
  'Vue.js': <SiVuedotjs size={iconSize} className='text-green-500' />,
  'Node.js': <SiNodedotjs size={iconSize} className='text-green-600' />,
  'Styled Components': (
    <SiStyledcomponents size={iconSize} className='text-pink-500' />
  ),
  Nginx: <SiNginx size={iconSize} className='text-green-500' />,
  CSS: <SiCss3 size={iconSize} className='text-blue-300' />,
  Express: <SiExpress size={iconSize} />,
  Jquery: <SiJquery size={iconSize} />,
  PowerApps: <SiPowerapps size={iconSize} className='text-blue-500'/>,
  PowerAutomate: <SiPowerautomate size={iconSize} className='text-purple-500'/>,
  PowerBI: <SiPowerbi size={iconSize} className='text-yellow-400'/>,
  SharePoint: <SiMicrosoftsharepoint size={iconSize} className='text-teal-500'/>,
  Vercel: <SiVercel size={iconSize} />,
  OpenAI: <SiOpenai size={iconSize} className='text-green-500'/>,
};
