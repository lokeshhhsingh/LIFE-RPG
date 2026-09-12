// Life RPG — Shared API Types
// Source: backend's types.ts (authoritative). Do not diverge from this
// without updating both sides — this is the contract.

export interface User {
  user_id: string; // uuid
}

export interface Task {
  id: number; // int8, auto-increment — NOT a string, watch for this
  created_at: string; // ISO timestamp
  user_id: string; // uuid
  title: string;
  attribute: string; // freeform string, MUST match a key used in Character.attributes
  xp_value: number;
  completed: boolean;
  completed_at: string | null;
}

export interface Character {
  id: string; // uuid
  user_id: string; // uuid
  level: number;
  current_xp: number; // progress toward NEXT level only — resets to 0 on level-up, NOT cumulative
  currency: number;
  attributes: Record<string, number>; // e.g. { "strength": 40, "intellect": 30 }
  streak_count: number;
  last_completed_date: string | null; // "YYYY-MM-DD"
  created_at: string;
}

export type ShopItemType = "badge" | "theme" | "item";
// badge/theme = one-time unlock per user (repurchase rejected)
// item        = stackable, can be bought multiple times (increments quantity)

export interface ShopItem {
  id: string; // uuid
  name: string;
  description: string | null;
  price: number;
  type: ShopItemType;
}

export interface InventoryItem {
  id: string; // uuid
  user_id: string; // uuid
  item_id: string; // uuid, references ShopItem.id
  quantity: number;
  shop_items: ShopItem; // joined in automatically by GET /inventory — plural key name, singular value
}

// ---- Endpoint response shapes ----

export interface AuthResponse {
  message?: string; // only on signup
  user_id: string;
  access_token?: string; // ⚠️ may be undefined on signup if email confirmation is required
}

export interface LoginResponse {
  access_token: string;
  user_id: string;
}

export interface TaskUpdateResponseSimple {
  task: Task;
  leveled_up: false;
  // character, xp_gained, currency_gained are ABSENT on this shape
}

export interface TaskUpdateResponseWithReward {
  task: Task;
  character: Character;
  leveled_up: boolean;
  xp_gained: number;
  currency_gained: number;
}

export type TaskUpdateResponse =
  | TaskUpdateResponseSimple
  | TaskUpdateResponseWithReward;

export function isCompletionResponse(
  res: TaskUpdateResponse
): res is TaskUpdateResponseWithReward {
  return "character" in res;
}

export interface BuyItemResponse {
  message: string;
  item: ShopItem;
  inventory: InventoryItem;
  remaining_currency: number;
}

export interface ApiErrorBody {
  error: string;
  have?: number; // present only on "Not enough currency" errors
  need?: number;
}

// ---- Frontend-only convenience types (not from backend) ----

// Backend never returns email anywhere (not even GET /me — just user_id).
// Capture it client-side at login/signup time if you need to display it.
export interface LocalUser {
  user_id: string;
  email: string;
}
