import { IsEmail, isNotEmpty, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}

export class AuthSignupDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    username: string;
}