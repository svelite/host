<script context="module">
    export async function load({api, reload, redirect}) {
        const {initialized} = await api('/api/initialized').get({})

        if(initialized) {
            return redirect('/')
        }
        return {
            async setup(request) {
                api('/api/setup').post(request)

                location.reload()
            }
        }
    }
</script>
<script lang="ts">
    let {data} = $props()

    let request: any = $state({})

    function onSubmit(e) {
        e.preventDefault()

        data.setup(request)

    }
</script>
First time user installs this project in server. should create account

<form onsubmit={onSubmit}>
<input type="text" bind:value={request.username} />
<input type="password" bind:value={request.password} />

<button type="submit">Setup</button>
</form>
