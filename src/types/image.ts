export interface ImageSchemaState {
    list: string[]
    updateList: (list: string[]) => void
    insertImage: (image: string) => void
    deleteImage: (imageIndex: number) => void
}