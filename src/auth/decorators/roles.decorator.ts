import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: string[]) =>
  SetMetadata(ROLES_KEY, roles); 

//SetMetadata permet d'attacher des métadonnées à une route
//ROLES_KEY est le nom de la métadonnée
//Roles(...roles) C'est une fonction qui fabrique un décorateur