/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/

'use strict';
const shim = require('fabric-shim');
const util = require('util');
//sd
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

  async queryVehicle(stub, args) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting CarNumber ex: CAR01');
    }
    let vin = args[0];

    let carAsBytes = await stub.getState(vin); //get the car from chaincode state
    if (!carAsBytes || carAsBytes.toString().length <= 0) {
      throw new Error(vin + ' does not exist: ');
    }
    console.info('beforeCarAsyBytesToString: ')
    console.info(carAsBytes.toString());
    return carAsBytes;
  }

  async initLedger(stub, args) {
    console.info('============= START : Initialize Ledger ===========');
    let cars = [];
    cars.push({
      make: 'Toyota',
      model: 'Prius',
      color: 'blue',
      owner: 'Tomoko'
    });
    cars.push({
      make: 'Ford',
      model: 'Mustang',
      color: 'red',
      owner: 'Brad'
    });
    cars.push({
      make: 'Hyundai',
      model: 'Tucson',
      color: 'green',
      owner: 'Jin Soo'
    });
    cars.push({
      make: 'Volkswagen',
      model: 'Passat',
      color: 'yellow',
      owner: 'Max'
    });
    cars.push({
      make: 'Tesla',
      model: 'S',
      color: 'black',
      owner: 'Adriana'
    });
    cars.push({
      make: 'Peugeot',
      model: '205',
      color: 'purple',
      owner: 'Michel'
    });
    cars.push({
      make: 'Chery',
      model: 'S22L',
      color: 'white',
      owner: 'Aarav'
    });
    cars.push({
      make: 'Fiat',
      model: 'Punto',
      color: 'violet',
      owner: 'Pari'
    });
    cars.push({
      make: 'Tata',
      model: 'Nano',
      color: 'indigo',
      owner: 'Valeria'
    });
    cars.push({
      make: 'Holden',
      model: 'Barina',
      color: 'brown',
      owner: 'Shotaro'
    });

    for (let i = 0; i < cars.length; i++) {
      cars[i].docType = 'car';
      await stub.putState('CAR' + i, Buffer.from(JSON.stringify(cars[i])));
      console.info('Added <--> ', cars[i]);
    }
    console.info('============= END : Initialize Ledger ===========');
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
      listingId: args[0],
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
      email: args[0],
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
      email: args[0],
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

    console.info('offer: ');    
    console.info(offer);

    //get listing
    let listing = args[1];
    console.info("listing: " + listing);    
    
    let listingAsBytes = await stub.getState(listing); //get the car from chaincode state
    if (!listingAsBytes || listingAsBytes.toString().length <= 0) {
      throw new Error(listing + ' does not exist: ');
    }

    var listingJson = JSON.parse(listingAsBytes);
    console.log('util.inspect');
    console.log(util.inspect(listingJson, {showHidden: false, depth: null}));

    if (!listingJson.offers) {
      console.info('offers is non-existant ');
      listingJson.offers = [];
    }
  
    listingJson.offers.push(offer);
    console.log('after push: ' + listingJson);
    console.log(util.inspect(listingJson, {showHidden: false, depth: null}));

    await stub.putState(args[0], Buffer.from(JSON.stringify(listingJson)));

    let listingAsBytes2 = await stub.getState(listing); //get the car from chaincode state
    if (!listingAsBytes2 || listingAsBytes2.toString().length <= 0) {
      throw new Error(listing + ' does not exist: ');
    }

    var listingJson2 = JSON.parse(listingAsBytes2);
    console.info('util.inspect');
    console.info(util.inspect(listingJson2, {showHidden: false, depth: null}));

    console.info('============= END : Create Car ===========');
  }

  /** closeBidding 
   * Close the bidding for a vehicle listing and choose the
   * highest bid that is over the asking price
   * args[0] - listingId - a reference to our vehicleListing
   */
  async closeBidding(stub, args) {
    console.info('============= START : Create Car ===========');
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting 5');
    }

    //check if this listing exists
    let listingKey = args[0];
    
    let listingAsBytes = await stub.getState(listingKey); //get the car from chaincode state
    if (!listingAsBytes || listingAsBytes.toString().length <= 0) {
      throw new Error(vin + ' does not exist: ');
    }

    var listing = JSON.parse(listingAsBytes);
    let highestOffer = null;

    if (listing.offers && listing.offers.length > 0) {
      listing.offers.sort(function(a, b) {
        return (b.bidPrice - a.bidPrice);
      });

      highestOffer = listing.offers[0];

      if (highestOffer.bidPrice >= listing.reservePrice) {
        let buyer = highestOffer.member;
        let seller = listing.vehicle.owner;
        //give money to seller
        console.info('#### seller balance before: ' + seller.balance);        
        seller.balance += highestOffer.bidPrice;
        console.info('#### seller balance before: ' + seller.balance);   
        console.info('#### buy balance before: ' + buyer.balance);                
        buyer.balance -= highestOffer.bidPrice;
        console.info('#### buy balance after: ' + buyer.balance);                
        listing.vehicle.owner = buyer;

        listing.offers = null;

      }


    }

    if (highestOffer) {
      let vehicleAsBytes = await stub.putState(listing.vehicle); //get the car from chaincode state
      if (!vehicleAsBytes || vehicleAsBytes.toString().length <= 0) {
        throw new Error(vin + ' does not exist: ');
      }

      await stub.putState(args[0], Buffer.from(JSON.stringify(listing.vehicle)));
      
      console.info('#### buy balance after: ' + vehicle);                      


    }

    
    

    await stub.putState(args[0], Buffer.from(JSON.stringify(car)));
    console.info('============= END : Create Car ===========');
  }
};

shim.start(new Chaincode());






// async queryAllCars(stub, args) {
  
//       let startKey = 'CAR0';
//       let endKey = 'CAR999';
  
//       let iterator = await stub.getStateByRange(startKey, endKey);
  
//       let allResults = [];
//       while (true) {
//         let res = await iterator.next();
  
//         if (res.value && res.value.value.toString()) {
//           let jsonRes = {};
//           console.log(res.value.value.toString('utf8'));
  
//           jsonRes.Key = res.value.key;
//           try {
//             jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
//           } catch (err) {
//             console.log(err);
//             jsonRes.Record = res.value.value.toString('utf8');
//           }
//           allResults.push(jsonRes);
//         }
//         if (res.done) {
//           console.log('end of data');
//           await iterator.close();
//           console.info(allResults);
//           return Buffer.from(JSON.stringify(allResults));
//         }
//       }
//     }
  
//     async changeCarOwner(stub, args) {
//       console.info('============= START : changeCarOwner ===========');
//       if (args.length != 2) {
//         throw new Error('Incorrect number of arguments. Expecting 2');
//       }
  
//       let carAsBytes = await stub.getState(args[0]);
//       let car = JSON.parse(carAsBytes);
//       car.owner = args[1];
  
//       await stub.putState(args[0], Buffer.from(JSON.stringify(car)));
//       console.info('============= END : changeCarOwner ===========');
//     }
//   };