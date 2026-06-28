import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { MyDrawResult } from '../models';
import { RevealService } from '../services/reveal.service';

/**
 * Resolver funcional: pré-carrega o par sorteado (get_my_draw) ANTES de a
 * rota /revelar/:personalToken ativar, para a tela já renderizar com os dados
 * prontos (sem estado de "carregando" no componente). Em caso de erro/token
 * inválido retorna null, e o componente exibe a mensagem apropriada.
 */
export const revealResolver: ResolveFn<MyDrawResult | null> = (route) => {
  const token = route.paramMap.get('personalToken');
  if (!token) {
    return null;
  }
  return inject(RevealService)
    .getMyDraw(token)
    .catch(() => null);
};
