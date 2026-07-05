# Touchline Coach v1.2 Stable – Vite Public Fix

Tahle verze je opravená pro Vercel/Vite.

Důležité:
- statické soubory jsou ve složce `public/`
- Vite je při buildu zkopíruje do `dist`
- `/icon-192.png` už nebude 404
- PWA ikona používá TC logo
- klubové logo je `public/zbiroh.png`

Nahraj celý obsah ZIPu do GitHubu:
- index.html
- package.json
- README.md
- .gitignore
- main.js
- style.css
- public/

Po deployi:
1. Vercel musí být Ready.
2. Otevři v mobilu: https://touchline-coach.vercel.app/icon-192.png?v=12
3. Musíš vidět TC ikonu.
4. Pak otevři: https://touchline-coach.vercel.app/?v=12
5. Odinstaluj starou PWA a nainstaluj znovu.
