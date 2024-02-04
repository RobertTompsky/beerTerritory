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
            return res.status(400).send("Пользователь уже существует");
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
            email: user.email,
            token
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
            return res.status(400).send("Пользователя не существует");
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
            email: user.email,
            token
        })
    } catch (error) {
        res.status(500).json({
            message: 'Ошибка аутентификации',
            error: error.message
        });
    }
}

export const getUser = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const user: User = await prisma.user.findUnique({
            where: {
                id
            }
        })

        if (user) {
            res.status(201).json({
                id: user.id,
                nickName: user.nickName,
                email: user.email
            })
            console.log('ff')
        } else {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }

    } catch (error) {
        res.status(500).json({
            message: 'Не удалось выполнить запрос',
            error: error.message
        });
    }
}

export const deleteUser = async (req: RequestWithUser, res: Response) => {
    const { id } = req.params;
    // надо будет поменять на req.user
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

            await tx.user.update({
                where: { id },
                data: {
                    createdBeers: {
                        set: []
                    },
                    favouriteBeers: {
                        set: []
                    }
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

export const createUserProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
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

export const updateUserProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const profileData: ProfileInputData = validateData(profileSchema, req.body)
        const { realName, age, bio } = profileData

        const existingProfile: Profile = await prisma.profile.findUnique({
            where: {
                userId: id
            }
        })
        console.log(existingProfile)
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

        res.status(201).json(updatedUserProfile)

    } catch (error) {
        res.status(500).json({
            message: 'Не удалось обновить профиль',
            error: error.message
        });
    }
}

