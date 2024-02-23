<script context="module">
    export async function load({ api, base_url }) {
        return {
            api,
            base_url
        };
    }
</script>

<script>
    let { data, reload } = $props();

    let request = $state({})


    async function onSubmit(e) {
        e.preventDefault();

        // upload file 
        const res = await fetch('/api/upload', {
            method: 'POST',
            body: request.files[0]
        }).then(x => x.json())

        const fileId = res.id
        // Deploy 
        const res2 = await data.api('/api/deploy').post({fileId, name: request.name})        

        reload()
    }
</script>

<h1 class="text-2xl text-start p-12 !pb-4">Deploy new Project</h1>

<form class="p-12 pt-0" onsubmit={onSubmit}>
    <!-- Name Input -->
    <div class="mb-4">
        <label for="name" class="block text-gray-700 font-bold mb-2">
            Name
        </label>
        <input
            type="text"
            id="name"
            bind:value={request.name}
            name="name"
            class="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
        />
    </div>
    <!-- Zip File Input -->
    <div class="mb-4">
        <label for="zipfile" class="block text-gray-700 font-bold mb-2">
            Zip File
        </label>
        <input
            type="file"
            id="zipfile"
            bind:files={request.files}
            name="zipfile"
            class="w-full bg-white border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
        />
    </div>
    <!-- Submit Button -->
    <div>
        <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
            Deploy
        </button>
    </div>
</form>
