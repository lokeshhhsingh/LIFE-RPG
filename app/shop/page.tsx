"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useShop } from "@/lib/hooks/useShop";
import { ShopList } from "@/components/ShopList";

function ShopContent() {
  const { items, character, loading, error, purchasingId, ownedQuantity, purchase } =
    useShop();

  return (
    <section data-page="shop">
      <h1>Shop</h1>
      <a href="/dashboard">Back to Quest Log</a>

      {character && <p data-component="currency-display">Gold: {character.currency}</p>}
      {error && <p role="alert">{error}</p>}

      {loading ? (
        <p role="status">Loading shop…</p>
      ) : (
        <ShopList
          items={items}
          ownedQuantity={ownedQuantity}
          purchasingId={purchasingId}
          onPurchase={purchase}
        />
      )}
    </section>
  );
}

export default function ShopPage() {
  return (
    <ProtectedRoute>
      <ShopContent />
    </ProtectedRoute>
  );
}
