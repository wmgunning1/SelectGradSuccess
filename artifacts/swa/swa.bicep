metadata description = 'Creates a static web app with basic authentication enabled.'

targetScope = 'resourceGroup'

@description('The location for this SWA resource')
param location string

@description('The name of the application')
param applicationName string

@description('The short name of the environment.')
param shortEnvironmentName string

@description('The tags to apply to all resources')
param baseTags object = {}

var swaName = 'swa-${toLower(applicationName)}-${shortEnvironmentName}'

resource swaResource 'Microsoft.Web/staticSites@2022-09-01' = {
  name: swaName
  location: location
  tags: union(
    baseTags,
    {
      tag_terraformmanaged: 'no'
    }
  )
  sku: {
    name: 'Standard'
    size: 'Standard'
    tier: 'Standard'
  }
  properties: {
    stagingEnvironmentPolicy: 'Disabled'
    allowConfigFileUpdates: true
    provider: 'None'
    enterpriseGradeCdnStatus: 'Disabled'
  }
}
