import { Request, Response } from 'express';
import { getRepository, getConnectionManager, getConnection } from 'typeorm';
import { validate } from 'class-validator';
import * as httpStatusCodes from 'http-status-codes';
import apiResponse from '../utilities/apiResponse';
import { User as UserEntity } from '../entity/UserEntity';

class UserController {
    static listAll = async (req: Request, res: Response) => {
        const userRepository = getRepository(UserEntity);
        // for raw query
        // const connect = getConnection();
        // const result = await connect.query('SELECT username FROM user');
        // console.log(connect, 'connection');
        const users = await userRepository.find();
        // apiResponse.success(res, { users, ...result[0] }, httpStatusCodes.OK);
        apiResponse.success(res, users, httpStatusCodes.OK);
    };

    static getOneById = async (req: Request, res: Response) => {
        const id: number = req.params.id;
        const userRepository = getRepository(UserEntity);
        try {
            const user = await userRepository.findOneOrFail(id);
            apiResponse.success(res, user, httpStatusCodes.OK);
        } catch (error) {
            apiResponse.error(res, httpStatusCodes.NOT_FOUND, error);
        }
    };

    static newUser = async (req: Request, res: Response) => {
        let { name, hobbies, address, mobile_no } = req.body;
        let user = new UserEntity();
        user.name = name;
        user.hobbies = hobbies;
        user.address = address;
        user.mobile_no = mobile_no;

        const errors = await validate(user);
        if (errors.length > 0) {
            apiResponse.error(res, httpStatusCodes.BAD_REQUEST, errors);
            return;
        }
        const userRepository = getRepository(UserEntity);
        let resUser: any;
        try {
            resUser = await userRepository.save(user);
        } catch (errors) {
            apiResponse.error(
                res,
                httpStatusCodes.CONFLICT,
                'user already in db'
            );
            return;
        }
        apiResponse.success(
            res,
            { res: 'User created', ...resUser },
            httpStatusCodes.CREATED
        );
    };

    static editUser = async (req: Request, res: Response) => {
        const id = req.params.id;
        const { mobile_no, address, hobbies } = req.body;

        const userRepository = getRepository(UserEntity);
        let user;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (error) {
            apiResponse.error(res, httpStatusCodes.NOT_FOUND, error);
            return;
        }

        user.hobbies = hobbies;
        user.address = address;
        user.mobile_no = mobile_no;

        const errors = await validate(user);
        if (errors.length > 0) {
            apiResponse.error(res, httpStatusCodes.BAD_REQUEST, errors);
            return;
        }

        try {
            await userRepository.save(user);
        } catch (e) {
            apiResponse.error(
                res,
                httpStatusCodes.CONFLICT,
                'user already in db'
            );
            return;
        }
        apiResponse.success(
            res,
            { res: 'User updated' },
            httpStatusCodes.NO_CONTENT
        );
    };

    static deleteUser = async (req: Request, res: Response) => {
        const id = req.params.id;

        const userRepository = getRepository(UserEntity);
        let user: UserEntity;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (error) {
            apiResponse.error(res, httpStatusCodes.NOT_FOUND, error);
            return;
        }
        userRepository.delete(id);

        apiResponse.success(
            res,
            { res: 'User deleted' },
            httpStatusCodes.NO_CONTENT
        );
    };
}

export default UserController;
