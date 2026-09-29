"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sageIntacct = void 0;
const pieces_framework_1 = require("@activepieces/pieces-framework");
const auth_1 = require("./lib/auth");
const test_connection_1 = require("./lib/actions/test-connection");
const rest_api_request_1 = require("./lib/actions/rest-api-request");
const test_xml_connection_1 = require("./lib/actions/test-xml-connection");
const xml_api_request_1 = require("./lib/actions/xml-api-request");
const get_outstanding_invoices_1 = require("./lib/actions/get-outstanding-invoices");
exports.sageIntacct = (0, pieces_framework_1.createPiece)({
    displayName: 'Sage Intacct',
    description: 'Connect Sage Intacct to Activepieces workflows',
    auth: auth_1.sageIntacctXmlAuth,
    minimumSupportedRelease: '0.36.1',
    logoUrl: 'https://cdn.activepieces.com/pieces/sage-intacct.png',
    authors: [],
    actions: [
        test_connection_1.testConnection,
        rest_api_request_1.restApiRequest,
        test_xml_connection_1.testXmlConnection,
        xml_api_request_1.xmlApiRequest,
        get_outstanding_invoices_1.getOutstandingInvoices,
    ],
    triggers: [],
});
//# sourceMappingURL=index.js.map