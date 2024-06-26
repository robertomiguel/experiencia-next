
export interface ImageSettings {
    prompt: string
    model: number
    hairColor: string
    hairLength: string
    hairStyle: string
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
    updateSettings: (newSettings: ImageSettings) => void
    toogleSidesheet: (open: boolean) => void
}
