const csv = require('csv-parser');
const fs = require('fs');
const fastCsv = require('fast-csv');
const path = require('path');
const xlsx = require('xlsx');


exports.singleUploadAndProcess = async (req, res) => {
  const employees = [];
  const previousAssignments = [];

  const filePath = path.join(__dirname, '../csv/previous_year.csv');
  await fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (row) => {
      employees.push({ name: row.Employee_Name, email: row.Employee_EmailID });
    })
    .on('end', () => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          previousAssignments.push({
            employeeEmail: row.Employee_EmailID,
            secretChildEmail: row.Secret_Child_EmailID,
          });
        })
        .on('end', async () => {
          const assignments = await assignSecretSanta(employees, previousAssignments);
          await saveAndGenerateCSV(assignments, res);
        });
    });
}

exports.uploadAndProcess = async (req, res) => {
  console.log("sucess")
  const employees = [];
  const previousAssignments = [];

  console.log(req.files)

  const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded.' });
    }

  await fs.createReadStream(req.files[0].path)
    .pipe(csv())
    .on('data', (row) => {
      employees.push({ name: row.Employee_Name, email: row.Employee_EmailID });
    })
    .on('end', () => {
      fs.createReadStream(req.files[1].path)
        .pipe(csv())
        .on('data', (row) => {
          previousAssignments.push({
            employeeEmail: row.Employee_EmailID,
            secretChildEmail: row.Secret_Child_EmailID,
          });
        })
        .on('end', () => {
          const assignments = assignSecretSanta(employees, previousAssignments);
          saveAndGenerateCSV(assignments, res);
        });
    });
};

function assignSecretSanta(employees, previousAssignments) {
  const assignments = [];
  let shuffled = shuffle(employees.slice());

  console.log(previousAssignments)

  employees.forEach((employee) => {
    let assignedChild;
    do {
      assignedChild = shuffled.pop();

    } while (assignedChild === employee.email || 
      previousAssignments.some(
        (prev) => prev.employeeEmail === employee.email && prev.secretChildEmail === assignedChild
      )) 

    assignments.push({ employee: employee, secretChild: assignedChild });
  });

  return assignments;
}


function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function saveAndGenerateCSV(assignments, res) {
  const csvStream = fastCsv.format({ headers: true });
  const outputPath = path.join(__dirname, '../uploads/secret_santa_results.csv');
  const writableStream = fs.createWriteStream(outputPath);

  console.log("success", outputPath)

  csvStream.pipe(writableStream);
  assignments.forEach((assignment) => {
    csvStream.write({
      Employee_Name: assignment.employee.name,
      Employee_EmailID: assignment.employee.email,
      Secret_Child_Name: assignment.secretChild.name,
      Secret_Child_EmailID: assignment.secretChild.email,
    });
  });
  csvStream.end();

  writableStream.on('finish', () => {
    res.download(outputPath);
  });
}


