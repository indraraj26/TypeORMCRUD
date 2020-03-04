import { Response } from 'express';
import * as httpStatusCodes from 'http-status-codes';

export default class ApiResponse {
    static success = (res: Response, data: object, status: number = 200) => {
        res.status(status).json({
            data,
            success: true
        });
    };

    static error = (
        res: Response,
        status: number = 400,
        data?: any,
        error: any = httpStatusCodes.getStatusText(status)
    ) => {
        res.status(status).json({
            error: {
                code: status,
                message: error,
                data: data
            },
            success: false
        });
    };
}
