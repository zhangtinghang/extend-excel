'use strict'

Object.defineProperty(exports, '__esModule', { value: true })

var XLSX = require('xlsx')
var FileSaver = require('file-saver')
var lodash = require('lodash')
var moment = require('moment')

function _interopNamespaceDefault(e) {
  var n = Object.create(null)
  if (e) {
    for (var k in e) {
      n[k] = e[k]
    }
  }
  n.default = e
  return n
}

var XLSX__namespace = /*#__PURE__*/ _interopNamespaceDefault(XLSX)

const exportExcel = (headers, sourceData, options) => {
  const { fileName = 'export', sheetName = 'sheet1' } = options
  if (!sourceData || !Array.isArray(sourceData))
    throw new Error('The sourceData needs to be in array format!')
  // 处理header和value值映射
  const data = lodash
    .chain(sourceData)
    .map((item) => {
      const ne = lodash.cloneDeep(item)
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
  const workbook = XLSX__namespace.utils.book_new()
  const ws = XLSX__namespace.utils.json_to_sheet(data)
  XLSX__namespace.utils.book_append_sheet(workbook, ws, sheetName)
  // bookType: file type of output，type：data type of out，bookSST: is Shared String Table，eg: 官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
  const wopts = { bookType: 'xlsx', bookSST: false, type: 'array' }
  const wbout = XLSX__namespace.write(workbook, wopts)
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
        const workbook = XLSX__namespace.read(data, { type: 'binary' })
        let persons = [] // 存储获取到的数据
        // 遍历每张表读取
        for (var sheet in workbook.Sheets) {
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            persons = persons.concat(
              XLSX__namespace.utils.sheet_to_json(workbook.Sheets[sheet])
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

exports.default = index
//# sourceMappingURL=index.cjs.map
