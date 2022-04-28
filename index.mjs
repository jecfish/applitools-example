import { createRunner, parse, PuppeteerRunnerExtension } from '@puppeteer/replay';
import { setupEyes } from './applitools.config.mjs';
import puppeteer from 'puppeteer';
import fs from 'fs';
import { Eyes, Target, VisualGridRunner } from '@applitools/eyes-puppeteer';
import { config } from 'process';

// extend runner to take screenshot after each step
class Extension extends PuppeteerRunnerExtension {
  async afterEachStep(step, flow) {
    await super.afterEachStep(step, flow);
    await eyes.check(`recording step: ${step.type}`, Target.window().fully(false));
    console.log(`after step: ${step.type}`);
  }
}

// Puppeteer: launch browser
const browser = await puppeteer.launch({ headless: false }); // or set it to true
const page = await browser.newPage();

// Aplitools: launch visual grid runner & eyes
const apiKey = process.env.APPLITOOLS_API_KEY || 'REPLACE_YOUR_APPLITOOLS_API_KEY';
const name = 'Chrome Recorder Demo';
const visualGridRunner = new VisualGridRunner({ testConcurrency: 5 });
const eyes = new Eyes(visualGridRunner);


await setupEyes(eyes, name, apiKey);
await eyes.open(page, {
  appName: "Order a coffee",
  testName: "My First Applitools Chrome Recorder test!",
  visualGridOptions: {
    "ieV2": true
  }
});

// Puppeteer: Read the JSON user flow
const recordingText = fs.readFileSync('./order-coffe.json', 'utf8');
const recording = parse(JSON.parse(recordingText));

// Puppeteer: Create a runner and execute the script
const runner = await createRunner(recording, new Extension(browser, page, 7000));

// Puppeteer: clean up
await runner.run();
await browser.close();

// Applitools: clean up
await eyes.closeAsync();
await eyes.abortAsync(); // abort if Eyes were not properly closed

// Manage tests across multiple Eyes instances
const testResultsSummary = await visualGridRunner.getAllTestResults()
for (const testResultContainer of testResultsSummary) {
  const testResults = testResultContainer.getTestResults();
  console.log(testResults);
}

