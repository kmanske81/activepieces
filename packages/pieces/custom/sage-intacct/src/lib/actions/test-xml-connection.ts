import { createAction } from '@activepieces/pieces-framework';

import { sageIntacctXmlAuth } from '../auth';
import { getApiSession } from '../xml-client';

export const testXmlConnection = createAction({
  name: 'test_xml_connection',
  displayName: 'Test XML Connection',
  description: 'Connect to Sage Intacct XML Web Services and obtain an API session.',

  auth: sageIntacctXmlAuth,

  props: {},

  async run(context) {
    const {
      senderId,
      senderPassword,
      companyId,
      userId,
      userPassword,
    } = context.auth.props;

    const session = await getApiSession({
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
  },
});