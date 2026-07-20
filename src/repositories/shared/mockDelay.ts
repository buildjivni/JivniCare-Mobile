/**
 * Cancellable delay for `Mock*Repository` implementations — simulates real network latency so
 * loading-state UI stays honest during development, per Section 6's "Repository Implementations"
 * ("Mock<Domain>Repository ... with artificial latency (via a shared, cancellable
 * mockDelay(ms, signal) utility ... directly fixing the two uncancelled setTimeout patterns
 * found in 02.4)"). Kept inside `src/repositories/shared/` rather than `src/utils/` since it is
 * exclusively a Mock-repository concern, not a general-purpose app utility.
 */
export function mockDelay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }

    const timeoutId = setTimeout(resolve, ms);

    signal?.addEventListener('abort', () => {
      clearTimeout(timeoutId);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}
