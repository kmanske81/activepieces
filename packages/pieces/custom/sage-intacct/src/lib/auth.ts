import {
  PieceAuth,
  Property,
  OAuth2AuthorizationMethod,
} from '@activepieces/pieces-framework';

export const sageIntacctOAuthAuth = PieceAuth.OAuth2({
  description: 'Connect to Sage Intacct using OAuth 2.0',
  authUrl: 'https://api.intacct.com/ia/api/v1/oauth2/authorize',
  tokenUrl: 'https://api.intacct.com/ia/api/v1/oauth2/token',
  scope: [],
  authorizationMethod: OAuth2AuthorizationMethod.BODY,
  required: true,
});

export const sageIntacctXmlAuth = PieceAuth.CustomAuth({
  description: 'Connect to Sage Intacct XML Web Services',
  required: true,

  props: {
    senderId: Property.ShortText({
      displayName: 'Sender ID',
      description: 'Sage Intacct Web Services Sender ID',
      required: true,
    }),

    senderPassword: PieceAuth.SecretText({
      displayName: 'Sender Password',
      description: 'Sage Intacct Web Services Sender Password',
      required: true,
    }),

    companyId: Property.ShortText({
      displayName: 'Company ID',
      description: 'Sage Intacct Company ID',
      required: true,
    }),

    userId: Property.ShortText({
      displayName: 'User ID',
      description: 'Sage Intacct Web Services User ID',
      required: true,
    }),

    userPassword: PieceAuth.SecretText({
      displayName: 'User Password',
      description: 'Sage Intacct Web Services User Password',
      required: true,
    }),
  },
});