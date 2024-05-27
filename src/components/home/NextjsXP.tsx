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
    'Responsive design'
];

export const NextjsXP = () => {
    return (
        <div className={style.container}>
            <h4>Experiencia Next.js</h4>
            <div className={style.listContainer} >
                {list.map((item) => (
                    <div key={item} className={style.item} >{item}</div>
                ))}
            </div>
            <a className={style.gitHub} href="https://github.com/robertomiguel/experiencia-next" target='_blank' >View code on GitHub</a>
        </div>
    );
}