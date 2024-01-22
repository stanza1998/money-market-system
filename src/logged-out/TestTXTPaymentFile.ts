// import * as fs from 'fs';
// import * as readlineSync from 'readline-sync';

export function generateTextFile(): void {
    const lines: string[] = [];

    // Header Record
    const headerRecord = formatLine('Header Record', {
        recordIdentifier: 'SB',
        actionDate: '20200214',
        batchDescription: '2011066001/D',
    });
    lines.push(headerRecord);

    // Detail Record
    const detailRecord = formatLine('Detail Record', {
        recordIdentifier: 'SD',
        subBatchNumber: '001',
        transactionReferenceNumber: '0000000001',
        transactionType: 'C',
        branchCode: '082372',
        accountNumber: '60003108928',
        accountName: 'AM NTEMA'

    });
    lines.push(detailRecord);

    // Contra Record
    const contraRecord = formatLine('Contra Record', {
        recordIdentifier: 'SC',
        subBatchNumber: '001',
        transactionRequest: 'D',
        branchCode: '087373',
        accountNumber: '042739330'


    });
    lines.push(contraRecord);

    // Trailer Record
    const trailerRecord = formatLine('Trailer Record', {
        recordIdentifier: 'ST',
        totalDebitRecords: '00001',
        totalCreditRecords: '0001',
        totalContraRecords: '001',
        totalAmountDebitRecords: '000000000010000',
        totalAmountCreditRecords: '000000000010000',
    });
    lines.push(trailerRecord);

    // Write to file
    // fs.writeFileSync('output.txt', lines.join('\n'));


    // Create a Blob containing the text
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });

    // Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'output.txt';

    // Trigger the download
    downloadLink.click();
}

function formatLine(recordType: string, fields: { [key: string]: string }): string {
    const fieldDescriptions = [
        { name: 'Record Identifier', length: 2 },
        { name: 'Action Date', length: 8 },
        { name: 'Batch Description', length: 30 },
        // ... (other field descriptions)
    ];

    let line = recordType.padEnd(15);
    let currentPosition = 15;

    for (const fieldDescription of fieldDescriptions) {
        const fieldName = fieldDescription.name.split(' ').join('');
        const fieldValue = fields[fieldName] || '';
        const paddedValue = fieldValue.padEnd(fieldDescription.length, ' ');

        line += paddedValue;
        currentPosition += fieldDescription.length;
    }

    const totalLength = 144;
    if (currentPosition !== totalLength) {
        throw new Error(`Total length of ${recordType} must be ${totalLength} characters.`);
    }

    return line;
}
