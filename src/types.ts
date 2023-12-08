import type { WritingOptions, ParsingOptions } from 'xlsx'
export type * from 'xlsx'

export interface DynamicObject {
  [key: string]: any
}

export interface ExportExcelOptions {
  fileName: string
  sheetName: string
  XLSXOption: WritingOptions
}

export interface ImportExcelOptions {
  onlyFirst: Boolean // only first sheet
  XLSXReadOptions: ParsingOptions
}
