import * as e from 'xlsx'
import t from 'file-saver'
import { chain as r, cloneDeep as o } from 'lodash'
var s = {
  importExcel: (t, r = { onlyFirst: !1, XLSXReadOptions: {} }) => {
    const { onlyFirst: o, XLSXReadOptions: s } = r,
      a = t.name,
      n = new FileReader()
    return (
      n.readAsBinaryString(t),
      new Promise((t, r) => {
        n.onload = (n) => {
          try {
            const r = n.target?.result,
              l = e.read(r, { type: 'binary', ...s })
            let p = []
            for (var i in l.Sheets)
              if (
                l.Sheets.hasOwnProperty(i) &&
                ((p = p.concat(e.utils.sheet_to_json(l.Sheets[i]))), o)
              )
                break
            t({ name: a, data: p })
          } catch (e) {
            r(e)
          }
        }
      })
    )
  },
  exportExcel: (
    s,
    a,
    n = { fileName: 'export', sheetName: 'sheet1', XLSXOption: {} }
  ) => {
    const { fileName: i, sheetName: l, XLSXOption: p } = n
    if (!a || !Array.isArray(a))
      throw new Error('The sourceData needs to be in array format!')
    const c = r(a)
        .map((e) => {
          const t = o(e)
          return Object.keys(t).reduce((e, r) => {
            if (s[r])
              if (s[r] && 'object' == typeof s[r]) {
                const o = s[r].key,
                  a = s[r].filter(t[r])
                e[o] = a
              } else e[s[r]] = t[r]
            return e
          }, {})
        })
        .value(),
      m = e.utils.book_new(),
      y = e.utils.json_to_sheet(c)
    e.utils.book_append_sheet(m, y, l)
    const f = { bookType: 'xlsx', bookSST: !1, type: 'array', ...p },
      h = e.write(m, f)
    t.saveAs(new Blob([h], { type: 'application/octet-stream' }), `${i}.xlsx`)
  }
}
export { s as default }
