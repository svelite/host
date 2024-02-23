<script>
    import { onMount } from "svelte";

    let {title, backUrl} = $props()

    let showShadow = $state(false)

    onMount(() => {
        const el = document.querySelector('.overflow-auto')
        el.addEventListener('scroll', () => {
            if(el.scrollTop === 0) {
                showShadow = false
            } else {
                showShadow = true
            }
        })
    })
</script>

<div class="sticky top-0 p-4 transition-all bg-gray-50 border-b border-gray-200" class:flex={showShadow}  class:items-center={showShadow} class:gap-4={showShadow} class:shadow-xl={showShadow}>
    {#if backUrl}
        <a class="text-sm font-bold text-gray-700" href="{backUrl}">Back</a>
    {:else}
        <!-- <a class="text-sm font-bold text-gray-50">Back</a> -->
    {/if}
    
    
    <h1 class="text-2xl">{title}</h1>
</div>