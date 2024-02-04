import { User } from '@prisma/client';
import { Request } from 'express';

export type UserRegistrationData = {
    nickName: string;
    email: string;
    password: string;
};

export type UserLoginData = Pick<UserRegistrationData, 'nickName' | 'password'>;


export type ProfileInputData = {
    realName: string,
    age: number,
    bio: string,
    avatar: string
}

export type BeerInputData = {
    name: string
    sort: string
    ibu: number
    abv: number
    og: number
    volume: number
    format: string
    image: string
}

export type DecodedToken = {
    userId: string
    iat: number
    exp: number
}

export interface LoginRequest extends Request {
    body: UserLoginData
}

export interface RequestWithUser extends Request {
    user: User
}