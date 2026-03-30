import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { GamePackage, PaymentMethod } from "../backend.d";
import { useActor } from "./useActor";

export function useGamePackages() {
  const { actor, isFetching } = useActor();
  return useQuery<GamePackage[]>({
    queryKey: ["gamePackages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGamePackages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      playerId,
      game,
      packageId,
      paymentMethod,
    }: {
      playerId: string;
      game: string;
      packageId: bigint;
      paymentMethod: PaymentMethod;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createOrder(playerId, game, packageId, paymentMethod);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });
    },
  });
}
