import {
  createAction,
  Property,
} from '@activepieces/pieces-framework';

import {
  httpClient,
  HttpMethod,
} from '@activepieces/pieces-common';

import { sageIntacctOAuthAuth } from '../auth';

export const restApiRequest = createAction({
  name: 'rest_api_request',
  displayName: 'REST API Request',
  description: 'Make a REST API request to Sage Intacct.',

  auth: sageIntacctOAuthAuth,

  props: {
    method: Property.StaticDropdown({
      displayName: 'Method',
      required: true,
      options: {
        options: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
          { label: 'PATCH', value: 'PATCH' },
          { label: 'DELETE', value: 'DELETE' },
        ],
      },
    }),

    url: Property.ShortText({
      displayName: 'URL',
      description: 'Full URL for the REST API request',
      required: true,
    }),

    sessionId: Property.ShortText({
        displayName: 'Session ID',
        description: 'Sage Intacct Session ID passed into the workflow at runtime',
        required: false,
    }),

    body: Property.Json({
      displayName: 'Body',
      description: 'JSON request body. Not used for GET requests.',
      required: false,
    }),
  },

  async run(context) {
    const { method, url, body } = context.propsValue;

    const accessToken = context.auth.access_token;

    const response = await httpClient.sendRequest({
      method: method as HttpMethod,
      url,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: method === 'GET' ? undefined : body,
    });

    return {
      status: response.status,
      body: response.body,
    };
  },
});