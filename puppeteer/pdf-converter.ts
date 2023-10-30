import puppeteer from 'puppeteer';
import express from 'express';
import bodyParser from 'body-parser';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import Queue from 'queue';
import dotenv from 'dotenv';

const { window } = new JSDOM('');
const DOMPurify = createDOMPurify(window);

const app = express();
const port = 3000;
// Set Body parser middleware
app.use(bodyParser.json({ limit: '50mb' }));

// @ts-ignore
let browser: puppeteer.Browser | undefined;

const q = new Queue({ results: [] });
q.concurrency = 5; // Only 5 jobs will be processed at a time
q.autostart = true; // Start processing jobs automatically

// Generate PDF from HTML
async function generatePDF(dirtyHTML: string) {
  const env = dotenv.config().parsed;

  console.log('Generating PDF...');
  const page = await browser.newPage();

  await page.setUserAgent(env?.PDF_CONVERTER_CUSTOM_USER_AGENT);

  const cleanBody = DOMPurify.sanitize(dirtyHTML, {
    USE_PROFILES: { html: true, mathMl: true },
    ADD_TAGS: ['math', 'mrow', 'mi', 'mo', 'mn', 'msup', 'msub', 'mfrac'],
  });

  // add katex css and markdown styles
  const htmlStart = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <link rel="stylesheet" href="${env?.APP_ROOT}src/markedPDF/styles/markdown.css">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV" crossorigin="anonymous">
      </head>
    <body>
  `;

  const htmlEnd = `
      </body>
      </html>
  `;

  // add head and end of html
  const cleanHTML = htmlStart + cleanBody + htmlEnd;

  // await page.on('console', (msg:any) => console.log('PAGE LOG:', msg.text()));

  await page.setContent(cleanHTML, { waitUntil: 'networkidle0' });

  const pdf = await page.pdf({
    format: 'A4',
    margin: {
      top: 50, bottom: 50, left: 50, right: 50,
    },
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: `
    <div style="width: 100%; font-size: 9px; padding: 16px; position: relative;">
      <div style="position: absolute; right: 16px; top: 5px; font-family: Arial, sans-serif;"><span class="pageNumber"></span>/<span class="totalPages"></span></div>
    </div>
  `,
  });

  await page.close();

  return pdf;
}

async function startBrowser() {
  browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--font-render-hinting=none',
      '--disable-features=IsolateOrigins',
      '--disable-site-isolation-trials',
      '--autoplay-policy=user-gesture-required',
      '--disable-background-networking',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-breakpad',
      '--disable-client-side-phishing-detection',
      '--disable-component-update',
      '--disable-default-apps',
      '--disable-dev-shm-usage',
      '--disable-domain-reliability',
      '--disable-extensions',
      '--disable-features=AudioServiceOutOfProcess',
      '--disable-hang-monitor',
      '--disable-ipc-flooding-protection',
      '--disable-notifications',
      '--disable-offer-store-unmasked-wallet-cards',
      '--disable-popup-blocking',
      '--disable-print-preview',
      '--disable-prompt-on-repost',
      '--disable-renderer-backgrounding',
      '--disable-setuid-sandbox',
      '--disable-speech-api',
      '--disable-sync',
      '--hide-scrollbars',
      '--ignore-gpu-blacklist',
      '--metrics-recording-only',
      '--mute-audio',
      '--no-default-browser-check',
      '--no-first-run',
      '--no-pings',
      '--no-sandbox',
      '--no-zygote',
      '--password-store=basic',
      '--use-gl=swiftshader',
      '--use-mock-keychain',
    ],
  });
}

async function startServer() {
  // Start the browser
  await startBrowser();

  // Periodically restart the browser
  setInterval(async () => {
    console.log('Restarting browser...');
    await browser.close();
    await startBrowser();
  }, 3600000); // Restart every hour

  app.post('/pdf-converter', async (req, res) => {
    // API key authentication
    const apiKey = req.header('Authorization');
    if (!apiKey || apiKey !== dotenv.config().parsed?.PDF_CONVERTER_API_KEY) {
      res.status(401).json({ error: 'Unauthorized' });
    }

    const dirtyHTML = req.body.html;

    // Add job to queue
    q.push(async (cb) => {
      try {
        const pdf = await generatePDF(dirtyHTML);
        console.log('PDF generated successfully');
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdf);
      } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).send('An error occurred while generating the PDF');
      }
      if (cb) cb(); // Notify queue that job is done
    });
  });

  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
}

// Start the server
startServer().catch((err) => {
  console.error('Failed to start the server:', err);
});
