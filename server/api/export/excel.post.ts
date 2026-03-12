/**
 * 그리드 현재 표시 데이터(필터/정렬 반영)를 엑셀 파일로 다운로드
 * POST body: { gridId: string, columns: { field: string, headerName: string }[], rows: Record<string, unknown>[] }
 */
import * as XLSX from 'xlsx'

interface ExportExcelBody {
    gridId: string
    columns: { field: string; headerName: string }[]
    rows: Record<string, unknown>[]
}

export default defineEventHandler(async (event) => {
    const body = await readBody<ExportExcelBody>(event)
    if (!body?.gridId || !Array.isArray(body.columns) || !Array.isArray(body.rows)) {
        throw createError({
            statusCode: 400,
            message: 'gridId, columns, rows 가 필요합니다.',
        })
    }

    const { gridId, columns, rows } = body
    const headerRow = columns.map((c) => c.headerName || c.field)
    const dataRows = rows.map((row) =>
        columns.map((col) => {
            const v = row[col.field]
            if (v === null || v === undefined) return ''
            return v
        }),
    )
    const aoa = [headerRow, ...dataRows]
    const ws = XLSX.utils.aoa_to_sheet(aoa)
    const wb = XLSX.utils.book_new()
    const sheetName = (gridId || 'export').slice(0, 31)
    XLSX.utils.book_append_sheet(wb, ws, sheetName)
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer

    const filename = `${gridId}.xlsx`
    setResponseHeader(event, 'Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`)
    setResponseHeader(event, 'Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    return buffer
})
