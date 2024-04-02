import chalk from 'chalk';
import { Request, Response } from 'express';
import morgan from 'morgan';

/**
 * Middleware function that logs request information.
 *
 * @param tokens - The tokens object containing various properties for logging.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @returns A formatted log message.
 */
export const logger = morgan((tokens, req: Request, res: Response) => {
  const status = tokens.status(req, res);
  const statusText =
    Number(status) < 400 ? chalk.green(status) : chalk.red.bold(status);
  const responseTime = tokens['response-time'](req, res);

  const timeText =
    Number(responseTime) > 400
      ? chalk.red(`response time: ${responseTime}`)
      : chalk.green(`response time: ${responseTime}`);
  return [
    statusText,
    chalk.yellowBright(
      `${tokens.method(req, res)} ${tokens.url(req, res)}   \n`
    ),
    chalk.gray(`headers: ${JSON.stringify(req.headers)}`),
    chalk.cyan(`body: ${JSON.stringify(req.body)}`),
    '-',
    timeText,
    'ms',
  ].join(' ');
});
