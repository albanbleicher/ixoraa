<template>
    <div class="inputCode">
        <input v-for='(number,i) in length' :key='i' :ref='"input-"+i' maxlength="1" type="number" @input='(e) => handleTyping(e,i)'>
    </div>
</template>
<script>
export default {
    model: {
    prop: 'code',
    event: 'change'
  },
    props:{
        length:{
            type:Number,
            default:4
        }
    },
    data() {
        return {
            code:''
        }
    },
    mounted() {
        this.$refs['input-0'][0].focus()
    },
    methods:{
        handleTyping(event,key) {
            this.code+=event.target.value
            console.log('code is', this.code)
            if(key<(this.length-1)) {
                this.$refs['input-'+(key+1)][0].focus()
            }
            else {
                this.$refs['input-'+(this.length-1)][0].blur()
                this.$emit('change', this.code)

            }

        }
    }
}
</script>