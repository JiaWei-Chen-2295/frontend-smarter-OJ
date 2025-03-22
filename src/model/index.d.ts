declare namespace OJModel {
    type User = {
        username: string
        password: string
        email: string
        avatar?: string
        role: Role,
        id: string
    }
    type Role = 'admin' | 'user'

}
