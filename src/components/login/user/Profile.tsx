import { useAppSelector } from "@/store"
import { UserLogin } from "@/types/user"


export const UserProfile = () => {

    const user = useAppSelector(state => state.user) as UserLogin


    return (
        <div>
            <h2>{user.userName}</h2>
            <button onClick={() => {
                document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
                location.reload()
            }} >Logout</button>
        </div>
    )
}