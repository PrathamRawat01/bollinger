# Bollinger Theta — Live Demo

Hey there! I’m **Pratham Rawat**, and welcome to **Bollinger Theta**, my take on a smooth, modern Bollinger Bands overlay using React, Next.js, TypeScript, Tailwind CSS, and KLineCharts. You can check it out right here: **[https://bollinger-theta.vercel.app/](https://bollinger-theta.vercel.app/)**



# What’s in the Project?

## Features

* Clean candlestick chart with **Bollinger Bands** overlay.
* Two-tab settings panel:

  * **Inputs**: Adjust length (default 20), multiplier (default 2), MA type (SMA), etc.
  * **Style**: Toggle middle/upper/lower bands, color, width, dashed/solid lines, and a translucent background fill.
* Everything updates **instantly**, no page reloads.
* Responsive to data loading using `computeBollingerBands()` — performance stays smooth, even with hundreds of candles.
* Touch/crosshair support that shows Band values under the cursor.




## Project Setup

To get a copy of the project:

```bash
git clone [https://github.com/PrathamRawat01/bollinger]
cd your-project-folder
npm install
npm run dev

```
Once everything’s running, open `http://localhost:3000` to explore the chart and settings panel.

---

## Formulas & Standard Deviation

For clarity on the math under the hood:

* **Basis**: `SMA(source, length)`
* **StdDev** (population formula): `sqrt( sum((source - mean)²) / length )`
* **Upper**: `Basis + multiplier × StdDev`
* **Lower**: `Basis - multiplier × StdDev`

Note: I use the **population** version (divide by *n*), consistent with John Bollinger's typical approach.

---

## KLineCharts Version

This project uses **KLineCharts v9** (as per dependencies in `package.json`) — it's lightweight and ideal for slick indicators like this one.

---

## Screenshots & GIFs![alt text](image-1.png)

* ![Chart with Bands and Settings](../bollinger/image.png)
* ![Style Tab: Toggle Bands and Colors](../bollinger/image2.png)


---

## TL;DR — Why It Rocks

| You Get...            | Why It’s Great                                   |
| --------------------- | ------------------------------------------------ |
| Real-time interaction | Changes feel smooth and intuitive                |
| Full styling control  | Look, feel, and behavior inspired by TradingView |
| Clean, modular code   | Easy to extend or integrate elsewhere            |
| Performance-ready     | Handles 200+ candles like a champ                |

---

Let me know if you want a walkthrough or some help adapting this into your own project. Thanks for checking it out!

— **PrathamRawat**
