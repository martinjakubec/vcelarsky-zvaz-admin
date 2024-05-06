import path from 'path';

export const JWT_SECRET = process.env.JWT_SECRET || '';

export const PDF_TITLE_FONT_SIZE = 14;
export const PDF_NORMAL_TEXT_FONT_SIZE = 10;
export const PDF_TABLE_TEXT_FONT_SIZE = 9;

export const DEFAULT_REPORTS_PATH = path.join(
  __dirname,
  '..',
  'uploads',
  'reports'
);

export const DEFAULT_UPLOADS_PATH = path.join(__dirname, '..', 'uploads');

export const LOCAL_FEES_TABLE_COLOR = '#FFE680'

export const COUNTRY_FEES_TABLE_COLOR = '#FFD114'

export const POLLINATION_TABLE_COLOR = '#FF9564'

export const TREATING_TABLE_COLOR = '#B496FF'

export const LOCAL_FEES_REPORT_FILENAME = 'clenske-poplatky-ZO.pdf'

export const COUNTRY_FEES_REPORT_FILENAME = 'clenske-poplatky-SZV.pdf'

export const POLLINATION_REPORT_FILENAME = 'dotacie-opelovacia-cinnost.pdf'

export const TREATING_REPORT_FILENAME = 'dotacie-liecivo.pdf'