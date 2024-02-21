<script context="module">
    export async function load() {
        return {}
    }
</script>

<script>
    let {data} = $props()
</script>

<svelte:head>
    <script src="https://cdn.tailwindcss.com"></script>
</svelte:head>

Admin Layout

<slot/>