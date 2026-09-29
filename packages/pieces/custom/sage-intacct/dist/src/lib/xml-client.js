"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApiSession = getApiSession;
const tslib_1 = require("tslib");
const pieces_common_1 = require("@activepieces/pieces-common");
function escapeXml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}
function getXmlValue(xml, tagName) {
    var _a, _b;
    const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)</${tagName}>`, 'i');
    return (_b = (_a = regex.exec(xml)) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.trim();
}
function getApiSession(credentials) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        const response = yield pieces_common_1.httpClient.sendRequest({
            method: pieces_common_1.HttpMethod.POST,
            url: 'https://api.intacct.com/ia/xml/xmlgw.phtml',
            headers: {
                'Content-Type': 'application/xml',
            },
            body: requestBody,
        });
        const xml = typeof response.body === 'string'
            ? response.body
            : String(response.body);
        const sessionId = getXmlValue(xml, 'sessionid');
        const endpoint = getXmlValue(xml, 'endpoint');
        if (!sessionId || !endpoint) {
            throw new Error('Sage Intacct authentication succeeded at the HTTP level, but no API session or endpoint was returned.');
        }
        return {
            sessionId,
            endpoint,
        };
    });
}
//# sourceMappingURL=xml-client.js.map