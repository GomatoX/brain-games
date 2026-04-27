export type UnloadGuardState = {
  /** True while the editor has changes that have not yet been POSTed to /draft */
  dirty: boolean
  /** True while a draft save is in flight */
  saving: boolean
}

/**
 * Returns true when the user should be warned about closing/navigating
 * away. Used by BrandingEditor's beforeunload + pagehide handlers.
 */
export const hasPendingSave = ({ dirty, saving }: UnloadGuardState): boolean =>
  dirty || saving
