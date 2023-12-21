import extendExcel from './index'
import fs from 'node:fs'
import path from 'node:path'
const { importExcel, exportExcel, keysMapping } = extendExcel

import FileSaver from 'file-saver'

describe('Import Excel', () => {
  test('Transitioning XLSX to Data with Default Parameters', async () => {
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

  test('Transitioning XLSX to Data with Only First Parameters', async () => {
    const fileBuffer = fs.readFileSync(
      path.resolve(__dirname, './__mocks__/test.xlsx')
    )
    const blob = new Blob([fileBuffer], { type: 'application/xlsx' })
    const excelFile = new File([blob], 'test')
    const result = await importExcel(excelFile, { onlyFirst: true })
    expect(result).toEqual({
      name: 'test',
      data: [{ 测试1: 1, 测试2: 2, 测试3: 3 }]
    })
  })

  test('Transitioning XLSX to Data with Key Mapping Parameters', async () => {
    const fileBuffer = fs.readFileSync(
      path.resolve(__dirname, './__mocks__/test.xlsx')
    )
    const blob = new Blob([fileBuffer], { type: 'application/xlsx' })
    const excelFile = new File([blob], 'test')
    const result = await importExcel(excelFile, {
      keyMapping: {
        测试1: 'test1',
        测试2: 'test2',
        测试3: 'test3',
        测试sheet1: 'testsheet1',
        测试sheet2: 'testsheet2',
        测试sheet3: 'testsheet3'
      }
    })

    expect(result).toEqual({
      name: 'test',
      data: [
        { test1: 1, test2: 2, test3: 3 },
        { testsheet1: 1, testsheet2: 2, testsheet3: 3 }
      ]
    })
  })

  test('Transitioning XLSX to Data with Key Mapping and Only First Parameters', async () => {
    const fileBuffer = fs.readFileSync(
      path.resolve(__dirname, './__mocks__/test.xlsx')
    )
    const blob = new Blob([fileBuffer], { type: 'application/xlsx' })
    const excelFile = new File([blob], 'test')
    const result = await importExcel(excelFile, {
      onlyFirst: true,
      keyMapping: {
        测试1: 'test1',
        测试2: 'test2',
        测试3: 'test3',
        测试sheet1: 'testsheet1',
        测试sheet2: 'testsheet2',
        测试sheet3: 'testsheet3'
      }
    })

    expect(result).toEqual({
      name: 'test',
      data: [{ test1: 1, test2: 2, test3: 3 }]
    })
  })

  test('Mapping JSON Data Headers', async () => {
    const result = keysMapping(
      [
        {
          源IP: '172.16.1.1',
          目的IP: '172.16.1.2',
          登录账号: 'root',
          白名单类型: '1',
          描述: 'test'
        }
      ],
      {
        源IP: 'origin_ip',
        目的IP: 'host_ip',
        登录账号: 'login_username',
        白名单类型: 'white_type',
        描述: 'desc'
      }
    )

    expect(result).toEqual([
      {
        origin_ip: '172.16.1.1',
        host_ip: '172.16.1.2',
        login_username: 'root',
        white_type: '1',
        desc: 'test'
      }
    ])
  })

  test('Transition Head Mapping Parameters from XLSX to Data', async () => {
    const fileBuffer = fs.readFileSync(
      path.resolve(__dirname, './__mocks__/test.xlsx')
    )
    const blob = new Blob([fileBuffer], { type: 'application/xlsx' })
    const excelFile = new File([blob], 'test')
    const result = await importExcel(excelFile, {
      keyMapping: {
        测试1: 'test1',
        测试2: 'test2',
        测试3: 'test3',
        测试sheet1: 'testSheet1',
        测试sheet2: 'testSheet2',
        测试sheet3: 'testSheet3'
      }
    })
    expect(result).toEqual({
      name: 'test',
      data: [
        { test1: 1, test2: 2, test3: 3 },
        { testSheet1: 1, testSheet2: 2, testSheet3: 3 }
      ]
    })
  })
})

describe('Export Excel', () => {
  test('Export Excel with Default Parameters', async () => {
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

  test('Export Excel with Customized File Name and Parameters', async () => {
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
      ],
      {
        fileName: 'test-export'
      }
    )
    expect(saveAsMock).toHaveBeenCalled()
  })
})
