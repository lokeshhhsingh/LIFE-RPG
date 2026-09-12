import { ShopItem } from "@/types";

interface ShopListProps {
  items: ShopItem[];
  ownedQuantity: (itemId: string) => number;
  purchasingId: string | null;
  onPurchase: (item: ShopItem) => void;
}

export function ShopList({ items, ownedQuantity, purchasingId, onPurchase }: ShopListProps) {
  if (items.length === 0) {
    return <p data-component="shop-list-empty">The shop is empty right now.</p>;
  }

  return (
    <ul data-component="shop-list">
      {items.map((item) => {
        const owned = ownedQuantity(item.id);
        const isOneTime = item.type === "badge" || item.type === "theme";
        const alreadyOwned = isOneTime && owned > 0;
        const isPurchasing = purchasingId === item.id;

        return (
          <li key={item.id} data-item-type={item.type}>
            <span>{item.name}</span>
            {item.description && <p>{item.description}</p>}
            <span>{item.price} gold</span>

            {alreadyOwned ? (
              <span data-owned-badge>Owned</span>
            ) : (
              <button
                onClick={() => onPurchase(item)}
                disabled={isPurchasing}
                aria-label={`Buy ${item.name} for ${item.price} gold`}
              >
                {isPurchasing
                  ? "Buying…"
                  : item.type === "item" && owned > 0
                  ? `Buy another (own ${owned})`
                  : "Buy"}
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
