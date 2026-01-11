/*!
 * main.js v26.01.11 | @xdarkshan | Sateula template
 * javascript file for Sateula template
 * @license Copyright 2025, Sateula. All rights reserved.
 * Subject to the terms at sateula standard-license.
 * @author: xdarkshan, sateula
 */

const loadStartTime = performance.now();
let currentLang = localStorage.getItem('selectedLang') || 'id';

async function applyTranslation() {
	const selectEl = document.querySelector('.goog-te-combo');
	if (selectEl) {
		selectEl.value = currentLang;
		selectEl.dispatchEvent(new Event('change'));
		selectEl.dispatchEvent(new Event('input'));
		return true;
	}
	return false;
}

async function removeLoadingScreen(duration) {
	const loader = document.getElementById('loading-screen');
	const loadingText = document.getElementById('loading-text');

	if (loader) {
		if (loadingText) {
			loadingText.innerText = `Selesai dalam ${duration} detik`;
		}

		setTimeout(() => {
			loader.classList.add('loaded');
			setTimeout(() => loader.remove(), 600);
		}, 400);
	}
}

window.addEventListener('load', () => {
	const loadingText = document.getElementById('loading-text');
	loadingText.innerText = "Mengubah bahasa...";

	let attempts = 0;
	const checkGoogleTranslate = setInterval(() => {
		const selectEl = document.querySelector('.goog-te-combo');

		const currentElapsed = ((performance.now() - loadStartTime) / 1000).toFixed(1);
		loadingText.innerText = `Mengubah bahasa... (${currentElapsed}s)`;

		if (selectEl) {
			selectEl.value = currentLang;
			selectEl.dispatchEvent(new Event('change'));
			selectEl.dispatchEvent(new Event('input'));

			clearInterval(checkGoogleTranslate);

			const totalLoadTime = ((performance.now() - loadStartTime) / 1000).toFixed(2);
			removeLoadingScreen(totalLoadTime);
			console.clear();
		}

		attempts++;
		if (attempts > 100) {
			clearInterval(checkGoogleTranslate);
			removeLoadingScreen("Gagal mengubah bahasa");
		}
	}, 100);
});

async function setLanguage(lang) {
	currentLang = lang;
	localStorage.setItem('selectedLang', lang);

	document.cookie = `googtrans=/id/${lang}; path=/`;

	applyTranslation();
	window.scrollTo({
		top: 0,
		behavior: 'auto'
	});

	const idsToRemove = ['lapisanutama', 'instructionutama1', 'instructionutama2', 'language-switcher'];
	idsToRemove.forEach(id => {
		const elhapus = document.getElementById(id);
		if (elhapus) elhapus.remove();
	});
}

window.addEventListener('load', () => {
	let attempts = 0;
	const checkWidget = setInterval(() => {
		const selectEl = document.querySelector('.goog-te-combo');
		if (selectEl) {
			applyTranslation();
			clearInterval(checkWidget);
		}
		attempts++;
		if (attempts > 40) clearInterval(checkWidget);
	}, 200);
});

function checkLocalRibbons() {
	const MS_PER_DAY = 3 * 24 * 60 * 60 * 1000;
	const currentTime = new Date().getTime();
	const cardPosts = document.querySelectorAll(".cardpost");

	if (cardPosts.length === 0) {
		return;
	}

	for (const card of cardPosts) {
		const localRibbon = card.querySelector('.ribbon-post');
		const descriptionElement = card.querySelector(".cardpost__description");

		if (!localRibbon || !descriptionElement) {
			continue;
		}

		const altString = descriptionElement.getAttribute('data-time');

		if (!altString) {
			localRibbon.classList.remove('is-new-visible');
			localRibbon.classList.add('is-not-visible');
			continue;
		}

		let cleanedString = altString
			.replace('(', ' ')
			.replace(',', ':')
			.replace(')', '');

		const postDate = new Date(cleanedString);

		if (isNaN(postDate.getTime())) {
			localRibbon.classList.remove('is-new-visible');
			localRibbon.classList.add('is-not-visible');
			continue;
		}

		const postTime = postDate.getTime();
		const timeDifference = currentTime - postTime;

		if (timeDifference > 0 && timeDifference <= MS_PER_DAY) {
			localRibbon.classList.add('is-new-visible');
			localRibbon.classList.remove('is-not-visible');
		} else {
			localRibbon.classList.remove('is-new-visible');
			localRibbon.classList.add('is-not-visible');
		}
	}
}
function checkNewPostsAndStyleRibbon() {
	const MS_PER_DAY = 3 * 24 * 60 * 60 * 1000;
	const currentTime = new Date().getTime();
	const cardPosts = document.querySelectorAll(".cardpost");
	const globalRibbon = document.querySelector(' .post-ribbon');

	if (!globalRibbon || cardPosts.length === 0) {
		return;
	}

	for (const CARD of cardPosts) {
		const descriptionElement = CARD.querySelector(".cardpost__description");

		if (!descriptionElement) continue;

		const altString = descriptionElement.getAttribute('data-time');
		if (!altString) continue;

		let cleanedString = altString
			.replace('(', ' ')
			.replace(',', ':')
			.replace(')', '');

		const postDate = new Date(cleanedString);

		if (isNaN(postDate.getTime())) continue;

		const postTime = postDate.getTime();
		const timeDifference = currentTime - postTime;

		if (timeDifference > 0 && timeDifference <= MS_PER_DAY) {
			globalRibbon.classList.remove('is-not-visible');

			setTimeout(() => {
				globalRibbon.classList.add('is-new-visible');
			}, 1000);

			setTimeout(() => {
				globalRibbon.classList.remove('is-new-visible');
				globalRibbon.classList.add('is-not-visible');

				setTimeout(() => {
					globalRibbon.classList.remove('is-not-visible');
				}, 500); // Adjust to transition duration with CSS (0.5s) PENTING NII!!
			}, 10000);


		}
	}
}

