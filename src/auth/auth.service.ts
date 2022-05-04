import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Users, UserDocument } from "../../model/users.schema";

@Injectable()
export class AuthService {

    constructor(@InjectModel(Users.name) private userModel: Model<UserDocument>) { }

    async login(email: string, password: string) {
        const user = await this.userModel.findOne({ email })

        if (user && user.password == password) {
            const deletePreviousToken = await this.userModel.updateOne({ email }, { $unset: { refreshToken: 1 } })

            const accessToken = await this.generateAccessToken({ user_id: user.id, email: user.email, username: user.username })
            const newRefreshToken = await this.generateRefreshToken({ user_id: user.id, email: user.email, username: user.username })

            const updateUser = await this.userModel.updateOne({ email }, { $set: { refreshToken: newRefreshToken } })

            return { statusCode: 200, accessToken, refreshToken: newRefreshToken }
        }
        else if (user && user.password != password) {
            throw new UnauthorizedException()
        }
        else {
            throw new NotFoundException()
        }
    }

    async createUser(email: string, password: string, username: string) {

        const user = {
            email,
            password: await this.hashdata(password),
            username
        }
        const createUser = await this.userModel.create(user)

        return { statusCode: 201}
    }

    async returnNewRefreshToken(refreshToken: string): Promise<any> {

        const findUserWithRefreshToken = await this.userModel.findOne({ refreshToken })
        
        if (!findUserWithRefreshToken) {
            return new UnauthorizedException()
        }
        else {
            return new Promise((resolve, reject) => {
                jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err: Error, resp: any) => {
                    if (err) reject(new UnauthorizedException())
                    else {
                        const user_id = resp.user_id
                        const user = await this.userModel.findById(user_id)

                        if (!user) reject(new NotFoundException())

                        const token = await this.generateAccessToken(resp)
                        const refreshToken = await this.generateRefreshToken(resp)

                        const update = await this.userModel.updateMany({ email: user.email }, { $set: { refreshToken: "" } })
                        resolve({ accessToken: token, refreshToken })
                    }
                })
            })
        }
    }

    async hashdata(data: string) {
        return await bcrypt.hash(data, 10)
    }

    generateAccessToken(payload: Object) {
        return new Promise((resolve, reject) => {
            resolve(jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 15 }))
        })
    }

    generateRefreshToken(payload: Object) {
        return new Promise((resolve, reject) => {
            resolve(jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET))
        })
    }
}