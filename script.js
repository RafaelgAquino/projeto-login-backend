document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.querySelector('.btn-submit');
  const userInput = document.querySelector('input[type="text"]');
  const passwordInput = document.querySelector('input[type="password"]');

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

        const resposta = await fetch('http://localhost:8080/api/login', {
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

          // Dica: Se o seu backend retornar um token (ex: JWT), guarde-o antes de redirecionar:
          // localStorage.setItem('token', resultado.token);

          // Redireciona para a nova página HTML (substitua 'dashboard.html' pelo seu ficheiro)
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