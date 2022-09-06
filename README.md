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
truffle verify "Smart Contract's name" --network "network's name"
```
