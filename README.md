# 🛡️ Truth Lens: AI-Powered Fact Verification

![Truth Lens Banner](https://images.unsplash.com/photo-1504711432869-0fd1078ee23b?auto=format&fit=crop&q=80&w=1200&h=400)

**Truth Lens** is a production-ready, full-stack AI platform designed to combat misinformation. By leveraging the power of **Google Gemini AI** and real-time **Google Search Grounding**, Truth Lens provides instant, authoritative verdicts on news snippets, URLs, and social media graphics.

---

## ✨ Key Features

### 🚀 High-Performance Hero Section
*   **Scroll-Triggered Canvas**: A cinematic animation that responds to user interaction, symbolizing the transformation from raw data to verified truth.
*   **Futuristic Typography**: Elegant text sequences powered by Framer Motion.

### 🔍 Advanced News Analyzer
*   **Multi-Input Support**: Analyze news via raw text, direct URLs, or image uploads (screenshots/posters).
*   **AI Reasoning**: Detailed explanations of *why* a news item is flagged, identifying linguistic patterns and logical fallacies.
*   **Fact Summaries**: Concise, verified alternatives to the analyzed misinformation.

### 📰 Editorial Design System
*   **Newspaper Effects**: Digital "paper grain" texture, halftone image filters, and classic drop-cap typography.
*   **Futuristic Editorial**: A blend of high-end dark mode aesthetics with traditional broadsheet layouts.
*   **Vertical Rail Labels**: Systematic margin labels for a technical, authoritative feel.

### 📊 User Dashboard
*   **Verification History**: Securely store and search through your past analyses using Firebase Firestore.
*   **Accuracy Insights**: Visual statistics on detection reliability and source trust scores.
*   **Real-time Stats**: Track total checks and real-vs-fake ratios.

---

## 📸 App Screenshots

### 1. Hero Experience
![Hero Section](./public/screenshots/hero.png)

### 2. News Analysis Engine
![News Analyzer](./public/screenshots/analyzer.png)

### 3. Personal Insights Dashboard
![User Dashboard](./public/screenshots/dashboard.png)

---

## 🤖 AI & Data Infrastructure

### Models Used
*   **Gemini 3 Flash**: Our primary reasoning engine, optimized for fast linguistic analysis and sentiment detection.
*   **Google Search Grounding**: Every analysis is cross-referenced against millions of live, verified sources to ensure factual accuracy.

### Data Handling
*   **Firebase Auth**: Secure Google-based authentication.
*   **Firestore**: Real-time, owner-only data persistence for analysis history and user statistics.

---

## 🛠️ Tech Stack

*   **Frontend**: [React 18](https://reactjs.org/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **AI SDK**: [@google/genai](https://www.npmjs.com/package/@google/genai)
*   **Backend**: [Firebase](https://firebase.google.com/) (Authentication & Firestore)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Components**: [shadcn/ui](https://ui.shadcn.com/)

---

## 🚀 Getting Started

### Prerequisites
*   Node.js 18+
*   A Gemini API Key (configured in environment)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/truth-lens.git
   cd truth-lens
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file based on `.env.example` and add your `GEMINI_API_KEY`.

4. Start the development server:
   ```bash
   npm run dev
   ```

---

## ⚖️ License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Built with ❤️ to protect the truth in the digital age.*
