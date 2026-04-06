# Wizard's Outreach Australia

Central hub for Glass Wizard Australia to spread our message and get down to business.

## Tech Stack

- **Frontend:** React 19 + Vite
- **Backend / Services:** Firebase (Authentication, Firestore)
- **Routing:** React Router v7

## Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project with **Authentication** (Email/Password) and **Firestore** enabled.

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/wizardofoztralia85-lab/Wizard-s-Outreach-Aus.git
   cd Wizard-s-Outreach-Aus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**

   Copy `.env.example` to `.env` and fill in your Firebase project credentials:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your values from the [Firebase Console](https://console.firebase.google.com/).

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. **Build for production**
   ```bash
   npm run build
   ```
   The output is in the `dist/` folder — deploy to Firebase Hosting or any static host.

## Admin Panel

The admin panel is available at `/admin`. It requires a Firebase Authentication account.

### Creating an Admin Account

In the [Firebase Console](https://console.firebase.google.com/) → **Authentication** → **Users**, add an email/password user. That user can then log in at `/admin/login`.

### Admin Features

| Section | What you can do |
|---|---|
| **Site Content** | Edit the hero title, subtitle, about text, and footer shown on the homepage |
| **App Listings** | Add, edit, or remove the app cards displayed on the homepage |
| **Announcements** | Post, edit, or delete announcements that appear at the top of the homepage |

## Related Repositories

- [Lyric Live — Free / Basic / Pro](https://github.com/Glass-Wizard-Australia-Pty-Ltd/Lyric-Live-Free-Basic-Pro)
- [Subscription Starter](https://github.com/Glass-Wizard-Australia-Pty-Ltd/subscription-starter)

## License

[CC0 1.0 Universal](LICENSE) — Public Domain
