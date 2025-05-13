import { After, Before, Status } from '@cucumber/cucumber';

Before(async function () {
  await this.init();
});

After(async function (scenario) {
  try {
    if (scenario.result.status === Status.FAILED) {
      if (!this.page) {
        console.error('Page object is not initialized, cannot take screenshot');
        return;
      }
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const screenshotName = `${scenario.pickle.name.replace(/\s+/g, '-')}-${timestamp}.png`;
      const screenshot = await this.page.screenshot({ 
        fullPage: true,
        path: `screenshots/${screenshotName}`
      });
      
      console.log(`Screenshot saved as: screenshots/${screenshotName}`);
      await this.attach(screenshot, 'image/png');
    }
  } catch (error) {
    console.error('Failed to capture screenshot:', error);
  } finally {
    try {
      await this.cleanup();
      
      // Explicitly close page, context, and browser
      if (this.page) {
        await this.page.close();
        this.page = null;
      }
      
      if (this.context) {
        await this.context.close();
        this.context = null;
      }
      
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
      }
    } catch (cleanupError) {
      console.error('Error during cleanup:', cleanupError);
    }
  }
});