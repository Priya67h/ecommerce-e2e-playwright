import * as ExcelJS from 'exceljs';

//Variables Declarations
let workbook: ExcelJS.Workbook;
let sheet: ExcelJS.Worksheet | undefined;

export class ExcelUtil {

   async readExcel(filePath: string, sheetName: string){
    workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
     sheet = workbook.getWorksheet(sheetName);
    if (sheet) {
        const rows: any[] = [];
    sheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skipping header row
        const rowData: any = {};
     if(sheet){
        sheet.getRow(1).eachCell((cell, colNumber) => {
            const header = cell.value as string; // Assuming first row contains headers
            rowData[header] = row.getCell(colNumber).value;
        });
     }
        rows.push(rowData);
    });

    return rows;
    }else{
        throw new Error(`Sheet "${sheetName}" not found in the file.`);
    }
    
   }
}

exports = { ExcelUtil };