metadata description = 'Sets up a standard web test'

targetScope = 'resourceGroup'

@description('The subscriptionId of the container app')
param subscriptionId string = subscription().subscriptionId

@description('The resource group of the container app')
param resourceGroupName string = resourceGroup().name

@description('Specifies the location for resources.')
param location string = resourceGroup().location

@description('Friendly name for the application')
param applicationName string

@description('The path to the application')
param applicationPath string

@description('The timeout in seconds for a healthy reply')
param replyTimeoutSeconds int = 120

@description('The frequency (in seconds) for the test to occur')
param testFrequencySeconds int = 300

@description('Short name of the environment')
param environmentShortName string

@description('Optional tags for the resource')
param tags object = {}

var appInsightsComponentName = '${resourceGroupName}-appinsights'

var hostName = (environmentShortName == 'sbox' || environmentShortName == 'prod') ? 'usi.com' : 'usii.com'
var domainName = (environmentShortName == 'prod')
  ? 'utech'
  : 'utech-${environmentShortName=='sbox' ? 'sandbox':environmentShortName}'
var webTestName = 'wt-${applicationName}'

resource webTestResource 'microsoft.insights/webtests@2022-06-15' = {
  name: webTestName
  location: location
  tags: union(
    tags,
    {
      'hidden-link:/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/microsoft.insights/components/${appInsightsComponentName}': 'Resource'
    }
  )
  properties: {
    SyntheticMonitorId: webTestName
    Name: webTestName
    Enabled: true
    Frequency: testFrequencySeconds
    Timeout: replyTimeoutSeconds
    Kind: 'standard'
    RetryEnabled: true
    Locations: [
      {
        Id: 'us-fl-mia-edge'
      }
      {
        Id: 'us-tx-sn1-azr'
      }
      {
        Id: 'us-ca-sjc-azr'
      }
      {
        Id: 'us-il-ch1-azr'
      }
      {
        Id: 'us-va-ash-azr'
      }
    ]
    Request: {
      RequestUrl: 'https://${domainName}.${hostName}/${applicationPath}/'
      HttpVerb: 'GET'
      ParseDependentRequests: false
    }
    ValidationRules: {
      ExpectedHttpStatusCode: 200
      IgnoreHttpStatusCode: false
      SSLCheck: true
    }
  }
}

output webTestId string = webTestResource.id
