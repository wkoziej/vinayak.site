# Instrukcja tworzenia strony firmowej z 11ty (Eleventy)

## Kontekst projektu

Tworzysz stronę wizytówkę dla firmy o nazwie "I to i to", która działa w trzech obszarach: masażu, muzyce i programowaniu. Nazwa firmy nawiązuje do filozofii, że alternatywy się uzupełniają, a nie wykluczają.

Celem jest stworzenie prostej i eleganckiej strony, która przestrzega zasady DRY (Don't Repeat Yourself), będzie łatwa w utrzymaniu i szybka w działaniu. Strona musi zawierać informacje o misji firmy, obszarach działalności, dane kontaktowe oraz informacje o firmie.

Eleventy (11ty) to prosty generator stron statycznych, który doskonale nadaje się do tego zadania ze względu na:
- Prostotę konfiguracji
- Minimalne wymagania i małą liczbę zależności
- Elastyczność w wyborze języków szablonów (Nunjucks, Liquid, Handlebars)
- Generowanie czystych stron HTML, które można hostować na dowolnym serwerze

## Struktura projektu

Rekomendowana struktura projektu:

```
itoito.site/
├── .eleventy.js                # Plik konfiguracyjny Eleventy
├── package.json                # Zależności npm
├── README.md                   # Dokumentacja
├── src/                        # Kod źródłowy
│   ├── _data/                  # Dane globalne
│   │   ├── site.json           # Dane strony (tytuł, opis, itp.)
│   │   └── navigation.json     # Struktura nawigacji
│   ├── _includes/              # Komponenty wielokrotnego użytku
│   │   ├── layouts/            # Szablony układu stron
│   │   │   └── base.njk        # Podstawowy szablon
│   │   ├── partials/           # Fragmenty stron
│   │   │   ├── header.njk      # Nagłówek strony
│   │   │   ├── footer.njk      # Stopka strony
│   │   │   └── navigation.njk  # Nawigacja
│   │   └── components/         # Mniejsze komponenty
│   ├── assets/                 # Zasoby statyczne
│   │   ├── css/                # Style CSS
│   │   │   └── main.css        # Główny plik CSS
│   │   ├── js/                 # Skrypty JavaScript
│   │   │   └── main.js         # Główny plik JS
│   │   └── images/             # Obrazy
│   ├── index.njk               # Strona główna
│   ├── o-firmie.njk            # Strona "O firmie"
│   ├── uslugi.njk              # Strona "Usługi"
│   └── kontakt.njk             # Strona "Kontakt"
└── .gitignore                  # Pliki ignorowane przez git
```

## Przygotowanie projektu

1. **Wymagania wstępne**:
   - Zainstalowany Node.js (co najmniej wersja 14.x)
   - Podstawowa znajomość terminala/wiersza poleceń

2. **Inicjalizacja projektu**:
   - Zainicjalizuj projekt npm: `npm init -y`
   - Zainstaluj Eleventy: `npm install @11ty/eleventy --save-dev`
   - Opcjonalnie zainstaluj live-server dla podglądu: `npm install browser-sync --save-dev`

3. **Konfiguracja npm scripts**:
   
   Dodaj do `package.json` następujące skrypty:

   ```json
   "scripts": {
     "build": "eleventy",
     "start": "eleventy --serve",
     "debug": "DEBUG=* eleventy"
   }
   ```

4. **Konfiguracja Eleventy**:
   
   Utwórz plik `.eleventy.js` w głównym katalogu projektu:

   ```javascript
   module.exports = function(eleventyConfig) {
     // Kopiuj zasoby statyczne
     eleventyConfig.addPassthroughCopy("src/assets");
     
     // Konfiguracja
     return {
       dir: {
         input: "src",
         output: "dist",
         includes: "_includes",
         data: "_data"
       },
       templateFormats: ["njk", "md", "html"],
       htmlTemplateEngine: "njk",
       markdownTemplateEngine: "njk"
     };
   };
   ```

## Implementacja Bootstrap

1. **Podłączenie Bootstrap przez CDN**:
   
   W pliku `src/_includes/layouts/base.njk` dodaj odniesienia do Bootstrap:

   ```html
   <!DOCTYPE html>
   <html lang="pl">
   <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>{{ title }} - {{ site.name }}</title>
       
       <!-- Bootstrap CSS -->
       <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
       
       <!-- Własne style -->
       <link href="/assets/css/main.css" rel="stylesheet">
   </head>
   <body>
       {% include "partials/header.njk" %}
       
       <main class="container py-5">
           {{ content | safe }}
       </main>
       
       {% include "partials/footer.njk" %}
       
       <!-- Bootstrap JS Bundle -->
       <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
       
       <!-- Własne skrypty -->
       <script src="/assets/js/main.js"></script>
   </body>
   </html>
   ```

## Tworzenie danych globalnych

1. **Dane strony**:
   
   Utwórz plik `src/_data/site.json`:

   ```json
   {
     "name": "I to i to",
     "description": "Alternatywy się uzupełniają",
     "url": "https://www.itoito.site",
     "author": "Wojciech Koziej",
     "email": "...",
     "phone": "+48 ...",
     "address": "Bogucin",
     "facebook": "https://facebook.com/itoito"
   }
   ```

2. **Struktura nawigacji**:
   
   Utwórz plik `src/_data/navigation.json`:

   ```json
   {
     "main": [
       {
         "text": "Strona główna",
         "url": "/"
       },
       {
         "text": "O I to i to",
         "url": "/o-firmie/"
       },
       {
         "text": "Czym się dzielimy",
         "url": "/uslugi/"
       },
       {
         "text": "Kontakt",
         "url": "/kontakt/"
       }
     ]
   }
   ```

## Tworzenie szablonów

1. **Nagłówek** (src/_includes/partials/header.njk):
   
   ```html
   <header>
     <nav class="navbar navbar-expand-lg navbar-light bg-light">
       <div class="container">
         <a class="navbar-brand" href="/">{{ site.name }}</a>
         <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
           <span class="navbar-toggler-icon"></span>
         </button>
         <div class="collapse navbar-collapse" id="navbarNav">
           <ul class="navbar-nav ms-auto">
             {% for item in navigation.main %}
               <li class="nav-item">
                 <a class="nav-link {% if page.url == item.url %}active{% endif %}" href="{{ item.url }}">{{ item.text }}</a>
               </li>
             {% endfor %}
           </ul>
         </div>
       </div>
     </nav>
   </header>
   ```

2. **Stopka** (src/_includes/partials/footer.njk):
   
   ```html
   <footer class="bg-light py-4 mt-5">
     <div class="container text-center">
       <p class="mb-0">&copy; {{ '' | date('YYYY') }} {{ site.name }}. Wszelkie prawa zastrzeżone.</p>
       <div class="mt-2">
         <a href="{{ site.facebook }}" class="text-decoration-none me-2">Facebook</a>
       </div>
     </div>
   </footer>
   ```

## Tworzenie stron

1. **Strona główna** (src/index.njk):
   
   ```njk
   ---
   layout: layouts/base.njk
   title: Strona główna
   ---

   <section class="py-5 text-center container">
     <div class="row py-lg-5">
       <div class="col-lg-8 col-md-10 mx-auto">
         <h1 class="fw-light">{{ site.name }}</h1>
         <p class="lead text-muted">{{ site.description }}</p>
         <p>
           <a href="/uslugi/" class="btn btn-primary my-2">Usługi</a>
           <a href="/kontakt/" class="btn btn-secondary my-2">Kontakt</a>
         </p>
       </div>
     </div>
   </section>

   <!-- Pozostała treść strony głównej -->
   ```

2. **Pozostałe strony - przykład**:
   
   Utwórz podobne pliki dla `o-firmie.njk`, `uslugi.njk` i `kontakt.njk`, zmieniając tylko frontmatter i treść.

## Zarządzanie projektem i wdrażanie

1. **Kontrola wersji z Git**:
   
   - Zainicjalizuj repozytorium Git: `git init`
   - Dodaj plik `.gitignore`:
     ```
     node_modules/
     dist/
     .DS_Store
     ```
   - Dodaj pliki: `git add .`
   - Utwórz pierwszy commit: `git commit -m "Inicjalizacja projektu"`

2. **Publikacja na GitHub**:
   
   - Utwórz nowe repozytorium na GitHub
   - Podłącz lokalne repozytorium: `git remote add origin https://github.com/wkoziej/itoito.site.git`
   - Wypchnij zmiany: `git push -u origin main`

3. **Wdrażanie na serwer**:
   
   **Automatyczne wdrażanie z GitHub Actions**
   
   Utwórz plik `.github/workflows/deploy.yml`:
   
   ```yaml
   name: Deploy Website

   on:
     push:
       branches: [ main ]

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v3

         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '16'
             
         - name: Install dependencies
           run: npm ci
           
         - name: Build site
           run: npm run build
           
         - name: Deploy to server
           uses: SamKirkland/FTP-Deploy-Action@v4.3.4
           with:
             server: ${{ secrets.FTP_SERVER }}
             username: ${{ secrets.FTP_USERNAME }}
             password: ${{ secrets.FTP_PASSWORD }}
             local-dir: ./dist/
             server-dir: /public_html/
   ```

   Pamiętaj, aby dodać odpowiednie sekrety w ustawieniach repozytorium GitHub.

## Rozszerzenia i optymalizacje

1. **Optymalizacja obrazów**:
   
   Zainstaluj `eleventy-img`: `npm install @11ty/eleventy-img --save-dev`
   
   I skonfiguruj w `.eleventy.js`

2. **Minifikacja CSS/JS**:
   
   Rozważ dodanie procesu budowania z Webpack, Parcel lub PostCSS


## Wskazówki dla twórcy strony

- Zachowaj spójny styl i kolorystykę pomiędzy podstronami
- Optymalizuj obrazy przed dodaniem do projektu
- Koncentruj się na przekazaniu klarownego komunikatu o firmie
- Pamiętaj o dostępności strony dla wszystkich użytkowników

