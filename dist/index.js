import * as XLSX from 'xlsx'
import FileSaver from 'file-saver'
import { chain, cloneDeep } from 'lodash'
import moment from 'moment'

const exportExcel = (headers, sourceData, options) => {
  const { fileName = 'export', sheetName = 'sheet1' } = options
  if (!sourceData || !Array.isArray(sourceData))
    throw new Error('The sourceData needs to be in array format!')
  // 处理header和value值映射
  const data = chain(sourceData)
    .map((item) => {
      const ne = cloneDeep(item)
      const newRzt = Object.keys(ne).reduce((newData, key) => {
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
  const workbook = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(data)
  XLSX.utils.book_append_sheet(workbook, ws, sheetName)
  // bookType: file type of output，type：data type of out，bookSST: is Shared String Table，eg: 官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
  const wopts = { bookType: 'xlsx', bookSST: false, type: 'array' }
  const wbout = XLSX.write(workbook, wopts)
  FileSaver.saveAs(
    new Blob([wbout], { type: 'application/octet-stream' }),
    `${fileName} ${moment().format('YYYYMMDDHHmmss')}.xlsx`
  )
}
const importExcel = (file, options) => {
  const name = file.name
  const reader = new FileReader()
  reader.readAsBinaryString(file)
  return new Promise((resolve, reject) => {
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })
        let persons = [] // 存储获取到的数据
        // 遍历每张表读取
        for (var sheet in workbook.Sheets) {
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            persons = persons.concat(
              XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
            )
            // break; // 如果只取第一张表，就取消注释这行
          }
        }
        resolve({ name, data: persons })
      } catch (e) {
        reject(e)
      }
    }
  })
}
var index = {
  importExcel,
  exportExcel
}

export { index as default }
//# sourceMappingURL=index.js.map
