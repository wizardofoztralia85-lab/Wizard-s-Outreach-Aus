# Wizard Outreach Admin Updater

React + Vite single-page UI for admins to update Wizard outreach content without engineering help. Edit hero copy, CTA labels/links, announcements, and targeted blocks while seeing a live preview. Changes persist to local storage so you can draft safely before flipping status to ready or live.

## Run locally
```bash
npm install
npm run dev
```

## Validate before handoff
```bash
npm run build
```

## Notes
- Required fields gate the “Mark ready” action; missing fields are listed inline.
- Quick status chips let you flag approvals needed, mark live, or pause a send.
- Content blocks are grouped by audience so comms can tailor messaging without touching code.
