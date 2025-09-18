# Narrative Buer - Progressive Web App

En moderne Progressive Web App (PWA) for tekstanalyse av norske tekster fra Nasjonalbiblioteket. Dette er en konvertering av den opprinnelige Streamlit-applikasjonen til en fullverdig PWA med offline-funksjonalitet.

## 🚀 Funksjoner

- **Søk i korpus**: Søk etter dokumenter basert på stikkord og tidsperiode
- **Dokumentvalg**: Velg dokumenter fra søkeresultatene
- **Ordspredningsanalyse**: Analyser hvordan ord er fordelt gjennom teksten
- **Interaktive grafer**: Visualiser resultater med responsive diagrammer
- **PWA-funksjonalitet**: Installer som app, fungerer offline
- **Moderne UI**: Responsivt design med moderne brukergrensesnitt

## 🛠 Teknologi

### Backend
- **Node.js** med Express.js
- **Axios** for API-kall til Nasjonalbiblioteket
- **Helmet** for sikkerhet
- **Rate limiting** og kompresjon

### Frontend
- **React 18** med moderne hooks
- **Styled Components** for styling
- **Recharts** for datavisualisering
- **React Select** for avanserte dropdown-menyer
- **Service Worker** for PWA-funksjonalitet

## 📦 Installasjon

### Forutsetninger
- Node.js >= 16.0.0
- npm >= 8.0.0

### Oppsett

1. **Klon repositoriet**:
```bash
git clone https://github.com/Yoonsen/Narrative_buer_js.git
cd Narrative_buer_js
```

2. **Installer avhengigheter**:
```bash
npm run install-all
```

3. **Konfigurer miljøvariabler**:
```bash
cp env.example .env
# Rediger .env med dine API-nøkler
```

4. **Start utviklingsservere**:
```bash
npm run dev
```

Dette starter både backend-serveren (port 3001) og React-appen (port 3000).

## 🌐 Produksjon

### Bygg for produksjon
```bash
npm run build
```

### Start produksjonsserver
```bash
npm start
```

## 📱 PWA-funksjoner

- **Installasjon**: Appen kan installeres på desktop og mobile enheter
- **Offline-støtte**: Grunnleggende funksjonalitet fungerer uten internett
- **Service Worker**: Cacher ressurser for rask lasting
- **Responsive design**: Tilpasset alle skjermstørrelser

## 🔧 API-endepunkter

- `GET /api/corpus` - Søk i dokumentkorpus
- `GET /api/dispersion` - Beregn ordspredning
- `GET /api/document/:urn` - Hent dokumentmetadata
- `GET /api/suggestions` - Få søkeforslag
- `GET /health` - Helsesjekk

## 📊 Bruk

1. **Søk**: Angi stikkord og velg tidsperiode
2. **Velg dokument**: Velg fra søkeresultatene
3. **Analyser ord**: Skriv inn ord du vil analysere
4. **Se resultater**: Interaktive grafer viser ordspredning

## 🔒 Sikkerhet

- HTTPS-påkrevet i produksjon
- Rate limiting på API-endepunkter
- CORS-konfigurasjon
- Content Security Policy
- Input-validering

## 🧪 Testing

```bash
# Frontend-tester
cd client && npm test

# Backend-tester (når implementert)
npm run test:server
```

## 📈 Ytelse

- Lazy loading av komponenter
- Bildekompresjon og optimalisering
- Service Worker-caching
- Gzip-kompresjon
- Bundle-optimalisering

## 🤝 Bidrag

1. Fork repositoriet
2. Opprett en feature-branch
3. Commit endringene dine
4. Push til branchen
5. Opprett en Pull Request

## 📄 Lisens

MIT License - se LICENSE-filen for detaljer.

## 🙋‍♂️ Support

For spørsmål eller problemer, opprett en issue i GitHub-repositoriet eller kontakt DH Lab.

## 🔗 Lenker

- [Nasjonalbiblioteket DH Lab](https://nb.no/dh-lab)
- [Original Streamlit-app](https://github.com/Yoonsen/Narrative_buer)
- [API-dokumentasjon](https://api.nb.no/catalog/v1/)
