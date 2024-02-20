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
	}
	if (e.target.type === 'submit') {
		const ans = window.confirm('Sure???');
		if (ans) {
			window.location.replace('login.html');
		}
	}
});

// STATUS

statusCard.addEventListener('mouseup', function (e) {
	const active = e.target.closest('.status-dropdown');

	if (active) {
		const allCard = this.querySelectorAll('.status-dropdown');
		allCard.forEach(card => card.classList.remove('dropdown-active'));
		// active.classList.add('dropdown-active');
		console.log(allCard, active);
	}
});
