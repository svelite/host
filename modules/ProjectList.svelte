<script context="module">
    export async function load() {
        const projects = [
            {
                id: "abcsoiwd",
                name: "project-name",
                active_deployment: "soifdjfd",
            },
            {
                id: "iosdifwq",
                name: "another-project",
                active_deployment: "aiosfjww",
            },
            {
                id: "siocvsia",
                name: "site",
                active_deployment: "isoqxoio",
            },
        ];

        return {
            projects
        }
    }
</script>

<script>
    let { data } = $props();
</script>

list of projects

<pre>
{JSON.stringify(data.projects, null, 2)}
</pre>
