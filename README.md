<div align="center">
  <br/>
  <img src="https://img.shields.io/badge/status-live-success?style=flat-square" alt="Status">
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License">
  <img src="https://img.shields.io/badge/made%20with-vanilla%20JS-f7df1e?style=flat-square" alt="Vanilla JS">
  <br/><br/>

  <h1>📄 MyInvoice</h1>
  <h3>Create, preview, and export professional invoices — instantly.</h3>
  <p><i>A beautifully designed, no-dependency invoice generator that runs entirely in your browser.</i></p>

  <br/>

  <a href="https://invoice-generator-kohl.vercel.app"><strong>🌐 Live Demo</strong></a>
  &nbsp;·&nbsp;
  <a href="#✨-features"><strong>Features</strong></a>
  &nbsp;·&nbsp;
  <a href="#🚀-deploy-your-own"><strong>Deploy</strong></a>
  &nbsp;·&nbsp;
  <a href="#🛠️-tech-stack"><strong>Stack</strong></a>

  <br/><br/>

  <img src="https://via.placeholder.com/900x520/4f46e5/ffffff?text=MyInvoice+Preview" alt="MyInvoice Screenshot" width="90%" style="border-radius: 16px; box-shadow: 0 12px 40px rgba(0,0,0,0.15);">

  <br/><br/>
</div>

---

## ✨ Features

| | |
|---|---|
| 🎨 **Live Preview** | See your invoice update in real-time as you type |
| 📄 **PDF Export** | One-click download as a polished, print-ready PDF |
| 🏢 **Company Info** | Your name, address, email, phone — fully customizable |
| 👤 **Client Details** | Bill-to section with all recipient fields |
| 📦 **Line Items** | Add, remove, and edit items with auto-calculated amounts |
| 💰 **Tax & Discount** | Configurable tax rate (%) and discount ($) |
| 📝 **Notes & Terms** | Optional payment notes and terms & conditions |
| 📋 **Sample Data** | Pre-filled demo to see the app in action |
| 📱 **Responsive** | Works beautifully on desktop, tablet, and mobile |
| ☁️ **Zero Backend** | Everything runs client-side — no server, no database |

## 🖼️ Screenshots

<div align="center">
  <table>
    <tr>
      <td><img src="https://via.placeholder.com/420x320/4f46e5/ffffff?text=Invoice+Form" alt="Form" width="100%"></td>
      <td><img src="https://via.placeholder.com/420x320/3730a3/ffffff?text=Live+Preview" alt="Preview" width="100%"></td>
    </tr>
    <tr align="center">
      <td><em>Side-by-side form layout</em></td>
      <td><em>Real-time invoice preview</em></td>
    </tr>
  </table>
</div>

## 🚀 Deploy Your Own

Deploy to Vercel, Netlify, or any static host in seconds:

```bash
# Clone it
git clone https://github.com/Olumidedara/invoice-generator.git
cd invoice-generator

# That's it. Open index.html or deploy.
```

Or just drag the folder to [vercel.com](https://vercel.com) — zero config required.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FOlumidedara%2Finvoice-generator)

## 🛠️ Tech Stack

```
📄 HTML5     — Semantic structure
🎨 CSS3      — Custom properties, grid, responsive design
⚡ Vanilla JS — No frameworks, zero dependencies
🖼️ html2canvas — DOM-to-canvas capture
📄 jsPDF     — PDF generation
🔤 Inter     — Clean, modern typeface
```

## 🧠 How It Works

1. **Fill out the form** — your company info, client details, invoice metadata, and line items.
2. **Watch the preview** — the right panel updates instantly with every keystroke.
3. **Export to PDF** — click the button and `html2canvas` captures the preview, then `jsPDF` wraps it into a downloadable file.

No data leaves your browser. No API calls. No sign-ups.

## 📁 Project Structure

```
├── index.html          # Main HTML — form + preview layout
├── css/
│   └── style.css       # All styling — design system, layout, responsiveness
├── js/
│   └── script.js       # App logic — CRUD items, calculations, PDF export
└── README.md           # This file
```

## 🤝 Contributing

Found a bug or have an idea? Open an [issue](https://github.com/Olumidedara/invoice-generator/issues) or submit a PR — contributions are welcome!

## 📄 License

MIT — use it freely for personal or commercial projects.

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/Olumidedara">Olumidedara</a></sub>
  <br/>
  <sub>Powered by vanilla JS, good coffee, and the desire to never open Word again.</sub>
</div>
