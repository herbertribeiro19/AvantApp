# AvantApp - Take Home Test (Fullstack App)

## 🎯 Funcionalidades Principais

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

## 🏗️ Arquitetura do Sistema

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

## 🛠️ Stack Tecnológica

### Frontend

- **React Native 0.79.4** - Framework mobile
- **Expo 53.0.12** - Plataforma de desenvolvimento
- **TypeScript 5.8.3** - Tipagem estática
- **React Navigation 7.x** - Navegação entre telas
- **React Native Chart Kit** - Gráficos e visualizações
- **Axios** - Cliente HTTP
- **AsyncStorage** - Armazenamento local
- **Vector Icons** - Ícones da aplicação

### Backend

- **Node.js** - Runtime JavaScript
- **Express.js 4.18.2** - Framework web
- **Sequelize 6.32.1** - ORM para MySQL
- **MySQL2 3.6.0** - Driver do banco de dados
- **JWT 9.0.2** - Autenticação
- **Bcryptjs 2.4.3** - Criptografia de senhas
- **Swagger** - Documentação da API
- **Jest** - Testes unitários

### Banco de Dados

- **MySQL** - Sistema de gerenciamento de banco relacional

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- MySQL 8.0+
- Expo CLI
- React Native CLI

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd app/AvantApp
npm install
npm expo start
```

## 🔧 Funcionalidades Técnicas

### Tratamento de Timezone

- Configuração específica para timezone brasileiro (UTC-3)
- Horário fixo para evitar inconsistências

### Validação e UX

- Validação em tempo real
- Feedback visual (erros e sucesso)
- Loading states

## 📊 API Endpoints

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

## 🧪 Testes

### Backend

```bash
cd backend
npm test
```

## 📚 Documentação API

- **Swagger UI**: Disponível em `/api-docs` quando o servidor estiver rodando

## 🔒 Segurança

- Autenticação JWT
- Criptografia de senhas com bcrypt
- Validação de entrada
- Sanitização de dados
- CORS configurado

## 🎨 Design System

- Tema consistente com cores customizáveis
- Componentes reutilizáveis
- Acessibilidade

---
