import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// O service worker do PWA é registrado via provideServiceWorker (app.config.ts).
bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
