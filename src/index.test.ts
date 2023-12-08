import extendExcel from './index'
import fs from 'node:fs'
import path from 'node:path'
const { importExcel, exportExcel } = extendExcel

import FileSaver from 'file-saver'

describe('import excel', () => {
  test('default params transition xlsx to data', async () => {
    const fileBuffer = fs.readFileSync(
      path.resolve(__dirname, './__mocks__/test.xlsx')
    )
    const blob = new Blob([fileBuffer], { type: 'application/xlsx' })
    const excelFile = new File([blob], 'test')
    const result = await importExcel(excelFile)
    expect(result).toEqual({
      name: 'test',
      data: [
        { 测试1: 1, 测试2: 2, 测试3: 3 },
        { 测试sheet1: 1, 测试sheet2: 2, 测试sheet3: 3 }
      ]
    })
  })
})

describe('export excel', () => {
  test('default params export excel', async () => {
    const saveAsMock = jest.spyOn(FileSaver, 'saveAs')
    await exportExcel(
      {
        test: '测试1',
        test2: '测试2',
        test3: '测试3',
        testsheet1: '测试sheet1',
        testsheet2: '测试sheet2',
        testsheet3: '测试sheet3'
      },
      [
        { test: 1, test2: 2, test3: 3 },
        { testsheet1: 1, testsheet2: 2, testsheet3: 3 }
      ]
    )
    expect(saveAsMock).toHaveBeenCalled()
  })
})
