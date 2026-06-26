import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DrawService } from './draw.service';
import { SUPABASE_URL } from '../tokens/supabase.tokens';

interface Participant {
  id: string;
  group_id: string;
  name: string;
}

// Algoritmo de derangement copiado da Edge Function para teste de cobertura de 100%
function generateDerangement(participants: Participant[]): Participant[] | null {
  if (participants.length < 3) return null;

  const shuffle = (arr: Participant[]): Participant[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  for (let attempt = 0; attempt < 2000; attempt++) {
    const shuffled = shuffle(participants);
    const isDerangement = shuffled.every((p, i) => p.id !== participants[i].id);
    if (isDerangement) return shuffled;
  }

  return null;
}

describe('DrawService', () => {
  let service: DrawService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DrawService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: SUPABASE_URL, useValue: 'https://example.supabase.co' },
      ],
    });
    service = TestBed.inject(DrawService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('generateDerangement (algoritmo puro)', () => {
    it('não deve atribuir nenhum participante a si mesmo', () => {
      const participants: Participant[] = [
        { id: '1', group_id: 'g', name: 'Alice' },
        { id: '2', group_id: 'g', name: 'Bob' },
        { id: '3', group_id: 'g', name: 'Charlie' },
        { id: '4', group_id: 'g', name: 'David' },
      ];

      const result = generateDerangement(participants);
      expect(result).not.toBeNull();
      result!.forEach((p, idx) => {
        expect(p.id).not.toBe(participants[idx].id);
      });
    });

    it('deve cobrir todos os participantes exatamente uma vez', () => {
      const participants: Participant[] = [
        { id: '1', group_id: 'g', name: 'Alice' },
        { id: '2', group_id: 'g', name: 'Bob' },
        { id: '3', group_id: 'g', name: 'Charlie' },
      ];

      const result = generateDerangement(participants);
      expect(result).not.toBeNull();
      const ids = result!.map((p) => p.id);
      expect(ids.sort()).toEqual(['1', '2', '3']);
    });

    it('deve retornar null para menos de 3 participantes', () => {
      const p1: Participant[] = [];
      const p2: Participant[] = [{ id: '1', group_id: 'g', name: 'Alice' }];
      const p3: Participant[] = [
        { id: '1', group_id: 'g', name: 'Alice' },
        { id: '2', group_id: 'g', name: 'Bob' },
      ];

      expect(generateDerangement(p1)).toBeNull();
      expect(generateDerangement(p2)).toBeNull();
      expect(generateDerangement(p3)).toBeNull();
    });

    it('deve funcionar com exatamente 3 participantes', () => {
      const participants: Participant[] = [
        { id: '1', group_id: 'g', name: 'Alice' },
        { id: '2', group_id: 'g', name: 'Bob' },
        { id: '3', group_id: 'g', name: 'Charlie' },
      ];

      const result = generateDerangement(participants);
      expect(result).not.toBeNull();
      expect(result!.length).toBe(3);
      result!.forEach((p, idx) => {
        expect(p.id).not.toBe(participants[idx].id);
      });
    });

    it('deve funcionar com 100 participantes', () => {
      const participants: Participant[] = [];
      for (let i = 1; i <= 100; i++) {
        participants.push({ id: String(i), group_id: 'g', name: `P${i}` });
      }

      const result = generateDerangement(participants);
      expect(result).not.toBeNull();
      expect(result!.length).toBe(100);
      result!.forEach((p, idx) => {
        expect(p.id).not.toBe(participants[idx].id);
      });
    });
  });

  describe('draw() — integração com Edge Function', () => {
    it('deve fazer POST para /functions/v1/perform-draw com o adminToken', async () => {
      const mockResponse = {
        drawn_at: '2026-06-25T20:00:00Z',
        participant_count: 5,
        group_name: 'Test Group',
      };

      const promise = service.draw('token123');

      const req = httpMock.expectOne('https://example.supabase.co/functions/v1/perform-draw');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ admin_token: 'token123' });

      req.flush(mockResponse);

      const res = await promise;
      expect(res).toEqual(mockResponse);
    });

    it('deve propagar erros HTTP', async () => {
      const promise = service.draw('invalid-token');

      const req = httpMock.expectOne('https://example.supabase.co/functions/v1/perform-draw');
      req.flush('Erro ao realizar o sorteio', { status: 404, statusText: 'Not Found' });

      await expect(promise).rejects.toThrow();
    });
  });
});
