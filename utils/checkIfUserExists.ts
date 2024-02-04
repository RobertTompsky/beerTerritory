import { prisma } from "../prisma/script";

export async function checkIfUserExists(nickName: string, email?: string): Promise<boolean> {
    const whereCase = email
        ? {
            OR: [
                {
                    nickName
                },
                {
                    email
                }
            ]
        }
        : { nickName }

    const existingUser = await prisma.user.findFirst({
        where: whereCase
    })
    
    return Boolean(existingUser)
}