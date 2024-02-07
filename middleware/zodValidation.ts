import { Request, Response, NextFunction } from 'express'
import { ZodError, z } from 'zod';

export const zodValidation = (schema: z.AnyZodObject | z.ZodOptional<z.AnyZodObject>) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map((issue: any) => ({
                    message: `${issue.path.join('.')} is ${issue.message}`,
                }))
                res.status(401).json({
                    message: 'Неправильно введены данные',
                    details: errorMessages
                });
            } else {
                res.status(500).json({
                    message: 'Ошибка при обработке со стороны сервера',
                    error: error.message
                });
            }
        }
    };