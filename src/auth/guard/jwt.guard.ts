import { AuthGuard } from "@nestjs/passport";

//`jwt` é o nome passado no JwtStrategy, por padrão é esse, mas é configurável
export class JwtGuard extends AuthGuard('jwt') {
    constructor() {
        super();
    }
}