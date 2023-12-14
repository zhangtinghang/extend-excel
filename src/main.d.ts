declare module 'file-saver'

declare module 'lodash'

declare module 'extend-excel' {
  const extendExcel: {
    importExcel
    exportExcel
  }
  export default extendExcel
  export { importExcel, exportExcel }
}
