import { useSyncExternalStore } from 'react';
import { versionManager } from './versionManager';

export function useVersionManagerSnapshot() {
  return useSyncExternalStore(
    versionManager.subscribe,
    versionManager.getSnapshotId,
    versionManager.getSnapshotId,
  );
}
