🚀Desafio Backend Gustavo
Plataforma web que lida com uploads de arquivos no formato CNAB e armazena esses dados em um banco de dados SQLite. Ele também suporta comunicação em tempo real via WebSocket para enviar dados processados para clientes conectados.

📋 Pré-requisitos
Antes de executar o código, certifique-se de que você tenha instalado as seguintes dependências:
1. Node.js
2. npm (Node Package Manager)
3. SQLite

Outras dependências: Você também precisa instalar as dependências Node.js listadas.
1. express
2. http
3. path
4. multer
5. sqlite3
6. ws

🔧 Instalação
1. Instale as Dependências citadas a cima no console da sua maquina.
Navegue até o diretório do projeto e instale todas as dependências Node.js necessárias que estão listadas.
"cd ../proj1"
"npm install"

2. Execute o servidor no terminal do framework
"node server.js"
Isso iniciará o servidor.

3. Acessando a Página de Upload:
Abra um navegador da web e acesse http://localhost:3000/upload para acessar a página de upload do projeto

4. Interagindo com a Página:
Na página de upload, siga as instruções para selecionar um arquivo CNAB, e clique no botão "Clique para enviar".
Os dados processados serão exibidos na tabela, e o saldo total será calculado e exibido na parte inferior

5. Use o filtro de loja conforme necessário para visualizar e filtrar os dados.

Com essas etapas, você deve conseguir executar o projeto localmente e interagir com a página de upload de arquivos CNAB.


🛠️ Construído com
Mencione as ferramentas que você usou para criar seu projeto

1. Visual Studio Code: O framework usado
2. Node.js: Um ambiente de tempo de execução JavaScript que permite executar do lado do servidor.
3. Express.js: Um framework para Node.js que facilita a criação de aplicativos da web e APIs.
4. Multer: Uma biblioteca Node.js para processar uploads de arquivos.
5. sqlite3: Biblioteca para trabalhar com o banco de dados SQLite em Node.js.
6. WebSocket: Biblioteca para habilitar comunicação bidirecional em tempo real entre clientes e servidor por meio do protocolo WebSocket.
7. Fetch API: Uma API JavaScript usada para fazer solicitações HTTP ao servidor e receber dados em JSON.
8. HTML, CSS e JavaScript: Linguagens de marcação e programação usadas
9. Outras bibliotecas: Foram utilizadas várias outras bibliotecas e recursos, como `path`, `fs`, `exec`, `child_process` entre outras, para manipular arquivos, executar scripts e facilitar o desenvolvimento.

📌 Versão
1.0.0

✒️ Autores
1. Gustavo dos Reis Pascoaletti 
     Desenvolvimento completo do projeto.
     Implementação de todas as funcionalidades.
     Arquitetura e design do sistema.
     Testes e validação.
     Documentação.

Gustavo dos Reis Pascoletti é o único autor deste projeto e foi responsável por todas as etapas, desde o desenvolvimento inicial até a entrega final.
Contato: [LinkedIn](https://www.linkedin.com/in/gustavo-dos-reis-pascoaletti-34219a207/)


📄 Licença
Este projeto está sob a licença The MIT License (MIT) - veja o arquivo LICENSE.md para detalhes.