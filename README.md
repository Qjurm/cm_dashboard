# CM Game Dashboard
Een realtime analytics-dashboard gebouwd met Vue 3 en Tailwind CSS om de resultaten van de CM Game-studie te visualiseren. Het maakt verbinding met een Supabase backend om keuzes van deelnemers, reactietijden en scenario-uitkomsten in realtime weer te geven.

## Functies
* 🟢 Real-time Feed: Live updates via Supabase-abonnementen zodra nieuwe deelnemers het spel voltooien.
* 📊 Analytics:
   * Gemiddelde reactietijd per scenario.
   * Cirkeldiagrammen voor scenario-uitkomsten.
   * Globale beslissingstellingen.
* 🔍 Filteren & Sorteren:
   * Zoeken op naam van de deelnemer.
   * Filteren op geslacht.
   * Sorteren op nieuwste, oudste, snelste of langzaamste.
   * Prototype Filter: Schakelaar om de eerste 30 "prototype"-inzendingen te verbergen/tonen.
* 💾 Databeheer:
   * Exporteren: Kopieer gefilterde data naar het klembord als CSV.
   * Importeren: Handmatig CSV-data inladen (Offline Modus).
##  Vereisten
* Node.js (v16+ aanbevolen)
* npm
## Installatie
1. Clone de repository:
```
git clone <jouw-repo-url>
cd cm-game-dashboard
```



2. Installeer afhankelijkheden:
```npm install```


3. Configureer Omgevingsvariabelen:
Maak een .env.local bestand aan in de root directory en voeg je Supabase-gegevens toe:
```
VITE_SUPABASE_URL=jouw_supabase_project_url
VITE_SUPABASE_KEY=jouw_supabase_anon_key
```


## De App Draaien
Development Server:
```
npm run dev
```



Build voor Productie:
```
npm run build
```


##  ## # Offline Modus (Supabase Offline?)
Als de Supabase backend offline of onbereikbaar is, of als je het dashboard zonder internetverbinding moet presenteren, kun je de ingebouwde Import-functie gebruiken.

Hoe om te gaan met een offline backend:
   1. Voorbereiding (Wanneer Online):
   * Gebruik de "Copy Filtered Data" knop in het dashboard om je huidige dataset naar je klembord te kopiëren.
   * Plak dit in een tekstbestand en sla het op als backup_data.csv.
   2. Wanneer Offline:
   * Open het dashboard (localhost of static build).
   * Zelfs als de live data niet laadt, klik op de "Import CSV" knop (groene knop in de bedieningsbalk).
   * Selecteer je backup_data.csv bestand.
   * Het dashboard zal het bestand verwerken en alle grafieken, statistieken en lijsten weergeven alsof de database live is.
## Projectstructuur
Dit project gebruikt een modulaire structuur voor onderhoudbaarheid:
   * src/composables/: Bevat useStudyData.js. Dit is het "brein" van de app, dat Supabase-verbindingen, dataverwerking, sorteerlogica en statusbeheer afhandelt.
   * src/components/:
   * ControlBar.vue: De filterbalk met zoek-, sorteer- en import/exportknoppen.
   * LiveFeed.vue & ParticipantCard.vue: Toont de lijst met gebruikers en hun keuzes.
   * ScenarioCharts.vue: Het raster met cirkeldiagrammen.
   * *Widget.vue: Kleine statistiekblokken (Totaal beslissingen, gemiddelden).
   * src/utils/: Hulpfuncties voor consistente kleurcodering (colors.js) en tijdformattering (formatters.js).
## Technologieën
   * Vue 3 (Composition API)
   * Vite
   * Tailwind CSS
   * Supabase
   * Chart.js & vue-chartjs
   * date-fns