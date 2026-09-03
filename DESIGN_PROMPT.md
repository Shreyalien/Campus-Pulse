# CAMPUS PULSE — Full-Stack Build & Design Prompt

Build **Campus Pulse**, a premium real-time campus issue intelligence platform for universities.

## Product Goal
Students can report Wi-Fi outages, classroom problems, transport delays, cafeteria/facility issues, lab equipment failures, events and lost/found items. Operations staff can triage, assign, update and resolve reports. The system turns raw reports into a live campus intelligence layer.

## Core Experience
1. Landing/dashboard opens with a live campus map.
2. Animated issue markers pulse according to severity.
3. Clicking a marker opens an investigation drawer with status timeline, location, category, priority, reporter and updates.
4. Students can submit reports through a polished modal.
5. New reports appear instantly through Socket.IO without refresh.
6. Analytics show report volume, issue categories, hotspots and response time.
7. Admin mode supports status changes, assignment, notes and resolution history.

## Visual Direction
- Premium dark command-center aesthetic.
- Near-black graphite background, subtle green/lime signal accent, cool gray text.
- Thin borders, restrained glow, soft glass surfaces.
- Dense but breathable dashboard grid.
- No generic Bootstrap/card-heavy appearance.
- Typography should feel editorial/technical.
- Use micro-interactions everywhere: hover lift, marker pulse, number transitions, drawer slide, modal spring, chart reveal, live-status shimmer.
- Prefer Framer Motion for UI motion.
- Use Recharts for analytics.
- Use Leaflet/OpenStreetMap for a real map in the production version.

## Pages
### Overview
KPIs, live map, recent reports, 7-day trend, category breakdown.
### Live Map
Full-screen map, filters, clustering, density layer and selected issue drawer.
### Reports
Search, category/status/priority filters, sortable issue table/list, bulk triage.
### Analytics
Report trend, hotspot analysis, average response time, resolution rate, category comparison.
### Admin Operations
Assignment queue, SLA risk, status workflow, internal notes and audit history.
### Report Issue
Title, category, location, priority, description, optional photo, anonymous toggle.

## Data Model
users(id, name, email, password_hash, role, created_at)
issues(id, title, description, category, location, lat, lng, priority, status, reporter_id, assignee_id, created_at, updated_at, resolved_at)
issue_updates(id, issue_id, author_id, status, note, created_at)
notifications(id, user_id, issue_id, type, read_at, created_at)

## API
GET /api/health
GET /api/issues
GET /api/issues/:id
POST /api/issues
PATCH /api/issues/:id
GET /api/analytics/summary
GET /api/analytics/trends
GET /api/analytics/categories

## Realtime Events
issue:new
issue:updated
issue:resolved
notification:new

## Security
Use bcrypt password hashing, JWT sessions, role-based admin authorization, input validation, rate limiting on report/auth endpoints, CORS allowlist and environment variables for secrets.

## Animation Rules
- Never animate everything simultaneously.
- Map markers: 1.8–2.5s pulse, staggered.
- Panels: 150–300ms entrance with small vertical offset.
- Drawer: spring slide from right.
- Modal: spring scale/opacity entrance.
- Charts: reveal on mount.
- Status updates: animate only the changed row/card.
- Respect prefers-reduced-motion.

## Production Standard
Responsive from 360px upward. Keyboard accessible. Visible focus states. Empty/loading/error states. Toast feedback. Optimistic updates only where safe. Avoid fake metrics once real API data is available.

## Portfolio Standard
The product should look like a real operations product, not a student CRUD dashboard. Prioritize interaction quality, data hierarchy, realtime behavior and a coherent visual system.
