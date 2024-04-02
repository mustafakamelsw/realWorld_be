import bodyParser from 'body-parser';
import express, { Express } from 'express';
import { createServer } from 'http';
import i18next from 'i18next';
import I18NexFsBackend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';
import { IMAGES_PATH } from './constants/APP_PATH';
import { logger } from './middleware/logger';
import { AppDataSource } from '../ormconfig';
import { notFoundError, serverError } from './controllers/common.controller';

const app: Express = express();
const PORT = 3000;
const server = createServer(app);

i18next
  .use(I18NexFsBackend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    resources: {
      en: {
        translation: require('./locales/all_en.json'),
      },
      ar: {
        translation: require('./locales/all_ar.json'),
      },
    },
  });

app.use(middleware.handle(i18next));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(IMAGES_PATH, express.static('images'));
app.use(logger);
AppDataSource.initialize()
  .then(() => {
    console.info('connected to database...');
  })
  .catch((error) => {
    console.error('Error has been occur while connecting database', { error });
  });

//routes
server.listen(PORT);
// handle errors
app.use(notFoundError);
app.use(serverError);
