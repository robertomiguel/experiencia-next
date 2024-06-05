import Link from 'next/link';
import style from './style.module.css';

const list = [
    'Javascript',
    'HTML',
    'CSS',
    'Node.Js',
    'SSR',
    'App components',
    'Tailwind css',
    'Typescript',
    'React.js',
    'Prisma',
    'PostgreSQL',
    'Redux Toolkit',
    'Formik',
    'Yup',
    'Responsive design',
    'Zustand',
];

export const NextjsXP = () => {
    return (<div className='flex flex-col gap-10 justify-center items-center'>
        <div className={style.container}>
            <h4>Experiencia Next.js</h4>
            <div className={style.listContainer} >
                {list.map((item) => (
                    <div key={item} className={style.item} >{item}</div>
                ))}
            </div>
            <a className={style.gitHub} href="https://github.com/robertomiguel/experiencia-next" target='_blank' >View code on GitHub</a>
        </div>
        <div className='flex flex-col gap-3 justify-center items-center' >
            <Link href='/wiki'>Demo Api Res Wikipedia</Link>
            <Link href='/iadraw'>Demo IA Text to Image</Link>
            <Link href='/crypto'>Demo Blockchain</Link>
        </div>
    </div>);
}