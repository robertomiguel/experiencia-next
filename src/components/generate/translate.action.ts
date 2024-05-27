'use server'
import axios from 'axios'

export const translateAction = async (prompt: string) => {

    const base_url = process.env.BASE_URL

    const text = await axios.post(base_url + '/api/translate', { q: prompt })

    return text.data
}
