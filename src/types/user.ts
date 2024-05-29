
export interface User {
    [key: string]: any
    id: String
    email: string
    password: string
    firstName: string
    lastName: string
    userName: string
    phoneNumber: string
    token: string
    verified: boolean
    status: 'active' | 'inactive' | 'banned'
    roleId: string
    createdAt: Date
    updatedAt: Date
}

export interface UserLogin {
    firstName: string
    lastName: string
    userName: string
    phoneNumber: string
    role: string
}
