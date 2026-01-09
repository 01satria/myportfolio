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