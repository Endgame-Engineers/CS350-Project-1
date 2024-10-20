# Carbio - Nutrition Tracker
## Prereqs
- Must have Docker (https://docs.docker.com/get-started/get-docker/)
- Google Console API ClientID and ClientSecret (https://developers.google.com/workspace/guides/create-project)
- Add callback to Google API: `http://localhost:3000/api/auth/google/callback`
## How to Run
Clone down repo: 
```git clone https://github.com/Endgame-Engineers/CS350-Project-1```

Modify `.env-example` and rename to `.env`
```
DB_USERNAME=carbio
DB_PASSWORD=carbio
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=thedatabase
GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>
GOOGLE_CLIENT_SECRET=<YOUR_GOOGLE_CLIENT_SECRET>
SESSION_SECRET=<YOUR_SESSION_SECRET>
POSTGRES_USER=carbio
POSTGRES_PASSWORD=carbio
POSTGRES_DB=thedatabase
```
Start docker using docker compose:
```docker compose up -d``` (daemonize) or ```docker compose up```

Connect to `http://localhost:3000/`

Profit????