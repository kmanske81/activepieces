"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restApiRequest = void 0;
const tslib_1 = require("tslib");
const pieces_framework_1 = require("@activepieces/pieces-framework");
const pieces_common_1 = require("@activepieces/pieces-common");
const auth_1 = require("../auth");
exports.restApiRequest = (0, pieces_framework_1.createAction)({
    name: 'rest_api_request',
    displayName: 'REST API Request',
    description: 'Make a REST API request to Sage Intacct.',
    auth: auth_1.sageIntacctOAuthAuth,
    props: {
        method: pieces_framework_1.Property.StaticDropdown({
            displayName: 'Method',
            required: true,
            options: {
                options: [
                    { label: 'GET', value: 'GET' },
                    { label: 'POST', value: 'POST' },
                    { label: 'PATCH', value: 'PATCH' },
                    { label: 'DELETE', value: 'DELETE' },
                ],
            },
        }),
        url: pieces_framework_1.Property.ShortText({
            displayName: 'URL',
            description: 'Full URL for the REST API request',
            required: true,
        }),
        sessionId: pieces_framework_1.Property.ShortText({
            displayName: 'Session ID',
            description: 'Sage Intacct Session ID passed into the workflow at runtime',
            required: false,
        }),
        body: pieces_framework_1.Property.Json({
            displayName: 'Body',
            description: 'JSON request body. Not used for GET requests.',
            required: false,
        }),
    },
    run(context) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { method, url, body } = context.propsValue;
            const accessToken = context.auth.access_token;
            const response = yield pieces_common_1.httpClient.sendRequest({
                method: method,
                url,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: method === 'GET' ? undefined : body,
            });
            return {
                status: response.status,
                body: response.body,
            };
        });
    },
});
//# sourceMappingURL=rest-api-request.js.map