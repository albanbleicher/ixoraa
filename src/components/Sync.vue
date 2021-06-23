<template>
    <div class="sync">
        <button @click='begin' v-if='!hasBegun'>Appuie pour retrouver l'harmonie avec ce totem</button>
        <div v-else class="syncInteraction">
            <button class="tap" ref="tap" @click="handleTap"></button>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            hasBegun:false
        }
    },
    computed:{
        ...mapGetters(['socket', 'currentTotem'])
    },
    methods:{
        begin(){
            this.socket.emit('totem begin', this.currentTotem )
            this.hasBegun = true
        },
        handleTap() {
            console.log('tap!');
        }
    }
}
</script>