const { uploadAndProcess } = require('./controllers/secretController');
const fs = require('fs');
const csv = require('csv-parser');
const fastCsv = require('fast-csv');
const mockFs = require('mock-fs');
jest.mock('fs');
jest.mock('csv-parser');
jest.mock('fast-csv');

describe('uploadAndProcess', () => {
  let req, res;

  beforeEach(() => {
    req = {
      files: {
        employees: [{ path: './uploads/employees.csv' }],
        previousYear: [{ path: './uploads/previousYear.csv' }],
      },
    };
    res = {
      download: jest.fn(),
    };

    // Mock employee CSV data
    const employeeData = [
      { Employee_Name: 'John Doe', Employee_EmailID: 'john@example.com' },
      { Employee_Name: 'Jane Doe', Employee_EmailID: 'jane@example.com' },
    ];

    // Mock previous year assignments data
    const previousYearData = [
      { Employee_EmailID: 'john@example.com', Secret_Child_EmailID: 'jane@example.com' },
    ];

    // Mock file reading for employees
    fs.createReadStream.mockImplementation((filePath) => {
      const stream = require('stream');
      const readable = new stream.Readable({
        read() {
          if (filePath.includes('employees')) {
            employeeData.forEach((row) => this.push(JSON.stringify(row)));
            this.push(null);
          } else if (filePath.includes('previousYear')) {
            previousYearData.forEach((row) => this.push(JSON.stringify(row)));
            this.push(null);
          }
        },
      });
      return readable;
    });

    // Mock fast-csv to pretend to write CSV files
    fastCsv.format.mockReturnValue({
      pipe: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should process CSV files and assign secret children correctly', async () => {
    await uploadAndProcess(req, res);

    // Check that res.download was called with the correct output file
    expect(res.download).toHaveBeenCalledWith(expect.stringContaining('secret_santa_results.csv'));
  });

  it('should assign secret children ensuring no one assigns themselves', async () => {
    await uploadAndProcess(req, res);

    // Mocked shuffle will return shuffled employees, so validate secret child assignment logic
    expect(fastCsv.format().write).toHaveBeenCalledWith({
      Employee_Name: 'John Doe',
      Employee_EmailID: 'john@example.com',
      Secret_Child_Name: expect.any(String),
      Secret_Child_EmailID: 'jane@example.com',
    });
  });

  it('should ensure no one gets assigned the same secret child from the previous year', async () => {
    await uploadAndProcess(req, res);

    // Ensure that John Doe doesn't get assigned Jane Doe again (as per previous year)
    expect(fastCsv.format().write).not.toHaveBeenCalledWith({
      Employee_Name: 'John Doe',
      Employee_EmailID: 'john@example.com',
      Secret_Child_Name: 'Jane Doe',
      Secret_Child_EmailID: 'jane@example.com',
    });
  });
});
