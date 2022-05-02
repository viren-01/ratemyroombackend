import { Body, Controller, Get, HttpCode, InternalServerErrorException, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { AuthDto, AuthSignupDto } from "./dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signin')
    @HttpCode(200)
    login(@Body() dto: AuthDto) {
        try {
            return this.authService.login(dto.email, dto.password)
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException()
        }
    }

    @Post('signup')
    createUser(@Body() dto: AuthSignupDto) {
        try {
            return this.authService.createUser(dto.email, dto.password, dto.username)
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException(error.errors.message)
        }
    }

    @Get('all')
    randomfunc(@Req() req: Request) {
        console.log(req)
        return "YES"
    }

    @Post('refreshToken')
    @HttpCode(200)
    async updateTokens(@Body() body: any) {
        try {
            return await this.authService.returnNewRefreshToken(body.refreshToken)
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException(error.errors.message)
        }
    }
}