import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {}

    login(email: string, password: string) {
        const payload = { email, id: 1 };
        const token = this.jwtService.sign(payload, { expiresIn: '60s' });
        return token;
    }
}
