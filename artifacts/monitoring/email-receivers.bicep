metadata description = 'Creates an array of e-mail receivers meant for an action group'

targetScope = 'resourceGroup'

@description('This is the list of email addresses')
param emailAddresses array = []

var receivers = [for email in emailAddresses: {
  name: 'Email to ${email}'
  emailAddress: email
  useCommonAlertSchema: true
}]

output emailReceivers object[] = receivers
