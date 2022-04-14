import { loadPackageDefinition, credentials } from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const PROTO_PATH = './proto/services/mail.service.proto';

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true,
});

const MailService = loadPackageDefinition(packageDefinition).mails.MailService;
const client = new MailService(
    `${process.env.MAIL_SERVICE_HOST}`,
    credentials.createInsecure(),
);

export { client };
