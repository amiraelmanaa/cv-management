
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
//on utilise la stratégie JWT de Passport et on la personnalise pour notre app
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {

    //On récupère la variable JWT_SECRET
    const secret = configService.get<string>('JWT_SECRET');
   
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
       //la valeur est absente ou vide
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //indique à Passport où chercher le token
      ignoreExpiration: false,
      secretOrKey: secret, //la clé secrète pour vérifier le token
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
  /*validate() n'est pas responsable de la vérification de la signature. Cette vérification est faite par la stratégie JWT avant son exécution*/ 
}
