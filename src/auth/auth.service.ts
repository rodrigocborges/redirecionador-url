import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ForbiddenException } from '@nestjs/common/exceptions';

@Injectable()
export class AuthService {
    constructor(private prismaService: PrismaService) { }

    async signUp(model: AuthDto){
        try {
            const hash = await argon.hash(model.password);

            const user = await this.prismaService.user.create({
                data: {
                    email: model.email,
                    hash,
                },
                // select: {
                //     id: true,
                //     email: true,
                //     created_at: true
                // }
            });
    
            delete user.hash;
            return user;
        }
        catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                //https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
                console.log(error.code);
                if(error.code === 'P2002') { //Código específico do Prisma para campo duplicado
                    throw new ForbiddenException({ message: 'Credentials taken!' });
                }
            }
            throw error;
        }
    }

    async signIn(model: AuthDto){     
        try {
            const user = await this.prismaService.user.findUnique({
                where: { 
                    email: model.email
                }
            });

            if(!user){
                throw new ForbiddenException({
                    message: 'Incorret email or password!'
                });
            }

            const passwordMatch = await argon.verify(user.hash, model.password);
            if(!passwordMatch){
                throw new ForbiddenException(
                    { message: 'Incorret email or password!' }
                );
            }

            delete user.hash;
            return user;

        }
        catch(error) {
            throw error;
        }
    }

}
