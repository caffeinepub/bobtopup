import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface GamePackage {
    id: bigint;
    diamonds: bigint;
    name: string;
    priceBDT: bigint;
}
export interface TopUpOrder {
    id: bigint;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    game: string;
    playerId: string;
    user: Principal;
    packageId: bigint;
}
export enum OrderStatus {
    pending = "pending",
    completed = "completed",
    processing = "processing"
}
export enum PaymentMethod {
    nagad = "nagad",
    bKash = "bKash"
}
export interface backendInterface {
    addGamePackage(name: string, diamonds: bigint, priceBDT: bigint): Promise<bigint>;
    createOrder(playerId: string, game: string, packageId: bigint, paymentMethod: PaymentMethod): Promise<bigint>;
    getAllOrders(): Promise<Array<TopUpOrder>>;
    getGamePackages(): Promise<Array<GamePackage>>;
    getUserOrders(user: Principal): Promise<Array<TopUpOrder>>;
    updateOrderStatus(orderId: bigint, newStatus: OrderStatus): Promise<void>;
}
