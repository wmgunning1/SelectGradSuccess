import { NumberParser } from '@internationalized/number';

const locale = 'en-US';
const currencyLocale = 'USD';

export const numberToCurrency = (
  value: number,
  currency = currencyLocale,
  minimumFractionDigits = 0,
  maximumFractionDigits = 0,
) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);

export const numberToCompact = (value: number, minimumFractionDigits = 1, maximumFractionDigits = 1) =>
  new Intl.NumberFormat(locale, {
    notation: 'compact',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);

export const numberWithThousandSeparator = (value: number, minimumFractionDigits = 0, maximumFractionDigits = 0) =>
  new Intl.NumberFormat(locale, { minimumFractionDigits, maximumFractionDigits }).format(value);

export const numberToPercent = (value: number, minimumFractionDigits = 1, maximumFractionDigits = 1) =>
  new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);

export const percentToNumber = (value: string) =>
  new NumberParser(locale, { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }).parse(value) ?? 0;

export const stringToNumber = (value: string, minimumFractionDigits = 0, maximumFractionDigits = 0) =>
  new NumberParser(locale, { style: 'decimal', minimumFractionDigits, maximumFractionDigits }).parse(value) ?? 0;

export const currencySymbol = () =>
  numberToCurrency(0)
    .replace(/\b\d+(?:\.\d+)?\b/g, '')
    .trim();

export const percentSymbol = () =>
  numberToPercent(0)
    .replace(/[+-]?\b\d+(?:\.\d+)?\b/g, '')
    .trim();
