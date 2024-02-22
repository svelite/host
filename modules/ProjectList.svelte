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
            projects
        }
    }
</script>

<script>
    let { data } = $props();
</script>

projects

{#each data.projects as project}
    <a href="/{project.id}">
        {project.name}
    </a>
{/each}
<!-- <pre>
{JSON.stringify(data.projects, null, 2)}
</pre> -->
