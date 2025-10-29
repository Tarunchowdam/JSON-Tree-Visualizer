
## 🧠 JSON Tree Visualizer

 A sleek, interactive, and beautifully designed web app to visualize JSON data as a hierarchical tree with search, highlighting, and temporary node preview support.

---

### 🚀 Features

✅ **Real-time JSON Parsing** — Paste or write JSON and visualize it instantly

✅ **Error Handling** — Detect invalid JSON input with user-friendly alerts

✅ **Interactive Tree View** — Built using **React Flow** and **Dagre.js** for auto layout

✅ **Search & Highlight** — Quickly find and focus on any key or value

✅ **Temporary Node Preview** — Dynamically preview nodes before final insertion

✅ **Premium UI** — Glassmorphic, responsive, and elegant light/dark mode design

✅ **No Scroll Layout** — Fixed view with adaptive scaling for a seamless user experience

---

### 🏗️ Tech Stack

| Layer                    | Technologies Used                                    |
| ------------------------ | ---------------------------------------------------- |
| **Frontend**             | React.js, React Flow, Dagre.js                       |
| **Styling**              | CSS3, Glassmorphism, Modern Gradients                |
| **Visualization Engine** | React Flow + Dagre Auto Layout                       |
| **State Management**     | React Hooks (`useState`, `useEffect`, `useCallback`) |

---

### 📂 Folder Structure

```
json-tree-visualizer/
│
├── public/
│   ├── index.html
│   └── favicon.ico
│
├── src/
│   ├── components/
│   │   └── TreeVisualizer.jsx     # Main visualization component
│   ├── App.jsx                    # Root app logic and controls
│   ├── index.js                   # Entry point
│   ├── styles.css                 # Premium glassmorphic styling
│   └── utils/
│       └── layout.js              # Dagre layout helper
│
├── package.json
├── README.md
└── preview.png                    # Optional demo image
```

---

### ⚙️ Installation & Setup

```bash
# 1️⃣ Clone the repository
git clone https://github.com/<your-username>/json-tree-visualizer.git
cd json-tree-visualizer

# 2️⃣ Install dependencies
npm install

# 3️⃣ Run the development server
npm start
```

Your app will be live at 👉 **[http://localhost:3000](http://localhost:3000)**

---

### 🧩 Usage

1. Paste or type any valid JSON into the text area on the left panel
2. Click **“Visualize”** to generate the hierarchical tree
3. Click on any node to:

   * Highlight it
   * Copy its full path
4. Hover or click to see **temporary preview nodes** (custom logic supported)

---

### 🎨 UI Highlights

* ✨ **Glassmorphic Design:** Subtle blur, gradients, and shadows for a premium look
* 🌗 **Dual Theme Ready:** Light and dark themes supported (optional toggle)
* 🧭 **Auto Layout:** Node positions are automatically managed using Dagre.js
* 🔗 **Path Copying:** Clicking a node copies its JSON path to clipboard

---


### 🧠 Future Enhancements

* [ ] Add **export to image/PDF** feature
* [ ] Enable **collapse/expand nodes**
* [ ] Support **very large JSON datasets**
* [ ] Add **dark mode toggle** switch

---

### 👨‍💻 Author

**chowdam Tarunkumar**

Full Stack Developer | Java | MERN 

📧 [[tarunchowdam435@gmail.com](mailto:tarunchowdam435@gmail.com)]

🔗 [LinkedIn](https://linkedin.com/in/chowdamtarunkumar) | [GitHub](https://github.com/Tarunchowdam)

---




