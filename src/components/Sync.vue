<template>
    <div class="sync">
        <div ref='waves' class="waves">
            <div v-for='(waves,i) in waves' :key='i' class="wave"></div>
        </div>
        <button class='syncButton' @click='begin' v-if='!hasBegun'>Appuie pour retrouver <br> l'harmonie avec ce totem</button>
        <div v-else class="syncInteraction">
            <button class="tap" ref="tap" @click="handleTap"></button>
        </div>
        
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import gsap from 'gsap'
export default {
    data() {
        return {
            hasBegun:false,
            waves:[]
        }
    },
    mounted(){
        const self=this;

        this.socket.on('totem wave', (wave) => {
            if(self.hasBegun) {
                self.waves.push(wave)
            }
        })
        this.socket.on('totem end listen', (wave) => {
        gsap.to(this.$refs.waves.children, {
            width:'250vh',
            height:'250vh',
            stagger:1,
            duration:2
        })
        })
       
    },
    computed:{
        ...mapGetters(['socket', 'currentTotem'])
    },
    methods:{
        begin(){
            this.socket.emit('totem begin listen', this.currentTotem )
            this.hasBegun = true
        },
        handleTap() {
            console.log('tap!');
        },
     
    }
}
</script>