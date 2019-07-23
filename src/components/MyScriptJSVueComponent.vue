<template>
  <div class="msContainer">
    <div
      class="writingcontainer"
      touch-action="none"
      @loaded="loaded"
      @changed="changed($event)"
      @exported="exported($event)"
      ref="editor"
    ></div>
  </div>
</template>

<script>
import MyScriptJS from "myscript/dist/myscript.esm";
import { EventBus } from "@/event.js";

export default {
  name: "myscriptjs-component",
  data() {
    return {
      textContent: "",
      editor: {}
    };
  },
  mounted() {
    // eslint-disable-next-line
    // console.log("Mounted " + this.$refs["editor"]);
    this.editor = MyScriptJS.register(this.$refs.editor, {
      triggerDelay : 500,
      processDelay : 250,
      triggers: {
        exportContent: "QUIET_PERIOD"
      },
      recognitionParams: {
        type: "TEXT",
        protocol: "REST",
        apiVersion: "V4",
        server: {
          applicationKey: "74742281-5a24-4c2d-9f37-853e6636b6f5",
          hmacKey: "c1b7f1fd-64c4-45f7-bc6a-9cb432df60d6"
        },
        v4: {
          lang: "zh_CN",
          text: {
            guides: {
              enable: false
            },
            smartGuide: false
          }
        }
      }
    });
  },
  methods: {
    clear() {
      this.editor.clear();
    },
    loaded() {
      // eslint-disable-next-line
      // console.log("Loaded");
    },
    changed(event) {
      // eslint-disable-next-line
      EventBus.$emit("ms-changed", event);
      // console.log("Changed:", event);
    },
    convert() {
      this.editor.convert();
    },
    export() {
      this.editor.export_();
    },
    exported(event) {
      if (
        event.detail &&
        event.detail.exports &&
        event.detail.exports["text/plain"]
      ) {
        // eslint-disable-next-line
        this.textContent = event.detail.exports["text/plain"];
        //FIXME Use const into event bus instead of strings
        EventBus.$emit("ms-exported", this.textContent);
      } else {
        this.textContent = "";
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import "../../node_modules/myscript/dist/myscript.min.css";

.ms-editor > svg {
  margin: 0px;
}
.ms-editor canvas.ms-rendering-canvas {
  background-image: none;
}
</style>
<style scoped>
/* TODO Adapat the margin to various screen sizes */
.msContainer {
  position: absolute;
  margin: auto;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.writingcontainer {
  min-height: 100%;
  height: 100%;
  /* max-height: 220px; */
  background: transparent;
}
</style>
