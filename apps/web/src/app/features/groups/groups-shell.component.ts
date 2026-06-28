import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Layout pai da área "/grupos" (rotas filhas).
 * Agrupa a lista de grupos (filho '') e a criação (filho 'criar') sob um
 * mesmo prefixo e router-outlet, representando a hierarquia de layout.
 */
@Component({
  selector: 'app-grupos-shell',
  standalone: true,
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<router-outlet />`,
})
export class GruposShellComponent {}
