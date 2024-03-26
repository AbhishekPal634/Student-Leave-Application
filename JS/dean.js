'use strict';

const navBar = document.querySelector('.navbar');
// const mentees = document.querySelector('.mentees');
const leaveApplicants = document.querySelector('.applicants');
// const defaulters = document.querySelector('.defaulters');

// NavBar Functioning
navBar.addEventListener('click', function (e) {
	e.preventDefault();
	const toShow = e.target.getAttribute('href');
	const elements = e.target.closest('.navbar').querySelectorAll('a');

	if (document.querySelector(`.${toShow}`)) {
		elements.forEach(el => {
			const toHide = el.getAttribute('href');
			document.querySelector(`.${toHide}`).classList.add('inactive');
			document.querySelector(`.${toHide}`).classList.remove('active');
		});

		document.querySelector(`.${toShow}`).classList.remove('inactive');
		document.querySelector(`.${toShow}`).classList.add('active');
	}
	if (e.target.type === 'submit') {
		const ans = window.confirm('Sure???');
		if (ans) {
			window.location.replace('index.html');
		}
	}
});

// ...

let count = 0;

const activeCard = function (e) {
	const mentee = e.target.closest('.status-card');

	if (mentee) {
		const allMentee = this.querySelectorAll('.status-card');
		if (mentee.classList.contains('active-card')) count = count % 2 === 0 ? 0 : 1;
		if (!mentee.classList.contains('active-card')) count = 0;
		allMentee.forEach(m => m.classList.remove('active-card'));

		if (count % 2 === 0) {
			mentee.classList.add('active-card');
		}

		count++;
	}
};

// mentees.addEventListener('mouseup', activeCard);
// defaulters.addEventListener('mouseup', activeCard);
// leaveApplicants.addEventListener('mouseup', activeCard);

//NEW STUFF

function getMentorLeaveCount() {
	return new Promise((resolve, reject) => {
		fetch('/deanLeaveCount', {
			method: 'GET',
			credentials: 'same-origin', // Assuming your session uses cookies for authentication
		})
			.then(function (response) {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error('Network response was not ok.');
				}
			})
			.then(function (data) {
				resolve(data); // Resolve with the fetched data
			})
			.catch(function (error) {
				reject(error); // Reject with the error
			});
	});
}

getMentorLeaveCount()
	.then(function (data) {
		// Use the data here
		console.log('Fetched data:', data);
		const applicantsContainer = document.querySelector('.applicants');
		applicantsContainer.innerHTML = ''; // Clear previous content
		data.forEach(function (row) {
			const name = row.name || 'N/A';
			const sapId = row.sap_id || 'N/A';
			const fromdate = row.fromdate ? new Date(row.fromdate).toLocaleDateString() : 'N/A';
			const todate = row.todate ? new Date(row.todate).toLocaleDateString() : 'N/A';
			const typeOfLeave = row.type_of_leave || 'N/A';
			const reason = row.reason || 'N/A';
			const address = row.address || 'N/A';
			const lastApprovedBy = row.last_approved_by || 'N/A';

			if (lastApprovedBy === 'HOD') {
				const html = 
				`<div class="status-card">
					<div class="status-card-up">
						<div class="card-info">
							<h3 class="name">${name}</h3>
							<h3 class="name">${sapId}</h3> <br>
							<p class="leave-details">
								<b>From</b>: ${fromdate}<br>
								<b>To</b>: ${todate}<br>
								<b>Type</b>: ${typeOfLeave}<br>
								<b>Reason</b>: ${reason}<br>
								<b>Address</b>: ${address}<br>
								<b>Last Approved By</b>: ${lastApprovedBy}
							</p>
						</div>
						<div class="status-indicator">
							<i id="red" class='bx bxs-circle' ></i>
						</div>
					</div>
					<div class="arbutton">
                        <input class="button approve" type="submit" value="Approve">
                        <input class="button reject" type="submit" value="Reject">
                    </div>
                </div>`;
				const div = document.createElement('div'); // Create a new div element
				div.innerHTML = html; // Set the HTML content of the div
				applicantsContainer.appendChild(div.firstChild); // Append the first child of the created div
			}
		});
	})
	.catch(function (error) {
		console.error('Error fetching mentor leave count:', error);
		// Handle error, e.g., display error message
	});

