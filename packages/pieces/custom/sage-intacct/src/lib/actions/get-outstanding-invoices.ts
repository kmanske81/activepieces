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

function decodeXml(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function getXmlValue(xml: string, tagName: string): string {
  const regex = new RegExp(
    `<${tagName}[^>]*>([\\s\\S]*?)</${tagName}>`,
    'i',
  );

  return decodeXml(regex.exec(xml)?.[1]?.trim() ?? '');
}

function parseInvoices(xml: string) {
  const invoiceRegex = /<arinvoice>([\s\S]*?)<\/arinvoice>/gi;

  const invoices = [];
  let match;

  while ((match = invoiceRegex.exec(xml)) !== null) {
    const invoiceXml = match[1];

    invoices.push({
      recordNo: getXmlValue(invoiceXml, 'RECORDNO'),
      invoiceNumber: getXmlValue(invoiceXml, 'RECORDID'),
      customerId: getXmlValue(invoiceXml, 'CUSTOMERID'),
      customerName: getXmlValue(invoiceXml, 'CUSTOMERNAME'),
      invoiceDate: getXmlValue(invoiceXml, 'WHENCREATED'),
      postedDate: getXmlValue(invoiceXml, 'WHENPOSTED'),
      dueDate: getXmlValue(invoiceXml, 'WHENDUE'),
      amountDue: Number(getXmlValue(invoiceXml, 'TOTALDUE')),
      amountPaid: Number(getXmlValue(invoiceXml, 'TOTALPAID')),
    });
  }

  return invoices;
}



export const getOutstandingInvoices = createAction({
  name: 'get_outstanding_invoices',
  displayName: 'Get Outstanding Invoices',
  description:
    'Get Sage Intacct AR invoices with an outstanding balance that are overdue by a specified number of days.',

  auth: sageIntacctXmlAuth,

  props: {
    daysOverdue: Property.Number({
      displayName: 'Days Overdue',
      description: 'Return invoices that were due more than this many days ago.',
      required: true,
      defaultValue: 30,
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

    const daysOverdue = context.propsValue.daysOverdue;

    // Calculate cutoff date
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysOverdue);

    const month = String(cutoff.getMonth() + 1).padStart(2, '0');
    const day = String(cutoff.getDate()).padStart(2, '0');
    const year = cutoff.getFullYear();

    const cutoffDate = `${month}/${day}/${year}`;

    // Obtain temporary Intacct API session
    const session = await getApiSession({
      senderId,
      senderPassword,
      companyId,
      userId,
      userPassword,
    });

    const controlId = `activepieces-${Date.now()}`;
    const functionControlId = `outstanding-invoices-${Date.now()}`;

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
        <readByQuery>
          <object>ARINVOICE</object>
          <fields>RECORDNO,RECORDID,CUSTOMERID,CUSTOMERNAME,WHENCREATED,WHENPOSTED,WHENDUE,TOTALDUE,TOTALPAID</fields>
          <query>TOTALDUE &gt; 0 AND WHENDUE &lt; '${cutoffDate}'</query>
          <pagesize>100</pagesize>
        </readByQuery>
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

    const xml =
        typeof response.body === 'string'
        ? response.body
        : String(response.body);

    const invoices = parseInvoices(xml);

    return {
        daysOverdue,
        cutoffDate,
        count: invoices.length,
        invoices,
    };
  },
});