import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto, AuthSignupDto } from "./dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService ) {}

    @Post('signin')
    login(@Body() dto: AuthDto) {
        return this.authService.login(dto.email, dto.password)
    }

    @Post('signup')
    createUser(@Body() dto: AuthSignupDto ){
        return this.authService.createUser(dto.email, dto.password, dto.username)
    }
}