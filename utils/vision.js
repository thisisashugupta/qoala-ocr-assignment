import { ImageAnnotatorClient } from '@google-cloud/vision';

const sampleOcrData= `บัตรประจำตัวประชาชน Thai National ID Card\n1 8199 00086 00 8\nเลขประจำตัวประชาชน\nIdentification Number\nชื่อตัวและชื่อสกุล นาย ณัฐพล ชนะกุล\nName Mr. Nadtapol\nLast name Chanakun\nเกิดวันที่ 12 ธ.ค. 2532\nDate of Birth 12 Dec. 1989\nศาสนา พุทธ\nที่อยู่ 33 หมู่ที่ 6 ต.ปกาสัย อ.เหนือคลอง\nจ.กระบี\n6 ม.ค. 2559\nวันออกบัตร\n8 Jan. 2016\nDate of issue\nร้อยตำรวจโท - 11 ธ.ค. 2557\n(อาทิตย์ บุญญะโสภัต)\nวันบัตรหมดอายุ\n11 Dec. 2024\nDate of Expiry.\nเจ้าพนักงานออกบัตร\n180\n170\n160\n150.\n180\n170\n160\n8108-06-01061049`;

async function detectText(imagePath) {
    try {
        const client = new ImageAnnotatorClient();

        const [result] = await client.textDetection(imagePath);

        const detections = result.textAnnotations;
        // detections.forEach((text) => receivedText += (text.description + '\n') || '');
        const detected = detections[0].description;
        // console.log(detected);
        const structured = structureOCRData(detected);
        console.log('returned data:', structured);
        return structured;

    } catch (error) {
        console.error('Error detecting text using vision api:', error);
        return error;
    }
}

function structureOCRData(ocrData) {

    const lines = ocrData.split('\n');
    console.log("lines", lines);

    const structuredData = {
        name: lines.find(line => line.includes('Name'))?.split('Name')[1]?.trim(),
        lastName: lines.find(line => line.includes('Last name'))?.split('Last name')[1]?.trim(),
        dateOfBirth: lines.find(line => line.includes('Date of Birth'))?.split('Date of Birth')[1]?.trim(),
        identificationNumber: null,
        dateOfIssue: null,
        dateOfExpiry: null,
    };

    for (let i = 0; i < lines.length; i++) {

        const line = lines[i];
    
        if (line.includes('Thai National ID Card')) {
          // If 'Thai National ID Card' is found, get the next line and set it as the IdentificationNumber
          structuredData.identificationNumber = lines[i + 1].trim();
        }

        if (line.includes('Expiry' || 'expiry')) {
            structuredData.dateOfExpiry = lines[i - 1].trim();
        }

        if (line.includes('issue' || 'Issue')) {
            structuredData.dateOfIssue = lines[i - 1].trim();
        }
    }

    return structuredData;
}

/*
function structureOCRData(ocrData) {
    const lines = ocrData.split('\n');
    console.log('lines', lines);
  
    const structuredData = {
      name: lines.find(line => line.includes('Name'))?.split('Name')[1]?.trim(),
      lastName: lines.find(line => line.includes('Last name'))?.split('Last name')[1]?.trim(),
      identificationNumber: lines.find(line => line.includes('Thai National ID Card'))?.split('Thai National ID Card')[1]?.trim(),
      dateOfBirth: lines.find(line => line.includes('Date of Birth'))?.split('Date of Birth')[1]?.trim(),
      dateOfIssue: lines.find(line => line.includes('Date of issue'))?.split('Date of issue')[1]?.trim(),
      dateOfExpiry: lines.find(line => line.includes('Date of Expiry'))?.split('Date of Expiry')[1]?.trim(),
    };
  
    return structuredData;
}
*/

export default detectText;