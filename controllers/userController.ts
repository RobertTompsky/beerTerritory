import { Request, Response } from 'express';
import { checkIfUserExists } from '../utils/checkIfUserExists';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '../prisma/script';
import { LoginRequest, ProfileInputData, RequestWithUser, UserRegistrationData } from '../types/types';
import { profileSchema, userRegistrationSchema, validateData } from '../utils/validateData';
import { Profile, User } from '@prisma/client';

export const register = async (req: Request, res: Response) => {
    try {
        const userData: UserRegistrationData = validateData(userRegistrationSchema, req.body)
        const { nickName, email, password } = userData

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

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' })

        res.status(201).json({
            id: user.id,
            nickName: user.nickName,
            token,
            message: 'Пользователь зарегистрировался'
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Не удалось зарегистрироваться',
            error: error.message
        })
    }
}

export const login = async (req: LoginRequest, res: Response) => {
    const { nickName, password } = req.body
    try {
        if (!nickName && !password) {
            return res.status(400).json({
                message: "Пожалуйста, заполните поля"
            })
        }

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
            return res.status(401).json({ message: 'Неверный пароль' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' })

        res.status(201).json({
            id: user.id,
            nickName: user.nickName,
            token,
            message: 'Пользователь залогинился'
        })
    } catch (error) {
        res.status(500).json({
            message: 'Ошибка аутентификации',
            error: error.message
        });
    }
}

export const getAllUsers = async (req: Request, res: Response) => {
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
        res.status(500).json({
            message: 'Не удалось выполнить запрос пользователя',
            error: error.message
        });
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
        res.status(500).json({
            message: 'Не удалось выполнить запрос пользователя',
            error: error.message
        });
    }
}

export const getMe = async (req: RequestWithUser, res: Response) => {
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
        res.status(500).json({
            message: 'Не удалось выполнить запрос пользователя',
            error: error.message
        });
    }
}

export const deleteUser = async (req: RequestWithUser, res: Response) => {
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
        res.status(500).json({
            message: 'Не удалось выполнить запрос',
            error: error.message
        });
    }
};

export const createUserProfile = async (req: RequestWithUser, res: Response) => {
    const { id } = req.user
    try {
        const profileData: ProfileInputData = validateData(profileSchema, req.body)
        const { realName, age, bio, avatar } = profileData

        const existingProfile: Profile = await prisma.profile.findUnique({
            where: {
                userId: id
            }
        })

        if (existingProfile) {
            return res.status(400).json({ message: 'Профиль пользователя уже существует' });
        }

        const profile: Profile = await prisma.profile.create({
            data: {
                realName,
                age,
                bio,
                avatar,
                user: {
                    connect: {
                        id
                    }
                }
            }
        })

        res.status(201).json(profile)

    } catch (error) {
        res.status(500).json({
            message: 'Не удалось создать профиль',
            error: error.message
        });
        console.log(error)
    }
}

export const updateUserProfile = async (req: RequestWithUser, res: Response) => {
    const { id } = req.user
    try {
        const profileData: ProfileInputData = validateData(profileSchema, req.body)
        const { realName, age, bio } = profileData

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
        res.status(500).json({
            message: 'Не удалось обновить профиль',
            error: error.message
        });
    }
}

export const getSelectedUserProfile = async (req: Request, res: Response) => {
    const {id} = req.params
    try {
        const selectedUserProfile = await prisma.profile.findUnique({
            where: { userId: id}
        })
        if (selectedUserProfile) {
            res.status(200).json(selectedUserProfile)
        } else {
            return res.status(400).json({
                message: 'Пользователь еще не создал свой профиль'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Не удалось выполнить запрос профиля',
            error: error.message
        })
    }
}

export const getMyProfile = async (req: RequestWithUser, res: Response) => {
    const {id} = req.user
    try {
        const myProfile = await prisma.profile.findUnique({
            where: { userId: id}
        })
        if (myProfile) {
            res.status(200).json(myProfile)
        } else {
            return res.status(400).json({
                message: 'Вы еще не создали свой профиль'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Не удалось выполнить запрос профиля',
            error: error.message
        })
    }
}

