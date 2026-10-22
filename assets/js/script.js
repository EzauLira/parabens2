document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.querySelector(".carousel");
    const track = document.querySelector(".carousel-container");
    const images = Array.from(track.querySelectorAll("img"));
    const dotsContainer = document.querySelector(".carousel-dots");
    const count = document.querySelector(".photo-count");
    const previousButton = document.querySelector(".previous");
    const nextButton = document.querySelector(".next");
    let index = 0;
    let autoSlide;
    let touchStartX = 0;

    // Mantém a data original informada no projeto: 27 de julho de 2026.
    const dataInicial = new Date(2026, 6, 27, 0, 0, 0);

    function atualizarContador() {
        const agora = new Date();
        let meses = (agora.getFullYear() - dataInicial.getFullYear()) * 12
            + agora.getMonth() - dataInicial.getMonth();
        let aniversarioMes = new Date(dataInicial.getFullYear(), dataInicial.getMonth() + meses, dataInicial.getDate());
        if (agora < aniversarioMes) {
            meses--;
            aniversarioMes = new Date(dataInicial.getFullYear(), dataInicial.getMonth() + meses, dataInicial.getDate());
        }
        const restante = agora.getTime() - aniversarioMes.getTime();
        const dias = Math.floor(restante / 86400000);
        const horas = Math.floor((restante % 86400000) / 3600000).toString().padStart(2, "0");
        const minutos = Math.floor((restante % 3600000) / 60000).toString().padStart(2, "0");
        const segundos = Math.floor((restante % 60000) / 1000).toString().padStart(2, "0");
        document.getElementById("contador").textContent = `${meses} ${meses === 1 ? "mês" : "meses"}, ${dias} ${dias === 1 ? "dia" : "dias"} · ${horas}:${minutos}:${segundos}`;
    }

    function renderDots() {
        images.forEach((_, dotIndex) => {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.setAttribute("aria-label", `Ir para a foto ${dotIndex + 1}`);
            dot.addEventListener("click", () => goTo(dotIndex, true));
            dotsContainer.appendChild(dot);
        });
    }

    function goTo(newIndex, resetTimer = false) {
        index = (newIndex + images.length) % images.length;
        track.style.transform = `translateX(-${index * 100}%)`;
        count.textContent = `${String(index + 1).padStart(2, "0")} / ${String(images.length).padStart(2, "0")}`;
        Array.from(dotsContainer.children).forEach((dot, dotIndex) => {
            if (dotIndex === index) dot.setAttribute("aria-current", "true");
            else dot.removeAttribute("aria-current");
        });
        if (resetTimer) restartAutoSlide();
    }

    function stopAutoSlide() {
        if (autoSlide) window.clearInterval(autoSlide);
        autoSlide = undefined;
    }
    function restartAutoSlide() {
        stopAutoSlide();
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            autoSlide = window.setInterval(() => goTo(index + 1), 4500);
        }
    }

    previousButton.addEventListener("click", () => goTo(index - 1, true));
    nextButton.addEventListener("click", () => goTo(index + 1, true));
    carousel.addEventListener("mouseenter", stopAutoSlide);
    carousel.addEventListener("mouseleave", restartAutoSlide);
    carousel.addEventListener("focusin", stopAutoSlide);
    carousel.addEventListener("focusout", restartAutoSlide);
    carousel.addEventListener("touchstart", event => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
    carousel.addEventListener("touchend", event => {
        const delta = event.changedTouches[0].clientX - touchStartX;
        if (Math.abs(delta) > 45) goTo(index + (delta < 0 ? 1 : -1), true);
    }, { passive: true });

    renderDots();
    goTo(0);
    restartAutoSlide();
    atualizarContador();
    window.setInterval(atualizarContador, 1000);

    // A reprodução automática é tentada, mas navegadores móveis podem bloqueá-la.
    const song = document.getElementById("our-song");
    const musicToggle = document.getElementById("music-toggle");
    const musicStatus = document.getElementById("music-status");

    function syncMusicControls() {
        const playing = !song.paused;
        musicToggle.textContent = playing ? "Ⅱ" : "▶";
        musicToggle.setAttribute("aria-label", playing ? "Pausar nossa música" : "Tocar nossa música");
        musicStatus.textContent = playing ? "Tocando agora" : "Toque para ouvir";
    }

    musicToggle.addEventListener("click", async () => {
        if (song.paused) {
            try { await song.play(); }
            catch (_) { musicStatus.textContent = "Não foi possível iniciar o áudio"; }
        } else {
            song.pause();
        }
        syncMusicControls();
    });
    song.addEventListener("play", syncMusicControls);
    song.addEventListener("pause", syncMusicControls);
    song.addEventListener("ended", syncMusicControls);
    song.addEventListener("error", () => { musicStatus.textContent = "Confira se o arquivo de música está disponível"; });
    const progress = document.getElementById("song-progress");
    const currentTime = document.getElementById("current-time");
    const duration = document.getElementById("duration");
    const volume = document.getElementById("song-volume");
    const formatTime = seconds => {
        if (!Number.isFinite(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
        return `${mins}:${secs}`;
    };
    song.volume = 0.8;
    volume.value = String(song.volume);
    song.addEventListener("loadedmetadata", () => {
        duration.textContent = formatTime(song.duration);
    });
    song.addEventListener("timeupdate", () => {
        currentTime.textContent = formatTime(song.currentTime);
        if (Number.isFinite(song.duration) && song.duration > 0) {
            progress.value = String((song.currentTime / song.duration) * 100);
        }
    });
    progress.addEventListener("input", () => {
        if (Number.isFinite(song.duration) && song.duration > 0) {
            song.currentTime = (Number(progress.value) / 100) * song.duration;
        }
    });
    volume.addEventListener("input", () => { song.volume = Number(volume.value); });
    song.play().then(syncMusicControls).catch(() => {
        musicStatus.textContent = "Toque para ouvir";
        syncMusicControls();
    });

    // Corações decorativos discretos; respeita a preferência por movimento reduzido.
    function createHeart() {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        if (document.querySelectorAll(".heart").length >= 10) return;
        const heart = document.createElement("span");
        heart.className = "heart";
        heart.textContent = "♥";
        heart.setAttribute("aria-hidden", "true");
        heart.style.left = `${Math.random() * 100}vw`;
        heart.style.fontSize = `${12 + Math.random() * 10}px`;
        heart.style.animationDuration = `${6 + Math.random() * 3}s`;
        document.body.appendChild(heart);
        window.setTimeout(() => heart.remove(), 9500);
    }
    window.setInterval(createHeart, 1200);
});
