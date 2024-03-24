'use strict';

const nav = document.querySelector('.navbar');

// const statusDropdown = document.querySelector('.statusdropdown');
const statusCard = document.querySelector('.status');
const leaveHistory = document.querySelector('.leave-history');

// Navigation
nav.addEventListener('click', function (e) {
	e.preventDefault();
	const toShow = e.target.getAttribute('href');
	const elements = e.target.closest('.navbar').querySelectorAll('a');

	if (document.querySelector(`.${toShow}`)) {
		elements.forEach(el => {
			const toHide = el.getAttribute('href');
			document.querySelector(`.${toHide}`).classList.add('inactive');
			document.querySelector(`.${toHide}`).classList.remove('active');
			el.style.color = 'grey';
		});

		document.querySelector(`.${toShow}`).classList.remove('inactive');
		document.querySelector(`.${toShow}`).classList.add('active');
		e.target.style.color = '#f00';
	}
	if (e.target.type === 'submit') {
		const ans = window.confirm('Sure???');
		if (ans) {
			window.location.replace('index.html');
		}
	}
});

// STATUS
let count = 0;

leaveHistory.addEventListener('mouseup', function (e) {
	const active = e.target.closest('.status-card');

	if (active) {
		const allCard = this.querySelectorAll('.status-dropdown');
		if (active.classList.contains('dropdown-active')) count = count % 2 === 0 ? 0 : 1;
		if (!active.classList.contains('dropdown-active')) count = 0;

		allCard.forEach(card => {
			card.classList.add('dropdown-inactive');
			card.classList.remove('dropdown-active');
		});

		// console.log(active.classList);
		if (count % 2 === 0) {
			active.querySelector('.status-dropdown').classList.add('dropdown-active');
			active.querySelector('.status-dropdown').classList.remove('dropdown-inactive');
		}

		count++;
	}
});

// Node
document.addEventListener('DOMContentLoaded', function () {
	const leaveForm = document.querySelector('form[name="leaveForm"]');
	leaveForm.addEventListener('submit', function (e) {
		e.preventDefault(); // Prevent the default form submission behavior

		// Submit the form using fetch API
		fetch('/submit_leave', {
			method: 'POST',
			body: new FormData(leaveForm),
		})
			.then(response => {
				if (response.ok) {
					alert('Form submitted successfully!');
				} else {
					alert('Error submitting form. Please try again.');
				}
			})
			.catch(error => {
				console.error('Error submitting form:', error);
				alert('Error submitting form. Please try again.');
			});
	});
});
