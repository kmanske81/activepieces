"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sageIntacctAuth = void 0;
const pieces_framework_1 = require("@activepieces/pieces-framework");
exports.sageIntacctAuth = pieces_framework_1.PieceAuth.OAuth2({
    description: 'Connect to Sage Intacct using OAuth 2.0',
    authUrl: 'https://api.intacct.com/ia/api/v1/oauth2/authorize',
    tokenUrl: 'https://api.intacct.com/ia/api/v1/oauth2/token',
    scope: [],
    authorizationMethod: pieces_framework_1.OAuth2AuthorizationMethod.BODY,
    required: true,
});
//# sourceMappingURL=auth.js.map