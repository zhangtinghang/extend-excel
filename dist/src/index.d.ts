interface DynamicObject {
  [key: string]: any
}
declare const _default: {
  importExcel: (file: File, options?: any) => Promise<unknown>
  exportExcel: (
    headers: DynamicObject,
    sourceData: DynamicObject[],
    options?: any
  ) => void
}
export default _default
