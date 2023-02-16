import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';

@Controller('users')
export class UserController {

    @UseGuards(JwtGuard) 
    @Get('me')
    async getMe(@GetUser() user: User) { //@Req() req: Request
        return user;
    }



}
