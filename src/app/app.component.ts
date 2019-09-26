import { Component } from '@angular/core';
import { CsvImport } from './models/csv-import.model';
import { CONSTANTS } from './constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'csv-app';
  tableHeaders: string[] = CONSTANTS.VIEWS.CSV_HEADERS;
  rowData: CsvImport[] = [];
  selectedFile: File;
  file: string;
  issueCountClass: string;
  validationMessage: string;
  reader: FileReader = new FileReader();

  /**
   * Handler for file input change event.
   * @param element $event.target from file input
   */
  onFileSelect(element: HTMLInputElement) {
    const files: FileList = element.files;
    if (files && files.length) {
      this.selectedFile = files[0];
      this.file = this.selectedFile.name;
      this.validationMessage = null;
    }
  }

  /**
   * Splits and Assigns data as per CSV model.
   * @param data Array of data extracted from csv. First array element holds tables header data
   */
  formatData(data: any[]) {
    // Removed if headers need to be received from CSV
    // this.tableHeaders = data.splice(0, 1).toString().split(',');
    data.splice(0, 1);
    this.rowData = data.map((row: any[]) => {
      return new CsvImport(row[0], row[1], row[2], row[3]);
    });
  }

  /**
   * Compares csv table headers with uploaded csv.
   * @param headers first row from csv
   */
  isValidCSV(headers: string[]): boolean {
    return this.tableHeaders.length === headers.length
      && this.tableHeaders
      .every((value: string, index: number) => value.toLowerCase() === headers[index].replace(/(\")+/g, '').toLowerCase());
  }

  /**
   * Reads csv file and converts it into javascript array
   */
  importCSV() {
    if (this.selectedFile) {
      // read file from input
      // this.reader = new FileReader();
      this.reader.readAsText(this.selectedFile);

      this.reader.onload = this.fileOnLoadReader;
    }
  }

  /**
   * Event which FileReader object triggers when it reads a file.
   */
  fileOnLoadReader = (e) => {
    const csv: string | ArrayBuffer = e.target.result;
    const csvString = csv.toString();
    const allTextLines = csvString.split(/(\r\n|\r|\n)/);
    const headers = allTextLines[0].split(',');
    const lines = [];

    if (this.isValidCSV(headers)) {
      for (const i of allTextLines) {
        // split content based on comma
        const data = i.split(',');
        if (data.length === headers.length) {
          const line = [];
          for (let j = 0; j < headers.length; j++) {
            const actualData = data[j].replace(/(\")+/g, '');
            line.push(actualData);
          }
          lines.push(line);
        }
      }
      this.formatData(lines);
    } else {
      this.validationMessage = CONSTANTS.VIEWS.CSV_VALIDATION_MSG;
    }
  }

  /**
   * Sorts the table column issue count
   */
  sort() {
    if (this.issueCountClass !== CONSTANTS.VIEWS.SORT_ASC_CLASS) {
      this.issueCountClass = CONSTANTS.VIEWS.SORT_ASC_CLASS;
      this.rowData.sort((a, b) => a.issueCount - b.issueCount);
    } else {
      this.issueCountClass = CONSTANTS.VIEWS.SORT_DESC_CLASS;
      this.rowData.sort((a, b) => b.issueCount - a.issueCount);
    }
  }


}
