/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/

'use strict';
const shim = require('fabric-shim');
const util = require('util');

let Chaincode = class {

  // The Init method is called when the Smart Contract 'fabcar' is instantiated by the blockchain network
  // Best practice is to have any Ledger initialization in separate function -- see initLedger()
  async Init(stub) {
    console.info('=========== Instantiated fabcar chaincode ===========');
    return shim.success();
  }

  // The Invoke method is called as a result of an application request to run the Smart Contract
  // 'fabcar'. The calling application program has also specified the particular smart contract
  // function to be called, with arguments
  async Invoke(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);

    let method = this[ret.fcn];
    if (!method) {
      console.error('no function of name:' + ret.fcn + ' found');
      throw new Error('Received unknown function ' + ret.fcn + ' invocation');
    }
    try {
      let payload = await method(stub, ret.params);
      return shim.success(payload);
    } catch (err) {
      console.info(err);
      return shim.error(err);
    }
  }

  //create auctioneer, 2 members, vehicle, and vehicle listing
  async initLedger(stub, args) {
    console.info('============= START : Initialize Ledger ===========');
    
    let auctioneer = {};
    auctioneer.firstName = "Jenny";
    auctioneer.lastName = "Jones";
    auctioneer.type = "auctioneer";    
    console.info('======After auctioneer ===========');
    console.info("auctioneer: " + JSON.stringify(auctioneer));

    let member1 = {};
    member1.balance = 5000;
    member1.firstName = "Amy";
    member1.lastName = "Williams";
    member1.type = "member";
    console.info('======After member ===========');
     
    let member2 = {};
    member2.balance = 5000;
    member2.firstName = "Billy";
    member2.lastName = "Thompson";
    member2.type = "member";
    
    let vehicle = {};
    vehicle.owner = "memberA@acme.org";
    vehicle.type = "vehicle";

    let vehicleListing = {};
    vehicleListing.reservePrice = 3500;
    vehicleListing.description = "Arium Nova";
    vehicleListing.listingState = "FOR_SALE";
    vehicleListing.offers = "";
    vehicleListing.vehicle = "1234";
    vehicleListing.type = "vehicleListing";  

    await stub.putState('auction@acme.org', Buffer.from(JSON.stringify(auctioneer)));
    await stub.putState('memberA@acme.org', Buffer.from(JSON.stringify(member1)));
    await stub.putState('memberB@acme.org', Buffer.from(JSON.stringify(member2)));
    await stub.putState('1234', Buffer.from(JSON.stringify(vehicle)));
    await stub.putState('ABCD', Buffer.from(JSON.stringify(vehicleListing)));

    console.info('============= END : Initialize Ledger ===========');
  }

  //query by using key
  async query(stub, args) {
    console.info('============= START : Query method ===========');
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting 1');
    }

    let query = args[0];

    let queryAsBytes = await stub.getState(query); //get the car from chaincode state
    if (!queryAsBytes || queryAsBytes.toString().length <= 0) {
      throw new Error('member' + ' does not exist: ');
    }
    console.info('query response: ');    
    console.info(queryAsBytes.toString());
    console.info('============= END : Query method ===========');
    
    return queryAsBytes;

  }

  

  async createVehicle(stub, args) {
    console.info('============= START : Create Car ===========');
    if (args.length != 2) {
      throw new Error('Incorrect number of arguments. Expecting 2');
    }

    var car = {
      vin: args[0],
      owner: args[1],
      type: args[2]      
    };

    await stub.putState(args[0], Buffer.from(JSON.stringify(car)));
    console.info('============= END : Create Car ===========');
  }

  async createVehicleListing(stub, args) {
    console.info('============= START : Create Car ===========');
    if (args.length != 7) {
      throw new Error('Incorrect number of arguments. Expecting 6');
    }

    var vehicleListing = {
      reservePrice: args[1],
      description: args[2],
      listingState: args[3],
      offers: args[4],
      vehicle: args[5],
      type: args[6]
    };

    await stub.putState(args[0], Buffer.from(JSON.stringify(vehicleListing)));
    console.info('============= END : Create Car ===========');
  }

  async createMember(stub, args) {
    console.info('============= START : Create Car ===========');
    if (args.length != 4) {
      throw new Error('Incorrect number of arguments. Expecting 4');
    }

    var member = {
      firstName: args[1],
      lastName: args[2],
      balance: args[3],
      type: args[4]
    };

    console.info(member);

    await stub.putState(args[0], Buffer.from(JSON.stringify(member)));
    console.info('============= END : Create Car ===========');
  }

  async createAuctioneer(stub, args) {
    console.info('============= START : Create Car ===========');
    if (args.length != 3) {
      throw new Error('Incorrect number of arguments. Expecting 3');
    }

    var auctioneer = {
      firstName: args[1],
      lastName: args[2],
      type: args[3]
    };

    await stub.putState(args[0], Buffer.from(JSON.stringify(auctioneer)));
    console.info('============= END : Create Car ===========');
  }


  async makeOffer(stub, args) {
    console.info('============= START : Create Car ===========');
    if (args.length != 4) {
      throw new Error('Incorrect number of arguments. Expecting 4');
    }

    var offer = {
      bidPrice: args[0],
      listing: args[1],
      member: args[2],
      type: args[3]
    };

    //get listing
    let listing = args[1];
    console.info("listing: " + listing);    
    
    let listingAsBytes = await stub.getState(listing); //get the car from chaincode state
    if (!listingAsBytes || listingAsBytes.toString().length <= 0) {
      throw new Error(listing + ' does not exist: ');
    }
    listing = JSON.parse(listingAsBytes);

    console.info('listing response before pushing to offers: ');    
    console.info(listing);
    if (!listing.offers) {
      console.info('there are no offers! ');          
      listing.offers = [];
    }
    listing.offers.push(offer);

    console.info('listing response after to offers: ');    
    console.info(listing);
    await stub.putState(args[1], Buffer.from(JSON.stringify(listing)));    
    
    console.info('============= END : MakeOffer method ===========');

  }

  /** closeBidding 
   * Close the bidding for a vehicle listing and choose the
   * highest bid that is over the asking price
   * args[0] - listingId - a reference to our vehicleListing
   */
  async closeBidding(stub, args) {
    console.info('============= START : Close bidding ===========');
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting 1');
    }

    //check if this listing exists
    let listingKey = args[0];
    
    let listingAsBytes = await stub.getState(listingKey); //get the car from chaincode state
    if (!listingAsBytes || listingAsBytes.toString().length <= 0) {
      throw new Error(vin + ' does not exist: ');
    }
    console.info('============= listing exists ===========');
    
    var listing = JSON.parse(listingAsBytes);
    console.info('listing: ' );     
    console.info(util.inspect(listing, {showHidden: false, depth: null}));
    let highestOffer = null;

    if (listing.offers && listing.offers.length > 0) {
      listing.offers.sort(function(a, b) {
        return (b.bidPrice - a.bidPrice);
      });

      highestOffer = listing.offers[0];
      console.info('highest Offer: ' + highestOffer);

      if (highestOffer.bidPrice >= listing.reservePrice) {
        let buyer = highestOffer.member;

        console.info('highestOffer.member: ' + buyer);        

        //get the owner of the vehicle
        let buyerAsBytes = await stub.getState(buyer); //get the car from chaincode state
        if (!buyerAsBytes || buyerAsBytes.toString().length <= 0) {
          throw new Error('vehicle does not exist: ');
        }

        buyer = JSON.parse(buyerAsBytes);
        console.info('buyer: ' );     
        console.info(util.inspect(buyer, {showHidden: false, depth: null}));
   

        //get the owner of the vehicle
        let vehicleAsBytes = await stub.getState(listing.vehicle); //get the car from chaincode state
        if (!vehicleAsBytes || vehicleAsBytes.toString().length <= 0) {
          throw new Error('vehicle does not exist: ');
        }

        var vehicle = JSON.parse(vehicleAsBytes);
        //get the balance of owner
        let sellerAsBytes = await stub.getState(vehicle.owner); //get the car from chaincode state
        if (!sellerAsBytes || sellerAsBytes.toString().length <= 0) {
          throw new Error('vehicle does not exist: ');
        }

        let seller = JSON.parse(sellerAsBytes);

        console.info('seller: ');
        console.info(util.inspect(seller, {showHidden: false, depth: null}));

        console.info('#### seller balance before: ' + seller.balance);
        let sellerBalance = parseInt(seller.balance, 10);
        let highOfferBidPrice = parseInt(highestOffer.bidPrice, 10);        
        sellerBalance += highOfferBidPrice;
        seller.balance = sellerBalance;
        
        console.info('#### seller balance after: ' + seller.balance);    
        console.info('#### buyer balance before: ' + buyer.balance);                        
        buyer.balance -= highestOffer.bidPrice;
        console.info('#### buyer balance after: ' + buyer.balance);  
        //need to put in ID back, so that I can get the key for the buyer!!
        console.info('#### buyer balance after: ' + buyer.balance);  
        console.info('#### vehicle owner before: ' + vehicle.owner); 
        var oldOwner = vehicle.owner         
        vehicle.owner = highestOffer.member;
        console.info('#### vehicle owner after: ' + vehicle.owner);                  
        console.info('#### buyer balance after: ' + buyer.balance);                                        
        listing.offers = null;
        listing.listingState = 'SOLD'; 

        await stub.putState(highestOffer.member, Buffer.from(JSON.stringify(buyer))); 
        //update the sellers balance
        console.info('old owner: ');    
        console.info(util.inspect(oldOwner, {showHidden: false, depth: null}));      
        await stub.putState(oldOwner, Buffer.from(JSON.stringify(seller))); 
      }
    }
    console.info('inspecting vehicle: ');                                            
    console.info(util.inspect(vehicle, {showHidden: false, depth: null}));

    if (highestOffer) {
      await stub.putState(listing.vehicle, Buffer.from(JSON.stringify(vehicle))); 
      //update the buyers balance
    } else { throw new Error('offers do not exist: '); }



    console.info('============= END : closeBidding ===========');
  }
};

