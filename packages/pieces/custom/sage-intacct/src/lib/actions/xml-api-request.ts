import {
  createAction,
  Property,
} from '@activepieces/pieces-framework';

import {
  httpClient,
  HttpMethod,
} from '@activepieces/pieces-common';

import { sageIntacctXmlAuth } from '../auth';
import { getApiSession } from '../xml-client';

export const xmlApiRequest = createAction({
  name: 'xml_api_request',
  displayName: 'XML API Request',
  description: 'Execute an XML Web Services function in Sage Intacct.',

  auth: sageIntacctXmlAuth,

  props: {
    functionXml: Property.LongText({
      displayName: 'Function XML',
      description:
        'The Sage Intacct XML function to execute, for example <readByQuery>...</readByQuery>.',
      required: true,
    }),
  },

  async run(context) {
    const {
      senderId,
      senderPassword,
      companyId,
      userId,
      userPassword,
    } = context.auth.props;

    const session = await getApiSession({
      senderId,
      senderPassword,
      companyId,
      userId,
      userPassword,
    });

    const controlId = `activepieces-${Date.now()}`;
    const functionControlId = `request-${Date.now()}`;

    const requestBody = `
<request>
  <control>
    <senderid>${senderId}</senderid>
    <password>${senderPassword}</password>
    <controlid>${controlId}</controlid>
    <uniqueid>false</uniqueid>
    <dtdversion>3.0</dtdversion>
    <includewhitespace>false</includewhitespace>
  </control>
  <operation>
    <authentication>
      <sessionid>${session.sessionId}</sessionid>
    </authentication>
    <content>
      <function controlid="${functionControlId}">
        ${context.propsValue.functionXml}
      </function>
    </content>
  </operation>
</request>`.trim();

    const response = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: session.endpoint,
      headers: {
        'Content-Type': 'application/xml',
      },
      body: requestBody,
    });

    return {
      status: response.status,
      body: response.body,
    };
  },
});