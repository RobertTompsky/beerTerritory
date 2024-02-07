import { Response } from 'express';

export function handleServerError(res: Response, errorMessage: string, error: Error): void {
    res.status(500).json({
        message: errorMessage,
        error: error.message
    });
}