// TIME AGO FUNCTIONALITY FOR .cardpost__description ELEMENTS
function formatTimeAgoEnglish(altString) {
	let cleanedString = altString
		.replace('(', ' ')
		.replace(',', ':')
		.replace(')', '');

	const pastDate = new Date(cleanedString);
	const currentDate = new Date();

	if (isNaN(pastDate.getTime())) {
		return 'Invalid date format.';
	}

	const msPerSecond = 1000;
	const msPerMinute = msPerSecond * 60;
	const msPerHour = msPerMinute * 60;
	const msPerDay = msPerHour * 24;
	const msPerMonth = msPerDay * 30.44;
	const msPerYear = msPerDay * 365.25;

	let elapsed = currentDate.getTime() - pastDate.getTime();

	// Handling Future Dates (Countdown)
	if (elapsed < 0) {
		elapsed = Math.abs(elapsed);
		let result;
		if (elapsed < msPerMinute) {
			const seconds = Math.floor(elapsed / msPerSecond);
			result = `In ${seconds} second${seconds !== 1 ? 's' : ''}`;
		} else if (elapsed < msPerHour) {
			const minutes = Math.floor(elapsed / msPerMinute);
			const remainingSeconds = Math.floor((elapsed % msPerMinute) / msPerSecond);
			result = `In ${minutes} min${minutes !== 1 ? 's' : ''}, ${remainingSeconds} sec${remainingSeconds !== 1 ? 's' : ''}`;
		} else if (elapsed < msPerDay) {
			const hours = Math.floor(elapsed / msPerHour);
			const remainingMinutes = Math.floor((elapsed % msPerHour) / msPerMinute);
			result = `In ${hours} hour${hours !== 1 ? 's' : ''}, ${remainingMinutes} min${remainingMinutes !== 1 ? 's' : ''}`;
		} else if (elapsed < msPerMonth) {
			const days = Math.floor(elapsed / msPerDay);
			const remainingHours = Math.floor((elapsed % msPerDay) / msPerHour);
			result = `In ${days} day${days !== 1 ? 's' : ''}, ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`;
		} else if (elapsed < msPerYear) {
			const months = Math.floor(elapsed / msPerMonth);
			const remainingDays = Math.floor((elapsed % msPerYear) / msPerMonth);
			result = `In ${months} month${months !== 1 ? 's' : ''}, ${remainingDays} day${remainingDays !== 1 ? 's' : ''}`;
		} else {
			const years = Math.floor(elapsed / msPerYear);
			const remainingMonths = Math.floor((elapsed % msPerYear) / msPerMonth);
			result = `In ${years} year${years !== 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
		}
		return result;
	}

	// Handling Past Dates ('... ago')
	if (elapsed < msPerMinute) {
		const seconds = Math.floor(elapsed / msPerSecond);
		return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
	} else if (elapsed < msPerHour) {
		const minutes = Math.floor(elapsed / msPerMinute);
		const remainingSeconds = Math.floor((elapsed % msPerMinute) / msPerSecond);
		return `${minutes} min${minutes !== 1 ? 's' : ''}, ${remainingSeconds} sec${remainingSeconds !== 1 ? 's' : ''} ago`;
	} else if (elapsed < msPerDay) {
		const hours = Math.floor(elapsed / msPerHour);
		const remainingMinutes = Math.floor((elapsed % msPerHour) / msPerMinute);
		return `${hours} hour${hours !== 1 ? 's' : ''}, ${remainingMinutes} min${remainingMinutes !== 1 ? 's' : ''} ago`;
	} else if (elapsed < msPerMonth) {
		const days = Math.floor(elapsed / msPerDay);
		const remainingHours = Math.floor((elapsed % msPerDay) / msPerHour);
		return `${days} day${days !== 1 ? 's' : ''}, ${remainingHours} hour${remainingHours !== 1 ? 's' : ''} ago`;
	} else if (elapsed < msPerYear) {
		const months = Math.floor(elapsed / msPerMonth);
		const remainingDays = Math.floor((elapsed % msPerMonth) / msPerDay);
		return `${months} month${months !== 1 ? 's' : ''}, ${remainingDays} day${remainingDays !== 1 ? 's' : ''} ago`;
	} else {
		const years = Math.floor(elapsed / msPerYear);
		const remainingMonths = Math.floor((elapsed % msPerYear) / msPerMonth);
		return `${years} year${years !== 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''} ago`;
	}
}

document.querySelectorAll('.cardpost__description').forEach(element => {
	const dateStringWithTime = element.getAttribute('alt'); // e.g., "08/13/2025(18,45)"

	if (dateStringWithTime) {
		const timeAgoString = formatTimeAgoEnglish(dateStringWithTime);
		element.textContent = timeAgoString;
	}
});

// INJECT LICENSE ARTICLE DYNAMICALLY - OTHER VARIABLE
const contentUrl = 'assets/txt/license.txt';
const targetElementId = 'license-content-container';
const licenseLayer = document.getElementById('license');
const galleryLayer = document.getElementById('mygallery');
const postsLayer = document.getElementById('myposts');

fetch(contentUrl)
	.then(response => {
		if (!response.ok) {
			throw new Error('failed to load: ' + response.statusText);
		}
		return response.text();
	})
	.then(textData => {
		const container = document.getElementById(targetElementId);
		if (container) {
			container.textContent = textData;
		}
	})
	.catch(error => {
		console.error('An error occurred while retrieving content:', error);
		document.getElementById(targetElementId).textContent = "failed to load license.";
	});

function showLayer(targetId) {
	const allLayers = [licenseLayer, galleryLayer, postsLayer];

	allLayers.forEach(layer => {
		layer.classList.remove('active');
	});

	document.getElementById(targetId).classList.add('active');
}

// Main JS (jQuery based navigation logic)
(function ($) {
	var $window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$newbut = $('#newbut'),
		$backtup = $('#backtup'),

		$main = $('#main'),
		$main_articles = $main.children('article');

	const isBreakpoint = (size) => {
		const queries = {
			xlarge: '(min-width: 1281px) and (max-width: 1680px)',
			large: '(min-width: 981px) and (max-width: 1280px)',
			medium: '(min-width: 737px) and (max-width: 980px)',
			small: '(min-width: 481px) and (max-width: 736px)',
			xsmall: '(min-width: 361px) and (max-width: 480px)',
			xxsmall: '(max-width: 360px)'
		};
		return window.matchMedia(queries[size]).matches;
	};

	$window.on('load', function () {
		if (window.location.hash) {
			history.replaceState(null, null, window.location.pathname);
		}

		window.setTimeout(function () {
			$body.removeClass('is-preload');
		}, 100);
	});

	var $nav = $header.children('nav'),
		$nav_li = $nav.find('li');
	if ($nav_li.length % 2 == 0) {
		$nav.addClass('use-middle');
		$nav_li.eq(($nav_li.length / 2)).addClass('is-middle');
	}

	var delay = 325,
		locked = false;

	$main._show = function (id, initial) {
		var $article = $main_articles.filter('#' + id);
		if ($article.length == 0)
			return;

		if (locked || (typeof initial != 'undefined' && initial === true)) {
			$body.addClass('is-switching');
			$body.addClass('is-article-visible');
			$main_articles.removeClass('active');
			$header.hide();
			$footer.show();
			$newbut.hide();

			$main.show();
			$article.show();
			$article.addClass('active');
			locked = false;
			setTimeout(function () {
				$body.removeClass('is-switching');
			}, (initial ? 1000 : 0));

			return;
		}
		locked = true;

		if ($body.hasClass('is-article-visible')) {
			var $currentArticle = $main_articles.filter('.active');
			$currentArticle.removeClass('active');

			setTimeout(function () {
				$currentArticle.hide();
				$article.show();

				setTimeout(function () {

					$article.addClass('active');

					$window
						.scrollTop(0)
						.triggerHandler('resize.flexbox-fix');

					setTimeout(function () {
						locked = false;
					}, delay);
				}, 25);
			}, delay);

		}
		else {
			$body
				.addClass('is-article-visible');

			setTimeout(function () {
				$header.hide();
				$footer.show();
				$newbut.hide();
				$main.show();
				$article.show();
				setTimeout(function () {
					$article.addClass('active');
					$window
						.scrollTop(0)
						.triggerHandler('resize.flexbox-fix');

					setTimeout(function () {
						locked = false;
					}, delay);
				}, 25);
			}, delay);
		}
	};

	$main._hide = function (addState) {
		var $article = $main_articles.filter('.active');
		if (!$body.hasClass('is-article-visible'))
			return;

		if (typeof addState != 'undefined'
			&& addState === true)
			history.pushState(null, null, '#');

		if (locked) {
			$body.addClass('is-switching');
			$article.removeClass('active');
			$article.hide();
			$main.hide();
			$footer.show();
			$newbut.show();
			// $backtup.hide();
			// $header.show();
			$body.removeClass('is-article-visible');
			locked = false;
			$body.removeClass('is-switching');
			$window
				.scrollTop(0)
				.triggerHandler('resize.flexbox-fix');

			return;
		}

		locked = true;
		$article.removeClass('active');
		setTimeout(function () {
			$article.hide();
			$main.hide();
			$footer.show();
			$newbut.show();
			// $backtup.hide();

			$header.show();
			setTimeout(function () {
				$body.removeClass('is-article-visible');
				$window
					.scrollTop(0)
					.triggerHandler('resize.flexbox-fix');
				setTimeout(function () {
					locked = false;
				}, delay);
			}, 25);
		}, delay);
	};

	$main_articles.each(function () {
		var $this = $(this);
		var articleId = $this.attr('id');

		$this.on('click', function (event) {
			event.stopPropagation();
		});

		var currentId = $this.attr('id');
		const noCloseIds = ['myshop', 'myjourney', 'myposts'];

		if (!noCloseIds.includes(currentId)) {
			$('<div class="close"></div>')
				.appendTo($this)
				.on('click', function (e) {
					e.preventDefault();
					e.stopPropagation();

					if (noCloseIds.includes(currentId)) {
						location.hash = '';
					} else if (currentId === 'mymusic' || currentId === 'license' || currentId === 'mygallery') {
						history.back();
					} else {
						const infoBoxElement = document.querySelector('.info-box');
						if (infoBoxElement) infoBoxElement.remove();
						history.back();
					}
				});
		}
	});

	$window.on('hashchange', function (event) {
		var hash = location.hash.substring(1);

		if (hash === '' || hash === '#' || hash === 'home') {
			event.preventDefault();
			event.stopPropagation();
			$main._hide();

			document.querySelectorAll('.glass-bar__p').forEach(el => el.classList.remove('active'));
			const homeBtn = document.querySelector('.glass-bar__p[data-section="home"]');
			if (homeBtn) homeBtn.classList.add('active');

			document.querySelectorAll('.homepage, .start-page').forEach(el => {
				el.style.display = 'none';
			});
		}
		else if ($main_articles.filter('#' + hash).length > 0) {
			event.preventDefault();
			event.stopPropagation();
			$main._show(hash);
		}
	});

	if ('scrollRestoration' in history)
		history.scrollRestoration = 'manual';

	if (window.location.hash) {
		history.replaceState(null, null, window.location.pathname + window.location.search);
	}

	$main.hide();
	$main_articles.hide();
	// $backtup.hide();

	if (location.hash != ''
		&& location.hash != '#')
		$window.on('load', function () {
			$main._show(location.hash.substr(1), true);
		});
})(jQuery);

const handleResponsive = () => {
	if (window.matchMedia('(max-width: 736px)').matches) {
		// Logika untuk layar 'small' ke bawah
		console.log("Mode Mobile Aktif");
	} else {
		// Logika untuk layar lebar
		console.log("Mode Desktop Aktif");
	}
};

// Jalankan saat pertama kali load dan saat layar di-resize
window.addEventListener('resize', handleResponsive);
handleResponsive();

document.getElementById('home-btn').addEventListener('click', function (e) {
	e.preventDefault();
	window.location.hash = '';
});

// Ganti blok breakpoints lama dengan ini
const settings = {
	// Anda bisa mengatur delay berbeda untuk mobile jika mau
	delay: window.matchMedia('(max-width: 736px)').matches ? 250 : 325
};

// Listener jika ingin delay berubah saat browser ditarik
window.addEventListener('resize', () => {
	settings.delay = window.matchMedia('(max-width: 736px)').matches ? 250 : 325;
});

function updateActiveNav(currentId) {
	document.querySelectorAll('.glass-bar__p').forEach(el => {
		el.classList.remove('active');
	});

	const activeButton = document.querySelector(`.glass-bar__p[data-section="${currentId}"]`);
	if (activeButton) {
		activeButton.classList.add('active');
	}
}

document.addEventListener("DOMContentLoaded", function () {
	function updateNavHighlight() {
		let currentId = window.location.hash.substring(1);
		if (!currentId) currentId = "";
		document.querySelectorAll('.glass-bar__p').forEach(el => {
			el.classList.remove('active');
		});

		const activeBtn = document.querySelector(`.glass-bar__p[data-section="${currentId}"]`);
		if (activeBtn) {
			activeBtn.classList.add('active');
		}

		const elementsToHide = document.querySelectorAll('.homepage');
		if (currentId == "") {
			elementsToHide.forEach(el => {
				el.style.display = "block";
			});
		} else {
			elementsToHide.forEach(el => {
				el.style.display = "none";
			});
		}
	}

	updateNavHighlight();

	window.addEventListener('hashchange', updateNavHighlight);
});


$(function () {
	if (window.location.hash) {
		history.replaceState(null, null, window.location.pathname + window.location.search);
	}
});

// MUSIC PLAYER JS (START OF COMPONENT DEFINITIONS)
let songIndex = 0;
let isLocked = false;
let songsLength = null;
let selectedSong = null;
let loadingProgress = 0;
let isPlayed = false;
let progress_elmnt = null;
let songName_elmnt = null;
let sliderImgs_elmnt = null;
let singerName_elmnt = null;
let progressBar_elmnt = null;
let playlistSongs_elmnt = [];
let loadingProgress_elmnt = null;
let musicPlayerInfo_elmnt = null;
let progressBarIsUpdating = false;
let broadcastGuarantor_elmnt = null;
const root = querySelector("#root");
const PLAYLIST_SVG_ICON = `
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6H14M20 10H14M20 14H12M20 18H4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
    <path d="M8 12C8 13.1046 7.10457 14 6 14C4.89543 14 4 13.1046 4 12C4 10.8954 4.89543 10 6 10C7.10457 10 8 10.8954 8 12ZM8 12V7M8 7H10V6H8V7Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
</svg>
`;

function App({ songs }) {
	function handleChangeMusic({ isPrev = false, playListIndex = null }) {
		if (isLocked || songIndex === playListIndex) return;

		if (playListIndex || playListIndex === 0) {
			songIndex = playListIndex;
		} else {
			songIndex = isPrev ? songIndex -= 1 : songIndex += 1;
		}

		if (songIndex < 0) {
			songIndex = 0;
			return;
		} else if (songIndex > songsLength) {
			songIndex = songsLength;
			return;
		}

		selectedSong.pause();
		selectedSong.currentTime = 0;
		progressBarIsUpdating = false;
		selectedSong = playlistSongs_elmnt[songIndex];

		if (selectedSong.paused && isPlayed) selectedSong.play(); else
			selectedSong.pause();

		setBodyBg(songs[songIndex].bg);
		setProperty(sliderImgs_elmnt, "--index", -songIndex);

		updateInfo(songName_elmnt, songs[songIndex].songName);

		updateInfo(singerName_elmnt, songs[songIndex].artist);

		if (isPlayed) {
			broadcastGuarantor_elmnt.classList.add("click");
		} else {
			broadcastGuarantor_elmnt.classList.remove("click");
		}
	}

	setBodyBg(songs[0].bg);

	return (
		dom("div", { class: "music-player flex-column" },
			dom(Slider, { slides: songs, handleChangeMusic: handleChangeMusic }),
			dom(Playlist, { list: songs, handleChangeMusic: handleChangeMusic })));

}

document.addEventListener('DOMContentLoaded', checkNewPostsAndStyleRibbon);

function Slider({ slides, handleChangeMusic }) {
	function handleResizeSlider({ target }) {
		if (isLocked) {
			return;
		} else if (target.classList.contains("music-player__info")) {
			this.classList.add("resize");
			setProperty(this, "--controls-animate", "down running");
			return;
		} else if (target.classList.contains("music-player__playlist-button")) {
			this.classList.remove("resize");
			setProperty(this, "--controls-animate", "up running");
			return;
		}
	}
	function handlePlayMusic() {
		if (selectedSong.currentTime === selectedSong.duration) {
			handleChangeMusic({});
		}

		this.classList.toggle("click");
		isPlayed = !isPlayed;
		selectedSong.paused ? selectedSong.play() : selectedSong.pause();
	}

	return (
		dom("div", { class: "slider center", onClick: handleResizeSlider },
			dom("div", { class: "slider__content center" },
				dom("button", { class: "music-player__playlist-button center button" },
					dom("button", {
						class: "music-player__playlist-button center button",
						ref: "playlistButton",
					},
						dom("img", {
							class: "music-player__playlist-button center button",
							style: { width: "inherit" },
							src: "images/property/playlist.png",
						})
					)),

				dom("button", {
					onClick: handlePlayMusic,
					class: "music-player__broadcast-guarantor center button"
				},
					dom("i", { class: "icon-play" },
						dom("img", {
							class: "music-player__broadcast-guarantor center button",
							style: { position: "static", width: "90%", height: "90%" },
							src: "images/property/play.png",
						})
					),

					dom("i", { class: "icon-pause" },
						dom("img", {
							class: "music-player__broadcast-guarantor center button",
							style: { position: "static", width: "90%", height: "90%" },
							src: "images/property/pause.png",
						})

					)),

				dom("div", { class: "slider__imgs flex-row" },
					slides.map(({ songName, files: { cover } }) =>
						dom("img", { src: cover, class: "img", alt: songName })))),



			dom("div", { class: "slider__controls center" },
				dom("button", {
					class: "slider__switch-button flex-row button",
					onClick: () => handleChangeMusic({ isPrev: true })
				},

					dom("i", { class: "icon-back" },
						dom("img", {
							class: "icon-back",
							style: { position: "static", width: "50%" },
							src: "images/property/previous.png",
						})
					)),


				dom("div", { class: "music-player__info text_trsf-cap" },
					dom("div", { class: "music-player__singer-name" },
						dom("span", null, slides[0].artist)),

					dom("div", { class: "music-player__subtitle" },
						dom("span", null, slides[0].songName))),


				dom("button", {
					class: "slider__switch-button flex-row button",
					onClick: () => handleChangeMusic({ isPrev: false })
				},

					dom("i", { class: "icon-next" },
						dom("img", {
							class: "icon-next",
							style: { position: "static", width: "50%" },
							src: "images/property/next.png",
						})
					)),

				dom("div", {
					class: "progress center",
					onPointerdown: e => {
						handleScrub(e);
						progressBarIsUpdating = true;
					}
				},

					dom("div", { class: "progress__wrapper" },
						dom("div", { class: "progress__bar center" }))))));

}

function Playlist({ list, handleChangeMusic }) {
	function loadedAudio() {
		const duration = this.duration;
		const target = this.parentElement.querySelector(
			".music-player__song-duration");


		let min = parseInt(duration / 60);
		if (min < 10) min = "0" + min;

		let sec = parseInt(duration % 60);
		if (sec < 10) sec = "0" + sec;

		target.appendChild(document.createTextNode(`${min}:${sec}`));
	}

	function updateTheProgressBar() {
		const duration = this.duration;
		const currentTime = this.currentTime;

		const progressBarWidth = currentTime / duration * 100;
		setProperty(progressBar_elmnt, "--width", `${progressBarWidth}%`);

		if (isPlayed && currentTime === duration && songIndex < songsLength) {
			handleChangeMusic({});
		}

		if (
			songIndex === songsLength &&
			this === selectedSong &&
			currentTime === duration
		) {
			isPlayed = false;
			broadcastGuarantor_elmnt.classList.remove("click");
		}
	}

	return (
		dom("ul", { class: "music-player__playlist list" },
			list.map(({ songName, artist, files: { cover, song } }, index) => {
				return (
					dom("li", {
						class: "music-player__song",
						onClick: () =>
							handleChangeMusic({ isPrev: false, playListIndex: index })
					},

						dom("div", { class: "flex-row _align_center" },
							dom("img", { src: cover, class: "img music-player__song-img" }),
							dom("div", { class: "music-player__playlist-info  text_trsf-cap" },
								dom("b", { class: "text_overflow" },
									songName ? songName : "Unknown Title"
								), dom("div", { class: "flex-row _justify_space-btwn" },
									dom("span", { class: "music-player__subtitle" }, artist),
									dom("span", { class: "music-player__song-duration" })))),

						dom("audio", {
							src: song,
							onLoadeddata: loadedAudio,
							onTimeupdate: updateTheProgressBar
						})));
			})));
}

function dom(tag, props, ...children) {
	if (typeof tag === "function") return tag(props, ...children);

	function addChild(parent, child) {
		if (Array.isArray(child)) {
			child.forEach(nestedChild => addChild(parent, nestedChild));
		} else {
			parent.appendChild(
				child.nodeType ? child : document.createTextNode(child.toString()));

		}
	}

	const element = document.createElement(tag);

	Object.entries(props || {}).forEach(([name, value]) => {
		if (name.startsWith("on") && name.toLowerCase() in window) {
			element[name.toLowerCase()] = value;
		} else if (name === "style") {
			Object.entries(value).forEach(([styleProp, styleValue]) => {
				element.style[styleProp] = styleValue;
			});
		} else {
			element.setAttribute(name, value.toString());
		}
	});

	children.forEach(child => {
		addChild(element, child);
	});

	return element;
}

// MUSIC PLAYER HELPER FUNCTIONS
function controlSubtitleAnimation(parent, child) {
	if (child.classList.contains("animate")) return;

	const element = child.firstChild;

	if (child.clientWidth > parent.clientWidth) {
		child.appendChild(element.cloneNode(true));
		child.classList.add("animate");
	}

}
function handleResize() {
	const vH = window.innerHeight * 0;
	setProperty(document.documentElement, "--vH", `${vH}px`);
}
function querySelector(target) {
	return document.querySelector(target);
}
function querySelectorAll(target) {
	return document.querySelectorAll(target);
}
function setProperty(target, prop, value = "") {
	target.style.setProperty(prop, value);
}
function setBodyBg(color) {
	setProperty(document.body, "--body-bg", color);
}
function updateInfo(target, value) {
	while (target.firstChild) {
		target.removeChild(target.firstChild);
	}

	const targetChild_elmnt = document.createElement("span");
	targetChild_elmnt.appendChild(document.createTextNode(value));
	target.appendChild(targetChild_elmnt);
	target.classList.remove("animate");
	controlSubtitleAnimation(musicPlayerInfo_elmnt, target);
}
function handleScrub(e) {
	const progressOffsetLeft = progress_elmnt.getBoundingClientRect().left;
	const progressWidth = progress_elmnt.offsetWidth;
	const duration = selectedSong.duration;
	const currentTime = (e.clientX - progressOffsetLeft) / progressWidth;
	selectedSong.currentTime = currentTime * duration;
}
// END OF MUSIC PLAYER HELPER FUNCTIONS
// NEW ASYNC FUNCTIONS FOR DATA LOADING AND INITIALIZATION
/**
 * @returns {Promise<Array<Object>|null>} Array object if done, or null if failed.
 */
async function loadMusicData() {
	const MUSIC_DATA_URL = 'assets/txt/music.txt';

	try {
		const response = await fetch(MUSIC_DATA_URL);

		if (!response.ok) {
			throw new Error(`Failed to load music file: ${response.status}`);
		}

		const rawText = await response.text();
		const songs = JSON.parse(rawText);

		if (!songs || !Array.isArray(songs) || songs.length === 0) {
			console.warn("Song data is loaded but is empty or not an array.");
			return null;
		}
		return songs;

	} catch (error) {
		console.error('An error occurred while loading or parsing music data.:', error);
		return null;
	}
}

/**
 * @param {Array<Object>} data - Array data of songs.
 */
function initializeMusicPlayer(data) {
	root.appendChild(dom(App, { songs: data }));

	songsLength = data.length - 1;
	progress_elmnt = querySelector(".progress");
	playlistSongs_elmnt = querySelectorAll("audio");
	sliderImgs_elmnt = querySelector(".slider__imgs");
	songName_elmnt = querySelector(".music-player__subtitle");
	musicPlayerInfo_elmnt = querySelector(".music-player__info");
	singerName_elmnt = querySelector(".music-player__singer-name");
	selectedSong = playlistSongs_elmnt[songIndex];
	progressBar_elmnt = querySelector(".progress__bar");
	broadcastGuarantor_elmnt = querySelector(".music-player__broadcast-guarantor");

	controlSubtitleAnimation(musicPlayerInfo_elmnt, songName_elmnt);
	controlSubtitleAnimation(musicPlayerInfo_elmnt, singerName_elmnt);

	window.addEventListener("resize", handleResize);
	window.addEventListener("orientationchange", handleResize);
	window.addEventListener("transitionstart", ({ target }) => {
		if (target === sliderImgs_elmnt) {
			isLocked = true;
			setProperty(sliderImgs_elmnt, "will-change", "transform");
		}
	});
	window.addEventListener("transitionend", ({ target, propertyName }) => {
		if (target === sliderImgs_elmnt) {
			isLocked = false;
			setProperty(sliderImgs_elmnt, "will-change", "auto");
		}
	});
	window.addEventListener("pointerup", () => {
		if (progressBarIsUpdating) {
			selectedSong.muted = false;
			progressBarIsUpdating = false;
		}
	});
	window.addEventListener("pointermove", e => {
		if (progressBarIsUpdating) {
			handleScrub(e, this);
			selectedSong.muted = true;
		}
	});

	handleResize();
}
// MAIN ENTRY POINT FOR MUSIC PLAYER
handleResize();

let GLOBAL_POST_DATA = null;
const POST_BASE_URL = 'assets/txt/mypost/';

async function discoverAllPostIds() {
	const MAX_POST_ID = 100;
	const possibleIds = Array.from({ length: MAX_POST_ID }, (_, i) => i + 1);

	const promises = possibleIds.map(id =>
		fetch(`${POST_BASE_URL}post_${id}.json`, { method: 'HEAD' })
			.then(res => res.ok ? id : null)
			.catch(() => null)
	);

	const results = await Promise.all(promises);
	return results.filter(id => id !== null);
}

async function getPostDataById(postId) {
	if (GLOBAL_POST_DATA !== null) {
		return GLOBAL_POST_DATA.find(post => post.id === postId);
	}

	try {
		const response = await fetch(`${POST_BASE_URL}post_${postId}.json`);
		if (!response.ok) return undefined;
		return await response.json();
	} catch (error) {
		console.error(`Failed to load post ${postId}:`, error);
		return undefined;
	}
}

async function loadAllPosts() {
	if (GLOBAL_POST_DATA !== null) return GLOBAL_POST_DATA;

	const postIds = await discoverAllPostIds();
	if (postIds.length === 0) {
		GLOBAL_POST_DATA = [];
		return [];
	}

	const promises = postIds.map(id =>
		fetch(`${POST_BASE_URL}post_${id}.json`)
			.then(res => res.ok ? res.json() : null)
			.catch(() => null)
	);

	const posts = await Promise.all(promises);
	GLOBAL_POST_DATA = posts.filter(p => p !== null);

	GLOBAL_POST_DATA.sort((a, b) => {
		const cleanA = a.waktu.replace('(', ' ').replace(',', ':').replace(')', '');
		const cleanB = b.waktu.replace('(', ' ').replace(',', ':').replace(')', '');
		return new Date(cleanB) - new Date(cleanA);
	});

	return GLOBAL_POST_DATA;
}

async function loadAllCardPosts() {
	const posts = await loadAllPosts();
	const container = document.getElementById('mypostsnya_konten-kon');
	if (!container) return;

	let htmlContent = '';

	posts.forEach(post => {
		const cardHtml = `
            <div class="cardpost" onclick="reloadpost(${post.id})">
                <span class="ribbon-post">NEW</span>
                <h3 class="cardpost__title">${post.judul}</h3>
                <div class="cardpost__time">
                    <svg style="display:block;position:absolute;align-self:center;left:10px;" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    <div style="padding-left: 1.3rem;">${hitungEstimasiBaca(post.isi_html).estimasiMenit}</div>
                </div>
                <div class="cardpost__description" data-time="${post.waktu}">
                    <svg style="display:block;position:absolute;align-self:center;left:10px;" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
                    <div style="padding-left: 1.3rem;">${formatTimeAgoEnglish(post.waktu)}</div>
                </div>
                <img class="image_post" src="${post.image}">
            </div>
        `;
		htmlContent += cardHtml;
	});

	container.innerHTML = htmlContent;
	checkLocalRibbons();
	checkNewPostsAndStyleRibbon();
}

async function reloadpost(postId) {
	document.location.href = "#mypost_read";
	const elemenInduk = document.getElementById('mypost_read');
	const postLama = elemenInduk.querySelector('.info-box');
	if (postLama) postLama.remove();

	const postDetail = await getPostDataById(postId);
	if (!postDetail) {
		const errorEl = document.createElement('div');
		errorEl.className = 'info-box';
		errorEl.innerHTML = '<p style="color: red; text-align: center;">Post tidak ditemukan atau gagal dimuat.</p>';
		elemenInduk.prepend(errorEl);
		return;
	}

	const elemenBaru = document.createElement('div');
	elemenBaru.className = 'info-box';
	elemenBaru.innerHTML = `
        <div class="post-full-container">
            <h1 class="post-judul">${postDetail.judul}</h1>      
            <div class="container-post-page">
                <img class="icon-post-page" src="${postDetail.image}">
                <p style="align-self: center; height: 100%; border-right: 2px solid #ffffff15;"></p>
                <p translate="no">Satria Bagus</p>
                <p style="align-self: center; height: 4px; border-radius: 100%; border-right: 4px solid #ffffff;"></p>
                <p class="post-date">${formatDateToShortMonth(postDetail.waktu)}</p>
            </div>
            <div class="post-body">
                ${postDetail.isi_html}
            </div>
        </div>
    `;
	elemenInduk.prepend(elemenBaru);
}

async function checkRecentPosts() {
	await loadAllPosts();
	const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);

	if (!GLOBAL_POST_DATA || GLOBAL_POST_DATA.length === 0) {
		console.log("No post data!");
		return;
	}

	const hasRecent = GLOBAL_POST_DATA.some(post => {
		const cleaned = post.waktu.replace('(', ' ').replace(',', ':').replace(')', '');
		const postTime = new Date(cleaned).getTime();
		return postTime > threeDaysAgo;
	});

	console.log(hasRecent ? 'Exist' : 'No posts in the last 3 days!');
}

document.addEventListener("DOMContentLoaded", () => {
	loadAllCardPosts();
	checkRecentPosts();
});


(async function () {
	const loadedSongs = await loadMusicData();

	if (loadedSongs) {
		initializeMusicPlayer(loadedSongs);
	} else {
		if (root) {
			root.innerHTML = '<div style="padding: 20px; text-align: center; color: red;">Failed to load music player data from music.txt.</div>';
		}
	}
})();

/**
 * @param {string} dateString - String date format "MM/DD/YYYY(H,M)".
 * @returns {string} String date format "MMM DD, YYYY" (example: "Dec 05, 2025").
 */
function formatDateToShortMonth(dateString) {
	if (!dateString) return 'Invalid Date';
	let cleanedString = dateString
		.replace('(', ' ')
		.replace(',', ':')
		.replace(')', '');

	const dateObject = new Date(cleanedString);
	if (isNaN(dateObject.getTime())) {
		return 'Incorrect Date Format';
	}
	const options = {
		year: 'numeric',
		month: 'short',
		day: '2-digit'
	};
	const formattedDate = dateObject.toLocaleDateString('en-US', options);
	const month = dateObject.toLocaleDateString('en-US', { month: 'short' });
	const day = dateObject.toLocaleDateString('en-US', { day: '2-digit' });
	const year = dateObject.toLocaleDateString('en-US', { year: 'numeric' });
	return `${month} ${day}, ${year}`;
}

function hitungEstimasiBaca(text) {
	const teks = text || "";
	const jumlahKata = teks.trim().split(/\s+/).filter(word => word.length > 0).length;
	const jumlahGambar = (text.match(/<img[^>]*>/g) || []).length;
	const WPM = 200;
	const detikPerGambar = 30;
	const detikTeks = (jumlahKata / WPM) * 60;
	const detikGambar = jumlahGambar * detikPerGambar;
	const totalDetik = detikTeks + detikGambar;
	const totalMenit = Math.ceil(totalDetik / 60);

	return {
		totalKata: jumlahKata,
		totalGambar: jumlahGambar,
		estimasiMenit: totalMenit + " min read",
		detail: `${totalMenit} min read (${jumlahKata} word, ${jumlahGambar} image)`
	};

}

//  GLASS PILL BAR NAVIGATION JS 
const pill = document.getElementById('pill');
const items = document.querySelectorAll('.glass-bar__p');
let activeItem = null;

window.onload = () => {
	const currentHash = window.location.hash.substring(1) || 'home';
	const initialItem = document.querySelector(`.glass-bar__p[data-section="${currentHash}"]`) || items[0];

	if (initialItem) {
		selectItem(initialItem);
	}
};

function movePill(element) {
	if (!element) return;

	pill.style.width = `${element.offsetWidth}px`;
	pill.style.left = `${element.offsetLeft}px`;

	if (element !== activeItem) {
		pill.classList.remove('clicked');
	} else {
		pill.classList.add('clicked');
	}
}

function selectItem(element) {
	if (!element) return;

	const target = element.getAttribute('alt') || element.getAttribute('data-section');

	window.location.hash = (target === 'home') ? '' : target;

	items.forEach(item => item.classList.remove('active'));
	element.classList.add('active');
	activeItem = element;

	pill.classList.add('clicked');

	pill.style.width = `${element.offsetWidth}px`;
	pill.style.left = `${element.offsetLeft}px`;

	let checks = 0;
	const checkInterval = setInterval(() => {
		applyTranslation();
		checks++;
		if (checks > 3) clearInterval(checkInterval);
	}, 60);
}

document.getElementById('glass-bar').onmouseleave = () => {
	if (activeItem) {
		pill.classList.add('clicked');
		pill.style.width = `${activeItem.offsetWidth}px`;
		pill.style.left = `${activeItem.offsetLeft}px`;
	}
};

// GALLERY JS
/*!
 * gallery.js v26.01.07
 * javascript file for Sateula template
 * 
 * @license Copyright 2025, Sateula. All rights reserved.
 * Subject to the terms at sateula standard-license.
 * @author: xdarkshan, sateula
 */


document.addEventListener("DOMContentLoaded", () => {
	const noResultsMessage = document.getElementById("noResultsMessage");
	const gallery = document.querySelector(".gallery");
	const lightbox = document.querySelector(".lightbox");
	const lightboxBackground = document.getElementById('lightbox-background');
	const lightboxImg = lightbox.querySelector("img");
	const lightboxInfo = lightbox.querySelector(".lightbox-info");
	const closeBtn = lightbox.querySelector(".lightboxclose");
	const prevBtn = lightbox.querySelector(".lightboxprev");
	const nextBtn = lightbox.querySelector(".lightboxnext");
	const zoomInBtn = lightbox.querySelector(".lightbox-zoom-in");
	const zoomOutBtn = lightbox.querySelector(".lightbox-zoom-out");
	const fullscreenBtn = lightbox.querySelector(".lightbox-fullscreen");
	const searchInput = document.getElementById("search");
	const glassbar = document.querySelector(".glass-bar");
	const instruction = document.querySelectorAll(".instruction");
	const lapisan = document.getElementById("lapisan");
	const sateulalicense = document.getElementById("sateulalicence-main");

	let currentImageIndex = 0;
	let sessioninstruction = 0;
	let allImages = [];
	let filteredImages = [];

	let scale = 1;
	let rotation = 0;
	let isDragging = false;
	let startX, startY, translateX = 0, translateY = 0;
	let animationFrameId = null;

	async function initGallery() {
		try {
			const username = "01satria";
			const repo = "me";
			const path = "images/gallery";

			const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${path}`;
			const response = await fetch(apiUrl);
			if (!response.ok) throw new Error("Failed to access GitHub API");

			const files = await response.json();
			allImages = [];

			const imageFiles = files.filter(file =>
				file.name.match(/\.(jpe?g|png|gif|webp)$/i)
			);

			imageFiles.forEach((file) => {
				const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
				allImages.push({
					src: file.download_url,
					alt: cleanName
				});
			});

			renderGallery(allImages);
		} catch (error) {
			console.error('Error:', error);
			gallery.innerHTML = '<p style="color:white; text-align:center;">Failed to load images.</p>';
		}
	}

	function renderGallery(targetList) {
		gallery.innerHTML = '';
		filteredImages = targetList;
		const fragment = document.createDocumentFragment();

		targetList.forEach((data, index) => {
			const item = document.createElement('div');
			item.className = 'gallery-item';
			item.innerHTML = `
                <div class="gallery-item-inner">
                    <img src="${data.src}" alt="${data.alt}" loading="lazy">
                    <h3 class="caption">${data.alt}</h3>
                </div>
            `;
			item.addEventListener("click", () => openLightbox(index));
			fragment.appendChild(item);
		});

		gallery.appendChild(fragment);
	}

	function filterGallery() {
		const searchTerm = searchInput.value.toLowerCase();

		const matches = allImages.filter(img =>
			img.alt.toLowerCase().includes(searchTerm)
		);

		if (noResultsMessage) {
			noResultsMessage.style.display = (matches.length === 0) ? "block" : "none";
		}

		renderGallery(matches);
	}

	function openLightbox(index) {
		if (!filteredImages[index]) return;
		currentImageIndex = index;
		updateLightboxImage();
		lightbox.classList.add("active");
		document.body.style.overflow = "hidden";
		if (glassbar) glassbar.style.display = "none";
		if (sateulalicense) sateulalicense.style.display = "none";
		if (backtup) backtup.style.display = "none";
		if (sessioninstruction === 0) {
			instruction.forEach(instruc => {
				instruc.style.display = "block";
			});
			lapisan.style.display = "block";
			const timernya = setTimeout(() => {
				if (instruction && lapisan) instruction.forEach(instruc => {
					instruc.style.transition = 'opacity 0.5s ease';
					lapisan.style.transition = 'opacity 0.5s ease';
					instruc.style.opacity = '0';
					lapisan.style.opacity = '0';
					setTimeout(() => {
						if (instruc.parentNode && lapisan.parentNode) {
							instruction.forEach(instruc => {
								instruc.remove();
							});
							lapisan.remove();
						}
					}, 500);
				});
				sessioninstruction = 1;
			}, 6000);
		} else {
			instruction.forEach(instruc => {
				instruc.style.display = "none";
			});
			lapisan.style.display = "none";
		}
		resetZoom();
	}

	function updateLightboxImage() {
		const image = filteredImages[currentImageIndex];
		if (!image) return;

		lightboxImg.src = image.src;
		if (lightboxBackground) {
			lightboxBackground.style.backgroundImage = `url('${image.src}')`;
		}

		const infoSpan = lightboxInfo.querySelector(".image-caption");
		if (infoSpan) infoSpan.textContent = image.alt;

		resetZoom();
	}

	// Navigation Controls
	function nextImage() {
		if (filteredImages.length <= 1) return;
		currentImageIndex = (currentImageIndex + 1) % filteredImages.length;
		updateLightboxImage();
	}

	function prevImage() {
		if (filteredImages.length <= 1) return;
		currentImageIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
		updateLightboxImage();
	}

	function closeLightbox() {
		lightbox.classList.remove("active");
		document.exitFullscreen();
		if (glassbar) glassbar.style.display = "grid";
		if (sateulalicense) sateulalicense.style.display = "flex";
		if (backtup) backtup.style.display = "block";
		document.body.style.overflow = "";
		resetZoom();
	}

	function updateTransform() {
		lightboxImg.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px) rotate(${rotation}deg)`;
		animationFrameId = null;
	}

	function resetZoom() {
		scale = 1; rotation = 0; translateX = 0; translateY = 0;
		updateTransform();
	}

	if (searchInput) searchInput.addEventListener("input", filterGallery);

	closeBtn.addEventListener("click", closeLightbox);
	nextBtn.addEventListener("click", nextImage);
	prevBtn.addEventListener("click", prevImage);

	zoomInBtn.addEventListener("click", () => {
		scale = Math.min(scale + 0.25, 3); updateTransform();
		if (scale > 1) {
			closeBtn.style.display = "none";
			prevBtn.style.display = "none";
			nextBtn.style.display = "none";
			lightboxInfo.style.display = "none";
		}
	});
	zoomOutBtn.addEventListener("click", () => {
		scale = Math.max(scale - 1, 1);
		if (scale === 1) {
			translateX = 0; translateY = 0;
			closeBtn.style.display = "block";
			prevBtn.style.display = "block";
			nextBtn.style.display = "block";
			lightboxInfo.style.display = "block";
		}
		updateTransform();
	});

	fullscreenBtn.addEventListener("click", () => {
		if (!document.fullscreenElement) lightbox.requestFullscreen();
		else document.exitFullscreen();
	});

	// Support Drag & Keyboard
	lightboxImg.addEventListener("mousedown", (e) => {
		if (scale <= 1) return;
		isDragging = true;
		startX = e.clientX; startY = e.clientY;
		e.preventDefault();
	});

	window.addEventListener("mousemove", (e) => {
		if (!isDragging) return;
		translateX += (e.clientX - startX) / scale;
		translateY += (e.clientY - startY) / scale;
		startX = e.clientX; startY = e.clientY;
		if (!animationFrameId) animationFrameId = requestAnimationFrame(updateTransform);
	});

	window.addEventListener("mouseup", () => isDragging = false);

	lightboxImg.addEventListener("touchstart", (e) => {
		if (scale <= 1) return;
		isDragging = true;

		startX = e.touches[0].clientX;
		startY = e.touches[0].clientY;

		e.preventDefault();
	}, { passive: false });

	window.addEventListener("touchmove", (e) => {
		if (!isDragging || scale <= 1) return;

		const touch = e.touches[0];
		const deltaX = (touch.clientX - startX) / scale;
		const deltaY = (touch.clientY - startY) / scale;

		translateX += deltaX;
		translateY += deltaY;

		startX = touch.clientX;
		startY = touch.clientY;

		if (!animationFrameId) {
			animationFrameId = requestAnimationFrame(updateTransform);
		}

		e.preventDefault();
	}, { passive: false });

	window.addEventListener("touchend", () => {
		isDragging = false;
	});

	document.addEventListener("keydown", (e) => {
		if (!lightbox.classList.contains("active")) return;
		if (e.key === "Escape") closeLightbox();
		if (e.key === "ArrowRight") nextImage();
		if (e.key === "ArrowLeft") prevImage();
	});

	initGallery();
});