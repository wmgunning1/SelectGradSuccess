const url = process.env.URL || 'http://localhost:3000';

describe('<App />', () => {
  beforeAll(async () => {
    await page.goto(url);
  }, 5000);

  test('contains app id', async () => {
    await page.waitForSelector('#app');
    const appElement = await page.$('#app');
    expect(appElement).toBeDefined();
  });
});
