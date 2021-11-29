# Cadastro de carro

**RF**
Deve ser possível cadastrar um novo carro.

**RN**
Não deve ser possível cadastrar um carro com uma placa já existente.
O carro deve ser cadastrado, por padrão, com disponibilidade.
* O usuário responsável pelo cadastro deve ser um usuário administrador.

# Listagem de carros

**RF**
Deve ser possível listar todos os carros disponíveis.
Deve ser possível listar todos os carros disponíveis pelo nome.
Deve ser possível listar todos os carros disponíveis pela marca.
Deve ser possível listar todos os carros disponíveis pela categoria

**RN**
O usuário não precisa estar logado no sistema.


# Cadastro de especificação no carro

**RF**
Deve ser possível cadastrar uma especificação para um carro. 
Deve ser possível listar todas as especificações.
Deve ser possível listar todos os carros.

**RN**
Não deve ser possível cadastrar uma especificação para um carro não cadastrado.
Não deve ser possível cadastrar uma especificação já existente para o mesmo carro.
O usuário responsável pelo cadastro deve ser um usuário administrador.


# Cadastro de imagens do carro

**RF**
Deve ser possível cadastrar a imagem do carro.

**RNF**
Utilizar o multer para upload dos arquivos.

**RN**
Deve ser possível cadastrar mais de uma imagem para o mesmo carro.
O usuário responsável pelo cadastro deve ser um usuário administrador.


# Alugel de carro

**RF**
Deve ser possível cadastrar um alugel.

**RN**
O alugel deve ter duração mínima de 24 horas.
Não deve ser possível cadastrar um novo alugel caso já exista um aberto para o mesmo usuário.
Não deve ser possível cadastrar um novo alugel caso já exista um aberto para o mesmo carro.