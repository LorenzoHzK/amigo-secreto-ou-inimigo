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

  // Valida apenas a existência do convite. A página de convite é informativa
  // (orienta a usar o link individual) e funciona antes e depois do sorteio —
  // por isso não bloqueamos mais grupos já sorteados aqui.
  return from(groupService.getGroupByInviteToken(token)).pipe(
    map((group) => (group ? true : router.createUrlTree(['/']))),
    catchError(() => of(router.createUrlTree(['/']))),
  );
};
