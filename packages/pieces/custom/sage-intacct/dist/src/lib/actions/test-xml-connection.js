"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testXmlConnection = void 0;
const tslib_1 = require("tslib");
const pieces_framework_1 = require("@activepieces/pieces-framework");
const auth_1 = require("../auth");
const xml_client_1 = require("../xml-client");
exports.testXmlConnection = (0, pieces_framework_1.createAction)({
    name: 'test_xml_connection',
    displayName: 'Test XML Connection',
    description: 'Connect to Sage Intacct XML Web Services and obtain an API session.',
    auth: auth_1.sageIntacctXmlAuth,
    props: {},
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
            return {
                success: true,
                endpoint: session.endpoint,
            };
        });
    },
});
//# sourceMappingURL=test-xml-connection.js.map