import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('users')
export class UserController {

    @UseGuards(AuthGuard('jwt')) //`jwt` é o nome passado no JwtStrategy, por padrão é esse, mas é configurável
    @Get('me')
    async getMe(@Req() req: Request) {
        return req.user;
    }

}
