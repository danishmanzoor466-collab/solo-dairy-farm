import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  CowId,
  EnquiryInput,
  OrderInput,
  ProductCategory,
  ProductId,
} from "../types";

function useBackendActor() {
  return useActor(createActor);
}

export function useProducts(category?: ProductCategory) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["products", category],
    queryFn: async () => {
      if (!actor) return [];
      if (category) return actor.getProductsByCategory(category);
      return actor.getProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProduct(id: ProductId) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["product", id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProductById(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCows() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["cows"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAvailableCows();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCow(id: CowId) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["cow", id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCowById(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSettings() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.checkIsAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePlaceOrder() {
  const queryClient = useQueryClient();
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async (input: OrderInput) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.placeOrder(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useSubmitEnquiry() {
  const queryClient = useQueryClient();
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async (input: EnquiryInput) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.submitEnquiry(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
    },
  });
}
