import {
  httpClient,
  HttpMethod,
} from '@activepieces/pieces-common';

export type SageIntacctXmlCredentials = {
  senderId: string;
  senderPassword: string;
  companyId: string;
  userId: string;
  userPassword: string;
};

export type SageIntacctApiSession = {
  sessionId: string;
  endpoint: string;
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getXmlValue(xml: string, tagName: string): string | undefined {
  const regex = new RegExp(
    `<${tagName}[^>]*>([\\s\\S]*?)</${tagName}>`,
    'i',
  );

  return regex.exec(xml)?.[1]?.trim();
}

export async function getApiSession(
  credentials: SageIntacctXmlCredentials,
): Promise<SageIntacctApiSession> {
  const controlId = `activepieces-${Date.now()}`;
  const functionControlId = `get-session-${Date.now()}`;

  const requestBody = `
<request>
  <control>
    <senderid>${escapeXml(credentials.senderId)}</senderid>
    <password>${escapeXml(credentials.senderPassword)}</password>
    <controlid>${controlId}</controlid>
    <uniqueid>false</uniqueid>
    <dtdversion>3.0</dtdversion>
    <includewhitespace>false</includewhitespace>
  </control>
  <operation>
    <authentication>
      <login>
        <userid>${escapeXml(credentials.userId)}</userid>
        <companyid>${escapeXml(credentials.companyId)}</companyid>
        <password>${escapeXml(credentials.userPassword)}</password>
      </login>
    </authentication>
    <content>
      <function controlid="${functionControlId}">
        <getAPISession />
      </function>
    </content>
  </operation>
</request>`.trim();

  const response = await httpClient.sendRequest({
    method: HttpMethod.POST,
    url: 'https://api.intacct.com/ia/xml/xmlgw.phtml',
    headers: {
      'Content-Type': 'application/xml',
    },
    body: requestBody,
  });

  const xml =
    typeof response.body === 'string'
      ? response.body
      : String(response.body);

  const sessionId = getXmlValue(xml, 'sessionid');
  const endpoint = getXmlValue(xml, 'endpoint');

  if (!sessionId || !endpoint) {
    throw new Error(
      'Sage Intacct authentication succeeded at the HTTP level, but no API session or endpoint was returned.',
    );
  }

  return {
    sessionId,
    endpoint,
  };
}