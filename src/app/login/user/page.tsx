'use client'

export default function User() {

    return (
        <div>
            <h2>User profile</h2>
            <button onClick={() => {
                document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
                location.reload()
            }} >Logout</button>
        </div>
    )
}