import { IUser } from '../interfaces/user.interface';

export class User implements IUser{
    constructor(
        public id: string,
        public name: string,
        public userName: string,
        public role: string,
        ){}
}