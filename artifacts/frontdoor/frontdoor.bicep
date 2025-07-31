metadata description = 'Deploys a Front Door profile with a origin group and a route.'

targetScope = 'resourceGroup'

@description('The name of the application.')
param applicationName string

@description('The short name of the environment.')
param environmentShortName string

@description('The host name of the origin.')
param hostName string

@description('The routes to match.')
param routes array

@description('Array of rule sets to apply to the route.')
param ruleSets array = ['Tenable']

var frontDoorProfileName = 'utech-app-frontend-${environmentShortName}-frontdoorprofile'

resource frontDoorProfileResource 'Microsoft.Cdn/profiles@2022-11-01-preview' existing = {
  name: frontDoorProfileName

  resource frontEndCustomDomain 'customdomains@2022-11-01-preview' existing = {
    name: 'utech-${environmentShortName}'
  }

  resource frontEndEndpoint 'afdendpoints@2022-11-01-preview' existing = {
    name: 'utech-app-frontend-${environmentShortName}-iwp-endpoint'

    resource frontEndRoute 'routes@2022-11-01-preview' = {
      name: 'fdr-${toLower(applicationName)}-${environmentShortName}'
      properties: {
        customDomains: [
          {
            id: frontEndCustomDomain.id
          }
        ]
        originGroup: {
          id: frontDoorOriginGroupResource.id
        }
        originPath: '/'
        ruleSets: [
          for ruleSet in ruleSets: {
            id: resourceId('Microsoft.Cdn/profiles/ruleSets', frontDoorProfileResource.name, ruleSet)
          }
        ]
        supportedProtocols: [
          'Https'
          'Http'
        ]
        patternsToMatch: routes
        forwardingProtocol: 'HttpsOnly'
        linkToDefaultDomain: 'Disabled'
        httpsRedirect: 'Enabled'
        enabledState: 'Enabled'
      }
    }
  }

  resource frontDoorOriginGroupResource 'origingroups@2022-11-01-preview' = {
    name: 'fdog-${toLower(applicationName)}-${environmentShortName}'
    properties: {
      loadBalancingSettings: {
        sampleSize: 20
        successfulSamplesRequired: 1
        additionalLatencyInMilliseconds: 10
      }
      trafficRestorationTimeToHealedOrNewEndpointsInMinutes: 10
      sessionAffinityState: 'Disabled'
    }

    resource frontDoorOriginGroupFrontEndResource 'origins@2022-11-01-preview' = {
      name: 'fdfe-${environmentShortName}-${toLower(applicationName)}'
      properties: {
        hostName: hostName
        httpPort: 80
        httpsPort: 443
        originHostHeader: hostName
        priority: 1
        weight: 500
        enabledState: 'Enabled'
        enforceCertificateNameCheck: true
      }
    }
  }
}
