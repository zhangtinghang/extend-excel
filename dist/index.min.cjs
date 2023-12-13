'use strict'
Object.defineProperty(exports, '__esModule', { value: !0 })
var e = require('xlsx'),
  t = require('file-saver'),
  r = require('lodash')
var o = (function (e) {
    var t = Object.create(null)
    if (e) for (var r in e) t[r] = e[r]
    return (t.default = e), t
  })(e),
  a = {
    importExcel: (e, t = { onlyFirst: !1, XLSXReadOptions: {} }) => {
      const { onlyFirst: r, XLSXReadOptions: a } = t,
        s = e.name,
        n = new FileReader()
      return (
        n.readAsBinaryString(e),
        new Promise((e, t) => {
          n.onload = (n) => {
            try {
              const t = n.target?.result,
                l = o.read(t, { type: 'binary', ...a })
              let c = []
              for (var i in l.Sheets)
                if (
                  l.Sheets.hasOwnProperty(i) &&
                  ((c = c.concat(o.utils.sheet_to_json(l.Sheets[i]))), r)
                )
                  break
              e({ name: s, data: c })
            } catch (e) {
              t(e)
            }
          }
        })
      )
    },
    exportExcel: (
      e,
      a,
      s = { fileName: 'export', sheetName: 'sheet1', XLSXOption: {} }
    ) => {
      const { fileName: n, sheetName: i, XLSXOption: l } = s
      if (!a || !Array.isArray(a))
        throw new Error('The sourceData needs to be in array format!')
      const c = r
          .chain(a)
          .map((t) => {
            const o = r.cloneDeep(t)
            return Object.keys(o).reduce((t, r) => {
              if (e[r])
                if (e[r] && 'object' == typeof e[r]) {
                  const a = e[r].key,
                    s = e[r].filter(o[r])
                  t[a] = s
                } else t[e[r]] = o[r]
              return t
            }, {})
          })
          .value(),
        p = o.utils.book_new(),
        u = o.utils.json_to_sheet(c)
      o.utils.book_append_sheet(p, u, i)
      const y = { bookType: 'xlsx', bookSST: !1, type: 'array', ...l },
        f = o.write(p, y)
      t.saveAs(new Blob([f], { type: 'application/octet-stream' }), `${n}.xlsx`)
    }
  }
exports.default = a
