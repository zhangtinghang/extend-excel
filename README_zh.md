# Intro

这个插件包简化了导入和导出Excel文件的过程，它建立在[file-saver](https://github.com/eligrey/FileSaver.js) 和 [xlsx](https://www.npmjs.com/package/xlsx) 库的基础上。

## Language

- zh_CN [简体中文](./README_zh.md)

## Extend-Excel

### Import Excel

1）如果您需要将Excel文件中的所有数据转换为JSON，`import_excel`函数将为您提供帮助。

测试原始文件内容:
![Alt text](./images/image.png)

```js
const { importExcel } = extendExcel

<!-- read file -->
const fileBuffer = fs.readFileSync(path.resolve(__dirname, './__mocks__/test.xlsx'))
const blob = new Blob([fileBuffer], { type : 'application/xlsx'});
const excelFile = new File([blob], 'test');

<!-- excel to json -->
const result = await importExcel(excelFile);
console.log(result)
```

2）如果您想将Excel文件的第一个工作表中的数据转换为JSON，您可以利用可选参数来实现这一点。

```js
const { onlyFirst, XLSXReadOptions } = options

const result = await importExcel(excelFile, { onlyFirst: true })
```

3）如果您想将Excel文件的第一个工作表中的数据转换为JSON，并映射Excel头部名称，您可以利用可选参数来实现这一点。

```js
const { onlyFirst, keyMapping, XLSXReadOptions } = options

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
```

结果:

```js
{
  name: 'test',
  data: [
    { 'test1': 1, 'test2': 2, 'test3': 3 },
    { 'testsheet1': 1, 'testsheet2': 2, 'testsheet3': 3 }
  ]
}
```

4）如果您需要更多选项，您可以传递`XLSXReadOptions`参数，该参数与`xlsx`选项兼容。

### Export Excel

1）如果您想要下载从JSON数据生成的Excel文件,`export_excel`函数可以帮助您。

```js
const { exportExcel } = extend-excel

<!-- json to excel -->
const headers = {
    'test': '测试1',
    'test2': '测试2',
    'test3': '测试3',
    'testsheet1': '测试sheet1',
    'testsheet2': '测试sheet2',
    'testsheet3': '测试sheet3',
  }

const sourceData = [
    { 'test': 1, 'test2': 2, 'test3': 3 },
    { 'testsheet1': 1, 'testsheet2': 2, 'testsheet3': 3 }
  ]

const options = {}

const result = await exportExcel(headers, sourceData, options)
```

2）如果您想要自定义文件名并下载从JSON数据生成的Excel文件，`export_excel`函数可以帮助您。

```js
const { exportExcel } = extend-excel

<!-- json to excel -->
const headers = {
    'test': '测试1',
    'test2': '测试2',
    'test3': '测试3',
    'testsheet1': '测试sheet1',
    'testsheet2': '测试sheet2',
    'testsheet3': '测试sheet3',
  }

const sourceData = [
    { 'test': 1, 'test2': 2, 'test3': 3 },
    { 'testsheet1': 1, 'testsheet2': 2, 'testsheet3': 3 }
  ]

const options = { filename: 'test-export' }

const result = await exportExcel(headers, sourceData, options)
```

3）如果您想要自定义下载文件的属性，您可以通过传递`options`参数来实现。

```js
const { fileName, sheetName, XLSXOption } = options
```

| Attribute name | info                         |
| -------------- | ---------------------------- |
| fileName       | 自定义下载文件的名称。       |
| sheetName      | 自定义下载文件的工作表名称。 |
| XLSXOption     | 调整xlsx库的选项。           |

#### 安装

---

```bash
# Basic Node.JS installation
npm install extend-excel --save
```

### Typescript 支持

```js
export interface DynamicObject {
  [key: string]: any
}

export interface ExportExcelOptions {
  fileName: string,
  sheetName: string,
  XLSXOption: WritingOptions
}

export interface ImportExcelOptions {
  onlyFirst: Boolean, // only first sheet
  XLSXReadOptions: ParsingOptions
}
```
