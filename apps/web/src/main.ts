import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    if ('serviceWorker' in navigator && environment.production) {
      void navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.error('Falha ao registrar service worker', err);
      });
    }
  })
  .catch((err) => console.error(err));
