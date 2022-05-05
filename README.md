An example to extend [Puppeteer Replay](https://goo.gle/puppeteer-replay) to use [Applitools](https://applitools.com/) to capture screenshots, validate and replay the exported user flow JSON file from Chrome DevTools Recorder.

Here is the blog post: https://applitools.com/blog/creating-first-test-google-chrome-devtools-recorder/

# To run the demo

1. Install [Nodejs](https://nodejs.org/en/)
2. Run `npm install` to install the dependencies.
3. Sign up for an Applitools account (https://applitools.com/) and get the API Key.
4. Replace the `apiKey` in `main.mjs` (or create an `.env` file with `APPLITOOLS_API_KEY`).
5. Run `npm start` to start the demo.
6. See the Applitools test result in the dashboard (https://eyes.applitools.com/app/test-results/).
7. Read the [blog post](https://applitools.com/blog/creating-first-test-google-chrome-devtools-recorder/) to understand what is happening.