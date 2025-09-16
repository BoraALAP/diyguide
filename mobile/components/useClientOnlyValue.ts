/**
 * useClientOnlyValue (native) always resolves to the client value because Expo
 * native apps only render on the client.
 */
// This function is web-only as native doesn't currently support server (or build-time) rendering.
export function useClientOnlyValue<S, C>(server: S, client: C): S | C {
  return client;
}
