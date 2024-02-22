<script context="module">
    export async function load({api}) {
        const user = await api('/api/user').get({})
        return {
            user,
            async login(request) {
                return api('/api/login').post(request)
            }
        }
    }
</script>

<script>
    let {data} = $props()

    let request = $state({})

    async function onSubmit(e) {
        e.preventDefault()

        const result = await data.login(request)
        
    }
</script>

<svelte:head>
    <script src="https://cdn.tailwindcss.com"></script>
</svelte:head>

Admin Layout

Check if logged in: 
{#if !data.user}
    <slot/>
{:else}
<div class="bg-gray-50 flex flex-col items-center gap-2 justify-center h-screen">
    <form class="bg-white border p-4 flex flex-col gap-2 border-gray-400 rounded w-md" onsubmit={onSubmit}>
        <label class="block">Username: <input class="p-2 border border-gray-200 bg-gray-100 rounded" type="text" bind:value={request.username}></label>
        <label class="block">Password: <input class="p-2 border border-gray-200 bg-gray-100 rounded" type="password" bind:value={request.password}></label>
        <button class="p-2 rounded w-full bg-blue-500 text-white" type="submit">Login</button>
    </form>
    
</div>
{/if}