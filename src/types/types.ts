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
    avatar?: string
}

export type BeerInputData = {
    name: string
    brewery: string
    type: string
    abv: number
    volume: number
    image: string
}

export type ReviewInputData = {
    title: string
    body: string
    rating: number
}

export type DecodedToken = {
    userId: string
    iat: number
    exp: number
}

export interface UserRequest extends Request {
    user: User
}

export interface FilterOptions {
    skip: number;
    take: number;
    where?: {
        type?: string,
        brewery?: string
    },
    orderBy?: {
        viewsCount?: 'asc' | 'desc',
        createdAt?: 'asc' | 'desc'
    }
}

export type SortOption = {
    field: string,
    order: 'asc' | 'desc'
}

export interface LoginRequest extends Request {
    body: UserLoginData
}