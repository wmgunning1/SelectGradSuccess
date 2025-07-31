import type { ConfigFile } from '@rtk-query/codegen-openapi';
import { baseOpenApiConfig } from '@usi/core-ui/code-generation';

const config: ConfigFile = {
    ...baseOpenApiConfig,
  schemaFile: './dotnetBase.json',
  outputFile: './dotnetBaseApi.ts',
  exportName: 'dotnetBaseApi',
};

export default config;
