import { handleServerError } from '@/utils/handleServerError';
import { Request, Response, NextFunction } from 'express'
import { ZodError, z } from 'zod';

export const zodValidation = (schema: z.AnyZodObject | z.ZodOptional<z.AnyZodObject>) =>
//так как внутри верхней функции срабатывает только одна функция, можно обойтись просто стрелкой без { }
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
                handleServerError(res, 'Ошибка при обработке со стороны сервера', error)
            }
        }
    };