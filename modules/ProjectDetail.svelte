<script context="module">
    export async function load({params, api}) {
        const project = await api('/api/projects/' + params.id).get({})
        

        return {
            project
        }
    }
</script>
<script>
    let {data} = $props()
</script>

project detail
<h1>{data.project.name}</h1>
<pre>
{JSON.stringify(data.project, null, 2)}
</pre>