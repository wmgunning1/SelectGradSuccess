using './frontdoor.bicep'

param applicationName = '#{ApplicationName}#'
param environmentShortName = '#{EnvironmentShortName}#'
param hostName = '#{SwaHostName}#'
param routes = [
  '/#{ApplicationPath}#/*'
  '/#{ApplicationPath}#'
]
