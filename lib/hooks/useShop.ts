"use client";

import { useEffect, useState } from "react";
import { ShopItem, InventoryItem, Character } from "@/types";
import { fetchShopItems, fetchInventory, buyItem } from "@/lib/api/shop";
import { fetchCharacter } from "@/lib/api/character";
import { ApiError } from "@/lib/api/client";

export function useShop() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchShopItems(), fetchInventory(), fetchCharacter()])
      .then(([shopItems, inv, char]) => {
        setItems(shopItems);
        setInventory(inv);
        setCharacter(char);
      })
      .catch((e) =>
        setError(e instanceof ApiError ? e.body.error : "Couldn't load the shop.")
      )
      .finally(() => setLoading(false));
  }, []);

  /** Total quantity owned of a given item (0 if never purchased). */
  function ownedQuantity(itemId: string): number {
    return inventory
      .filter((inv) => inv.item_id === itemId)
      .reduce((sum, inv) => sum + inv.quantity, 0);
  }

  async function purchase(item: ShopItem) {
    setError(null);
    setPurchasingId(item.id);

    const prevCharacter = character;
    if (character) {
      // optimistic: deduct immediately, reconciled with remaining_currency
      // from the server response, rolled back entirely on failure
      setCharacter({ ...character, currency: character.currency - item.price });
    }

    try {
      const res = await buyItem(item.id);
      setCharacter((prev) => (prev ? { ...prev, currency: res.remaining_currency } : prev));
      setInventory((prev) => {
        const existingIndex = prev.findIndex((inv) => inv.item_id === item.id);
        if (existingIndex === -1) return [...prev, res.inventory];
        const copy = [...prev];
        copy[existingIndex] = res.inventory;
        return copy;
      });
    } catch (e) {
      setCharacter(prevCharacter); // rollback the optimistic deduction
      if (e instanceof ApiError) {
        if (e.body.have !== undefined && e.body.need !== undefined) {
          setError(`Not enough gold — need ${e.body.need - e.body.have} more.`);
        } else {
          setError(e.body.error);
        }
      } else {
        setError("Couldn't complete that purchase — try again.");
      }
    } finally {
      setPurchasingId(null);
    }
  }

  return { items, inventory, character, loading, error, purchasingId, ownedQuantity, purchase };
}
