# Wanderlust Tracker

Proiect Angular 20 pentru un jurnal si planificator de calatorii personale.

## Ce face proiectul

Wanderlust Tracker ofera:
- autentificare + inregistrare prin interfata Angular,
- retinerea sesiunii cu `Remember me` folosind `localStorage` / `sessionStorage`,
- vizualizare si administrare a destinatiilor intr-un tabel cu sortare si cautare,
- creare si editare destinatii in modale NgZorro,
- stergere cu confirmare,
- harta interactiva Leaflet bazata pe destinatia selectata,
- validari custom pentru date si parola,
- folosirea Angular Signals in logica aplicatiei.

## Tehnologii principale

- Angular 20
- NgZorro Ant Design
- Leaflet + OpenStreetMap
- `date-fns`
- TypeScript
- Reqres.in demo API pentru autentificare

## Functionalitati principale

- Login si Register
- Guard-uri de ruta: `authGuard` si `guestGuard`
- Lazy loaded routes pentru `auth` si `destinations`
- Search bar reutilizabil cu `input()` / `output()`
- CRUD destinatii
- Tabel cu sortare pe coloane si paginare
- Harta interactiva (Leaflet)
- Mesaje de succes / eroare cu `NzMessageService`

## Structura si componente importante

```
src/app/
├── app.config.ts            # configuratie router si NgZorro
├── app.routes.ts            # rute principale
├── core/
│   ├── guards/
│   │   └── auth.guard.ts    # blocare rute autentificate / guest
│   ├── models/
│   │   ├── destination.model.ts
│   │   └── user.model.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── destination.service.ts
│   └── validators/
│       └── custom.validators.ts
├── features/
│   ├── auth/
│   │   ├── auth.routes.ts
│   │   ├── login/login.component.ts
│   │   └── register/register.component.ts
│   └── destinations/
│       ├── destinations.routes.ts
│       ├── destinations.component.ts
│       ├── destination-form/destination-form.component.ts
│       └── destination-map/destination-map.component.ts
└── shared/
    └── components/
        └── search-bar/search-bar.component.ts
```

## Rute importante

- `/auth/login` - pagina login
- `/auth/register` - pagina inregistrare
- `/destinations` - lista destinatii + harta
- `/` si `**` redirecteaza la `/destinations`

## Cum rulezi proiectul

### 1. Instaleaza dependentele

```powershell
cd c:\work\unitbv\2025-2026\of2
npm install
```

### 2. Ruleaza in modul de dezvoltare

```powershell
npm start
```

Aplicatia va porni pe adresa implicita `http://localhost:4200`.

### 3. Build productie

```powershell
npm run build
```

### 4. Build de dezvoltare cu watch

```powershell
npm run watch
```

## Configuratie build

Fisier: `angular.json`
- output: `dist/wanderlust-tracker`
- `styles`: `ng-zorro-antd`, `leaflet.css`, `src/styles.scss`
- `production`: output hashing si limite buget
- `development`: fara optimizare si cu sourcemap

## Date de test si demo

- Login demo: `eve.holt@reqres.in` / `cityslicka`
- In registrare, folositi un email unic.

## Observatii

- Rutele pentru autentificare si destinatii sunt incarcate lazy, ceea ce reduce dimensiunea bundle-ului initial.
- `DestinationService` salveaza in `localStorage` si initializeaza date seed la prima rulare.
- `AuthService` foloseste un mock local pentru login/register daca nu exista `apiKey` configurat.

