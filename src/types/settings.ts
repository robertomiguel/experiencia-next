
export interface SettingsState {
    openSidesheet: boolean
    toogleSidesheet: (open: boolean) => void
    chatList: any[]
    setChatList: (chatList: any[]) => void
    chatRole: string
    setChatRole: (chatRole: string) => void
    chatHistory: any[]
    setChatHistory: (chatHistory: any[]) => void
}
