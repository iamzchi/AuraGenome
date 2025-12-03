<script setup>
import { ref,inject,onMounted,onUnmounted } from 'vue'
import { useChatStore } from '@/stores/useChatStore';
const { addSnapshot } = useChatStore();

const bus = inject('bus');
const track = ref({
    trackName: 'Track 3',
    content: 'Zygosity Mutation Bar',
    associatedData: 'file1.csv',
    explanation: 'To display heterozygous (light orange) and homozygous (dark orange) mutations with 10Mb aggregation.',
    elements: 'Histogram'
})

const color = ref('#0052d9');
const color2 = ref('pink');
const numberFormat1 = (value) => `${value} px`;
const innerRadius = ref(3);
const outerRadius = ref(10);
const gap = ref(2);

import enConfig from 'tdesign-vue-next/es/locale/en_US';
import { deleteTrack, getConsoleInfo } from '@/utils/server';

//透明度
const marks1 = {
    0: '0%',
    20: '20%',
    50: '50%',
    70: '70%',
    100: '100%',
};
const value1 = ref(30);
const change = (val) => {
  const opacity = Number(val) / 100;
  const el = document.getElementById('polar_system');
  if (el) el.style.opacity = String(opacity);
};

const fillColor = ref('#purple'); // 橙色
const strokeColor = ref('#808080'); // 灰色

// 添加下载功能
const downloadSVGAsPNG = () => {
  // 获取SVG元素
  const svgElement = document.querySelector('#circos_chart svg');
  
  if (!svgElement) {
    console.error('未找到SVG元素');
    return;
  }
  
  // 创建Canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // 获取SVG尺寸
  const svgRect = svgElement.getBoundingClientRect();
  canvas.width = svgRect.width;
  canvas.height = svgRect.height;
  
  // 将SVG转为XML字符串
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
  const url = URL.createObjectURL(svgBlob);
  
  // 创建图片对象
  const img = new Image();
  img.onload = function() {
    // 在Canvas上绘制图片
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);
    
    // 将Canvas转为PNG并下载
    const pngUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = 'circos_chart.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  
  img.src = url;
};

const exchanging = ref(false);
const exchenge_tracks = (e) => {
    exchanging.value = true;
    //调用兄弟组件的方法

}
const close_exchenge_tracks = (e) => {
    exchanging.value = false;
}

const tracks_to_exchange = ref([".","."]);
const go_exchenge = () => {
    console.log("go_exchenge", tracks_to_exchange.value);
    
    bus.emit('go_exchange', tracks_to_exchange.value);//发送交换请求
}
const clear_exchenge = () => {
    tracks_to_exchange.value = [];
    bus.emit('send_tracks_to_exchange', tracks_to_exchange.value);
}
onMounted(() => {
    bus.on('send_tracks_to_exchange', (tracks) => {//监听哪两个tracks进行了交换
        tracks_to_exchange.value = tracks;
        console.log("收到的tracks_to_exchange", tracks_to_exchange.value);
    });
    const el = document.getElementById('polar_system');
    if (el) el.style.opacity = String(value1.value / 100);
});

onUnmounted(() => {
    bus.off('send_tracks_to_exchange');
});

watch(value1, (v) => {
  const el = document.getElementById('polar_system');
  if (el) el.style.opacity = String(Number(v) / 100);
});

//更新console面板当前点击的track信息
import { computed, watch } from 'vue';
const store = useChatStore();
const trackInfo = computed(() => store.nowTrackInfo);
console.log("console面板当前点击的track信息", trackInfo);

watch(trackInfo, (newInfo) => {
  if (newInfo && newInfo.color) {
    fillColor.value = newInfo.color;
  }
}, { immediate: true });

