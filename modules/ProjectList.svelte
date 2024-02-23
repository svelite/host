<script context="module">
    export async function load({api}) {
        const projects = await api('/api/projects').get()

        // const projects = [
        //     {
        //         id: "abcsoiwd",
        //         name: "project-name",
        //         active_deployment: "soifdjfd",
        //     },
        //     {
        //         id: "iosdifwq",
        //         name: "another-project",
        //         active_deployment: "aiosfjww",
        //     },
        //     {
        //         id: "siocvsia",
        //         name: "site",
        //         active_deployment: "isoqxoio",
        //     },
        // ];

        return {
            projects,
            stopProject(project) {
                return api('/api/stop').post({projectId: project.id})
            },
            startProject(project) {
                return api('/api/start').post({
                    projectId: project.id, 
                    deploymentId: project.active_deployment
                })
            }
        }
    }
</script>

<script>
    let { data, reload } = $props();

    async function startProject(e, project) {
        e.stopPropagation()
        data.startProject(project)
        await reload()
    }

    async function stopProject(e, project) {
        e.stopPropagation()

        data.stopProject(project)
        await reload()
    }
</script>

<div class="px-12 mb-12">

<h1 class="text-xl font-bold">Projects</h1>


{#each data.projects as project}
    <div class="mt-4 p-4 flex items-center justify-between border border-gray-200 rounded bg-white">
        <div class="flex gap-2">

            <a href="/{project.id}" class="font-bold">{project.name}</a>
        
        {#if  project.active_deployment}
            <div class="rounded-full p-0.5 px-2 bg-green-500 text-white">Running</div>
            {:else}
            <div class="rounded-full p-0.5 px-2 bg-red-500 text-white">Stopped</div>

        {/if}
    </div>
        
        {#if project.active_deployment}
            <button class="p-2 border border-red-500" on:click={(e) => stopProject(e, project)}>Stop</button>
        {:else}
            <button class="p-2 border border-green-500" on:click={(e) => startProject(e, project)}>Start</button>

        {/if}
</div>
{/each}
</div>

<!-- <pre>
{JSON.stringify(data.projects, null, 2)}
</pre> -->
