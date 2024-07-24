export interface ImageSchemaState {
    list: string[]
    prompt: string
    isLoading: boolean
    refImage: string
    deleteImage: (imageIndex: number) => void
    clearList: () => void
    setPrompt: (prompt: string) => void
    setIsLoading: (isLoading: boolean) => void
    setRefImage: (refImage: string) => void
    setList: (list: string[]) => void
    insertImage: (image: string) => void
}