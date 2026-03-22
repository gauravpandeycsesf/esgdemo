# CSRD Render Demo

A small Node + Express project that serves a demo frontend for a CSRD-style workflow.

## Local run

```bash
npm install
npm start
```

Open `http://localhost:3000`

## Deploy to Render

### Option 1: with render.yaml
1. Push the project to GitHub
2. In Render, create a new Web Service from the repo
3. Render should pick up the settings from `render.yaml`

### Option 2: manual settings
- Environment: Node
- Build Command: `npm install`
- Start Command: `npm start`

## Next upgrades
- persist data in Postgres
- add login
- export report as PDF
- move rules into JSON or DB tables
