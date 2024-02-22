<script context="module">
    export async function load({ api, base_url }) {
        return {
            api,
            base_url
        };
    }
</script>

<script>
    let { data } = $props();

    let request = $state({})


    async function onSubmit(e) {
        e.preventDefault();

        console.log(request.files[0])
        // upload file 
        const res = await fetch('/api/upload', {
            method: 'POST',
            body: request.files[0]
        }).then(x => x.json())

        const fileId = res.id
        // Deploy 
        const res2 = await data.api('/api/deploy').post({fileId, name: request.name})        

        console.log(res2)
    }
</script>

<h1 class="text-4xl text-center p-12">Svelite Hosting</h1>

<form class="p-12" onsubmit={onSubmit}>
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
            class="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
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
