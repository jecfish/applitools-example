import { BrowserType, DeviceName } from '@applitools/eyes-puppeteer';

export async function setupEyes(eyes, batchName, apiKey) {
    eyes.setApiKey(apiKey);
  
    const configuration = eyes.getConfiguration();
  
    configuration.setBatch({ name: batchName })
    configuration.setStitchMode('CSS');

    // Add browser
    configuration.addBrowser({ width: 1200, height: 800, name: BrowserType.CHROME });
    configuration.addBrowser({ width: 1200, height: 800, name: BrowserType.FIREFOX });
    configuration.addBrowser({ width: 1200, height: 800, name: BrowserType.SAFARI });
    configuration.addBrowser({ width: 1200, height: 800, name: BrowserType.EDGE_CHROMIUM });
    configuration.addBrowser({ width: 1200, height: 800, name: BrowserType.IE_11 });
    configuration.addBrowser({ deviceName: DeviceName.Pixel_2 });
    configuration.addBrowser({ deviceName: DeviceName.iPhone_X });
  
    eyes.setConfiguration(configuration);
  };
  