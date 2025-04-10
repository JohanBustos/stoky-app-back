import { Module, Global } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { join } from 'path';
import * as fs from 'fs';
import { FIREBASE_DB_URL } from '../../../utils/constants/firebase';

@Global()
@Module({
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      useFactory: () => {
        const pathToKey = join(
          process.cwd(),
          'src/shared/config/firebase/serviceAccountKey.json',
        );

        if (!fs.existsSync(pathToKey)) {
          throw new Error(
            `❌ Firebase service account key not found at ${pathToKey}`,
          );
        }

        const serviceAccount = require(pathToKey);

        return admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: FIREBASE_DB_URL,
        });
      },
    },
  ],
  exports: ['FIREBASE_ADMIN'],
})
export class FirebaseModule {}
