import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { GroupService } from '../services/group.service';

export const adminTokenGuard: CanActivateFn = (route) => {
  const groupService = inject(GroupService);
  const router = inject(Router);
  const token = route.params['adminToken'] as string;

  if (!token) {
    return router.createUrlTree(['/']);
  }

  return from(groupService.getGroupByAdminToken(token)).pipe(
    map((group) => (group ? true : router.createUrlTree(['/']))),
    catchError(() => of(router.createUrlTree(['/']))),
  );
};
