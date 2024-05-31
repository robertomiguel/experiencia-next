
export interface ImageSettings {
    prompt: string
    model: number
    hairColor: string
    eyeColor: string
    age: string
    ethnicGroup: string
    dancer: string
    background: string
}

export interface SettingsState {
    openSidesheet: boolean
    image: ImageSettings
}
