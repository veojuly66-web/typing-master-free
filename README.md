# ⌨️ Typing Master Free (100% Free & Open Touch-Typing Platform)

A modern, full-featured touch-typing tutor inspired by classic **Typing Master Pro**, completely unlocked with **all premium features free for everyone**.

---

## 🌟 Key Features

### 1. 📚 Complete 6-Unit Touch Typing Curriculum (24 Structured Lessons)
* **Unit 1: The Home Row** (Keys F, J, D, K, S, L, A, ;, G, H + Home Row mastery drills)
* **Unit 2: The Top Row** (Keys R, U, E, I, W, O, Q, P, T, Y + Upper reach drills)
* **Unit 3: The Bottom Row** (Keys V, M, C, Comma, X, Period, Z, Slash, B, N + Pangrams)
* **Unit 4: Capital Letters & Shift Keys** (Opposite hand Shift rule & capitalization)
* **Unit 5: Numbers & Common Symbols** (Number row 1-0, punctuation, and coding symbols)
* **Unit 6: Speed & Professional Fluency** (Top 100 high-frequency words, workplace emails, grand graduation drill)

### 2. 🖐️ Interactive Visual Hands & Animated Virtual Keyboard
* **Dynamic Finger Visualizer**: Left & right SVG hand diagrams highlighting exactly which of the 10 fingers to use for each key.
* **QWERTY Virtual Keyboard**: Color-coded keycaps mapped to respective fingers, with tactile nubs on `F` and `J`.
* **Target Character Bubble**: Shows live upcoming character and finger instruction.

### 3. 🔊 Realistic Keyboard Switch Audio Synthesizer (Web Audio API)
* **Cherry MX Blue**: Crisp mechanical click switch.
* **Gateron Brown**: Deep bassy "thock" sound.
* **Vintage Typewriter**: Authentic metallic clack.
* **Harmonic Success Chimes & Error Audio**: Zero external audio files required — synthesized in real-time.

### 4. ⏱️ Standardized Speed Test & 📜 Official Certificate Generator
* **Timed Tests**: 1-minute, 2-minute, 3-minute, and 5-minute timed assessments across multiple literature & tech topics.
* **Real-time Metrics**: Gross WPM, Net WPM, Accuracy %, Keystroke count, and Errors.
* **Authentic Certificate of Achievement**:
  * Customizable student name.
  * Verified Net WPM and Accuracy badges.
  * Official seal, date, and unique certificate serial ID.
  * **1-Click High-Res PNG Download** (1600x1100 rendered via HTML5 canvas).
  * **1-Click Print / Save to PDF** with dedicated clean print styling.

### 5. 🎮 Classic Arcade Game: "Word Drops / Falling Words"
* Words float down from the sky toward a red laser defense line.
* Type words before they hit the ground.
* Combo multipliers, particle explosion effects, levels, and local high-score tracking.

### 6. 🔥 Problem Keys Heatmap & AI Custom Drill Generator
* **Key Accuracy Heatmap**: Visual overview of every single key (Green = Mastered, Yellow = Needs practice, Red = Problem keys).
* **Identified Weak Spots**: Automatically tracks accuracy and hesitation for each key.
* **"Practice Only My Weak Keys" Button**: Dynamically creates a customized exercise targeting your specific weak keys!

### 7. 🎨 Themes & Customization
* **Typing Master Classic Blue**
* **Cyberpunk Neon**
* **Emerald Forest**
* **Retro Amber Terminal**

### 8. 🔒 100% Client-Side & Privacy First
* No sign-up or login required.
* All progress, test history, and settings are saved automatically in browser `localStorage`.
* Backup & Restore: 1-click **Export to JSON** and **Import from JSON**.

---

## 🚀 How to Run Locally

You don't need any complex installation. You can run it immediately using any of the following:

### Option 1: Direct File Open
Simply double-click `index.html` in your file explorer to open it in Chrome, Edge, Safari, or Firefox.

### Option 2: Python Local Server
```bash
cd /Users/pankaj/.gemini/antigravity/scratch/typing-master-free
python3 -m http.server 8080
```
Then open [http://localhost:8080](http://localhost:8080) in your browser.

### Option 3: Node / npx
```bash
npx serve .
```

---

## 🌐 How to Host Online for Free Forever

You can publish this website online for free in under 2 minutes:

### Method A: GitHub Pages (Recommended)
1. Create a new GitHub repository named `typing-master-free`.
2. Push the files in this folder to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Typing Master Free"
   git branch -M main
   git remote add origin https://github.com/<your-username>/typing-master-free.git
   git push -u origin main
   ```
3. In your GitHub repository, go to **Settings** > **Pages**.
4. Under **Branch**, select `main` and `/ (root)`, then click **Save**.
5. Your website will be live at `https://<your-username>.github.io/typing-master-free/`!

### Method B: Vercel or Netlify (Drag & Drop)
1. Go to [vercel.com](https://vercel.com) or [netlify.com](https://netlify.com).
2. Simply drag and drop the `typing-master-free` folder into the dashboard.
3. Your site gets deployed instantly with a free HTTPS custom domain!

---

## 📁 Project Structure

```
typing-master-free/
├── index.html            # Main Single Page App shell
├── css/
│   └── styles.css        # Complete custom styling, 3D keys, certificate print styles
├── js/
│   ├── audio.js          # Web Audio API switch sound synthesizer
│   ├── storage.js        # LocalStorage persistence, backup & restore
│   ├── lessons.js        # 24-lesson comprehensive typing curriculum
│   ├── keyboard.js       # Virtual keyboard layout, finger map, SVG hand visualizer
│   ├── practice.js       # Character-by-character typing practice engine
│   ├── test.js           # Timed speed test runner & scoring
│   ├── game.js           # Falling words arcade canvas game
│   ├── analytics.js      # Key heatmap, weak key detection & drill generator
│   ├── certificate.js    # Canvas certificate renderer & PNG exporter
│   └── app.js            # App initialization, tabs, settings & themes
└── README.md             # Documentation
```
