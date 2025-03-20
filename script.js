const weddingDate = new Date("2025-06-14T16:30:00");

function updateCountdown() {
  const now = new Date();
  const timeRemaining = weddingDate - now;

  if (timeRemaining > 0) {
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    document.querySelector(".countdown .days .value").textContent = days.toString().padStart(2, "0");
    document.querySelector(".countdown .hours .value").textContent = hours.toString().padStart(2, "0");
    document.querySelector(".countdown .minutes .value").textContent = minutes.toString().padStart(2, "0");
    document.querySelector(".countdown .seconds .value").textContent = seconds.toString().padStart(2, "0");
  } else {
    document.querySelector(".countdown").innerHTML = "<h3>Já estamos casados! 🎉</h3>";
  }
}

setInterval(updateCountdown, 1000);
updateCountdown();

const swiper = new Swiper('.swiper', {
  loop: true,
  pagination: {
    el: '.swiper-pagination',
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  spaceBetween: 10
});

document.addEventListener('DOMContentLoaded', function () {
  AOS.init({
    duration: 3000,
    once: true,
  });
});

document.querySelector(".arrow").addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function showNotification(message) {
  const notification = document.getElementById('notification');
  const notificationMessage = document.getElementById('notification-message');

  notificationMessage.textContent = message;
  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show');
  }, 5000);
}

emailjs.init("VPFzWApoeoZMUnjiL");

document.getElementById('form-confirmacao').addEventListener('submit', function(event) {
  event.preventDefault();

  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const confirmacao = document.getElementById('confirmacao').value;
  const convidadosInput = document.getElementById('convidados').value;
  
  if (!convidadosInput.includes(',')) {
    showNotification("O nome dos convidados deve ser separado por vírgula.");
    return;
  }

  const convidados = convidadosInput.split(',').map(nome => ({ nome: nome.trim() })).slice(0, 2);

  if (convidados.length > 2) {
    showNotification("Você pode adicionar no máximo 2 convidados.");
    return;
  }

  const dados = {
    nome,
    email,
    confirmacao,
    convidados
  };

  fetch('https://67354ff75995834c8a9269a3.mockapi.io/casamento', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao salvar no MockAPI');
    }
    return response.json();
  })
  .then(() => {
    return emailjs.send("service_3s7ttqn", "template_zb71yhp", {
      nome,
      email,
      confirmacao,
      convidados: convidados.map(c => c.nome).join(', ')
    });
  })
  .then(() => {
    return emailjs.send("service_3s7ttqn", "template_f40b7jn", {
      nome,
      email,
      confirmacao,
      convidados: convidados.map(c => c.nome).join(', '),
      convite_url: "https://i.ibb.co/bRQrDLV1/convite.jpg" 
    });
  })
  .then(() => {
    showNotification('Confirmação enviada com sucesso!');
    event.target.reset();
  })
  .catch((error) => {
    console.error('Erro:', error);
    showNotification('Ocorreu um erro ao enviar sua confirmação. Tente novamente!');
  });
});


document.getElementById('message-content').addEventListener('submit', function(event) {
  event.preventDefault();

  const nome = document.getElementById('message-name').value;
  const mensagem = document.getElementById('mensagem').value;

  const messageData = {
    nome: nome,
    mensagem: mensagem
  };

  fetch('https://67354ff75995834c8a9269a3.mockapi.io/mensagens', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(messageData)
  })
  .then(response => response.json())
  .then(data => {
    showNotification("Mensagem enviada com sucesso!");
    document.getElementById('message-content').reset(); 
  })
  .catch(error => {
    console.error('Erro ao enviar mensagem:', error);
    showNotification("Erro ao enviar a mensagem. Tente novamente.");
  });
});