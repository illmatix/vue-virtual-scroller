import { ref } from 'vue';
import { useVirtualScroller } from './useVirtualScroller';

test('calculates visibleItems slice', () => {
  const items = Array.from({ length: 100 }, (_, i) => i);
  const container = { value: { scrollTop: 0, clientHeight: 200, addEventListener: () => {}, removeEventListener: () => {} } };
  const { visibleItems } = useVirtualScroller({ items, containerRef: container as any, itemHeight: 20, overscan: 1 });
  expect(visibleItems.value.length).toBeGreaterThan(0);
});
