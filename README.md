# linagora.esn.onlyoffice
 :books: Office module for OpenPaaS

This repository contains source code of Office module for OpenPaaS ESN.

## Install

The current module is not enabled by default in the OpenPaaS ESN repository :
You need to add `linagora.esn.onlyoffice` in the file `config/Default.json`.

Doing an `npm install` from there will install and enable the office module in OpenPaaS.

## Develop

### 1. Clone linagora.esn.onlyoffice

```
git clone git+https://github.com/linagora/linagora.esn.onlyoffice.git
cd linagora.esn.onlyoffice
```

### 2. Install dependencies and link in OpenPaaS

*Note: The following instructions assumes that you have already installed OpenPaaS ESN in the path referenced by $ESN below.*

In order to develop, you will have to run several commands from your favorite terminal:
  1. In the current repository, install dependencies with `npm install`
  2. In the current repository, use `npm link` to symlink packages
  3. In your OpenPaaS ESN repository, link the office module
```
cd $ESN
npm link linagora.esn.onlyoffice
```