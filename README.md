# digitalXc-task

To automate the Secret Santa process for Acme as described, we can build a program using Node.js for backend processing  Secret Santa assignments. We will parse CSV files for employee data and previous year assignments, then assign secret children following the rules and constraints, and output the results in a new CSV file.

# explanation

## System Requirements
## Input Format:
- Two CSV files
Current Employee List:
- Fields:
Employee_Name: The name of the employee.
Employee_EmailID: The email ID of the employee.
  - Previous Year’s Secret Santa Assignments (optional):
  - Fields:
Employee_Name: The name of the employee.
Employee_EmailID: The email ID of the employee.
Secret_Child_Name: The name of the secret child assigned last year.
Secret_Child_EmailID: The email ID of the secret child assigned last year.
Business Rules for Secret Santa Assignments:
## No Self-Selection:

- An employee cannot be assigned to themselves as a secret child.
Avoid Repeating Previous Year's Assignment:

- If the previous year’s data is provided, an employee cannot be assigned the same secret child as they were last year.
Unique Secret Child for Each Employee:

- Each employee must have exactly one unique secret child.
- Each secret child should be assigned to only one employee (no duplicates).
## Output Format:
# A new CSV file containing the fields:
Employee_Name: The name of the employee.
Employee_EmailID: The email ID of the employee.
Secret_Child_Name: The name of the assigned secret child.
Secret_Child_EmailID: The email ID of the assigned secret child.
Steps for the Solution:
Reading the CSV files:

Employee Data CSV: This contains the list of employees participating in the event.
Previous Year’s Assignment CSV: This is optional but, if provided, will be used to ensure no employee is assigned the same secret child they had last year.
Assigning Secret Children:

Shuffle the employee list and attempt to assign each employee a random secret child from the shuffled list.
Ensure:
The employee does not get themselves.
The employee does not get the same secret child as last year (if previous data is available).
Handling Constraints:

No Self-Assignment: If an employee is randomly assigned themselves, reshuffle and reassign.
Avoid Repeat Assignments: Cross-check with the previous year's data to avoid repeat assignments.
Continue shuffling until a valid assignment is made.
Generating the Output:

After valid assignments are made, generate a new CSV file containing the current year’s Secret Santa assignments with the required fields.
Algorithm Outline:
Load Employee Data:

Parse the employee CSV to get the list of employees (with names and emails).
Load Previous Assignments (Optional):

If a previous assignment CSV is provided, parse it to track which employee was assigned to which secret child last year.
Shuffling and Assignment:

Shuffle the employee list and assign secret children.
Ensure:
No employee is assigned to themselves.
Cross-check with last year’s data to avoid duplicate secret children assignments.
Validate Assignments:

If the current assignment violates the rules (self-assignment or repeat from last year), reassign until all rules are satisfied.
Write Output:

Write the result into a new CSV file with the required format.
Edge Cases:
Previous Year Data Not Provided:

If previous assignments are not provided, the program can simply avoid self-assignments and ensure each employee has a unique secret child.
Insufficient Employees:

If only one employee is in the list, Secret Santa cannot work as each person needs to have someone to give to. In such cases, the system should raise an error.
Odd Employee Count:

This is not an issue as long as there are more than one employee since the shuffling and assignment process ensures that each employee gets exactly one secret child.



Please clone the repository using 
```sh
git clone https://github.com/rajasekarpradeep/digitalXc-task.git
```

Install the dependencies
```sh
//frontend 
cd front-end
npm install

//backend
cd back-end
npm install

```

To run front end 
```sh
npm run dev
```

To run back end
```sh
node index.js
```

to test the logic in backend 
```sh
npm test
```
