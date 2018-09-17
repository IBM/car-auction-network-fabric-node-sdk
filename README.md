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

1. [Clone the repo](#1-clone-the-repo)
2. [Enroll App](#2-enroll-app)


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

```npm install```

Then, run this command to enroll the admin:

```
node enrollAdmin.js
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
