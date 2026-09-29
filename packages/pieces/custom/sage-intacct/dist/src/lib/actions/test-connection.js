"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = void 0;
const tslib_1 = require("tslib");
const pieces_framework_1 = require("@activepieces/pieces-framework");
exports.testConnection = (0, pieces_framework_1.createAction)({
    name: 'test_connection',
    displayName: 'Test Intacct Action',
    description: 'Simple action to verify the Sage Intacct custom piece is working.',
    props: {
        message: pieces_framework_1.Property.ShortText({
            displayName: 'Message',
            description: 'Enter a test message',
            required: true,
        }),
    },
    run(context) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return {
                success: true,
                message: context.propsValue.message,
                source: 'Sage Intacct custom piece',
            };
        });
    },
});
//# sourceMappingURL=test-connection.js.map