#!/usr/bin/env node

/**
 * Theme Screenshot Capture Script
 * 
 * This script uses Playwright to programmatically open the baFive application,
 * cycle through each of the 9 themes, and capture screenshots of the login page.
 * 
 * Screenshots are saved to: design-previews/screenshots/theme-{number}-{name}.png
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Theme definitions matching src/contexts/ThemeContext.tsx
const THEMES = [
  { id: 'modern-blue', name: 'Modern Blue', displayName: 'Modern Blue' },
  { id: 'neon', name: 'Vibrant Neon', displayName: 'Vibrant Neon' },
  { id: 'sunset', name: 'Warm Sunset', displayName: 'Warm Sunset' },
  { id: 'mint', name: 'Cool Mint', displayName: 'Cool Mint' },
  { id: 'elegant', name: 'Elegant Dark', displayName: 'Elegant Dark' },
  { id: 'ocean', name: 'Ocean Deep', displayName: 'Ocean Deep' },
  { id: 'dracula', name: 'Dracula Dark', displayName: 'Dracula Dark' },
  { id: 'forest', name: 'Forest Green', displayName: 'Forest Green' },
  { id: 'cyberpunk', name: 'Cyberpunk', displayName: 'Cyberpunk' },
];

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'design-previews', 'screenshots');
const APP_URL = process.env.APP_URL || 'http://localhost:5173';
const VIEWPORT_WIDTH = 1280;
const VIEWPORT_HEIGHT = 800;
const ANIMATION_DELAY = 500; // ms to wait for animations to complete

/**
 * Ensure screenshots directory exists
 */
function ensureScreenshotsDir() {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
    console.log(`✓ Created directory: ${SCREENSHOTS_DIR}`);
  }
}

/**
 * Capture screenshots for all themes
 */
async function captureThemeScreenshots() {
  console.log('🎨 Starting theme screenshot capture...\n');
  console.log(`Target URL: ${APP_URL}`);
  console.log(`Viewport: ${VIEWPORT_WIDTH}x${VIEWPORT_HEIGHT}`);
  console.log(`Animation delay: ${ANIMATION_DELAY}ms\n`);

  let browser;
  let successCount = 0;
  let failureCount = 0;

  try {
    // Launch browser
    browser = await chromium.launch({
      headless: true,
      args: ['--disable-gpu', '--disable-dev-shm-usage'],
    });

    const context = await browser.createContext({
      viewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT },
    });

    const page = await context.newPage();

    // Set up console message logging
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log(`  ⚠ Console Error: ${msg.text()}`);
      }
    });

    // Navigate to app
    console.log(`Navigating to ${APP_URL}...`);
    try {
      await page.goto(APP_URL, { waitUntil: 'networkidle', timeout: 30000 });
      console.log('✓ Page loaded\n');
    } catch (error) {
      console.error(`✗ Failed to load page: ${error.message}`);
      throw error;
    }

    // Capture screenshot for each theme
    for (let i = 0; i < THEMES.length; i++) {
      const theme = THEMES[i];
      const themeNumber = (i + 1).toString().padStart(2, '0');
      const filename = `theme-${themeNumber}-${theme.id}.png`;
      const filepath = path.join(SCREENSHOTS_DIR, filename);

      try {
        console.log(`[${i + 1}/${THEMES.length}] Capturing ${theme.displayName}...`);

        // Set theme in localStorage
        await page.evaluate((themeId) => {
          localStorage.setItem('selectedTheme', themeId);
          // Trigger a storage event to update the theme
          window.dispatchEvent(
            new StorageEvent('storage', {
              key: 'selectedTheme',
              newValue: themeId,
              storageArea: localStorage,
            })
          );
        }, theme.id);

        // Reload to apply theme (or wait for context update)
        await page.reload({ waitUntil: 'networkidle', timeout: 10000 });

        // Wait for animations to complete
        await page.waitForTimeout(ANIMATION_DELAY);

        // Take screenshot
        await page.screenshot({ path: filepath, fullPage: false });

        console.log(`  ✓ Saved: ${filename}`);
        successCount++;
      } catch (error) {
        console.log(`  ✗ Failed: ${error.message}`);
        failureCount++;
      }
    }

    await context.close();

    // Print summary
    console.log(`\n${'='.repeat(60)}`);
    console.log(`✓ Screenshot capture complete!`);
    console.log(`  Success: ${successCount}/${THEMES.length}`);
    console.log(`  Failed: ${failureCount}/${THEMES.length}`);
    console.log(`  Location: ${SCREENSHOTS_DIR}`);
    console.log(`${'='.repeat(60)}\n`);

    if (failureCount === 0) {
      console.log('🎉 All theme screenshots captured successfully!');
    }

    return failureCount === 0;
  } catch (error) {
    console.error(`\n✗ Fatal error: ${error.message}`);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Main entry point
 */
async function main() {
  try {
    ensureScreenshotsDir();
    const success = await captureThemeScreenshots();
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
main();
