import { WritableSignal } from '@angular/core';

// Some Angular Elements don't fully rebootstrap on attribute-only changes;
// null + yield forces a tear-down before the new element mounts.
export async function remount<T>(slot: WritableSignal<T | null>, next: T): Promise<void> {
  slot.set(null);
  await new Promise((r) => setTimeout(r, 0));
  slot.set(next);
}
