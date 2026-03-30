import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Order "mo:core/Order";

actor {
  type GamePackage = {
    id : Nat;
    name : Text;
    diamonds : Nat;
    priceBDT : Nat;
  };

  type OrderStatus = {
    #pending;
    #processing;
    #completed;
  };

  type PaymentMethod = {
    #bKash;
    #nagad;
  };

  type TopUpOrder = {
    id : Nat;
    playerId : Text;
    game : Text;
    packageId : Nat;
    paymentMethod : PaymentMethod;
    status : OrderStatus;
    user : Principal;
  };

  module TopUpOrder {
    public func compare(a : TopUpOrder, b : TopUpOrder) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  let gamePackages = Map.empty<Nat, GamePackage>();
  let topUpOrders = Map.empty<Nat, TopUpOrder>();

  var nextPackageId = 1;
  var nextOrderId = 1;

  public shared ({ caller }) func addGamePackage(name : Text, diamonds : Nat, priceBDT : Nat) : async Nat {
    let packageId = nextPackageId;
    let gamePackage : GamePackage = {
      id = packageId;
      name;
      diamonds;
      priceBDT;
    };
    gamePackages.add(packageId, gamePackage);
    nextPackageId += 1;
    packageId;
  };

  public query ({ caller }) func getGamePackages() : async [GamePackage] {
    gamePackages.values().toArray();
  };

  public shared ({ caller }) func createOrder(playerId : Text, game : Text, packageId : Nat, paymentMethod : PaymentMethod) : async Nat {
    if (not gamePackages.containsKey(packageId)) {
      Runtime.trap("Game package not found");
    };

    let orderId = nextOrderId;
    let order : TopUpOrder = {
      id = orderId;
      playerId;
      game;
      packageId;
      paymentMethod;
      status = #pending;
      user = caller;
    };
    topUpOrders.add(orderId, order);
    nextOrderId += 1;
    orderId;
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, newStatus : OrderStatus) : async () {
    switch (topUpOrders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder : TopUpOrder = {
          id = order.id;
          playerId = order.playerId;
          game = order.game;
          packageId = order.packageId;
          paymentMethod = order.paymentMethod;
          status = newStatus;
          user = order.user;
        };
        topUpOrders.add(orderId, updatedOrder);
      };
    };
  };

  public query ({ caller }) func getAllOrders() : async [TopUpOrder] {
    topUpOrders.values().toArray().sort();
  };

  public query ({ caller }) func getUserOrders(user : Principal) : async [TopUpOrder] {
    topUpOrders.values().toArray().filter(func(o) { o.user == user });
  };
};
