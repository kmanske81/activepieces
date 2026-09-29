export type SageIntacctXmlCredentials = {
    senderId: string;
    senderPassword: string;
    companyId: string;
    userId: string;
    userPassword: string;
};
export type SageIntacctApiSession = {
    sessionId: string;
    endpoint: string;
};
export declare function getApiSession(credentials: SageIntacctXmlCredentials): Promise<SageIntacctApiSession>;
//# sourceMappingURL=xml-client.d.ts.map