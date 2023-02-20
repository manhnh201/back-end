export abstract class UserCreateDto {
    username: string;
    password: string;
}

export class UserDetail {
    username: 'anonymousUser' | string;
    authorities?: string[] = [];
    payload?: any;
}