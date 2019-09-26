import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { CsvImport } from './models/csv-import.model';
import { CONSTANTS } from './constants';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render Import CSV title in a h1 tag', () => {

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Import CSV');
  });

  it('Import CSV function should call formatData', () => {
    const text = `"First name","Sur name","Issue count","Date of birth"`;
    const e = {
      target: {
        result: text
      }
    };
    const formatDataSpy = spyOn(component, 'formatData');
    spyOn(component.reader, 'readAsText').and.callFake((event) => {
      const fileevent = e;
      component.fileOnLoadReader(fileevent);
    });
    const data = [ 'First name', 'Sur name', 'Issue count', 'Date of birth' ];
    const file: File = new File(data, 'foo.csv', {
      type: 'text/plain',
    });

    component.selectedFile = file;
    component.importCSV();
    expect(formatDataSpy).toHaveBeenCalled();
    expect(formatDataSpy).toHaveBeenCalledWith([data]);
  });

  it('Should execute importCSV function on Click of import csv data button', () => {
    const text = `"First name","Sur name","Issue count","Date of birth"
    "Theo","Jansen",5,"1978-0109-02T00:00:00"`;
    const file: File = new File([text], 'foo.csv', {
      type: 'text/plain',
    });
    const importSPY = spyOn(component, 'importCSV');
    const de = fixture.debugElement;
    const compiled = de.nativeElement;
    component.selectedFile = file;

    // component.selectedFile = file;
    component.file = 'issues.csv';
    // fixture.detectChanges();
    const importBtn = compiled.querySelector('#importBtn');
    importBtn.click();
    fixture.detectChanges();
    const firsTdElements: NodeListOf<Element> = compiled.querySelectorAll('tr:first-child td');
    const tdContent = [];
    // firsTdElements.forEach((ele) => tdContent.push(ele.textContent));
    // const expectedData = ['Theo', 'Jansen', '5', '1978-01-02T00:00:00'];
    expect(importSPY).toHaveBeenCalled();
  });

  it('format Data should initialize the row data of the table', () => {

    const data = [['First name', 'Sur name', 'Issue count', 'Date of birth'], ['Theo', 'Jansen', '5', '1978-01-02T00:00:00']];
    const importObject = new CsvImport('Theo', 'Jansen', '5', '1978-01-02T00:00:00');
    const expectedData = [importObject];
    component.formatData(data);
    expect(component.rowData).toEqual(expectedData);
  });

  it('Should call sort function from column header issue count', () => {
    const sortSPY = spyOn(component, 'sort');
    const compiled = fixture.debugElement.nativeElement;
    const issueCountColumn = compiled.querySelector('#tdSort');
    issueCountColumn.click();
    expect(sortSPY).toHaveBeenCalled();
  });

  it('Should sort data in Ascending - Issue count', () => {
    component.issueCountClass = '';
    const importObject1 = new CsvImport('Theo', 'Jansen', '15', '1978-01-02T00:00:00');
    const importObject2 = new CsvImport('Fiona', 'de Vries', '7', '1950-11-12T00:00:00');
    component.rowData = [importObject1, importObject2];
    component.sort();
    const actualData = component.rowData.map(data => data.issueCount);
    const expectedData = [7, 15];
    expect(actualData).toEqual(expectedData);
  });

  it('Should sort data in Descending - Issue count', () => {
    component.issueCountClass = CONSTANTS.VIEWS.SORT_ASC_CLASS;
    const importObject1 = new CsvImport('Theo', 'Jansen', '15', '1978-01-02T00:00:00');
    const importObject2 = new CsvImport('Fiona', 'de Vries', '7', '1950-11-12T00:00:00');
    component.rowData = [importObject1, importObject2];
    component.sort();
    const actualData = component.rowData.map(data => data.issueCount);
    const expectedData = [15, 7];
    expect(actualData).toEqual(expectedData);
  });

  it('Should show Validation message when csv format is invalid', () => {
    const text = `"First name","Sur name","Issue count","Date of death"
    "Theo","Jansen",5,"1978-0109-02T00:00:00"`;
    const e = {
      target: {
        result: text
      }
    };
    component.fileOnLoadReader(e);
    expect(component.validationMessage).toEqual(CONSTANTS.VIEWS.CSV_VALIDATION_MSG);
  });
});
