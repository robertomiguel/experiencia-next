

export default function Login() {
    const inputClass = 'border-b-2 border-blue-400 rounded p-2 focus:outline-none focus:border-blue-800'
    return (
        <div className="flex w-fit m-auto gap-2 p-2 flex-col justify-center content-center items-center  bg-blue-300">
            <h1>Start session</h1>
            <input className={inputClass} type="text" placeholder="Usuario" />
            <input className={inputClass} type="password" placeholder="Contraseña" />
            <button className="bg-blue-800 text-white p-2 rounded">Login</button>
        </div>
    );
}