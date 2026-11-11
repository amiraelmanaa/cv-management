
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {

  // Reflector permet de lire les métadonnées
  // enregistrées auparavant avec @Roles()
  constructor(private reflector: Reflector) {}

  // Cette méthode est appelée automatiquement par NestJS
  // avant d'autoriser l'accès à une route protégée
  // Elle retourne true (autoriser) ou false (refuser).
  canActivate(context: ExecutionContext): boolean {

    // On récupère les rôles autorisés pour cette route.
    // ROLES_KEY : nom de la métadonnée ('roles').
    // getHandler() : récupère la méthode du contrôleur appelée.
    // getClass() : récupère la classe du contrôleur.
    // On vérifie donc les métadonnées de la méthode et du contrôleur.
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si aucun rôle n'est exigé pour cette route,
    // on autorise l'accès.
    if (!requiredRoles) {
      return true;
    }

    // On récupère la requête HTTP en cours.
    const request = context.switchToHttp().getRequest();

    // Passport, grâce au JwtAuthGuard, a déjà vérifié le JWT
    // et placé les informations de l'utilisateur dans request.user.
    const user = request.user;

    // On vérifie si le rôle de l'utilisateur correspond
    // à au moins un des rôles autorisés.
    // some() retourne true dès qu'une correspondance est trouvée.
    return requiredRoles.some((role) => user.role === role);
  }
}
