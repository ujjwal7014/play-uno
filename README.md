# Online UNO Game – Architecture and Development Guide

This project is a turn-based, real-time online UNO game. It features Google OAuth login, real-time game state via GraphQL subscriptions (Hasura), and a React (Vite) frontend styled with Tailwind and Shadcn UI.

---

## Features

* Google Sign-In (OAuth)
* Create/Join game lobbies via unique codes
* Real-time updates with GraphQL subscriptions over WebSockets
* Official UNO rules enforced (including Wild/D4 restrictions)
* Scalable for many players per game

---

## Tech Stack

* **Frontend**: React (Vite), Tailwind CSS, Shadcn UI, Zustand for state
* **GraphQL Client**: Apollo Client with WebSocketLink
* **Backend**: Hasura GraphQL Engine over PostgreSQL
* **Authentication**: Google OAuth JWT

---

## Screens

### 1️⃣ Login Screen

* "Sign in with Google" using @react-oauth/google
* On success, JWT stored in state/context
* Hasura verifies this token on every request

### 2️⃣ Lobby Screen

* Create a new game ➜ generates a unique join code
* Join existing game ➜ enter a code
* Uses Hasura mutations & queries to manage players
* Real-time list of joined players via GraphQL subscription

### 3️⃣ Game Rules Screen

* Static page/modal showing UNO rules
* Includes color/number matching, action cards, Wild Draw Four rules, etc.

### 4️⃣ Game Screen

* Displays:

  * Top card on discard pile
  * Player’s hand
  * Other players’ cards count/avatars
* Shows whose turn it is
* Highlights valid moves
* Real-time updates via GraphQL subscriptions

---

## Architecture Overview

### Frontend

* Vite + React + JS
* React Router for navigation
* Zustand for global state (user, game state)
* Apollo Client for GraphQL
* GoogleOAuthProvider for login
* Shadcn UI for accessible components

**Routes:**

* `/login`
* `/lobby`
* `/rules`
* `/game/:gameId`

**Component Structure:**

* `<App />`

  * `<Navbar />`
  * `<Outlet />`
  * `<LoginScreen />`
  * `<LobbyScreen />`
  * `<GameScreen />`

    * `<CurrentCard />`
    * `<PlayerHand />`
    * `<PlayerList />`
    * `<ActionButtons />`

---

### Backend

* Hasura GraphQL Engine
* PostgreSQL database

**Suggested Tables:**

* `users`: id, name, email, Google ID, role
* `games`: id, join\_code, status, current\_player\_id, discarded\_color/value
* `players`: id, game\_id (FK), user\_id (FK), hand (JSONB), position
* (Optional) `moves`: history of plays

**Real-time:**

* GraphQL subscriptions push game and player state to clients
* Uses WebSockets (Apollo WebSocketLink)

---

## Rule Enforcement

* **Client-side:** disables illegal moves in UI
* **Server-side:** validates moves using UNO engine library (npm package recommended)

Example validation flow:

* User clicks card
* Frontend calls Hasura Action (playCard mutation)
* Serverless function validates move (e.g., with uno-engine)
* Updates database via Hasura
* Subscriptions push new state to all players

---

## Authentication

* Frontend:

  * Google Sign-In via @react-oauth/google
  * JWT stored in context/state
  * Added as `Authorization: Bearer <token>` header
* Backend:

  * Hasura JWT configuration to verify Google tokens
  * Uses Google’s JWKS for signature validation
  * Role-based permissions (x-hasura-user-id claims)

---

## Development Plan (Recommended Phases)

✅ Setup & Scaffolding (1–2 days)

* Vite+React repo
* Install Tailwind, Shadcn UI, Apollo Client
* Hasura + Postgres setup

✅ Google OAuth Integration (1–2 days)

* Implement Login
* Configure Hasura JWT auth

✅ Lobby Screen (1–2 days)

* Create/join game
* Subscriptions for player list

✅ Game Rules Screen (0.5–1 day)

* Static modal/page

✅ Game Screen UI (2–3 days)

* Current card, player hand, other players
* Wire up GraphQL subscriptions

✅ Backend Game Logic (3–4 days)

* Hasura Actions or Event Triggers
* Serverless function (e.g. Node.js with uno-engine)

✅ Integration (1–2 days)

* Connect UI controls to mutations/actions

✅ Rule Enforcement & UI Feedback (1–2 days)

* Disable invalid moves
* Wild card color picker

✅ Testing & Edge Cases (2 days)

* Playtest with multiple players
* Error handling, token expiry

✅ Polish & Deployment (1–2 days)

* UI polish
* Production deployment (Vercel/Netlify)

*Total estimate: \~10–15 working days*

---

## Additional Considerations

* **Data model**: store hands in JSONB for simplicity
* **Scaling**: Hasura Cloud supports high concurrency for subscriptions
* **Security**: Enforce role-based permissions in Hasura
* **Error Handling**: Return meaningful errors for invalid moves
* **Analytics**: Optionally log game events for debugging or stats

---

## Recommended Libraries & Tools

* [`@react-oauth/google`](https://www.npmjs.com/package/@react-oauth/google) – Google Sign-In
* [Apollo Client](https://www.apollographql.com/docs/react/) – GraphQL
* [Hasura GraphQL Engine](https://hasura.io) – Real-time backend
* [uno-engine](https://www.npmjs.com/package/uno-engine) – UNO rules logic
* [Shadcn UI](https://shadcn.dev) – Accessible React components
* [Tailwind CSS](https://tailwindcss.com) – Utility styling
* [Zustand](https://zustand-demo.pmnd.rs/) – Lightweight state management

---

## Deployment

* Frontend: Vercel / Netlify
* Backend:

  * Hasura Cloud or self-hosted
  * Postgres database (e.g., Railway, Supabase)
  * Serverless functions (Vercel/Netlify Functions)

---

## License

MIT or your preferred license.

---

## Contributors

* Add your team here!

---

## References

* [Hasura Authentication Docs](https://hasura.io/learn/graphql/hasura/authentication/)
* [GraphQL Subscriptions with Apollo](https://hasura.io/learn/graphql/react/subscriptions/1-subscription/)
* [UNO Rules (Wikipedia)](https://en.wikipedia.org/wiki/Uno_%28card_game%29)
