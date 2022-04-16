import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import { Users, UserDocument } from "../../model/users.schema"

@Injectable()
export class AuthService {
    constructor(@InjectModel(Users.name) private userModel: Model<UserDocument>) {}

    hashdata (data: string) {
        return bcrypt.hash(data, 10)
    }

    async login(email:string, password:string)  {
        const resp = await this.userModel.findOne({email, password})
        if(resp && resp.password == password){
            return resp
        }
        else if(resp && resp.password != password) {
            return {msg: "Invalid password"}
        }
        else{
            return {msg: "User not found..."}
        }
    } 
    
    async createUser(email: string, password: string, username: string){
        const user = {
            email,
            password,
            username
        }
        const createUser = await this.userModel.create(user)
    }
}