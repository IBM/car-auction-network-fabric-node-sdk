# Create a car auction network with Hyperledger Fabric Node.js SDK and IBM Blockchain Starter Plan

In this Code Pattern we will create a blockchain app that simulates a car auction network. In this pattern, the user will first enroll the admin user by connecting to the CA from the IBM Blockchain Starter Plan instance, and then register a user as well. After that, we will initiate the ledger, which will create a few members, and a sample car on the ledger. After that, we will make some offers for the cars, and the chaincode will check for two types of errors:

1) If the owner of the car bids on their own item
2) If the bidder has enough money in their account to make the bid

If both checks are passed, an offer is recorded on the ledger. Once the auction closes, we call the `closeBidding` transaction. That will give the car to the highest bidder, and transfer funds from the buyer to the seller. The buyer will gain ownership of the car.

To ensure that our auction has worked correctly, we can query the ledger at the end to ensure that the car has the correct owner, and that the seller has been credited the correct amount in their account.

Lastly, we will check the logs of the peers on the IBM Blockchain Starter Plan, and also view the details of the blocks to see how transactions are recorded.

When the reader has completed this Code Pattern, they will understand how to:

* Interact with IBM Blockchain Starter Plan
* Build a blockchain back-end using Hyperledger Fabric Node SDK
* Inspect and read logs from applications connected to IBM Blockchain Starter Plan

<!--Remember to dump an image in this path-->
![Architecture](/docs/app-architecture.png)

## Flow
1. WIP!

