import * as XLSX from 'xlsx'
import type { WritingOptions, WorkBook, WorkSheet } from 'xlsx'
import FileSaver from 'file-saver'
import { chain, cloneDeep } from 'lodash'
import { DynamicObject, ExportExcelOptions, ImportExcelOptions } from './types'

const exportExcel = (
  headers: DynamicObject,
  sourceData: DynamicObject[],
  options?: ExportExcelOptions
) => {
  const {
    fileName = 'export',
    sheetName = 'sheet1',
    XLSXOption = {}
  } = options || {}
  if (!sourceData || !Array.isArray(sourceData)) {
    throw new Error('The sourceData needs to be in array format!')
  }
  // 处理header和value值映射
  const data = chain(sourceData)
    .map((item: DynamicObject) => {
      const ne = cloneDeep(item)
      const newRzt = Object.keys(ne).reduce((newData: DynamicObject, key) => {
        if (headers[key]) {
          if (headers[key] && typeof headers[key] === 'object') {
            const tkey = headers[key].key
            const fVal = headers[key].filter(ne[key])
            newData[tkey] = fVal
          } else {
            newData[headers[key]] = ne[key]
          }
        }
        return newData
      }, {})
      return newRzt
    })
    .value()
  const workbook: WorkBook = XLSX.utils.book_new()
  const worksheet: WorkSheet = XLSX.utils.json_to_sheet(data)
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
  // bookType: file type of output，type：data type of out，bookSST: is Shared String Table，eg: 官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
  const wopts: WritingOptions = {
    bookType: 'xlsx',
    bookSST: false,
    type: 'array',
    ...XLSXOption
  }
  const wbout = XLSX.write(workbook, wopts)
  FileSaver.saveAs(
    new Blob([wbout], { type: 'application/octet-stream' }),
    `${fileName}.xlsx`
  )
}

const importExcel = (file: File, options?: ImportExcelOptions) => {
  const {
    onlyFirst = false,
    XLSXReadOptions = {},
    keyMapping = {}
  } = options || {}
  const name = file.name
  const reader: FileReader = new FileReader()
  reader.readAsBinaryString(file)
  return new Promise((resolve, reject) => {
    reader.onload = (evt: ProgressEvent<FileReader>) => {
      try {
        const data = evt.target?.result
        const workbook = XLSX.read(data, { type: 'binary', ...XLSXReadOptions })
        let persons: DynamicObject[] = [] // 存储获取到的数据
        // 遍历每张表读取
        for (var sheet in workbook.Sheets) {
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            workbook.Sheets[sheet]['!ref']
            persons = persons.concat(
              XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
            )
            // 如果只取第一张表，就取消注释这行
            if (onlyFirst) break
            // break;
          }
        }

        if (keyMapping && Object.keys(keyMapping).length > 0)
          persons = keysMapping(persons, keyMapping)

        resolve({ name, data: persons })
      } catch (e) {
        reject(e)
      }
    }
  })
}

const keysMapping = (
  data: DynamicObject[],
  keyMapping: DynamicObject
): DynamicObject[] => {
  const taskQueue: DynamicObject[] = []
  for (let index = 0; index < data.length; index++) {
    const sourceVal = data[index]
    const taskItem: DynamicObject = {}
    for (const key in keyMapping) {
      if (Object.prototype.hasOwnProperty.call(sourceVal, key)) {
        taskItem[keyMapping[key]] = sourceVal[key]
      }
    }
    if (Object.keys(taskItem).length > 0) taskQueue.push(taskItem)
  }
  return taskQueue
}

const extendExcel = {
  importExcel,
  exportExcel,
  keysMapping
}

export default extendExcel
export { importExcel, exportExcel, keysMapping }
