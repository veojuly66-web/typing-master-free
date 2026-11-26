# Pankaj Typing

A modern, distraction-free touch typing tutor and speed test application built with React, Vite, and Tailwind CSS.

Live demo: [https://veojuly66-web.github.io/typing-master-free/](https://veojuly66-web.github.io/typing-master-free/)

## Features

- **Structured Touch Typing Curriculum**: 30 progressive lessons across four levels (Beginner, Intermediate, Advanced, and Expert), starting from the home row to full punctuation and numbers.
- **Interactive Visual Keyboard & Finger Guide**: Real-time finger-placement indicators showing which hand and finger to use for every keystroke.
- **Strict Typing Mode**: Enforces accurate muscle memory by requiring the correct key before the cursor advances.
- **Realistic Audio Feedback**: Web Audio API synthesizer offering acoustic grand piano notes, mechanical switches, vintage typewriter, or soft click sounds with an instant mute toggle.
- **Speed Tests & Certificates**: Timed typing assessments (1, 2, 3, or 5 minutes) with a downloadable Certificate of Completion.
- **Arcade Practice Games**: Engaging mini-games (*Word Bubbles* and *Word Attack*) to build quick reflexes and peripheral letter recognition.
- **Custom Text Practice**: Practice with any custom text, literature, or programming snippets.
- **Personal Progress Analytics**: Tracks WPM history, accuracy trends, and problem keys entirely in your browser using `localStorage`. No account required.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Installation

```bash
# Clone the repository
git clone https://github.com/veojuly66-web/typing-master-free.git
cd typing-master-free

# Install dependencies
npm install
```

### Development

Run the local development server:

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173/`.

### Production Build

Create an optimized static build in the `dist` folder:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Deployment

This repository is configured for automated deployment to GitHub Pages using GitHub Actions. Any push to the `main` branch automatically runs `.github/workflows/deploy.yml`, which compiles the project and publishes the `./dist` directory.

## Privacy

Pankaj Typing runs entirely in the browser. All typing metrics, personal bests, and completed lessons are saved strictly in your device's `localStorage`. No personal data or keystroke information is transmitted to any external server.

## License

MIT
