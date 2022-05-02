import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from "mongoose"

export type UserDocument = Users & Document

@Schema()
export class Users {
  @Prop()
  firstname: string;

  @Prop()
  lastname: string;

  @Prop({required: true})
  username: string;

  @Prop({required: true})
  password: string;

  @Prop({required: true, unique: true})
  email: string;

  @Prop()
  refreshToken: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users);