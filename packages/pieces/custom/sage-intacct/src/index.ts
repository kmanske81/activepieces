import { createPiece } from '@activepieces/pieces-framework';
import { sageIntacctXmlAuth } from './lib/auth';
import { testConnection } from './lib/actions/test-connection';
import { restApiRequest } from './lib/actions/rest-api-request';
import { testXmlConnection } from './lib/actions/test-xml-connection';
import { xmlApiRequest } from './lib/actions/xml-api-request';
import { getOutstandingInvoices } from './lib/actions/get-outstanding-invoices';

export const sageIntacct = createPiece({
  displayName: 'Sage Intacct',
  description: 'Connect Sage Intacct to Activepieces workflows',
  auth: sageIntacctXmlAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/sage-intacct.png',
  authors: [],
  actions: [
    testConnection,
    restApiRequest,
    testXmlConnection,
    xmlApiRequest,
    getOutstandingInvoices,
  ],
  triggers: [],
});