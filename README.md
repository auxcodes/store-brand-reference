Prod: [![Netlify Status](https://api.netlify.com/api/v1/badges/76e28d34-5506-4ab4-9ae6-e26e4342564f/deploy-status)](https://app.netlify.com/sites/ecstatic-hamilton-9c06e7/deploys), Dev: [![Netlify Status](https://api.netlify.com/api/v1/badges/7a4d811a-b4aa-4eff-a7b4-2fdfed6b719c/deploy-status)](https://app.netlify.com/sites/radiant-gecko-7ec5aa/deploys)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/H2H1ZZY1Q)
# store-brand-reference (Store Search)
**Store Search** is a website to aid Australian bike shops in searching for Australian Distributers that stock specific bike brands and parts.

## Updates
- January 31 2024: Addition of a main landing page (search engine style), improvements to styling, automatic clearing of old notfications.
- September 24 2022: Massive addition of backend data added (100+ distributors), new Store tab added to search for specific store, stores now have extra fields such as contact details.
- May 31 2022: Version 1.0 released, all store data is online and can now be edited by uses with valid email adresses.
- December 05 2021: Initial POC release, store data stored locally in json file.

## Local Setup
### Netlify CLI
```
npm install netlify-cli -g
```

### Netlify Functions
```
cd netlify_functions
npm install
```

### Run Local CLI
```
netlify dev
```
