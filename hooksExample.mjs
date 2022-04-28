import { createRunner, parse, PuppeteerRunnerExtension } from '@puppeteer/replay';
import { setupEyes } from './applitools.config.mjs';
import puppeteer from 'puppeteer';
import fs from 'fs';
import { Eyes, Target, VisualGridRunner } from '@applitools/eyes-puppeteer';

// Puppeteer: launch browser
const browser = await puppeteer.launch({ headless: false });
const page = await browser.newPage();

// Applitools: global variables
let visualGridRunner = null;
let eyes = null;

// Extend runner to initialize Eyes before all steps, take screenshot after each step, and close Eyes after all steps
class Extension extends PuppeteerRunnerExtension {
  async beforeAllSteps(flow) {
    await super.beforeAllSteps(flow);
    console.log('starting');

    // Aplitools: launch visual grid runner & eyes
    const apiKey = process.env.APPLITOOLS_API_KEY || 'REPLACE_YOUR_APPLITOOLS_API_KEY';
    const name = 'Chrome Recorder Demo';
    visualGridRunner = new VisualGridRunner({ testConcurrency: 7 });
    eyes = new Eyes(visualGridRunner);

    await setupEyes(eyes, name, apiKey);

    // Applitools: start the visual test
    await eyes.open(page, {
      appName: "Order a coffee",
      testName: "My first Applitools Chrome Recorder test!",
    })
    console.log("Eyes open");
  }

  async afterEachStep(step, flow) {
    await super.afterEachStep(step, flow);
    
    // Applitools: capture a full-page screenshot
    await eyes.check(`recording step: ${step.type}`, Target.window().fully(true))
    console.log(`after step: ${step.type}`);
  }

  async afterAllSteps(flow) {
    await super.afterAllSteps(flow);
    console.log('done');

    // Applitools: clean up
    await eyes.closeAsync();
    await eyes.abortAsync(); // abort if Eyes were not properly closed
    console.log("Eyes closed");
  }
}

// Puppeteer: read the JSON user flow
const recordingText = fs.readFileSync('./order-a-coffee.json', 'utf8');
const recording = parse(JSON.parse(recordingText));

// Puppeteer: create a runner and execute the script
const runner = await createRunner(recording, new Extension(browser, page, 7000));

// Puppeteer: clean up
await runner.run();
await browser.close();

// Applitools: manage tests across multiple Eyes instances
const testResultsSummary = await visualGridRunner.getAllTestResults()
for (const testResultContainer of testResultsSummary) {
  const testResults = testResultContainer.getTestResults();
  console.log(testResults);
}