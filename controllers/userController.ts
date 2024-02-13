import { Request, Response } from 'express';
import { checkIfUserExists } from '../utils/checkIfUserExists';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '../prisma/script';
import { ProfileInputData, UserLoginData, UserRegistrationData, UserRequest } from '../types/types';
import { Profile, User } from '@prisma/client';
import { handleServerError } from '../utils/handleServerError';

export const register = async (req: Request, res: Response) => {
    const { nickName, email, password }: UserRegistrationData = req.body
    try {
        const userExists = await checkIfUserExists(nickName, email)

        if (userExists) {
            // return Обязательно нужно добавить, чтобы после возвращения ответа код останавливался, а не продолжал слать headers
            return res.status(409).send("Пользователь уже существует");
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user: User = await prisma.user.create({
            data: {
                nickName,
                email,
                password: hashedPassword
            }
        })

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        )

        res.status(201).json({
            id: user.id,
            nickName: user.nickName,
            token,
            message: 'Пользователь зарегистрировался'
        })

    } catch (error) {
        handleServerError(res, 'Не удалось зарегистрировать пользователя', error)
    }
}

export const logIn = async (req: Request, res: Response) => {
    const { nickName, password }: UserLoginData = req.body
    try {
        const userExists = await checkIfUserExists(nickName)
        if (!userExists) {
            // return Обязательно нужно добавить, чтобы после возвращения ответа код останавливался, а не продолжал слать headers
            return res.status(401).send("Пользователя не существует");
        }

        const user: User = await prisma.user.findUnique({
            where: {
                nickName
            }
        })

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            return res.status(401).json({
                message: 'Неверный пароль'
            });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' })

        res.status(201).json({
            id: user.id,
            nickName: user.nickName,
            token,
            message: 'Пользователь залогинился'
        })
    } catch (error) {
        handleServerError(res, 'Не удалось совершить авторизацию пользователя', error)
    }
}

export const logOut = (req: Request, res: Response) => {
    try {
        res.clearCookie('jwtToken');

        res.status(200).json({ 
            message: 'Пользователь успешно вышел из системы' 
        });
    } catch (error) {
        handleServerError(res, 'Ошибка при выходе пользователя', error)
    }
};

export const getAllUsers = async (req: UserRequest, res: Response) => {
    try {
        const allUsers = await prisma.user.findMany()

        if (allUsers.length >= 1) {
            res.status(200).json(allUsers)
        } else {
            return res.status(404).json({
                message: 'Список пользователей пуст'
            })
        }
    } catch (error) {
        handleServerError(res, 'Не удалось выполнить запрос пользователей', error)
    }
}

export const getUser = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                nickName: true,
                favouriteBeers: true,
                profile: true
            }
        })

        if (user) {
            res.status(200).json(user)

        } else {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }

    } catch (error) {
        handleServerError(res, 'Не удалось выполнить запрос пользователя', error)
    }
}

export const getMe = async (req: UserRequest, res: Response) => {
    const { id } = req.user
    try {
        const me = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                nickName: true,
                favouriteBeers: true,
                profile: true
            }
        })

        if (me) {
            res.status(200).json(me)
        } else {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }
    } catch (error) {
        handleServerError(res, 'Не удалось выполнить запрос пользователя', error)
    }
}

export const deleteUser = async (req: UserRequest, res: Response) => {
    const { id } = req.user;
    try {
        await prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({
                where: { id },
                include: {
                    favouriteBeers: true
                },
            });

            for (const beer of user.favouriteBeers) {
                await tx.beer.update({
                    where: {
                        id: beer.id,
                    },
                    data: {
                        favouriteInUsers: {
                            disconnect: { id },
                        },
                    },
                });
            }

            await tx.beer.deleteMany({
                where: {
                    creatorId: id
                }
            });

            await tx.user.delete({
                where: { id }
            })
        })

        res.status(200).json({
            message: 'Пользователь успешно удален'
        });
    }
    catch (error) {
        handleServerError(res, 'Не удалось выполнить запрос на удаление пользователя', error)
    }
};

export const createUserProfile = async (req: UserRequest, res: Response) => {
    const { id } = req.user
    const { realName, age, bio }: ProfileInputData = req.body
    try {
        const existingProfile: Profile = await prisma.profile.findUnique({
            where: {
                userId: id
            }
        })

        if (existingProfile) {
            return res.status(400).json({ 
                message: 'Профиль пользователя уже существует' 
            });
        }

        const profile: Profile = await prisma.profile.create({
            data: {
                realName,
                age,
                bio,
                avatar: req?.file?.path || '',
                user: {
                    connect: {
                        id
                    }
                }
            }
        })

        res.status(201).json(profile)

    } catch (error) {
        handleServerError(res, 'Не удалось создать профиль пользователя', error)
    }
}

export const updateUserProfile = async (req: UserRequest, res: Response) => {
    const { id } = req.user
    const { realName, age, bio }: ProfileInputData = req.body
    try {
        const existingProfile: Profile = await prisma.profile.findUnique({
            where: {
                userId: id
            }
        })

        if (!existingProfile) {
            return res.status(400).json({
                message: 'Для начала создайте профиль пользователя'
            });
        }

        const updatedUserProfile: Profile = await prisma.profile.update({
            where: {
                userId: id
            },
            data: {
                realName,
                age,
                bio
            }
        })

        res.status(200).json(updatedUserProfile)

    } catch (error) {
        handleServerError(res, 'Не удалось обновить профиль пользователя', error)
    }
}

export const getSelectedUserProfile = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const selectedUserProfile = await prisma.profile.findUnique({
            where: { userId: id }
        })
        if (selectedUserProfile) {
            res.status(200).json(selectedUserProfile)
        } else {
            return res.status(400).json({
                message: 'Пользователь еще не создал свой профиль'
            });
        }
    } catch (error) {
        handleServerError(res, 'Не удалось выполнить запрос профиля пользователя', error)
    }
}

export const getMyProfile = async (req: UserRequest, res: Response) => {
    const { id } = req.user
    try {
        const myProfile = await prisma.profile.findUnique({
            where: { userId: id }
        })
        if (myProfile) {
            res.status(200).json(myProfile)
        } else {
            return res.status(400).json({
                message: 'Вы еще не создали свой профиль'
            });
        }
    } catch (error) {
        handleServerError(res, 'Не удалось выполнить запрос профиля пользователя', error)
    }
}

