export const legacyAboutData = {
  userName: 'user@usi.com',
  currentVersion: 'mock 1.0',
};

export const standardAboutData = {
  build: '20250401.1',
  image: 'ca-dotnet-base-dev:68160',
  tag: 'dev',
  userName: 'user@usi.com',
  apiVersion: 'mock 2.0',
};

export const enhancedAboutData = {
  build: '20250402.0',
  image: 'ca-dotnet-base-dev:68261',
  tag: 'dev',
  userName: '**********',
  apiVersion: 'mock 2.1',
};

export const aboutData: { [key: string]: { [key: string]: string } } = {
  '1.0': legacyAboutData,
  '2.0': standardAboutData,
  '2.1': enhancedAboutData,
};
