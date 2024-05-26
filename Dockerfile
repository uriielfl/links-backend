# Use a imagem do Node.js
FROM node:21 as development

# Crie e defina o diretório de trabalho
WORKDIR /usr/app

# Copie os arquivos do projeto para o contêiner
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o código da aplicação
COPY . .

# Expõe a porta que a aplicação NestJS estará escutando
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
