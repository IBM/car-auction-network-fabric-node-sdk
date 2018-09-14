# Create a car auction network with Hyperledger Fabric Node.js and IBM Blockchain Starter Plan

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

<!-- ## Deploy to IBM Cloud -->


<!-- [![Deploy to IBM Cloud](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/IBM/watson-second-opinion) -->
# Links

* [IBM Blockchain - Marbles demo](https://github.com/IBM-Blockchain/marbles)
* [Hyperledger Fabric Docs](https://hyperledger-fabric.readthedocs.io/en/release-1.2/)


# Learn more

* **Blockchain Code Patterns**: Enjoyed this Code Pattern? Check out our other [Blockchain Code Patterns](https://developer.ibm.com/code/technologies/blockchain/)

* **Blockchain 101**: Learn why IBM believes that blockchain can transform businesses, industries – and even the world. [Blockchain 101](https://developer.ibm.com/code/technologies/blockchain/)

# License
[Apache 2.0](LICENSE)
