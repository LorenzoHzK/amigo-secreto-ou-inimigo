import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { adminTokenGuard } from './admin-token.guard';
import { GroupService } from '../services/group.service';

describe('adminTokenGuard', () => {
  let groupServiceMock: any;
  let routerMock: any;

  beforeEach(() => {
    groupServiceMock = {
      getGroupByAdminToken: vi.fn(),
    };
    routerMock = {
      createUrlTree: vi.fn((path) => path),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: GroupService, useValue: groupServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  const runGuard = (routeParams: Record<string, string>) => {
    const route = {
      params: routeParams,
    } as unknown as ActivatedRouteSnapshot;

    return TestBed.runInInjectionContext(() => adminTokenGuard(route, {} as any));
  };

  it('deve retornar true se o token for válido e o grupo for encontrado', async () => {
    groupServiceMock.getGroupByAdminToken.mockResolvedValue({ id: '1', name: 'Test Group' });

    const result = runGuard({ adminToken: 'valid-token' });

    let finalValue: any;
    if (typeof result === 'boolean' || result instanceof Promise) {
      finalValue = await result;
    } else {
      finalValue = await new Promise((resolve) => (result as any).subscribe(resolve));
    }

    expect(finalValue).toBe(true);
    expect(groupServiceMock.getGroupByAdminToken).toHaveBeenCalledWith('valid-token');
  });

  it('deve retornar UrlTree para "/" se o token for inválido (grupo não encontrado)', async () => {
    groupServiceMock.getGroupByAdminToken.mockResolvedValue(null);

    const result = runGuard({ adminToken: 'invalid-token' });

    let finalValue: any;
    if (typeof result === 'boolean' || result instanceof Promise) {
      finalValue = await result;
    } else {
      finalValue = await new Promise((resolve) => (result as any).subscribe(resolve));
    }

    expect(finalValue).toEqual(['/']);
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/']);
  });

  it('deve retornar UrlTree para "/" se houver um erro de rede/promessa rejeitada', async () => {
    groupServiceMock.getGroupByAdminToken.mockRejectedValue(new Error('Erro de conexão'));

    const result = runGuard({ adminToken: 'error-token' });

    let finalValue: any;
    if (typeof result === 'boolean' || result instanceof Promise) {
      finalValue = await result;
    } else {
      finalValue = await new Promise((resolve) => (result as any).subscribe(resolve));
    }

    expect(finalValue).toEqual(['/']);
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/']);
  });

  it('deve retornar UrlTree para "/" se o token estiver ausente na rota', async () => {
    const result = runGuard({});

    let finalValue: any;
    if (typeof result === 'boolean' || result instanceof Promise) {
      finalValue = await result;
    } else if (result && typeof (result as any).subscribe === 'function') {
      finalValue = await new Promise((resolve) => (result as any).subscribe(resolve));
    } else {
      finalValue = result;
    }

    expect(finalValue).toEqual(['/']);
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/']);
    expect(groupServiceMock.getGroupByAdminToken).not.toHaveBeenCalled();
  });
});
