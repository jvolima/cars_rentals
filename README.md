# 🚗 Cars Rentals
API Restful to rent cars

## Funcionalidades

### Cadastro de usuários
**RF**
- Deve ser possível cadastrar um novo usuário.

**RN**
- Não deve ser possível cadastrar um novo usuário se o email já existe.

### Autenticação de usuário
**RF**
- Deve ser possível autenticar um usuário e gerar um token e um refresh token para ele.

**RN**~
- Não deve ser possível autenticar um usuário se o email ou a senha estiverem incorretos.

### Refresh token
**RF**
- Deve ser possível gerar um novo token e um novo refresh token pelo token informado.

**RN**
- Não deve ser possível gerar um novo token e um novo refresh token se o token estiver incorreto.
- Não deve ser possível gerar um novo token e um novo refresh token se o token estiver expirado.

### Alterar senha
**RF**
- Deve ser possível o usuário alterar sua senha.

**RN**
- Não deve ser possível um usuário alterar a senha se o token de troca estiver invalido ou expirado.

### Email de troca de senha
**RF**
- Deve ser possível o usuário receber um email de troca de senha.

**RN**
- Não deve ser possível enviar um email de troca de senha se o email for inexistente.

### Cadastro de avatar do usuário
**RF**
- Deve ser possível um usuário adicionar/alterar um novo avatar para ele.

**RNF**
- Utilizar o multer para upload dos arquivos.

**RN**
- O usuário deve estar autenticado para adicionar/alterar o seu avatar.

### Cadastro de carro
**RF**
- Deve ser possível cadastrar um novo carro.

**RN**
- Não deve ser possível cadastrar um carro com uma placa já existente.
- O carro deve ser cadastrado, por padrão, com disponibilidade.
- O usuário responsável pelo cadastro deve ser um usuário administrador.

### Listagem de carros
**RF**
- Deve ser possível listar todos os carros disponíveis.
- Deve ser possível listar todos os carros disponíveis pelo nome.
- Deve ser possível listar todos os carros disponíveis pela marca.
- Deve ser possível listar todos os carros disponíveis pela categoria

**RN**
- O usuário não precisa estar autenticado no sistema.

### Cadastro de especificação no carro
**RF**
- Deve ser possível cadastrar uma especificação para um carro. 

**RN**
- Não deve ser possível cadastrar uma especificação para um carro não cadastrado.
- Não deve ser possível cadastrar uma especificação já existente para o mesmo carro.
- O usuário responsável pelo cadastro deve ser um usuário administrador.

### Cadastro de imagens do carro
**RF**
- Deve ser possível cadastrar imagens para um carro.

**RNF**
- Utilizar o multer para upload dos arquivos.

**RN**
- Deve ser possível cadastrar mais de uma imagem para o mesmo carro.
- O usuário responsável pelo cadastro deve ser um usuário administrador.

### Cadastro de categorias
**RF**
- Deve ser possível cadastrar categorias de carros.

**RN**
- O usuário responsável pelo cadastro deve ser um usuário administrador.

### Cadastro de especificações
**RF**
- Deve ser possível cadastrar especificações de carros.

**RN**
- O usuário responsável pelo cadastro deve ser um usuário administrador.

### Importação de categorias
**RF**
- Deve ser possível cadastrar novas categorias pelo arquivo importado.

**RN**
- O usuário responsável pelo cadastro deve ser um usuário administrador.

### Listagem de categorias
**RF**
- Deve ser possível listar todas as categorias de carros.

**RN**
- O usuário não precisa estar logado no sistema para visualizar a lista de categorias.

### Alugel de carro
**RF**
- Deve ser possível cadastrar um alugel.

**RN**
- O alugel deve ter duração mínima de 24 horas.
- Não deve ser possível cadastrar um novo alugel caso já exista um aberto para o mesmo usuário.
- Não deve ser possível cadastrar um novo alugel caso já exista um aberto para o mesmo carro.

### Devolução de aluguel
**RF**
- Deve ser possível fazer a devolução de um aluguel.
- O total a pagar deve ser calculado na hora da devolução do aluguel.

**RN**
- O usuário deve estar autenticado para fazer a devolução.

### Listagem de alugueis do usuário
**RF** 
- Deve ser possível um usuário listar todos os seus aluguéis.

**RN**
- O usuário deve estar autenticado para visualizar os seus aluguéis.

## DB Diagram
!(Diagrama do banco de dados)[./diagram.png]