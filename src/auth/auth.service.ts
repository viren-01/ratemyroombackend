import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Users, UserDocument } from "../../model/users.schema"

@Injectable()
export class AuthService {
    constructor(@InjectModel(Users.name) private userModel: Model<UserDocument>) { }

    async login(email: string, password: string) {
        try {
            const user = await this.userModel.findOne({ email })
            if (user && user.password == password) {

                const accessToken = this.generateAccessToken({user_id: user.id, email: user.email, username: user.username})

                const refreshToken = this.generateRefreshToken({user_id: user.id, email: user.email, username: user.username})

                const updateUser = await this.userModel.updateOne({email}, {$set: {refreshToken}})

                return {accessToken, refreshToken}
            }
            else if (user && user.password != password) {
                return { msg: "Invalid password" }
            }
            else {
                return { msg: "User not found..." }
            }
        } catch (error) {
            console.log(error)
        }
    }

    async createUser(email: string, password: string, username: string) {
        try {
            const user = {
                email,
                password: await this.hashdata(password),
                username
            }
            const createUser = await this.userModel.create(user)
        } catch (error) {
            console.log(error)
        }
    }

    async hashdata(data: string) {
        return await bcrypt.hash(data, 10)
    }

    generateAccessToken(payload: Object) {
       return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET)
    }

    generateRefreshToken(payload: Object) {
        return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET)
     }
}