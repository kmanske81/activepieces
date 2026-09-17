import { createAction, Property } from '@activepieces/pieces-framework';

export const testConnection = createAction({
  name: 'test_connection',
  displayName: 'Test Intacct Action',
  description: 'Simple action to verify the Sage Intacct custom piece is working.',
  props: {
    message: Property.ShortText({
      displayName: 'Message',
      description: 'Enter a test message',
      required: true,
    }),
  },

  async run(context) {
    return {
      success: true,
      message: context.propsValue.message,
      source: 'Sage Intacct custom piece',
    };
  },
});