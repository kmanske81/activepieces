"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sageIntacctXmlAuth = exports.sageIntacctOAuthAuth = void 0;
const pieces_framework_1 = require("@activepieces/pieces-framework");
exports.sageIntacctOAuthAuth = pieces_framework_1.PieceAuth.OAuth2({
    description: 'Connect to Sage Intacct using OAuth 2.0',
    authUrl: 'https://api.intacct.com/ia/api/v1/oauth2/authorize',
    tokenUrl: 'https://api.intacct.com/ia/api/v1/oauth2/token',
    scope: [],
    authorizationMethod: pieces_framework_1.OAuth2AuthorizationMethod.BODY,
    required: true,
});
exports.sageIntacctXmlAuth = pieces_framework_1.PieceAuth.CustomAuth({
    description: 'Connect to Sage Intacct XML Web Services',
    required: true,
    props: {
        senderId: pieces_framework_1.Property.ShortText({
            displayName: 'Sender ID',
            description: 'Sage Intacct Web Services Sender ID',
            required: true,
        }),
        senderPassword: pieces_framework_1.PieceAuth.SecretText({
            displayName: 'Sender Password',
            description: 'Sage Intacct Web Services Sender Password',
            required: true,
        }),
        companyId: pieces_framework_1.Property.ShortText({
            displayName: 'Company ID',
            description: 'Sage Intacct Company ID',
            required: true,
        }),
        userId: pieces_framework_1.Property.ShortText({
            displayName: 'User ID',
            description: 'Sage Intacct Web Services User ID',
            required: true,
        }),
        userPassword: pieces_framework_1.PieceAuth.SecretText({
            displayName: 'User Password',
            description: 'Sage Intacct Web Services User Password',
            required: true,
        }),
    },
});
//# sourceMappingURL=auth.js.map