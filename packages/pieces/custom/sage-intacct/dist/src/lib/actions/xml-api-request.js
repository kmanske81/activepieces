"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xmlApiRequest = void 0;
const tslib_1 = require("tslib");
const pieces_framework_1 = require("@activepieces/pieces-framework");
const pieces_common_1 = require("@activepieces/pieces-common");
const auth_1 = require("../auth");
const xml_client_1 = require("../xml-client");
exports.xmlApiRequest = (0, pieces_framework_1.createAction)({
    name: 'xml_api_request',
    displayName: 'XML API Request',
    description: 'Execute an XML Web Services function in Sage Intacct.',
    auth: auth_1.sageIntacctXmlAuth,
    props: {
        functionXml: pieces_framework_1.Property.LongText({
            displayName: 'Function XML',
            description: 'The Sage Intacct XML function to execute, for example <readByQuery>...</readByQuery>.',
            required: true,
        }),
    },
    run(context) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { senderId, senderPassword, companyId, userId, userPassword, } = context.auth.props;
            const session = yield (0, xml_client_1.getApiSession)({
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
            const response = yield pieces_common_1.httpClient.sendRequest({
                method: pieces_common_1.HttpMethod.POST,
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
        });
    },
});
//# sourceMappingURL=xml-api-request.js.map