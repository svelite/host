<script context="module">
    export async function load({params, api}) {
        // const project = await api('/projects/' + params.id).get({})
        const project = {
            id: 'abcsoiwd',
            name: 'project-name',
            active_deployment: 'soifdjfd',
            deployments: [
                'soifdjfd',
                'asdfsoij'
            ]
        }

        return {
            project
        }
    }
</script>
<script>
    let {data} = $props()
</script>

project detail
<pre>
{JSON.stringify(data.project, null, 2)}
</pre>