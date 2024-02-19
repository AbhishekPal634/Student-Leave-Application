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
			window.location.replace('login.html');
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
leaveApplicants.addEventListener('mouseup', activeCard);
