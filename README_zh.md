# 写在前面

这个插件包简化了导入和导出Excel文件的过程，它是建立在[file-saver](https://github.com/eligrey/FileSaver.js)和[xlsx](https://github.com/SheetJS/sheetjs)库之上的

## 语言

- en [English](README.md)

### 如何使用

---

```bash
# Basic Node.JS installation
npm install extend-excel --save
```

### 源码

[extend-excel](https://github.com/zhangtinghang/extend-excel)

### 场景1 Excel数据转化为JSON数据

使用importExcel方法即可：

```js
importExcel(File [,options?]):Promise => data
```

示例：

```js
const { importExcel } = extend-excel

<!-- read file -->
const fileBuffer = fs.readFileSync(path.resolve(__dirname, './__mocks__/test.xlsx'))
const blob = new Blob([fileBuffer], { type : 'application/xlsx'});
const excelFile = new File([blob], 'test');

<!-- excel to json -->
const result = await importExcel(excelFile);
console.log(result)
```

如果只想将第一个sheet页导出为JSON数据，可以传入参数`onlyFirst`参数，如果有其他自定义需求，可通过`XLSXReadOptions`参数，传入xlsx要求的属性，以便完成自定义属性设置。

```js
const { onlyFirst, XLSXReadOptions } = options
```

#### 场景2 JSON数据转化为Excel数据：

### Export Excel

如果你想将JSON数据导出为excel文件，可以使用`export_excel`方法。

```js
exportExcel(headers, sourceData, [,options?]):Promise => File
```

上述参数中：
headers：用于做数据与excel第一行的映射关系，例如：JSON数据中`test`参数，对应excel中第一行的名称是`测试1`,以此类推。
sourceData: 待导出数据。数组内每个对象为一个sheet页，可以根据需求创建一个或多个sheet页。
options: 可以简单设置导出的文件名、sheet页名称等。

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

如果对导出有其他特殊设置需求，导出方法使用`FileSaver`,可以使用XLSXOption
参数传入，进行导出文件的设置。

```js
const { fileName, sheetName, XLSXOption } = options
```

| Attribute name | info                                          |
| -------------- | --------------------------------------------- |
| fileName       | Customize the downloaded file's name.         |
| sheetName      | Customize the downloaded file's sheetNmae.    |
| XLSXOption     | Adjust the options for the FileSaver library. |

### 支持 Typescript

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