const handleDeleteTrack = async () => {
  try {
    const code = store.currentCode;
    const trackId = trackInfo.value && trackInfo.value.id ? trackInfo.value.id : '';
    console.log("删除的trackId", trackId);
    store.addMessage('user', `Delete track ${trackId}`);
    setTimeout(() => {
        store.addMessage('ai', 'Deleting and tweaking the track now – this could take a bit longer than you thought.');
    }, 800);
    const res = await deleteTrack(code, trackId);
    if (res && res.code === 200 && res.generated_code) {
      store.allCodes.push(res.generated_code);
      store.currentCode = res.generated_code;
      try {
        const consoleInfo = await getConsoleInfo(res.generated_code);
        if (Array.isArray(consoleInfo)) {
          store.trackInfo = consoleInfo;
        } else if (consoleInfo && Array.isArray(consoleInfo.data)) {
          store.trackInfo = consoleInfo.data;
        }
      } catch (e) {
        console.error('Get console info failed:', e);
      }
    } else {
      console.error('Delete track failed:', res);
      store.addMessage('ai', '🗑Delete failed. Not your fault, please retry.');
    }
  } catch (e) {
    console.error('Delete track error:', e);
    store.addMessage('ai', '🗑Delete failed. Not your fault, please retry.');
  }
};
</script>
<template>
    <t-config-provider :global-config="enConfig">
        <div class="action_container border">
            <div id="exchange_track_panel" v-if="exchanging">
                <div>track1:{{ tracks_to_exchange[0] }}</div>
                <div>track2:{{ tracks_to_exchange[1] }}</div>
                <br />
                <br />
                <br />

                <t-button @click="go_exchenge" class="btns" shape="" theme="primary" variant="outline">Exchange</t-button>
                <t-button @click="clear_exchenge" class="btns" shape="" theme="default" variant="outline">清空</t-button>
            </div>
            <t-tooltip content="Grab" trigger="hover">
                <t-button class="btns" shape="circle" theme="primary" variant="outline">
                    <t-icon name="wave-left" />
                </t-button>
            </t-tooltip>
            <t-tooltip content="Cursor" trigger="hover">
                <t-button class="btns" shape="circle" theme="primary" variant="outline">
                    <t-icon name="cursor" />
                </t-button>
            </t-tooltip>
            <t-space />
            <t-tooltip content="Download Everything..." trigger="hover">
                <t-button class="btns" shape="circle" theme="primary" variant="outline" @click="downloadSVGAsPNG">
                    <t-icon name="download" />
                </t-button>
            </t-tooltip>

            <t-tooltip content="Exchange Tracks" trigger="hover">
                <t-button v-show="!exchanging" @click="exchenge_tracks" class="btns" shape="circle" theme="primary"
                    variant="outline">
                    <t-icon name="swap" />
                </t-button>
                <t-button v-show="exchanging" @click="close_exchenge_tracks" style="margin-bottom: 10px;" class="btns"
                    shape="circle" theme="primary">
                    <t-icon name="swap" />
                </t-button>
            </t-tooltip>
            <t-tooltip content="Add Tips" trigger="hover">
                <t-button class="btns" shape="circle" theme="primary" variant="outline">
                    <t-icon name="tips" />
                </t-button>
            </t-tooltip>
            <t-tooltip content="Need Help?" trigger="hover">
                <t-button class="btns" shape="circle" theme="primary" variant="outline">
                    <t-icon name="help" />
                </t-button>
            </t-tooltip>
        </div>
        <div class="console_container border" style="display: block;">
            <div id="trackName">
                {{ trackInfo.id?trackInfo.id:track.trackName }}
            </div>
            <div class="trackDetail">
                <div class="detailTitle">Display Content</div>
                <div class="detailContent">{{ trackInfo.title?trackInfo.title:track.content }}</div>
            </div>
            <div class="trackDetail">
                <div class="detailTitle">Associated Data</div>
                <div class="detailContent">{{ trackInfo.file?trackInfo.file:track.associatedData }}</div>
            </div>
            <div class="trackDetail">
                <div class="detailTitle">Explanation</div>
                <div class="detailContent">{{ trackInfo.explanation?trackInfo.explanation:track.explanation }}</div>
            </div>
            <div class="trackDetail">
                <div class="detailTitle">Elements</div>
                <div class="detailContent">{{ trackInfo.type?trackInfo.type:track.elements }}</div>
            </div>
            <div class="trackDetail">
                <div class="detailTitle">Color Palette</div>
                <div class="detailContent">
                    <!-- <t-color-picker borderless="false" format="HEX" size="small" class="colorPicker" v-model="color"
                        :show-primary-color-preview="true" />
                    <t-color-picker borderless="false" format="HEX" size="small" class="colorPicker" v-model="color"
                        :show-primary-color-preview="true" /> -->
                        <img src="/colorp1.png" style="width: 50%;margin-top: .3rem;" alt="color_palette" class="color_palette">

                </div>
            </div>
            <div class="trackDetail_row">
                <div class="detailTitle">Inner Radius</div>
                <div class="detailContent">
                    <t-input-number  style="color:red" theme="column" width="100px" v-model="innerRadius" size="small"
                        :max="15" :min="-2" :format="numberFormat1" auto-width></t-input-number>
                </div>
            </div>
            <div class="trackDetail_row">
                <div class="detailTitle">Outer Radius</div>
                <div class="detailContent">
                    <t-input-number  style="color:red" theme="column" width="100px" v-model="outerRadius" size="small"
                        :max="15" :min="-2" :format="numberFormat1" auto-width></t-input-number>
                </div>
            </div>
            <div class="trackDetail_row">
                <div class="detailTitle">Gap</div>
                <div class="detailContent">
                    <t-input-number  style="color:red" theme="column" width="100px" v-model="gap" size="small"
                        :max="15" :min="-2" :format="numberFormat1" auto-width></t-input-number>
                </div>
            </div>
            <div class="trackDetail_row">
                <div class="detailTitle">Fill Color</div>
                <div class="detailContent">
                    <t-color-picker  borderless="false" format="HEX" size="small" class="colorPicker" v-model="fillColor"
                        :show-primary-color-preview="true" />
                </div>
            </div>
            <div class="trackDetail_row">
                <div class="detailTitle">Stroke Color</div>
                <div class="detailContent">
                    <t-color-picker borderless="false" format="HEX" size="small" class="colorPicker"
                        v-model="strokeColor" :show-primary-color-preview="true" />
                </div>
            </div>
            <div class="trackDetail">
                <div class="detailTitle">Polar coordinate transparency</div>
                <div class="detailContent" style="margin-top: .6rem;">
                    <t-slider v-model="value1" :show-tooltip="true" :marks="marks1" :input-number-props="false"
                        @change="change" />
                </div>
            </div>
            <br />
            <t-divider />
            <div class="trackDetail">
                <div class="detailTitle">Save to SNAPSHOTS</div>
                <t-button style="margin-top: 5px;" @click="addSnapshot">
                    <template #icon>
                        <t-icon name="task-checked" />
                    </template>
                    Save
                </t-button>
            </div>

            <div id="btns">
                <t-button theme="primary" variant="text" size="small">
                    <template #icon>
                        <t-icon name="lightbulb-circle" />
                    </template>
                    Regenerate this track</t-button>
                <t-button theme="primary" variant="text" size="small" @click="handleDeleteTrack">
                    <template #icon>
                        <t-icon name="delete" />
                    </template>
                    Delete this track</t-button>
                <t-button theme="primary" variant="text" size="small">
                    <template #icon>
                        <t-icon name="file-export" />
                    </template>
                    Export Configuration File</t-button>
            </div>
        </div>


    </t-config-provider>
