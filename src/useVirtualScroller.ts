import {ref, computed, onMounted, onUnmounted, watch, Ref} from 'vue';

interface UseVirtualScrollerOptions<T> {
    items: T[];
    containerRef: Ref<HTMLElement | null>;
    itemHeight: number;
    overscan?: number;
}

export function useVirtualScroller<T>({
                                          items,
                                          containerRef,
                                          itemHeight,
                                          overscan = 2,
                                      }: UseVirtualScrollerOptions<T>) {
    const scrollTop = ref(0);
    const containerHeight = ref(0);

    const visibleCount = computed(() =>
        Math.ceil(containerHeight.value / itemHeight)
    );

    const startIndex = computed(() =>
        Math.max(0, Math.floor(scrollTop.value / itemHeight) - overscan)
    );

    const endIndex = computed(() =>
        Math.min(
            items.length,
            startIndex.value + visibleCount.value + overscan * 2
        )
    );

    const visibleItems = computed(() =>
        items.slice(startIndex.value, endIndex.value)
    );

    const paddingTop = computed(() => startIndex.value * itemHeight);
    const paddingBottom = computed(
        () => (items.length - endIndex.value) * itemHeight
    );

    function onScroll() {
        if (containerRef.value) {
            scrollTop.value = containerRef.value.scrollTop;
        }
    }

    function onResize() {
        if (containerRef.value) {
            containerHeight.value = containerRef.value.clientHeight;
        }
    }

    function scrollToIndex(index: number) {
        if (containerRef.value) {
            containerRef.value.scrollTop = index * itemHeight;
        }
    }

    onMounted(() => {
        if (containerRef.value) {
            containerHeight.value = containerRef.value.clientHeight;
            containerRef.value.addEventListener('scroll', onScroll);
            window.addEventListener('resize', onResize);
        }
    });

    onUnmounted(() => {
        if (containerRef.value) {
            containerRef.value.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
        }
    });

    watch(
        containerRef,
        (newEl: HTMLElement | null, oldEl: HTMLElement | null) => {
            if (oldEl) oldEl.removeEventListener('scroll', onScroll);
            if (newEl) {
                containerHeight.value = newEl.clientHeight;
                newEl.addEventListener('scroll', onScroll);
            }
        }
    );

    return {
        visibleItems,
        paddingTop,
        paddingBottom,
        scrollToIndex,
        startIndex,
        endIndex,
        visibleCount,
    };
}

