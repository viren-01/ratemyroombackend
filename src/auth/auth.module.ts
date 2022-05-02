import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Users, UsersSchema } from "model/users.schema";
import { TokenAuthenticationMiddleware } from "src/middlewares/token-auth.middleware";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
    imports: [MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }])],
    controllers: [AuthController],
    providers: [AuthService]
})

export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(TokenAuthenticationMiddleware.authenticateToken).forRoutes('auth/all');
    }
}