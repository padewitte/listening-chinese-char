<template>
  <div class="write" @pointerenter="stopAnimation">
    <div v-if="waitingReco" class="progress-line"></div>

    <transition name="bounce">
      <div v-if="!this.canClear && !this.stopAnim" class="write-here">
        <div class="write-here-logo zoom"></div>
      </div>
    </transition>

    <myscriptjs-component ref="myscriptjsComponent"></myscriptjs-component>
    <div v-if="!this.empty" class="convertion-result">{{currentSymbol}}</div>
    <el-button
      v-if="this.canClear"
      icon="el-icon-refresh"
      class="custobtn toplefttbtn clearbtn"
      :class="{ zoombtn: animClearButton }"
      size="medium"
      @click="clear"
    ></el-button>
    <!-- FIXME consitent naming of action -->
    <el-button
      v-if="!this.empty"
      type="primary"
      class="custobtn toprightbtn listenButton"
      :class="{ zoombtn: animListenButton }"
      size="medium"
      @click="readSymbol"
    ></el-button>
  </div>
</template>

<script>
// @ is an alias to /src
import MyScriptJSVueComponent from "@/components/MyScriptJSVueComponent.vue";
import { EventBus } from "@/event.js";

const synth = window.speechSynthesis;
export default {
  name: "write",
  components: { "myscriptjs-component": MyScriptJSVueComponent },
  props: {},
  data() {
    return {
      speaking: false,
      status: "begin",
      currentSymbol: "",
      canClear: false,
      waitingReco: false,
      threes: false,
      stopAnim: false,
      animListenButton: false,
      animClearButton: false
    };
  },
  watch: {
    // whenever question changes, this function will run
    speaking: function(oldValue, newValue) {
      if (newValue === false) {
        if (this.$refs.currentAnswerRef && this.$refs.currentAnswerRef.$el) {
          this.$refs.currentAnswerRef.$el.focus();
        }
      }
    }
  },
  computed: {
    empty: function() {
      return this.currentSymbol === "";
    }
  },
  methods: {
    stopAnimation() {
      this.stopAnim = true;
    },
    clear() {
      this.canClear = false;
      this.waitingReco = false;
      this.currentSymbol = "";
      this.$refs.myscriptjsComponent.clear();
      this.animListenButton = false;
      this.animClearButton = false;
    },
    speak(sentence) {
      const utterance = new SpeechSynthesisUtterance(sentence);
      utterance.lang = "zh-CN";
      this.speaking = true;
      synth.speak(utterance);
    },
    readSymbol() {
      this.animListenButton = false;
      this.speak(this.currentSymbol);
      this.animClearButton = true;
    }
  },
  created() {},
  mounted() {
    setInterval(() => {
      this.speaking = synth.speaking;
    }, 200);

    // eslint-disable-next-line
    setTimeout(data => {
      this.threes = true;
    }, 3000);

    EventBus.$on("ms-exported", data => {
      if (this.currentSymbol !== data) {
        this.currentSymbol = data;
        this.waitingReco = false;
        this.animListenButton = true;
      }
    });

    EventBus.$on("ms-changed", data => {
      // console.log("changed");
      this.canClear = data.detail.canClear;
      if (this.canClear) {
        this.waitingReco = true;
      }
    });
  }
};
</script>
<style>
.el-icon-refresh {
  position: absolute;
  top: 3px;
  left: 15px;
  max-height: 24px;
}
</style>
<style scoped>
.write {
  margin: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 500px;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #eef2f9;
  -webkit-box-shadow: 10px 10px 20px 0px rgba(223, 231, 245, 1);
  -moz-box-shadow: 10px 10px 20px 0px rgba(223, 231, 245, 1);
  box-shadow: 10px 10px 20px 0px rgba(223, 231, 245, 1);
  border-radius: 4px;
}

.custobtn {
  position: absolute;
  height: 39.4px;
  width: 60px;
  color: #fdfdfe;
  border: none !important;
  --main-color: rgba(0, 0, 0, 0.2);
  box-shadow: 0 2px 8px -2px var(--main-color);
}

.custobtn:over {
  --main-color-accented: rgba(0, 0, 0, 0.5);
  box-shadow: 0 2px 8px -2px var(--main-color-accented);
}

.toprightbtn {
  top: 10px;
  right: 10px;
}

.toplefttbtn {
  top: 10px;
  left: 10px;
}

.clearbtn {
  z-index: 35;
  background-color: #c1d0eb;
}
.clearbtn:active,
.clearbtn:focus,
.clearbtn:hover {
  background-color: #a4bae2;
}

.listenButton:focus,
.listenButton {
  transition: none;
  z-index: 30;
  height: 39.4px;
  width: 60px;
  background: no-repeat center/26px url(../assets/speaking.svg);
  background-color: #6bbe3e;
}

.listenButton:active,
.listenButton:hover {
  background: no-repeat center/26px url(../assets/speaking.svg);
  background-color: #5aa034;
}

.convertion-result {
  position: absolute;
  height: 39.4px;
  top: 10px;
  width: 40%;
  border-radius: 4px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  color: #264174;
  background: #fdfdfe;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  z-index: 25;
}

.write-here-logo {
  height: 100%;
  width: 100%;
  background: no-repeat center/50px
    url(../assets/pencil-striped-symbol-for-interface-edit-buttons.svg);
}

.write-here {
  margin: auto;
  height: 100px;
  width: 100px;
}

.zoom {
  animation: scale 3s linear infinite;
}

@keyframes scale {
  50% {
    transform: scale(1.8);
  }
}

.zoombtn {
  animation: scalebtn 6s linear 2;
  --scale-factor: 1.2;
}

@keyframes scalebtn {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1);
  }
  60% {
    transform: scale(var(--scale-factor));
  }
  70% {
    transform: scale(1);
  }
  80% {
    transform: scale(var(--scale-factor));
  }
  90% {
    transform: scale(1);
  }
  100% {
    transform: scale(1);
  }
}

.progress-line,
.progress-line:before {
  height: 3px;
  width: 100%;
  margin: 0;
}
.progress-line {
  background-color: transparent;
  display: -webkit-flex;
  display: flex;
}
.progress-line:before {
  background-color: #4b76c4;
  content: "";
  -webkit-animation: running-progress 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  animation: running-progress 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
@-webkit-keyframes running-progress {
  0% {
    margin-left: 0px;
    margin-right: 100%;
  }
  50% {
    margin-left: 25%;
    margin-right: 0%;
  }
  100% {
    margin-left: 100%;
    margin-right: 0;
  }
}
@keyframes running-progress {
  0% {
    margin-left: 0px;
    margin-right: 100%;
  }
  50% {
    margin-left: 25%;
    margin-right: 0%;
  }
  100% {
    margin-left: 100%;
    margin-right: 0;
  }
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>

