import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
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

            const accessToken = this.generateAccessToken({ user_id: user.id, email: user.email, username: user.username })

            const newRefreshToken = this.generateRefreshToken({ user_id: user.id, email: user.email, username: user.username })

            const updateUser = await this.userModel.updateOne({ email }, { $set: { refreshToken: newRefreshToken } })

            return { accessToken, refreshToken: newRefreshToken }
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

        const accessToken = this.generateAccessToken({ user_id: createUser.id, email: createUser.email, createUsername: createUser.username })

        const refreshToken = this.generateRefreshToken({ user_id: createUser.id, email: createUser.email, username: createUser.username })

        return { accessToken, refreshToken }
    }

    returnNewRefreshToken(refreshToken: string): Object {

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err: Error, resp: any) => {
            if (err) throw new UnauthorizedException()
            else {
                const user_id = resp.user_id
                console.log(resp)
                const user = await this.userModel.findById(user_id)
                console.log(user)

                if (!user) throw new NotFoundException()

                const token = await this.generateAccessToken(resp)
                const refreshToken = await this.generateRefreshToken(resp)

                console.log(token + "My TOken")
                console.log(refreshToken + "My 2 TOken")


                // const update  = await this.userModel.updateMany({ email: user.email }, { $set: { refreshToken: refreshToken } })
                // console.log(update)
                return { accessToken: token, refreshToken }
            }
        })
    }

    async hashdata(data: string) {
        return await bcrypt.hash(data, 10)
    }

    generateAccessToken(payload: Object) {
        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 15 })
    }

    generateRefreshToken(payload: Object) {
        return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET)
    }
}