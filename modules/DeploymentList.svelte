<script context="module">
    export async function load({ params, api, redirect, next }) {
        const project = await api("/api/projects/" + params.id).get({});
        // const project = {
        //     id: 'abcsoiwd',
        //     name: 'project-name',
        //     active_deployment: 'soifdjfd',
        //     deployments: [
        //         'soifdjfd',
        //         'asdfsoij'
        //     ]
        // }

        if (!project) {
            // return redirect('/test')
            // return next()
        }

        return {
            project,
            api,
            async upload(file) {
                return fetch("/api/upload", {
                    method: "POST",
                    body: file,
                }).then((res) => res.json());
            },
            async reload() {
                // const project = await api("/api/projects/" + params.id).get({});
                // reload data of module
            },
        };
    }
</script>

<script>
    let { data } = $props();

    let fileUploadEl = $state();

    let loading = $state(false);

    async function rollback(id) {
        await data
            .api("/api/rollback")
            .post({ projectId: data.project.id, deploymentId: id });
    }

    function openDeploy() {
        fileUploadEl.click();
    }

    async function onDeploy(e) {
        loading = true;

        const { id } = await data.upload(e.target.files[0]);
        await data.api("/api/deploy").post({
            fileId: id,
            name: data.project.name,
            projectId: data.project.id,
        });

        loading = false;
    }
</script>

Deployments
<!-- <pre>
{JSON.stringify(data.project, null, 2)}
</pre> -->
<input
    type="file"
    bind:this={fileUploadEl}
    on:change={onDeploy}
    class="hidden"
/>
<button class="p-2 bg-blue-500 text-white" on:click={openDeploy}>
    {#if loading}
        Loading...
    {:else}
        Deploy new version
    {/if}
</button>
<div class="flex flex-col p-4 gap-2">
    {#each data.project.deployments as deployment}
        <div class="p-2 flex items-center justify-between bg-gray-200">
            <div>
                {deployment.id}
            </div>
            {#if deployment.id === data.project.active_deployment}
                <button class="p-2 bg-blue-200 text-blue-700 text-white"
                    >Production</button
                >
            {:else}
                <button
                    onclick={() => rollback(deployment.id)}
                    class="p-2 bg-blue-500 text-white"
                >
                    Rollback
                </button>
            {/if}
        </div>
    {/each}
</div>