</template>
<style scoped lang="scss">
.action_container {
    position: relative;

    #exchange_track_panel {
        position: absolute;
        top: 0;
        left: -140px;
        width: 130px;
        height: 160px;
        background-color: var(--td-brand-color-7);
        border-radius: 10px;
        border: 1px solid #d6d6d6;
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: white;

        div {
            width: 100%;
            text-align: left;
        }

    }

    display: flex;
    flex-direction: column;
    // justify-content: center;
    align-items: center;
    background-color: white;
    border-radius: 20px;
    padding: 10px;
    // border: 1px solid #d6d6d6;
    width: 50px;
    margin-right: 10px;
    height: fit-content;

    .btns {
        margin-bottom: 10px;
    }

    .btns:last-child {
        margin-bottom: 0;
    }


}

.console_container {
    background: rgb(2, 0, 36);
    background: linear-gradient(164deg, rgba(2, 0, 36, 1) 0%, #deefff 0%, rgba(255, 255, 255, 1) 10%);
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 20px;
    padding: 1.3rem;
    // border: 1px solid #d6d6d6;
    width: 380px;
    height: 100%;

    #trackName {
        font-size: 1.3rem;
        font-weight: bold;
        word-wrap: break-word;
        word-break: break-word;
        overflow-wrap: anywhere;
        white-space: normal;
    }

    .trackDetail {
        display: flex;
        flex-direction: column;
        margin-top: 1rem;

        .detailTitle {
            font-size: .8rem;
            font-weight: bold;
            color: var(--td-gray-color-14);
        }

        .detailContent {
            font-size: 0.8rem;
            color: var(--td-brand-color-6);
            word-wrap: break-word;
            word-break: break-word;
            overflow-wrap: anywhere;
            white-space: normal;

            .colorPicker {
                margin-top: 1rem !important;
            }
        }
    }

    .trackDetail_row {
        display: flex;
        flex-direction: row;
        margin-top: 1rem;
        justify-content: space-between;
        align-items: center;

        .detailTitle {
            font-size: .8rem;
            font-weight: bold;
            color: var(--td-gray-color-14);
        }

        .detailContent {
            font-size: 0.8rem;
            color: var(--td-brand-color-6);
            word-wrap: break-word;
            word-break: break-word;
            overflow-wrap: anywhere;
            white-space: normal;

            .colorPicker {
                margin-top: 1rem !important;
            }
        }
    }
}

#btns {
    position: absolute;
    bottom: 20px;
}
</style>
