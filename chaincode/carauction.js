/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 *  SPDX-License-Identifier: Apache-2.0
 */

'use strict';
const shim = require('fabric-shim');
const util = require('util');

let Chaincode = class {

  /**
   * The Init method is called when the Smart Contract 'carauction' is instantiated by the 
   * blockchain network. Best practice is to have any Ledger initialization in separate
   * function -- see initLedger()
   */
  async Init(stub) {
    console.info('=========== Instantiated fabcar chaincode ===========');
    return shim.success();
  }
  /**
   * The Invoke method is called as a result of an application request to run the 
   * Smart Contract 'carauction'. The calling application program has also specified 
   * the particular smart contract function to be called, with arguments
   */
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

  /**
   * The initLedger method is called as a result of instantiating chaincode. 
   * It can be thought of as a constructor for the network. For this network 
   * we will create 3 members, a vehicle, and a vehicle listing.
   */
  async initLedger(stub, args) {
    console.info('============= START : Initialize Ledger ===========');

    let member1 = {};
    member1.balance = 5000;
    member1.firstName = "Amy";
    member1.lastName = "Williams";
    console.info('======After member ===========');

    let member2 = {};
    member2.balance = 5000;
    member2.firstName = "Billy";
    member2.lastName = "Thompson";

    let member3 = {};
    member3.balance = 5000;
    member3.firstName = "Tom";
    member3.lastName = "Werner";

    let vehicle = {};
    vehicle.owner = "memberA@acme.org";

    let vehicleListing = {};
    vehicleListing.reservePrice = 3500;
    vehicleListing.description = "Arium Nova";
    vehicleListing.listingState = "FOR_SALE";
    vehicleListing.offers = "";
    vehicleListing.vehicle = "1234";

    await stub.putState('memberA@acme.org', Buffer.from(JSON.stringify(member1)));
    await stub.putState('memberB@acme.org', Buffer.from(JSON.stringify(member2)));
    await stub.putState('memberC@acme.org', Buffer.from(JSON.stringify(member3)));
    await stub.putState('1234', Buffer.from(JSON.stringify(vehicle)));
    await stub.putState('ABCD', Buffer.from(JSON.stringify(vehicleListing)));

    console.info('============= END : Initialize Ledger ===========');
  }

  /**
   * Query the state of the blockchain by passing in a key  
   * @param arg[0] - key to query 
   * @return value of the key if it exists, else return an error 
   */
  async query(stub, args) {
    console.info('============= START : Query method ===========');
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting 1');
    }

    let query = args[0];

    let queryAsBytes = await stub.getState(query); //get the car from chaincode state
    if (!queryAsBytes || queryAsBytes.toString().length <= 0) {
      throw new Error('key' + ' does not exist: ');
    }
    console.info('query response: ');
    console.info(queryAsBytes.toString());
    console.info('============= END : Query method ===========');

    return queryAsBytes;

  }


  /**
   * Create a vehicle object in the state  
   * @param arg[0] - key for the car (vehicle id number)
   * @param arg[1] - owner of the car - should reference the email of a member
   * onSuccess - create and update the state with a new vehicle object  
   */
  async createVehicle(stub, args) {
    console.info('============= START : Create Car ===========');
    if (args.length != 2) {
      throw new Error('Incorrect number of arguments. Expecting 2');
    }

    var car = {
      owner: args[1]
    };

    await stub.putState(args[0], Buffer.from(JSON.stringify(car)));
    console.info('============= END : Create Car ===========');
  }

  /**
   * Create a vehicle listing object in the state  
   * @param arg[0] - key for the vehicle listing (listing number)
   * @param arg[1] - reservePrice, or the minimum acceptable offer for a vehicle
   * @param arg[2] - description of the object
   * @param arg[3] - state of the listing, can be 'FOR_SALE', 'RESERVE_NOT_MET', or 'SOLD'
   * @param arg[4] - an array of offers for this particular listing
   * @param arg[5] - reference to the vehicle id (vin) which is to be put on auction
   * onSuccess - create and update the state with a new vehicle listing object  
   */
  async createVehicleListing(stub, args) {
    console.info('============= START : Create Car ===========');
    if (args.length != 6) {
      throw new Error('Incorrect number of arguments. Expecting 6');
    }

    var vehicleListing = {
      reservePrice: args[1],
      description: args[2],
      listingState: args[3],
      offers: args[4],
      vehicle: args[5]
    };

    await stub.putState(args[0], Buffer.from(JSON.stringify(vehicleListing)));
    console.info('============= END : Create Car ===========');
  }

  /**
   * Create a member object in the state  
   * @param arg[0] - key for the member (email)
   * @param arg[1] - first name of member
   * @param arg[2] - last name of member
   * @param arg[3] - balance: amount of money in member's account
   * onSuccess - create and update the state with a new member  object  
   */
  async createMember(stub, args) {
    console.info('============= START : Create Car ===========');
    if (args.length != 4) {
      throw new Error('Incorrect number of arguments. Expecting 4');
    }

    var member = {
      firstName: args[1],
      lastName: args[2],
      balance: args[3]
    };

    console.info(member);

    await stub.putState(args[0], Buffer.from(JSON.stringify(member)));
    console.info('============= END : Create Car ===========');
  }

  /**
   * Create a offer object in the state, and add it to the array of offers for that listing  
   * @param arg[0] - bid price in the offer - how much bidder is willing to pay
   * @param arg[1] - listing number: reference to a listing in the state
   * @param arg[2] - member email: reference to member which does not own vehicle
   * onSuccess - create and update the state with a new offer object  
   */
  async makeOffer(stub, args) {
    console.info('============= START : Create Car ===========');
    if (args.length != 3) {
      throw new Error('Incorrect number of arguments. Expecting 3');
    }

    var offer = {
      bidPrice: args[0],
      listing: args[1],
      member: args[2]
    };

    let listing = args[1];
    console.info("listing: " + listing);

    //get reference to listing, to add the offer to the listing later
    let listingAsBytes = await stub.getState(listing);
    if (!listingAsBytes || listingAsBytes.toString().length <= 0) {
      throw new Error('listing does not exist');
    }
    listing = JSON.parse(listingAsBytes);

    //get reference to vehicle, to update it's owner later
    let vehicleAsBytes = await stub.getState(listing.vehicle);
    if (!vehicleAsBytes || vehicleAsBytes.toString().length <= 0) {
      throw new Error('vehicle does not exist');
    }

    let vehicle = JSON.parse(vehicleAsBytes);

    //get reference to member to ensure enough balance in their account to make the bid
    let memberAsBytes = await stub.getState(offer.member); 
    if (!memberAsBytes || memberAsBytes.toString().length <= 0) {
      throw new Error('member does not exist: ');
    }
    let member = JSON.parse(memberAsBytes);

    //check to ensure bidder has enough balance to make the bid
    if (member.balance < offer.bidPrice) {
      throw new Error('The bid is higher than the balance in your account!');
    }

    console.info("vehicle: ");
    console.info(util.inspect(vehicle, { showHidden: false, depth: null }));
    console.info("offer: ");
    console.info(util.inspect(offer, { showHidden: false, depth: null }));


    //check to ensure bidder can't bid on own item!
    if (vehicle.owner == offer.member) {
      throw new Error('owner cannot bid on own item: ');
    }

    console.info('listing response before pushing to offers: ');
    console.info(listing);
    if (!listing.offers) {
      console.info('there are no offers! ');
      listing.offers = [];
    }
    listing.offers.push(offer);

    console.info('listing response after pushing to offers: ');
    console.info(listing);
    await stub.putState(args[1], Buffer.from(JSON.stringify(listing)));

    console.info('============= END : MakeOffer method ===========');

  }

  /** closeBidding 
   * Close the bidding for a vehicle listing and choose the
   * highest bid as the winner. 
   * @param arg[0] - listingId - a reference to our vehicleListing
   * onSuccess - changes the ownership of the car on the auction from the original
   * owner to the highest bidder. Subtracts the bid price from the highest bidder 
   * and credits the account of the seller. Updates the state to include the new 
   * owner and the resulting balances. 
   */
  async closeBidding(stub, args) {
    console.info('============= START : Close bidding ===========');
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting 1');
    }

    let listingKey = args[0];

    //check if listing exists
    let listingAsBytes = await stub.getState(listingKey);
    if (!listingAsBytes || listingAsBytes.toString().length <= 0) {
      throw new Error('listing does not exist: ');
    }
    console.info('============= listing exists ===========');


    var listing = JSON.parse(listingAsBytes);
    console.info('listing: ');
    console.info(util.inspect(listing, { showHidden: false, depth: null }));
    listing.listingState = 'RESERVE_NOT_MET';
    let highestOffer = null;

    //can only close bidding if there are offers
    if (listing.offers && listing.offers.length > 0) {
      listing.offers.sort(function (a, b) {
        return (b.bidPrice - a.bidPrice);
      });

      highestOffer = listing.offers[0];
      console.info('highest Offer: ' + highestOffer);

      //bid must be higher than reserve price, otherwise we can sell the car
      if (highestOffer.bidPrice >= listing.reservePrice) {
        let buyer = highestOffer.member;

        console.info('highestOffer.member: ' + buyer);

        //get the buyer or highest bidder on the vehicle
        let buyerAsBytes = await stub.getState(buyer);
        if (!buyerAsBytes || buyerAsBytes.toString().length <= 0) {
          throw new Error('vehicle does not exist: ');
        }

        buyer = JSON.parse(buyerAsBytes);
        console.info('buyer: ');
        console.info(util.inspect(buyer, { showHidden: false, depth: null }));


        //get reference to vehicle
        let vehicleAsBytes = await stub.getState(listing.vehicle); 
        if (!vehicleAsBytes || vehicleAsBytes.toString().length <= 0) {
          throw new Error('vehicle does not exist: ');
        }

        var vehicle = JSON.parse(vehicleAsBytes);
        //get reference to the seller - or owner of vehicle
        let sellerAsBytes = await stub.getState(vehicle.owner); 
        if (!sellerAsBytes || sellerAsBytes.toString().length <= 0) {
          throw new Error('vehicle does not exist: ');
        }

        let seller = JSON.parse(sellerAsBytes);

        console.info('seller: ');
        console.info(util.inspect(seller, { showHidden: false, depth: null }));

        console.info('#### seller balance before: ' + seller.balance);
        //ensure all strings get converted to ints
        let sellerBalance = parseInt(seller.balance, 10);
        let highOfferBidPrice = parseInt(highestOffer.bidPrice, 10);
        let buyerBalance = parseInt(buyer.balance, 10);

        sellerBalance += highOfferBidPrice;
        seller.balance = sellerBalance;

        console.info('#### seller balance after: ' + seller.balance);
        console.info('#### buyer balance before: ' + buyerBalance);
        buyerBalance -= highestOffer.bidPrice;
        buyer.balance = buyerBalance;
        console.info('#### buyer balance after: ' + buyerBalance);
        console.info('#### buyer balance after: ' + buyerBalance);
        console.info('#### vehicle owner before: ' + vehicle.owner);
        let oldOwner = vehicle.owner;
        //assign person with highest bid as new owner
        vehicle.owner = highestOffer.member;
        console.info('#### vehicle owner after: ' + vehicle.owner);
        console.info('#### buyer balance after: ' + buyerBalance);
        listing.offers = null;
        listing.listingState = 'SOLD';

        //update the balance of the buyer 
        await stub.putState(highestOffer.member, Buffer.from(JSON.stringify(buyer)));
        console.info('old owner: ');
        console.info(util.inspect(oldOwner, { showHidden: false, depth: null }));
        //update the balance of the seller 
        await stub.putState(oldOwner, Buffer.from(JSON.stringify(seller)));
        // update the listing
        await stub.putState(listingKey, Buffer.from(JSON.stringify(listing)));        
      }
    }
    console.info('inspecting vehicle: ');
    console.info(util.inspect(vehicle, { showHidden: false, depth: null }));

    if (highestOffer) {
      //update the owner of the vehicle
      await stub.putState(listing.vehicle, Buffer.from(JSON.stringify(vehicle)));
    } else { throw new Error('offers do not exist: '); }

    console.info('============= END : closeBidding ===========');
  }
};

shim.start(new Chaincode()); 
