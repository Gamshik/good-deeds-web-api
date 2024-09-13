/* eslint-disable prettier/prettier */
/* eslint-disable no-var */
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECURITY_KEY } from '../constants/jwt.security.key';
import { Request } from 'express';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const token = this.getJwtTokenFromRequest(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      var decodedToken = this.jwtService.verify(token, { secret: JWT_SECURITY_KEY });
      request['user'] = decodedToken;
      return true;
    }
    catch(err) {
      throw new ForbiddenException();
    }
  }

  private getJwtTokenFromRequest(request: Request): string | null {
    const authorizationField = request.headers['authorization']; 
    console.log(request.cookies['Token']);

    if (!authorizationField){
      return null;
    }

    const [type, token] = authorizationField.split(' ');
    
    return type === 'Bearer' ? token : null;
  }
}
