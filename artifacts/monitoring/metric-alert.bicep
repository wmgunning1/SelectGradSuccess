metadata description = 'Sets up a metric alert'

targetScope = 'resourceGroup'

@description('The subscriptionId of the container app')
param subscriptionId string = subscription().subscriptionId

@description('The resource group of the container app')
param resourceGroupName string = resourceGroup().name

@description('Display name of the API')
param applicationName string

@description('An array of action groups to receive the alert')
param actionGroupIds string[]

@description('The id for the monitored web test')
param webTestId string

@description('The evaluation frequency for the alert')
param evaluationFrequency string

@description('The time window size for evaluating the alert')
param windowSize string

@description('Short name of the environment')
param environmentShortName string

@description('Optional tags for the resource')
param tags object = {}

var metricAlertName = 'ma-${applicationName}-${environmentShortName}-availability'
var appInsightsComponentName = '${resourceGroupName}-appinsights'

resource applicationInsightsResource 'microsoft.insights/components@2020-02-02' existing = {
  name: appInsightsComponentName
}

resource metricAlertResource 'microsoft.insights/metricalerts@2018-03-01' = {
  name: metricAlertName
  location: 'global'
  tags: union(
    tags,
    {
      'hidden-link:/subscriptions/${subscriptionId}/resourcegroups/${resourceGroupName}/providers/microsoft.insights/components/${appInsightsComponentName}': 'Resource'
      'hidden-link:/subscriptions/${subscriptionId}/resourcegroups/${resourceGroupName}/providers/microsoft.insights/webtests/wt-${applicationName}': 'Resource'
    }
  )
  properties: {
    description: 'Alert rule for availability test on ${applicationName}'
    severity: 1
    enabled: true
    scopes: [
      webTestId
      applicationInsightsResource.id
    ]
    evaluationFrequency: evaluationFrequency
    windowSize: windowSize
    criteria: {
      webTestId: webTestId
      componentId: applicationInsightsResource.id
      failedLocationCount: 2
      'odata.type': 'Microsoft.Azure.Monitor.WebtestLocationAvailabilityCriteria'
    }
    actions: [
      for grp in actionGroupIds: {
        actionGroupId: grp
      }
    ]
  }
}

output metricAlertResourceId string = metricAlertResource.id
