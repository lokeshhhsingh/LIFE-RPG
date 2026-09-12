import { ShopItem, InventoryItem, BuyItemResponse } from "@/types";
import { apiFetch, ApiError } from "./client";

export async function fetchShopItems(): Promise<ShopItem[]> {
  return apiFetch<ShopItem[]>("/shop");
}

export async function fetchInventory(): Promise<InventoryItem[]> {
  return apiFetch<InventoryItem[]>("/inventory");
}

/**
 * Buying can fail with two structured error shapes worth showing
 * differently in the UI:
 *  - "Not enough currency" comes with { have, need } — show a
 *    "need N more gold" message instead of a generic error toast.
 *  - "You already own this item" — only for badge/theme items.
 * Callers should catch ApiError and inspect err.body for these fields.
 */
export async function buyItem(itemId: string): Promise<BuyItemResponse> {
  try {
    return await apiFetch<BuyItemResponse>("/shop/buy", {
      method: "POST",
      body: JSON.stringify({ item_id: itemId }),
    });
  } catch (err) {
    if (err instanceof ApiError) {
      // Re-throw as-is — err.body.have / err.body.need are available to
      // whatever UI code calls this, e.g.:
      //   if (err.body.have !== undefined) showNeedMoreGold(err.body.need - err.body.have)
      throw err;
    }
    throw err;
  }
}
