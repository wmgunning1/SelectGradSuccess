metadata description = 'Creates an array of e-mail receivers meant for an action group'

targetScope = 'resourceGroup'

@description('The name of the application. ')
param applicationName string

@description('A short name for the action group. 12 chars max.')
@maxLength(12)
param applicationShortName string = applicationName

@description('E-mail address for the distribution list for the alert group')
param emailReceivers array = []

@description('Environment short name')
param environmentShortName string

@description('Optional tags for the resource')
param tags object = {}

var actionGroupName = 'ag-${applicationName}-${environmentShortName}'

resource actionGroupResource 'microsoft.insights/actionGroups@2023-01-01' =
  if (!empty(emailReceivers)) {
    name: actionGroupName
    tags: union(tags, {})
    location: 'Global'
    properties: {
      groupShortName: applicationShortName
      enabled: true
      emailReceivers: emailReceivers
      smsReceivers: []
      webhookReceivers: []
      eventHubReceivers: []
      itsmReceivers: []
      azureAppPushReceivers: []
      automationRunbookReceivers: []
      voiceReceivers: []
      logicAppReceivers: []
      azureFunctionReceivers: []
      armRoleReceivers: []
    }
  }

output actionGroupId string = actionGroupResource.id
