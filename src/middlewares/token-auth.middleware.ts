import * as jwt from 'jsonwebtoken';
import { Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { NextFunction } from 'express';

@Injectable()
export class TokenAuthenticationMiddleware {

    static authenticateToken(req: any, res: Response, next: NextFunction) {
        const token = req.headers['authorization']?.split(" ")[1]

        if (!token) throw new UnauthorizedException()

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: Error, resp: any) => {
            if (err) {
                throw new UnauthorizedException()
            }
            else {
                const user = resp
                req.user = user
            }
        })
        next()
    }
}