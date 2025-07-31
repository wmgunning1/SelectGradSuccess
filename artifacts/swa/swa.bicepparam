using 'swa.bicep'

param location = 'eastus2'
param shortEnvironmentName = '#{EnvironmentShortName}#'
param applicationName = '#{ApplicationName}#'
param baseTags = {
  'owning-team': '#{AzureTagOwnerTeam}#'
  'owner-individual': '#{AzureTagOwnerIndividual}#'
}
