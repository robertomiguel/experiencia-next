'use server'

export const loginAction = async (formData: FormData) => {
    const url = process.env.REACT_APP_URL + '/api/login'
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            email: formData.get('email'),
            password: formData.get('password')
        })
    })
    const data = await response.json()
    return data
}
