import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose"
import { Users, UserDocument } from "../../model/users.schema"

@Injectable()
export class AuthService {
    constructor(@InjectModel(Users.name) private userModel: Model<UserDocument>) {}

    async login(email:string, password:string)  {
        const resp = await this.userModel.findOne({email})
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
}