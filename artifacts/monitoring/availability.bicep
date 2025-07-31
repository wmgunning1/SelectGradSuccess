metadata description = 'Sets up alerts along with a standard web test'

targetScope = 'resourceGroup'

@description('The subscriptionId of the container app')
param subscriptionId string = subscription().subscriptionId

@description('The resource group of the container app')
param resourceGroupName string = resourceGroup().name

@description('Specifies the location for resources.')
param location string = resourceGroup().location

@description('Display name of the application')
param applicationName string

@description('Path for the api. Defaults to kebabCaseApiName.')
param applicationPath string = applicationName

@description('Short name of the group')
param applicationShortName string

@description('Short name of the environment')
param environmentShortName string

@description('E-mail address for the distribution list for the alert group')
param actionGroupRecipientListEmailAddress array

@description('The timeout in seconds for a healthy reply')
param replyTimeoutSeconds int = 120

@description('The frequency (in seconds) for the test to occur')
param testFrequencySeconds int = 300

@description('The evaluation frequency for the alert')
param evaluationFrequency string

@description('The time window size for evaluating the alert')
param windowSize string

@description('The tags to apply to all resources')
param baseTags object = {}

module emailReceivers 'email-receivers.bicep' = {
  name: 'emailReceiversModule'
  params: {
    emailAddresses: actionGroupRecipientListEmailAddress
  }
}

module actionGroupResource 'action-groups.bicep' = {
  name: 'actionGroupsModule'
  params: {
    environmentShortName: environmentShortName
    applicationShortName: applicationShortName
    applicationName: applicationName
    emailReceivers: emailReceivers.outputs.emailReceivers
    tags: baseTags
  }
}

module metricAlertResource 'metric-alert.bicep' = {
  name: 'metricAlertModule'
  params: {
    applicationName: applicationName
    actionGroupIds: [actionGroupResource.outputs.actionGroupId]
    evaluationFrequency: evaluationFrequency
    windowSize: windowSize
    environmentShortName: environmentShortName
    tags: baseTags
    webTestId: webTestResource.outputs.webTestId
  }
}

module webTestResource 'web-test.bicep' = {
  name: 'webTestModule'
  params: {
    location: location
    applicationName: applicationName
    applicationPath: applicationPath
    testFrequencySeconds: testFrequencySeconds
    replyTimeoutSeconds: replyTimeoutSeconds
    environmentShortName: environmentShortName
  }
}
