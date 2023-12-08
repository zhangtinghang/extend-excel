# Intro

This plugin package simplifies the process of importing and exporting Excel files, and it is built upon the [file-saver](https://github.com/eligrey/FileSaver.js) library.

## extend-excel

### Import Excel

If you need to convert all data from an Excel file to JSON, the import_excel function is here to assist you.

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

If you want to convert the data from the first sheet of an Excel file to JSON, you can utilize the optional parameters to achieve this.

```js
const { onlyFirst, XLSXReadOptions } = options
```

If you need additional options, you can pass the `XLSXReadOptions` parameter, which is compatible with file-saver options.

### Export Excel

If you want to download an Excel file generated from JSON data, the export_excel function can assist you.

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

const result = await exportExcel(headers, sourceData, options)
```

If you want to customize the properties of the downloaded file, you can do so by passing the `options` parameter.

```js
const { fileName, sheetName, XLSXOption } = options
```

| Attribute name | info                                          |
| -------------- | --------------------------------------------- |
| fileName       | Customize the downloaded file's name.         |
| sheetName      | Customize the downloaded file's sheetNmae.    |
| XLSXOption     | Adjust the options for the FileSaver library. |

#### Installation

---

```bash
# Basic Node.JS installation
npm install extend-excel --save
```

### Typescript Support

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