## Included components
* [IBM Blockchain Starter Plan](https://console.bluemix.net/catalog/services/blockchain): Use the IBM Blockchain Platform to simplify the developmental, governmental, and operational aspects of creating a blockchain solution.

## Featured technologies
* [IBM Blockchain](https://www.ibm.com/blockchain): Blockchain is a shared, immutable ledger for recording the history of transactions.
* [Cloud](https://www.ibm.com/developerworks/learn/cloud/): Accessing computer and information technology resources through the Internet.

<!-- ## Watch the Video -->

<!-- [![](docs/youtubePicture.png)](https://www.youtube.com/watch?v=wwNAEvbxd54&list=PLVztKpIRxvQXhHlMQttCfYZrDN8aELnzP&index=1&t=1s) -->
# Prerequisites
1. If you do not have an IBM Cloud account yet, you will need to create one [here](https://ibm.biz/BdjLxy).


# Steps

1. [Clone the repo](#step-1-clone-the-repo)
2. [Enroll App](#step-2-enroll-app)
3. [Register Users](#step-3-register-users)
4. [Invoke Chaincode](#step-4-invoke-chaincode)


## Step 1. Clone the repo
The first thing we need to do is clone the repo on your local computer.

```
git clone https://github.com/horeaporutiu/carauction-network.git
```
Then, go ahead and go into the directory:

```cd carauction-network```

## Step 2. Enroll App 
 ![packageFile](/docs/enrollAdmin.gif)

First, we need to generate the necessary keys and certs from the Certificate Authority to prove our authenticity to the network.
To do this, we will go into our new IBM Blockchain Starter Plan network, and from the `Overview` Tab on the left, we will click on `Connection Profile` on the right-side of the page. Then click on `Raw JSON`.

Open `enrolladmin.js` in an editor of your choice. I prefer VSCode.

Down around line 40 of the file, you will see a new instance of the Fabric_CA_Client. This is where we
need to give our application the necessary endpoints of our CA from our IBM Blockchain Starter Plan.

We will need 4 things from the Certificate Authority
1) `enrollId` - should be "admin"
2) `enrollSecret` - should be similar to "1dcab332aa"
3) `url` - should be similar to 
"nde288ef7dd7542d3a1cc824a02be67f1-org1-ca.us02.blockchain.ibm.com:31011"
4) `caName` - should be "org1CA"

Your code should look something like this when finished:

```
fabric_ca_client = new Fabric_CA_Client('https://admin:4352f3499a@nd61fdbe87a194a10bde3cccdb90d427e-org1-ca.us04.blockchain.ibm.com:31011', null ,"org1CA", crypto_suite);
```

Once you fill out the necessary info as shown in the gif above, move down to the call to 
enroll the CA. You will need to add in the enrollSecret there again. Should be around 
line 55. 

Your code should look something like this when finished (note, this is just a small chunk of the code)

```
return fabric_ca_client.enroll({
          enrollmentID: 'admin',
          enrollmentSecret: '4252f3499a'
        }).then((enrollment) =>
```

Save your file, and run npm install:

```
$ npm install
```

Then, run this command to enroll the admin:

```
$ node enrollAdmin.js
```

If all went well, you should get a response like this.

```
carauction 👉🏼  node enrollAdmin.js
 Store path:/Users/Horea.Porutiu@ibm.com/Workdir/blockchain/carauction/hfc-key-store
(node:86820) 
Successfully enrolled admin user "admin"
Assigned the admin user to the fabric client ::{"name":"admin","mspid":"org1","roles":null,"affiliation":"","enrollmentSecret":"","enrollment":{"signingIdentity":"b*4d7843af972bcfb7dac51f641458af95a54b4904d98da67e5b1db934adf35a","identity":{"certificate":"-----BEGIN CERTIFICATE-----\nMIIB8TCCAZigAwIBAgIULHILXwt3DhxQSW7gdzNmziY18iAwCgYIKoZIzj0EAwIw\nbzELMAkGA1UEBhMCVVMxFzAVBgNVBAgTDk5vcnRoIENhcm9saW5hMRQwEgYDVQQK\nEwtIeXBlcmxlZGdlcjEPMA0GA1UECxMGRmFicmljMSAwHgYDVQQDExdmYWJyaWMt\nY2Etc2VydmVyLW9yZzFDQTAeF*0xODA5MTcxODMxMDBaFw0xOTA5MTcxODM2MDBa\nMCExDzANBgNVBAsTBmNsaWVudDEOMAwGA1UEAxMFYWRtaW4wWTATBgcqhkjOPQIB\nBggqhkjOPQMBBwNCAAQIDN3iZJeoQbFE7+3ShqlhQd6cYsxrOAWs3nGlv/SC+qQV\nQd33uwkkbcs8PTVlWgM6FsmoNZfMEhx5LH1pW+y0o2AwXjAOBgNVHQ8BAf8EBAMC\nB4AwDAYDVR0TAQH/BAIwADAdBgNVHQ4EFgQUuI4+VTbgNTXcnYg+8qpGXf/mUmIw\nHwYDVR0jBBgwFoAUo/8jv0agwT3tol8HsbOmorxdijkwCgYIKoZIzj0EAwIDRwAw\nRAIgTEJKJL6/U/wMgxqG25K5NW4A5+ie1vG9qi7zP98wVVoCIB7hV0en6cV3nI9L\nMdWPTvgrB67CCL8Ay+yJ25B8hMO9\n-----END CERTIFICATE-----\n"}}}
```

## Step 3. Register Users 
![packageFile](/docs/registerUser.gif)

Now that we have generated our client side certificates, and stored them in `htc-key-store`, we need
to register our application so that the network recongnizes it. 

Open `registerUser.js` in the editor of your choice. On line 42, we can see a new instance of the 
Fabric_ca_client being created. We can simply copy our existing instance from `enrollAdmin.js`. This is 
very important <b> your URL should be the same as in `enrollAdmin.js` </b>.

After you copy and paste, the code in `registerUser.js` should look like this on line 42, except
your credentials will be different than mine:

```
fabric_ca_client = new Fabric_CA_Client('https://admin:4352f3499a@nd61fdbe87a194a10bde3cccdb90d427e-org1-ca.us04.blockchain.ibm.com:31011', null ,"org1CA", crypto_suite);
```

Note that from the first gif to the second gif that my credentials changed. That is just 
because I needed to get a new network. Yours will remain the same.  

Now, run this command to register and enroll `user1`. You can only register an identity once. If you 
get errors, it is probably because that user is already registered - you can try it with a different name. 

```
$ node registerUser.js 
```

If successful, output should be something like this: 

```
carauction 👉🏼  node registerUser.js
 Store path:/Users/Horea.Porutiu@ibm.com/Workdir/blockchain/carauction/hfc-key-store
Successfully loaded admin from persistence
Successfully registered user1 - secret:OnqVuU*tCwPU
Successfully enrolled member user "user1"User1 was successfully registered and enrolled and is ready to interact with the fabric network
```

🙌🏼 Nice! You are almost there!

## Step 4. Invoking Chaincode 
![packageFile](/docs/invoke.gif)

Now, we need to download the connection profile, and move it to our current working directory. 
From the `Overview` in IBM Blockchain Platform, click on `Download`. Go to your recent 
downloads, and move the file to the `carauction-network` directory. 

Next, we need to install the chaincode on the peers. Then, we will need to instantiate the chaincode. 
From the `Overview` tab on the left, click on `Install Code`. Then, click on `Install Chaincode` on 
the right. 

```
Chaincode ID: carauction  
Chaincode Version: 1
Chaincode Type: Node
```

Choose your chaincode files from the carauction directory. This is very important. You need to 
select both `carauction.js` and `package.json`.

Then click `Submit`.

Once the chaincode in installed, we need to instantiate it. From the same screen, click on the 
3-dot symbol under `Actions`. Then click `Instantiate`.

For `Chaincode Type` select `Node`. Then click `Next`. Next, leave the defaults on the next screen,
which show a simple endorsement policy. Just click `Submit`.

Next, let's click on the `Channels` tab on the left side. Then click on the `defaultchannel`.
You should see the `total blocks` and `time since last transaction`. If we click on the 
block number, we can see our `initLedger` function being called, and the data that was 
written to the ledger.

Open `invoke.js` in the editor of your choice. You'll see at the top of the file
we import our connection profile from IBM Blockchain Platform with this line: 

```
var creds = require('./creds.json');
```

Just save the file and then use this command to invoke chaincode on our network:

```
$ node invoke.js
```

If all went well, you should see something like this: 

```
carauction 👉🏼  node invoke.js
Store path:/Users/Horea.Porutiu@ibm.com/Workdir/blockchain/carauction/hfc-key-store
Successfully loaded user1 from persistence
Assigning transaction_id:  812694fba979d495423a40701fed3b221e7d7add2eecde8f9dd9a64827c8aced
Transaction proposal was good
Successfully sent Proposal and received ProposalResponse: Status - 200, message - "OK"
The transaction has been committed on peer n9fb94659f16c4d85a20219df994288bb-org1-peer1.us03.blockchain.ibm.com:31002
Send transaction promise and event listener promise have completed
Successfully sent transaction to the orderer.
Successfully committed the change to the ledger by the peer
```











<!-- If you check your downloaded files now, you should have a file starting with `cred` ending in `.json`. Let's rename this file to `creds.json` and move this file to the root of our carauction-network directory.

Open `enrolladmin.js` and the newly downloaded `creds.json` in an editor of your choice. I prefer VSCode. -->












<!-- [![Deploy to IBM Cloud](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/IBM/watson-second-opinion) -->
# Links

* [IBM Blockchain - Marbles demo](https://github.com/IBM-Blockchain/marbles)
* [Hyperledger Fabric Docs](https://hyperledger-fabric.readthedocs.io/en/release-1.2/)


# Learn more

* **Blockchain Code Patterns**: Enjoyed this Code Pattern? Check out our other [Blockchain Code Patterns](https://developer.ibm.com/code/technologies/blockchain/)

* **Blockchain 101**: Learn why IBM believes that blockchain can transform businesses, industries – and even the world. [Blockchain 101](https://developer.ibm.com/code/technologies/blockchain/)

# License
[Apache 2.0](LICENSE)
