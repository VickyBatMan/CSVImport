export class CsvImport {
    firstName: string;
    surName: string;
    issueCount: number;
    dob: Date | string;

    constructor(firstName: string, surName: string, issueCount: string, dob: string) {
        this.firstName = firstName;
        this.surName = surName;
        this.issueCount = parseInt(issueCount, 10);
        const dobDate = new Date(dob);
        this.dob = !isNaN(dobDate.getTime()) ? dobDate : '' ;
    }
}
