# Processamento GNSS IBGE PPP

Este projeto é uma aplicação web desenvolvida em **React + TypeScript + Vite** para facilitar o envio de arquivos GNSS ao serviço PPP do IBGE, permitindo o processamento de múltiplos arquivos simultaneamente e o download automático dos resultados.

## Tecnologias Utilizadas
- **React**: Interface de usuário
- **TypeScript**: Tipagem estática
- **Vite**: Bundler e servidor de desenvolvimento rápido
- **CSS**: Estilização customizada

## Funcionalidades
- Envio de múltiplos arquivos GNSS para o PPP do IBGE
- Preenchimento dos parâmetros obrigatórios (tipo de levantamento, modelo de antena, email)
- Download automático dos resultados (opcional)
- Relatório dos arquivos baixados com sucesso e dos que falharam
- Interface moderna, responsiva e fácil de usar

## Como Executar o Projeto

### Pré-requisitos
- Node.js instalado ([download aqui](https://nodejs.org/))

### Passo a Passo

1. **Clone o repositório ou baixe os arquivos do projeto**

2. **Instale as dependências**

   No terminal, dentro da pasta do projeto:
   ```sh
   npm install
   ```

3. **Execute o projeto em modo de desenvolvimento**

   ```sh
   npm run dev
   ```

   O terminal mostrará o endereço local, geralmente:
   
   [http://localhost:5173](http://localhost:5173)

4. **Acesse a aplicação pelo navegador**

5. **Utilize a interface para selecionar arquivos GNSS, preencher os campos obrigatórios e enviar para processamento.**

   - Marque a opção "Baixar automaticamente após processar" para que os arquivos sejam baixados assim que o IBGE retornar o link.
   - O relatório mostrará quais arquivos foram baixados com sucesso e quais falharam.

## Observações
- Não é necessário backend local: a aplicação se conecta diretamente à API oficial do IBGE.
- O processamento e o download dependem da disponibilidade do serviço do IBGE.
- Os arquivos processados ficam disponíveis para download conforme o link retornado pelo IBGE.

---

Desenvolvido para facilitar o processamento em lote de arquivos GNSS no PPP do IBGE.

