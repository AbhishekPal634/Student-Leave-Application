'use strict';

const navBar = document.querySelector('.navbar');

navBar.addEventListener('click', function (e) {
	e.preventDefault();
	navBar.Style.backgroundColor = 'black';
});