shim.start(new Chaincode()); 

    // console.info("auctioneer: " + JSON.stringify(auctioneer));
    // console.info("member1: " + JSON.stringify(member1));    
    // console.info("member2: " + JSON.stringify(member2));    
    // console.info("vehicle: " + JSON.stringify(vehicle));   


    
    
    // let auction = await stub.getState(auctioneer.email); //get the car from chaincode state
    // console.info("auction: " + JSON.stringify(auction));
    // if (!auction || auction.toString().length <= 0) {
    //   throw new Error('auction' + ' does not exist: ');
    // }

    // var listingJson = JSON.parse(listingAsBytes);
    // console.log('util.inspect');
    // console.log(util.inspect(listingJson, {showHidden: false, depth: null}));
    // await stub.putState(args[0], Buffer.from(JSON.stringify(member1))); 
    
    // let member = await stub.getState('memberA@acme.org'); //get the car from chaincode state
    // if (!member || member.toString().length <= 0) {
    //   throw new Error('member' + ' does not exist: ');
    // }

    // var memberJson = JSON.parse(member);
    // console.log('util.inspect');
    // console.log(util.inspect(memberJson, {showHidden: false, depth: null}));

    // await stub.putState(args[0], Buffer.from(JSON.stringify(member1)));









    // var listingJson = JSON.parse(listingAsBytes);
    // console.log('util.inspect');
    // console.log(util.inspect(listingJson, {showHidden: false, depth: null}));

    // if (!listingJson.offers) {
    //   console.info('offers is non-existant ');
    //   listingJson.offers = [];
    // }
  
    // listingJson.offers.push(offer);
    // console.log('after push: ' + listingJson);
    // console.log(util.inspect(listingJson, {showHidden: false, depth: null}));

    // await stub.putState(args[0], Buffer.from(JSON.stringify(listingJson)));

    // let listingAsBytes2 = await stub.getState(listing); //get the car from chaincode state
    // if (!listingAsBytes2 || listingAsBytes2.toString().length <= 0) {
    //   throw new Error(listing + ' does not exist: ');
    // }

    // var listingJson2 = JSON.parse(listingAsBytes2);
    // console.info('util.inspect');
    // console.info(util.inspect(listingJson2, {showHidden: false, depth: null}));

            // console.info('#### seller balance before: ' + seller.balance);        
        // seller.balance += highestOffer.bidPrice;
        // console.info('#### seller balance before: ' + seller.balance);   
        // console.info('#### buy balance before: ' + buyer.balance);                
        // buyer.balance -= highestOffer.bidPrice;
        // console.info('#### buy balance after: ' + buyer.balance);                
        // listing.vehicle.owner = buyer;
        // listing.offers = null;