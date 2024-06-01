
export interface ImageSettings {
    prompt: string
    model: number
    hairColor: string
    eyeColor: string
    age: number
    gender: 'female' | 'male' | 'no binary'
    ethnicGroup: string
    dancer: string
    background: string
}

export interface SettingsState {
    openSidesheet: boolean
    image: ImageSettings
}
