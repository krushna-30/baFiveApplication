const playwright = require('playwright');
const fs = require('fs');
const path = require('path');

const themes = [
  { id: 'modern-blue', num: '01', label: 'Modern Blue' },
  { id: 'neon', num: '02', label: 'Neon' },
  { id: 'sunset', num: '03', label: 'Sunset' },
  { id: 'mint', num: '04', label: 'Mint' },
  { id: 'elegant', num: '05', label: 'Elegant' },
  { id: 'ocean', num: '06', label: 'Ocean' },
  { id: 'dracula', num: '07', label: 'Dracula' },
  { id: 'forest', num: '08', label: 'Forest' },
  { id: 'cyberpunk', num: '09', label: 'Cyberpunk' }
];

(async () => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  const screenshotDir = path.join(__dirname, 'design-themes');
  
  await page.goto('http://localhost:5173/');
  
  for (const { id, num, label } of themes) {
    console.log(`Capturing ${label}...`);
    
    await page.evaluate((themeId) => {
      document.documentElement.className = `theme-${themeId}`;
      localStorage.setItem('selectedTheme', themeId);
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'selectedTheme',
        newValue: themeId,
        storageArea: localStorage
      }));
    }, id);
    
    await page.waitForTimeout(800);
    
    const filename = `${num}-${id}.png`;
    const filepath = path.join(screenshotDir, filename);
    await page.screenshot({ path: filepath, fullPage: true });
    console.log(`✓ Saved: ${filename}`);
  }
  
  await browser.close();
  console.log('\n✅ All 9 theme screenshots captured!');
})();
