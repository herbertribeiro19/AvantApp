# AvantApp - Take Home Test (Fullstack App - IOS & Android)

## Screenshots do App

<table>
  <tr>
    <td><img src="app/AvantApp/assets/screens/Simulator Screenshot - 15 Pro - 2025-06-20 at 09.37.22.png" width="200"></td>
    <td><img src="app/AvantApp/assets/screens/Simulator Screenshot - 15 Pro - 2025-06-20 at 09.37.40.png" width="200"></td>
    <td><img src="app/AvantApp/assets/screens/Simulator Screenshot - 15 Pro - 2025-06-20 at 09.38.09.png" width="200"></td>
    <td><img src="app/AvantApp/assets/screens/Simulator Screenshot - 15 Pro - 2025-06-20 at 09.38.16.png" width="200"></td>
  </tr>
  <tr>
    <td><img src="app/AvantApp/assets/screens/Simulator Screenshot - 15 Pro - 2025-06-20 at 09.38.20.png" width="200"></td>
    <td><img src="app/AvantApp/assets/screens/Simulator Screenshot - 15 Pro - 2025-06-20 at 09.38.23.png" width="200"></td>
    <td><img src="app/AvantApp/assets/screens/Simulator Screenshot - 15 Pro - 2025-06-20 at 09.38.28.png" width="200"></td>
    <td><img src="app/AvantApp/assets/screens/Simulator Screenshot - 15 Pro - 2025-06-20 at 09.38.32.png" width="200"></td>
  </tr>
  <tr>
    <td><img src="app/AvantApp/assets/screens/Simulator Screenshot - 15 Pro - 2025-06-20 at 09.38.34.png" width="200"></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
</table>

## Funcionalidades Principais

### Clientes

- Cadastro completo com nome, email, telefone e data de nascimento
- Busca inteligente por nome ou email
- Visualização detalhada em modal
- Indicador visual de letras faltantes no nome (funcionalidade única)

### Vendas

- Registro de vendas realizadas
- Seleção de data
- Validação de dados em tempo real

### Dashboard e Estatísticas

- Gráficos de vendas diárias (LineChart e BarChart)
- Estatísticas de clientes (maior volume, maior média, mais frequente)
- Pull-to-refresh para atualização em tempo real
- Resumo diário de vendas

### Autenticação e Segurança

- Sistema de login/registro com JWT
- Proteção de rotas

## Arquitetura

### Frontend (React Native + Expo)

```
src/
├── components/          # Componentes reutilizáveis
│   ├── common/         # Componentes específicos do domínio
│   └── ui/             # Componentes de interface genéricos
├── contexts/           # Context API para estado global
├── hooks/              # Custom hooks
├── navigation/         # Configuração de navegação
├── screens/            # Telas da aplicação
├── services/           # Serviços de API
├── types/              # Definições TypeScript
└── utils/              # Utilitários e helpers
```

### Backend (Node.js + Express)

```
src/
├── config/             # Configurações (banco, auth)
├── controllers/        # Lógica de negócio
├── database/           # Configuração do Sequelize
├── middlewares/        # Middlewares customizados
├── models/             # Modelos do Sequelize
├── routes/             # Definição de rotas
└── swagger.js          # Documentação da API
```

## Tecnologias

### Frontend

- **React Native 0.79.4**
- **Expo 53.0.12**
- **TypeScript**
- **React Navigation**
- **React Native Chart Kit**
- **Axios**
- **AsyncStorage**
- **Vector Icons**

### Backend

- **Node.js**
- **Express.js**
- **Sequelize**
- **MySQL2**
- **JWT**
- **Bcryptjs**
- **Swagger**
- **Jest**

### Outros

- **Git**

### Sistema Operacional utilizado

- MacOS Sequoia Versão 15.5

### Banco de Dados

- **MySQL** - Banco relacional

## Como Executar

### Pré-requisitos

- Node.js 18+
- MySQL 8.0+
- Expo
- React Native

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd app/AvantApp
open -a simulator (Rodar o emulador de IOS - MacOS)
npm install
npm expo start
```

## Funcionalidades Técnicas

### Tratamento de Timezone

- Configuração específica para timezone brasileiro (UTC-3)
- Horário fixo para evitar inconsistências

### Validação e UX

- Validação em tempo real
- Feedback visual (erros e sucesso)
- Loading states

## API Endpoints

### Autenticação

- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login

### Clientes

- `GET /api/clients` - Listar clientes
- `POST /api/clients` - Criar cliente
- `GET /api/clients/:id` - Buscar cliente

### Vendas

- `POST /api/sales` - Criar venda
- `GET /api/sales/daily-stats` - Estatísticas diárias
- `GET /api/sales/weekly-stats` - Estatísticas semanais
- `GET /api/sales/client-stats` - Estatísticas de clientes

## Testes

### Backend

```bash
cd backend
npm test
```

## Documentação da API

- **Swagger UI**: Disponível em `/api-docs` quando o servidor estiver rodando

## Segurança

- Autenticação JWT
- Criptografia de senhas com bcrypt
- Validação de entrada
- Sanitização de dados
- CORS configurado

## Design System

- Tema consistente com cores customizáveis
- Componentes reutilizáveis
- Acessibilidade

---
