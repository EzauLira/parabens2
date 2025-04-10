document.addEventListener("DOMContentLoaded", function () {
    // Seleção do container do carrossel
    const container = document.querySelector(".carousel-container");
    const images = container.querySelectorAll("img");
    const totalImages = images.length;
    let index = 0;

    // Função para calcular a largura do carrossel dinamicamente
    function getCarouselWidth() {
        return document.querySelector(".carousel").offsetWidth;
    }

    // Função para trocar as imagens automaticamente
    function nextImage() {
        index = (index + 1) % totalImages; // Volta para a primeira imagem após a última
        container.style.transform = `translateX(${-index * getCarouselWidth()}px)`;
    }

    // Configurar a troca automática a cada 3 segundos
    let autoSlide = setInterval(nextImage, 3000);

    // Pausar a troca automática quando o mouse passa por cima
    container.addEventListener("mouseenter", () => clearInterval(autoSlide));

    // Retomar a troca automática quando o mouse sai
    container.addEventListener("mouseleave", () => autoSlide = setInterval(nextImage, 3000));

    // Atualização do contador de tempo
    function atualizarContador() {
        const dataInicial = new Date("2024-10-04T00:00:00");
        const agora = new Date();

        let anos = agora.getFullYear() - dataInicial.getFullYear();
        let meses = agora.getMonth() - dataInicial.getMonth() + anos * 12;
        let dias = agora.getDate() - dataInicial.getDate();

        if (dias < 0) {
            meses--;
            let ultimoDiaMesPassado = new Date(agora.getFullYear(), agora.getMonth(), 0).getDate();
            dias += ultimoDiaMesPassado;
        }

        let horas = agora.getHours().toString().padStart(2, '0');
        let minutos = agora.getMinutes().toString().padStart(2, '0');
        let segundos = agora.getSeconds().toString().padStart(2, '0');

        document.getElementById("contador").innerText = `${meses} meses, ${dias} dias - ${horas}:${minutos}:${segundos}`;
    }

    setInterval(atualizarContador, 1000);
    atualizarContador();

    // Exibição gradual das mensagens
    const messages = document.querySelectorAll(".message");
    let delay = 500;

    messages.forEach((msg, index) => {
        setTimeout(() => {
            msg.style.opacity = "1";
            msg.style.transform = "translateY(0)";
        }, delay * (index + 1));
    });

    // Função para criar corações animados
    function createHeart() {
        if (document.querySelectorAll(".heart").length > 30) return; // Limita o número de corações na tela
        const heart = document.createElement("div");
        heart.classList.add("heart");
        heart.textContent = "❤️";
        heart.style.left = Math.random() * 100 + "vw";
        heart.style.animationDuration = Math.random() * 2 + 3 + "s";
        document.body.appendChild(heart);

        setTimeout(() => heart.remove(), 5000);
    }
    setInterval(createHeart, 500);
});