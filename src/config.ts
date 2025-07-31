import type { UsiConfig } from '@usi/core-ui';
import { baseConfigs, deepMerge, env, environment } from '@usi/core-ui';

//STARTUP NOTES:
//1.Change the devClientId and the individual environment clientIds
//to the correct values for your app - these can be obtained from infrastructure
//2.Change the below "apiUrl" values to the correct values for your app.
//Check with your backend developers for the value for LocalBackend and with
//architecture for the cloud environments
//***If desired, these startup notes can be removed after making the changes***
const devClientId = '756d8778-67d3-401f-9831-36a356af218e';

type BaseAppConfig = { someAppConfig?: Record<string, string> };
const appConfigs: Record<string, Partial<UsiConfig> & BaseAppConfig> = {
  [environment.Local]: {
    msalConfiguration: {
      auth: {
        clientId: devClientId,
      },
    },
  },
  [environment.Dev]: {
    msalConfiguration: {
      auth: {
        clientId: devClientId,
      },
    },
  },
  [environment.QA]: {
    msalConfiguration: {
      auth: {
        clientId: '00000000-0000-0000-0000-000000000000',
      },
    },
  },
  [environment.UAT]: {
    msalConfiguration: {
      auth: {
        clientId: '00000000-0000-0000-0000-000000000000',
      },
    },
  },
  [environment.Sandbox]: {
    msalConfiguration: {
      auth: {
        clientId: '00000000-0000-0000-0000-000000000000',
      },
    },
  },
  [environment.Prod]: {
    msalConfiguration: {
      auth: {
        clientId: '00000000-0000-0000-0000-000000000000',
      },
    },
  },
};

const configs = deepMerge(baseConfigs, appConfigs) as Record<string, UsiConfig & BaseAppConfig>;

const config = configs[env];

export default config;
