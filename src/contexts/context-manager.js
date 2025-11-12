/*
 * The context manager singleton handles transitions between different contexts
 *
 */

class ContextManager {
  current = null

  change (context) {
    if (this.current) {
      this.current.exit()
    }

    this.current = context
    this.current.enter()
  }
}
export const contextManager = new ContextManager()
