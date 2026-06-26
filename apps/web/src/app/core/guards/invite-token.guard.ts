import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { GroupService } from '../services/group.service';

export const inviteTokenGuard: CanActivateFn = (route) => {
  const groupService = inject(GroupService);
  const router = inject(Router);
  const token = route.params['inviteToken'] as string;

  if (!token) {
    return router.createUrlTree(['/']);
  }

  return from(groupService.getGroupByInviteToken(token)).pipe(
    map((group) => {
      if (!group) {
        return router.createUrlTree(['/']);
      }
      if (group.status === 'drawn' || group.drawn_at !== null) {
        // Redirecionar para página informativa de grupo encerrado
        return router.createUrlTree(['/grupo-encerrado']);
      }
      return true;
    }),
    catchError(() => of(router.createUrlTree(['/']))),
  );
};
