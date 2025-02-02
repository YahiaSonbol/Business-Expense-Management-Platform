const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const config = {
  user: 'yahia',
  password: 'yahia',
  server: 'localhost',
  database: 'bemp-data',
  options: {
    trustedConnection: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    instancename: 'SQLEXPRESS',
  },
  port: 1433,
};

app.get('/api/employees', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(
        "select email,password from employee where email='Admin@gmail.com' and password='Admin123'"
      );
    res.json(result.recordset); // Send the data as JSON in the response
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Error fetching employee data');
  }
});
app.get('/api/homepagebudget', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(
        "select sum(bd.total_budget) as [total_budget] , sum (bd.allocated_budget) as [allocated_budget] from Department bd"
      );
    res.json(result.recordset); // Send the data as JSON in the response
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Error fetching employee data');
  }
});
app.get('/api/numberofproject', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(
        "select count(p.id) as [total_number_of_project]from project p"
      );
    res.json(result.recordset); // Send the data as JSON in the response
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Error fetching employee data');
  }
});
app.get('/api/tabledash', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(
        "SELECT Employee.id,Employee.name, Employee.email, Employee.role, Department.name AS d_name, Department.total_budget,Department.allocated_budget, EmployeeCount.num_employees FROM Employee JOIN Department ON Department.id = Employee.department_id JOIN (SELECT department_id, COUNT(id) AS num_employees FROM Employee GROUP BY department_id) AS EmployeeCount ON EmployeeCount.department_id = Employee.department_id WHERE Employee.role = 'Department Head';"
      );
    res.json(result.recordset); // Send the data as JSON in the response
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Error fetching employee data');
  }
});
app.get('/api/tabledep', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(
        "select p.id,p.department_id,p.name as[projectname] , p.allocated_budget, p.total_budget from Project p"
      );
    res.json(result.recordset); // Send the data as JSON in the response
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Error fetching employee data');
  }
});
app.get('/api/tabsdep', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(
        "SELECT id,name, total_budget, allocated_budget FROM Department "
      );
    res.json(result.recordset); // Send the data as JSON in the response
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Error fetching employee data');
  }
});
app.get('/api/emp', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(
        "select Employee.name,Employee.department_id,Employee.role from Employee where name !='Admin' and role!='Department Head'"
      );
    res.json(result.recordset); // Send the data as JSON in the response
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Error fetching employee data');
  }
});

app.get('/api/approval', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(
        "select project_id from Approval_Workflow"
      );
    res.json(result.recordset); 
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Error fetching employee data');
  }
});
app.post('/api/projects', async (req, res) => {
  const { projectName, allocatedBudget, departmentId, employeeNames, totalBudget } = req.body;

  if (!projectName || !allocatedBudget || !departmentId ||!totalBudget|| !employeeNames || employeeNames.length === 0) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    const pool = await sql.connect(config);
    const transaction = pool.transaction();
    await transaction.begin();

    try {
      // Insert the project into the Project table
      const projectResult = await transaction.request()
      .input('name', sql.NVarChar, projectName)
      .input('allocated_budget', sql.Decimal(18, 2), allocatedBudget)
      .input('total_budget', sql.Decimal(18, 2), totalBudget)
      .input('department_id', sql.Int, departmentId)
      .query('INSERT INTO Project (name, department_id, allocated_budget, total_budget) OUTPUT INSERTED.id VALUES (@name, @department_id ,@allocated_budget,@total_budget)');
      // Insert the project assignments into a linking table (ProjectEmployee)
      for (const employeeName of employeeNames) {
        const employeeResult = await transaction.request()
          .input('name', sql.NVarChar, employeeName)
          .query('SELECT id FROM Employee WHERE name = @name');
          const projectId = projectResult.recordset[0]?.id;
    
          if (!projectId) {
            throw new Error('Failed to retrieve the ID of the newly inserted project.');
          }   
        if (employeeResult.recordset.length > 0) {
          const employeeId = employeeResult.recordset[0].id;
          await transaction.request()
            .input('project_id', sql.Int, projectId)
            .input('employee_id', sql.Int, employeeId)
            .query('INSERT INTO EmployeeProject (project_id, employee_id) VALUES (@project_id, @employee_id)');
        } else {
          throw new Error(`Employee with name "${employeeName}" not found.`);
        }
      }
      await transaction.request()
      .input('department_id', sql.Int, departmentId)
      .input('allocated_budget', sql.Decimal(18, 2), allocatedBudget)
      .input('total_budget', sql.Decimal(18, 2), totalBudget)
      .query('UPDATE Department SET allocated_budget =allocated_budget+@allocated_budget, total_budget = total_budget+@total_budget WHERE id = @department_id; ');

      await transaction.commit();
      res.status(201).json({ message: 'Project added successfully.' });
    } catch (err) {
      await transaction.rollback();
      console.error('Error adding project:', err);
      res.status(500).json({ message: 'Failed to add project.', error: err.message });
    }
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).send('Database connection error.');
  }
});
app.put('/api/editedprojects/:projectId', async (req, res) => {
  const { projectName } = req.body;
  const projectId = req.params.projectId;

  if (!projectName || !projectId) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    const pool = await sql.connect(config);

    // Update project name
    await pool.request()
      .input('id', sql.Int, projectId)
      .input('name', sql.NVarChar, projectName)
      .query('UPDATE Project SET name = @name WHERE id = @id');

    res.status(200).json({ message: 'Project updated successfully.' });
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({ message: 'Failed to update project.', error: err.message });
  }
});
app.delete('/api/deletedprojects/:projectId', async (req, res) => {
  const projectId = req.params.projectId;
  console.log("Received DELETE request body:", req.body);
  const { departmentId, AllocatedBudget, totalBudget } = req.body;

  if (!projectId) {
    return res.status(400).json({ message: 'Project ID is required.' });
  }

  const pool = await sql.connect(config);
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin(); // Start the transaction

    await transaction.request()
      .input('allocated_budget', sql.Decimal(18, 2), AllocatedBudget)
      .input('total_budget', sql.Decimal(18, 2), totalBudget)
      .input('department_id', sql.Int, departmentId)
      .query('UPDATE Department SET allocated_budget = allocated_budget - @allocated_budget, total_budget = total_budget - @total_budget WHERE id = @department_id;');

    await transaction.request()
      .input('id', sql.Int, projectId)
      .query('DELETE FROM EmployeeProject WHERE project_id = @id');

    await transaction.request()
      .input('id', sql.Int, projectId)
      .query('DELETE FROM Project WHERE id = @id');

    await transaction.commit(); // Commit the transaction if all operations succeed
    res.status(200).json({ message: `Project deleted successfully for department ID ${departmentId}.` });

  } catch (err) {
    console.error('Error deleting project:', err);
    await transaction.rollback(); // Rollback the transaction if any error occurs
    res.status(500).json({ message: 'Failed to delete project.', error: err.message });
  }
});

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.listen(3000, () => {
  console.log('server started');
});
