# Vue 3 Virtual Scroller

vue-virtual-scroller is a tiny, TypeScript-friendly Vue 3 library that lets you render only the visible portion of very
large lists. Just pass in your data array, container ref, and item height—no extra dependencies, no boilerplate—while
enjoying smooth scrolling performance even on tens of thousands of items.

## Installation

`npm install vue-virtual-scroller`

## Usage Example

First, install:

```bash
yarn add vue-virtual-scroller
# or npm install vue-virtual-scroller
```

Then in your Vue 3 component:

```vue
<template>
  <div
          ref="scroller"
          class="scroller"
          @scroll.passive="onScroll"
  >
    <!-- top spacer -->
    <div :style="{ height: paddingTop + 'px' }" />

    <!-- only the visible items -->
    <div
            v-for="item in visibleItems"
            :key="item.id"
            class="item"
    >
      {{ item.label }}
    </div>

    <!-- bottom spacer -->
    <div :style="{ height: paddingBottom + 'px' }" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useVirtualScroller } from 'vue-virtual-scroller'

  // 1. Your full data array:
  const items = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    label: `Item #${i}`,
  }))

  // 2. A ref to the scrolling container:
  const scroller = ref<HTMLElement | null>(null)

  // 3. Activate the scroller:
  const {
    visibleItems,
    paddingTop,
    paddingBottom,
    scrollToIndex,
  } = useVirtualScroller({
    items,
    containerRef: scroller,
    itemHeight: 30,    // each .item is 30px tall
    overscan: 5,       // render 5 extra items above & below
  })

  // (Optional) expose a method to jump to a particular item:
  function onScroll() {
    // you can also react to scroll events here
  }

  // e.g. somewhere in your code:
  // scrollToIndex(500)  // jump so item #500 is at the top
</script>

<style scoped>
  .scroller {
    height: 400px;
    overflow-y: auto;
    border: 1px solid #ddd;
  }

  .item {
    height: 30px;
    display: flex;
    align-items: center;
    padding: 0 8px;
    border-bottom: 1px solid #f0f0f0;
  }
</style>

```

### How it works

1. `paddingTop`/`paddingBottom` keep the scroll bar size correct.
2. `visibleItems` is just the slice you render.
3. Adjust `itemHeight` and `overscan` to trade off between extra DOM nodes and scroll jank.

That’s it—drop the `<div ref="scroller">` into your app anywhere you need high-performance lists!

## API signature and options

```typescript
import { Ref, ComputedRef } from 'vue'

export interface UseVirtualScrollerOptions<T> {
  /** The full array of items to virtualize */
  items: T[]
  /** A `ref` to your scrolling container element (overflow-auto/scroll) */
  containerRef: Ref<HTMLElement | null>
  /** Fixed height of a single item (in pixels) */
  itemHeight: number
  /**
   * Number of extra items to render above and below the viewport
   * @default 2
   */
  overscan?: number
}

export interface UseVirtualScrollerReturn<T> {
  /** The subset of `items` you should actually render */
  visibleItems: ComputedRef<T[]>
  /** Top spacer height in pixels */
  paddingTop: ComputedRef<number>
  /** Bottom spacer height in pixels */
  paddingBottom: ComputedRef<number>
  /** Index of the first rendered item */
  startIndex: ComputedRef<number>
  /** One past the index of the last rendered item */
  endIndex: ComputedRef<number>
  /** How many items fit in the container at once */
  visibleCount: ComputedRef<number>
  /** Scroll the container so that `index` lands at the top */
  scrollToIndex: (index: number) => void
}

/**
 * Creates a Vue composable for virtual‐scrolling a large list.
 *
 * @param options - Configuration options for virtualization
 * @returns an object with reactive fields and helpers
 */
export function useVirtualScroller<T>(
        options: UseVirtualScrollerOptions<T>
): UseVirtualScrollerReturn<T>
```

### Options

| Option         | Type                       | Required | Default | Description                                                |
|----------------|----------------------------|:--------:|:-------:|------------------------------------------------------------|
| `items`        | `T[]`                      |    ✅     |    —    | The full data array you want to virtualize.                |
| `containerRef` | `Ref<HTMLElement \| null>` |    ✅     |    —    | A Vue `ref` pointing at the scrollable container element.  |
| `itemHeight`   | `number`                   |    ✅     |    —    | Fixed pixel height of each item in the list.               |
| `overscan`     | `number`                   |    ❌     |   `2`   | How many extra items to render above + below the viewport. |

### Return Values

| Field           | Type                      | Description                                                                     |
|-----------------|---------------------------|---------------------------------------------------------------------------------|
| `visibleItems`  | `ComputedRef<T[]>`        | The slice of `items` to render based on scroll position and overscan.           |
| `paddingTop`    | `ComputedRef<number>`     | Height (px) of the spacer above `visibleItems` to preserve total scroll height. |
| `paddingBottom` | `ComputedRef<number>`     | Height (px) of the spacer below `visibleItems` to preserve total scroll height. |
| `startIndex`    | `ComputedRef<number>`     | Index of the first item in `visibleItems`.                                      |
| `endIndex`      | `ComputedRef<number>`     | One past the index of the last item in `visibleItems`.                          |
| `visibleCount`  | `ComputedRef<number>`     | Number of items that fit into the container’s viewport (excluding overscan).    |
| `scrollToIndex` | `(index: number) => void` | Imperatively scroll so the given item index floats to the top of the container. |

## Browser support / Vue version

- **Vue:** Built and tested with **Vue 3.2+**. Not compatible with Vue 2.x or earlier.
- **Browsers:** Supports all modern “evergreen” browsers—Chrome, Firefox, Edge, Safari, and Opera.
- **Polyfills:** No additional polyfills required for standard virtual scrolling functionality; relies on basic DOM APIs
  and `ResizeObserver` (included in most modern browsers).
- **SSR:** Can be used in server-side rendering builds (Nuxt 3, Vite SSR), but virtualization only activates in the
  browser (guard against `window`/`document` if rendering on the server).
- **Not supported:** Internet Explorer and legacy browsers without ES Module support.

## License

- **License**  
  This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for full details.
