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
		});

		document.querySelector(`.${toShow}`).classList.remove('inactive');
		document.querySelector(`.${toShow}`).classList.add('active');
		// e.target.style.backgroundColor = 'grey';
		console.log(toShow);
	}
	if (e.target.type === 'submit') {
		const ans = window.confirm('Sure???');
		if (ans) {
			window.location.replace('login.html');
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
