import sgMail from '@sendgrid/mail';
import { logger } from '../lib/logger';
import fs from 'fs';
import path from 'path';

const templatePath = (...segments: string[]) =>
  path.resolve(__dirname, '..', '..', '..', '..', 'docs', ...segments);

const htmlTemplate = fs.readFileSync(templatePath('email-templates', 'broker-order.html'), 'utf-8');
const textTemplate = fs.readFileSync(templatePath('email-templates', 'broker-order.txt'), 'utf-8');

export interface BrokerEmailPayload {
  tradeId: string;
  ticker: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  priceVES: number;
  userEmail: string;
  brokerEmailTo: string;
}

const renderTemplate = (template: string, payload: BrokerEmailPayload) =>
  template
    .replace(/\{TRADE_ID\}/g, payload.tradeId)
    .replace(/\{TICKER\}/g, payload.ticker)
    .replace(/\{BUY\|SELL\}/g, payload.side)
    .replace(/\{QTY\}/g, payload.quantity.toString())
    .replace(/\{PRICE_VES\}/g, payload.priceVES.toFixed(2))
    .replace(/\{USER_EMAIL\}/g, payload.userEmail);

export const sendTradeEmail = async (payload: BrokerEmailPayload) => {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    throw new Error('SENDGRID_API_KEY missing');
  }
  sgMail.setApiKey(apiKey);

  const subject = `VeneValores Trade Request — ${payload.ticker} — ${payload.side} — Qty ${payload.quantity} @ ${payload.priceVES} VES — ${payload.userEmail} — ${payload.tradeId}`;

  const msg = {
    to: payload.brokerEmailTo,
    from: process.env.SENDGRID_FROM_EMAIL || 'robot@venevalores.com',
    subject,
    text: renderTemplate(textTemplate, payload),
    html: renderTemplate(htmlTemplate, payload),
  };

  logger.info(`Sending broker email for trade ${payload.tradeId}`);
  await sgMail.send(msg);
};
