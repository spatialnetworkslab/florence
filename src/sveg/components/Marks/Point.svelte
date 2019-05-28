<script>
    export let x
    export let y

    export let radius = 3
    export let fill = 'black'
</script>

<circle cx={x} cy={y} r={radius} {fill} />