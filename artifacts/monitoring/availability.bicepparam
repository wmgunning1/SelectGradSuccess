using 'availability.bicep'

param applicationName = '#{ApplicationName}#'
param applicationShortName = '#{ApplicationShortName}#'
param applicationPath = '#{ApplicationPath}#'
param environmentShortName = '#{EnvironmentShortName}#'
param actionGroupRecipientListEmailAddress = [
  '#{ActionGroupRecipientListEmailAddress}#'
]

param replyTimeoutSeconds = 120
param testFrequencySeconds = 600

param evaluationFrequency = 'PT1M'
param windowSize = 'PT5M'

param baseTags = {
  environment: '#{EnvironmentShortName}#'
  'owning-team': '#{AzureTagOwnerTeam}#'
  'owner-individual': '#{AzureTagOwnerIndividual}#'
}
