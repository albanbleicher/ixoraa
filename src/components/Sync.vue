<template>
    <div class="sync">
        <div ref='waves' class="waves">
            <div v-for='(wave,i) in waves' :key='i' :class="'wave wave-'+i"></div>
        </div>
        <span v-if='currentWave'>{{waveOffset}} </span>
        <transition name="fade" mode='out-in'>
            <button class='syncButton' @click='beginListen' v-if='!hasBegun'>Appuie pour entendre la médolie du totem</button>
        <button class='syncButton' @click='beginSync' v-if='hasBegun && !hasBegunSync'>Appuie pour reproduire la mélodie totem</button>
        <button class='syncButton' v-if='endSync'>Félicitations, tu as terminé la symbiose avec le totem.</button>
        <div v-if='showTap'  class="syncInteraction">
            <button :style='check ?"background:#1E8D88":null ' class="tap" ref="tap" @click="handleTap"></button>
        </div>
        </transition>
        
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import gsap from 'gsap'
export default {
    data() {
        return {
            hasBegun:false,
            hasBegunSync:false,
            endSync:false,
            showTap:false,
            currentNote:0,
            check:false,
            currentWave:null,
            waves:[],
            score:0
        }
    },
    mounted(){
        const self=this;

        this.socket.on('totem wave', (wave) => {
            if(self.hasBegun) {
                self.waves.push(wave)
            }
        })
        this.socket.on('totem end listen', (wave) => window.navigator.vibrate(200))
        this.socket.on('totem end sync', (wave) => {
           if(this.score===4) {
               setTimeout(() => {
                this.showTap=false;
            this.endSync=true
            this.socket.emit('totem success')
           },1500)
           }
           else {
               this.hasBegun=false
                this.showTap=false
               this.hasBegunSync=false
           }
            window.navigator.vibrate(200)
            })
       
    },
    computed:{
        ...mapGetters(['socket', 'currentTotem']),
        waveOffset() {
            return this.currentWave.offsetTop+this.currentWave.offsetHeight
        }
    },
    methods:{
        beginListen(){
            this.socket.emit('totem begin listen', this.currentTotem )
            this.hasBegun = true
        },
        beginSync(){
            console.log('begin sync')
            this.socket.emit('totem begin sync', this.currentTotem )
         setTimeout(() => {
                gsap.to(this.$refs.waves.children, {
            width:'300vh',
            height:'300vh',
            stagger:1,
            duration:4
        })
            const increment = setInterval(()=> {
                if(this.currentNote < (this.waves.length -1)) this.currentNote++
                else clearInterval(increment)
            },1000)
         },1000)
            this.hasBegunSync = true
            this.showTap=true
        },
        handleTap() {
            console.log('currentNote is', this.currentNote)
            const currentWave = this.$refs.waves.children[this.currentNote]
            const pos = parseInt(currentWave.style.height.replace('vh',''));
            console.log(pos);
            if(pos>80&& pos<150) {
                this.check=true
                this.score++
                setTimeout(() => {
                    this.check=false
                },500)
            }
            else {
                this.check=false
            }
        },
    },
}
</script>