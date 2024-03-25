const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session'); // Import express-session

const app = express();
const port = 3000;

// mysql connection
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root', // mysql username
	password: '19601348', // mysql password
	database: 'student', // database name
});

// Connect to MySQL
connection.connect(err => {
	if (err) {
		console.error('Error connecting to MySQL: ' + err.stack);
		return;
	}
	console.log('Connected to MySQL as id ' + connection.threadId);
});

// Middleware
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	session({
		secret: 'your-secret-key', // Change this to a secure secret
		resave: false,
		saveUninitialized: false,
	})
);

// GET route for serving index.html
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
});

// POST route for handling login
app.post('/login', (req, res) => {
	const { username, password } = req.body;
	const query = 'SELECT * FROM login_info WHERE username = ? AND password = ?';

	connection.query(query, [username, password], (error, results, fields) => {
		if (error) {
			console.error('Error executing query: ' + error);
			res.status(500).send('Internal Server Error');
			return;
		}

		if (results.length > 0) {
			// If username and password match
			const userType = results[0].type;
			switch (userType) {
				case 'student':
					// Save username in session
					req.session.username = username;
					res.redirect('/student.html');
					break;
				case 'mentor':
					// Save username in session
					req.session.username = username;
					res.redirect('/mentor.html');
					break;
				case 'dean':
					// Save username in session
					req.session.username = username;
					res.redirect('/dean.html');
					break;
				case 'pc':
					// Save username in session
					req.session.username = username;
					res.redirect('/programchair.html');
					break;
				default:
					res.status(500).send('Unknown user type');
			}
		} else {
			// If username and password don't match, redirect back to login page
			res.redirect('/');
		}
	});
});

const multer = require('multer');
const upload = multer(); // Initialize Multer

// POST route for handling form submission from student.html
app.post('/submit_leave', upload.none(), (req, res) => {
	const { fromDate, toDate, leaveType, reasonForLeave, address } = req.body;
	const username = req.session.username; // Retrieve username from session

	// Determine the type of leave (A for Authorized, S for Special)
	const type_of_leave = leaveType === 'special' ? 'S' : 'A';

	// Set last_approved_by to 'mentor'
	const last_approved_by = 'None';
	const status = 'Pending';

	const query =
		'INSERT INTO student_leave (sap_id, fromdate, todate, type_of_leave, reason, address, last_approved_by, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

	connection.query(
		query,
		[username, fromDate, toDate, type_of_leave, reasonForLeave, address, last_approved_by, status],
		error => {
			if (error) {
				console.error('Error executing query: ' + error);
				res.status(500).send('Internal Server Error');
				return;
			}
			// Send a success response
			res.status(200).send('Form submitted successfully!');
		}
	);
});

app.get('/profileData', (req, res) => {
	const username = req.session.username; // Retrieve username from session
	const query =
		'SELECT sap_id, name, roll, course, branch, sem, mentorid FROM student_basic_info WHERE sap_id = ?';

	connection.query(query, [username], (error, results, fields) => {
		if (error) {
			console.error('Error executing query: ' + error);
			res.status(500).send('Internal Server Error');
			return;
		}

		// If results exist, send the data, otherwise send null
		if (results.length > 0) {
			const studentData = {
				sap_id: results[0].sap_id,
				name: results[0].name,
				roll: results[0].roll,
				course: results[0].course,
				branch: results[0].branch,
				sem: results[0].sem,
				mentorid: results[0].mentorid,
			};
			res.send(studentData);
		} else {
			res.send(null);
		}
	});
});

app.get('/statuscarddata', (req, res) => {
	const username = req.session.username; // Retrieve username from session
	const query =
		'SELECT fromdate, todate, last_approved_by, status FROM student_leave WHERE sap_id = ? ORDER BY fromdate DESC LIMIT 1';

	connection.query(query, [username], (error, results, fields) => {
		if (error) {
			console.error('Error executing query: ' + error);
			res.status(500).send('Internal Server Error');
			return;
		}

		// If results exist, send the dates, otherwise send null
		if (results.length > 0) {
			const dates = {
				fromDate: results[0].fromdate,
				toDate: results[0].todate,
				last_approved_by: results[0].last_approved_by,
				status: results[0].status,
			};
			res.send(dates);
		} else {
			res.send(null);
		}
	});
});

app.get('/facultyProfileData', (req, res) => {
	const username = req.session.username; // Retrieve username from session
	const query = 'SELECT name, mentorid, dept, school FROM teacher_basic_info WHERE mentorid = ?';

	connection.query(query, [username], (error, results, fields) => {
		if (error) {
			console.error('Error executing query: ' + error);
			res.status(500).send('Internal Server Error');
			return;
		}

		// If results exist, send the faculty data, otherwise send null
		if (results.length > 0) {
			const facultyData = {
				name: results[0].name,
				mentorid: results[0].mentorid,
				dept: results[0].dept,
				school: results[0].school,
			};
			res.send(facultyData);
		} else {
			res.send(null);
		}
	});
});

app.get('/mentorLeaveCount', (req, res) => {
	const username = req.session.username;
	const query = `
SELECT sbi.*, 
       IFNULL(
           (SELECT COUNT(*) 
            FROM student_leave sl 
            WHERE sl.sap_id = sbi.sap_id 
              AND sl.last_approved_by = 'none' 
              AND sl.status = 'Pending'
           ), 0) AS count,
       sl.fromdate,
       sl.todate,
       sl.type_of_leave,
       sl.reason,
       sl.address,
       sl.last_approved_by
FROM student_basic_info sbi
LEFT JOIN student_leave sl ON sbi.sap_id = sl.sap_id
WHERE sbi.mentorid = (
    SELECT mentorid
    FROM student_basic_info
    WHERE sap_id = sbi.sap_id
) AND sbi.mentorid = ?;



    `;
	connection.query(query, [username], (error, results, fields) => {
		if (error) {
			console.error('Error executing query: ' + error);
			res.status(500).send('Internal Server Error');
			return;
		}

		// Send all the data fetched from the query
		res.json(results);
	});
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port http://localhost:${port}`);
});
