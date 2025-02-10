<template>
    <div class="right-panel">
        <slot />
    </div>
</template>

<style lang="scss" scoped>
.right-panel {
    background-color: var(--background-dark);
    border-radius: 1rem;
    color: white;
    padding: 20px;
}


.right-panel-{
    &-enter{
        &-from {
            opacity: 0;
        }
        
        &-active {
            transition: all 1s ease;
        }
    }
}
</style>