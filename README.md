# Prerequisites

1. Install nodejs
2. Install npm

# Installation

1. Install truffle

```bash
nom install -g truffle
```

2. Install ganache-cli for local testing

```bash
npm install -g ganache-cli
```

3. Install Openzeppelin

```bash
npm install @openzeppelin/contracts
```

4. Install hdwallet-provider

```bash
npm install @truffle/hdwallet-provider
```

5. Install dotenv

```bash
npm install dotenv
```

# Deploying

```bash
truffle develop
truffle migrate --reset (on localtest)
```

or

```bash
truffle migrate --reset --network "network's name"
```

# Verify

```bash
truffle run verify "Smart Contract's name" --network "network's name"
```
