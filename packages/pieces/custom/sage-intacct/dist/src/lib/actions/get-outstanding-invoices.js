"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOutstandingInvoices = void 0;
const tslib_1 = require("tslib");
const pieces_framework_1 = require("@activepieces/pieces-framework");
const pieces_common_1 = require("@activepieces/pieces-common");
const auth_1 = require("../auth");
const xml_client_1 = require("../xml-client");
function decodeXml(value) {
    return value
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'");
}
function getXmlValue(xml, tagName) {
    var _a, _b, _c;
    const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)</${tagName}>`, 'i');
    return decodeXml((_c = (_b = (_a = regex.exec(xml)) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : '');
}
function parseInvoices(xml) {
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
exports.getOutstandingInvoices = (0, pieces_framework_1.createAction)({
    name: 'get_outstanding_invoices',
    displayName: 'Get Outstanding Invoices',
    description: 'Get Sage Intacct AR invoices with an outstanding balance that are overdue by a specified number of days.',
    auth: auth_1.sageIntacctXmlAuth,
    props: {
        daysOverdue: pieces_framework_1.Property.Number({
            displayName: 'Days Overdue',
            description: 'Return invoices that were due more than this many days ago.',
            required: true,
            defaultValue: 30,
        }),
    },
    run(context) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { senderId, senderPassword, companyId, userId, userPassword, } = context.auth.props;
            const daysOverdue = context.propsValue.daysOverdue;
            // Calculate cutoff date
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - daysOverdue);
            const month = String(cutoff.getMonth() + 1).padStart(2, '0');
            const day = String(cutoff.getDate()).padStart(2, '0');
            const year = cutoff.getFullYear();
            const cutoffDate = `${month}/${day}/${year}`;
            // Obtain temporary Intacct API session
            const session = yield (0, xml_client_1.getApiSession)({
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
            const response = yield pieces_common_1.httpClient.sendRequest({
                method: pieces_common_1.HttpMethod.POST,
                url: session.endpoint,
                headers: {
                    'Content-Type': 'application/xml',
                },
                body: requestBody,
            });
            const xml = typeof response.body === 'string'
                ? response.body
                : String(response.body);
            const invoices = parseInvoices(xml);
            return {
                daysOverdue,
                cutoffDate,
                count: invoices.length,
                invoices,
            };
        });
    },
});
//# sourceMappingURL=get-outstanding-invoices.js.map