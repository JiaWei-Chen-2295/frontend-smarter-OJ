declare namespace OJModel {
    type User = {
        createTime?: string;
        id?: number;
        isDelete?: number;
        mpOpenId?: string;
        unionId?: string;
        updateTime?: string;
        userAccount?: string;
        userAvatar?: string;
        userName?: string;
        userPassword?: string;
        userProfile?: string;
        userRole?: string;
    }
    type Role = 'admin' | 'user'



}
