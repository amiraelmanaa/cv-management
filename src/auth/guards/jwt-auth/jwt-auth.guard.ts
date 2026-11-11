
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

/* Récupérer la requête
Lancer la stratégie JWT
Vérifier le token
Autoriser ou refuser l'accès */