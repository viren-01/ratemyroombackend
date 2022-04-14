import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose"
import { Users, UserDocument } from "../../model/users.schema"

@Injectable()
export class UserService {
    constructor(@InjectModel(Users.name) private userModel: Model<UserDocument>) {}


    getAllUsers() {
        return this.userModel.find().exec()
    }
}