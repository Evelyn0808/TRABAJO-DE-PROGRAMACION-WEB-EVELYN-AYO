import { Body, Controller, Post } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    registerUser(@Body() userObj: RegisterAuthDto) {
        return userObj;
    }

    @Post('login')
    loginUser(@Body() credentials: LoginAuthDto) {
        return this.authService.login(credentials.email, credentials.password);
    }
}
