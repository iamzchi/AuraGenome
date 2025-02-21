<script setup>
import { ref } from 'vue'
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

import enConfig from 'tdesign-vue-next/es/locale/en_US';

//透明度
const marks1 = {
    0: '0%',
    20: '20%',
    50: '50%',
    70: '70%',
    100: '100%',
};
const value1 = ref(30);

const fillColor = ref('#FFA500'); // 橙色
const strokeColor = ref('#808080'); // 灰色

const exchanging = ref(false);
const exchenge_tracks = (e) => {
    exchanging.value = true;
}
const close_exchenge_tracks = (e) => {
    exchanging.value = false;
}
</script>
<template>
    <t-config-provider :global-config="enConfig">
        <div class="action_container border">
            <div id="exchange_track_panel">
                <div>track1:</div>
                <div>track2:</div>
                <br />
                <br />
                <br />

                <t-button class="btns" shape="" theme="primary" variant="outline">Exchange</t-button>
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
                <t-button class="btns" shape="circle" theme="primary" variant="outline">
                    <t-icon name="download" />
                </t-button>
            </t-tooltip>

            <t-tooltip content="Exchange Tracks" trigger="hover">
                <t-button v-show="!exchanging" @click="exchenge_tracks" class="btns" shape="circle" theme="primary"
                    variant="outline">
                    <t-icon name="swap " />
                </t-button>
                <t-button v-show="exchanging" @click="close_exchenge_tracks" style="margin-bottom: 10px;" class="btns"
                    shape="circle" theme="primary">
                    <t-icon name="swap " />
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
        <div class="console_container border">
            <div id="trackName">
                {{ track.trackName }}
            </div>
            <div class="trackDetail">
                <div class="detailTitle">Display Content</div>
                <div class="detailContent">{{ track.content }}</div>
            </div>
            <div class="trackDetail">
                <div class="detailTitle">Associated Data</div>
                <div class="detailContent">{{ track.associatedData }}</div>
            </div>
            <div class="trackDetail">
                <div class="detailTitle">Explanation</div>
                <div class="detailContent">{{ track.explanation }}</div>
            </div>
            <div class="trackDetail">
                <div class="detailTitle">Elements</div>
                <div class="detailContent">{{ track.elements }}</div>
            </div>
            <div class="trackDetail">
                <div class="detailTitle">Color Palette</div>
                <div class="detailContent">
                    <t-color-picker borderless="false" format="HEX" size="small" class="colorPicker" v-model="color"
                        :show-primary-color-preview="true" />
                    <t-color-picker borderless="false" format="HEX" size="small" class="colorPicker" v-model="color"
                        :show-primary-color-preview="true" />

                </div>
            </div>
            <div class="trackDetail_row">
                <div class="detailTitle">Inner Radius</div>
                <div class="detailContent">
                    <t-input-number style="color:red" theme="column" width="100px" v-model="innerRadius" size="small"
                        :max="15" :min="-2" :format="numberFormat1" auto-width></t-input-number>
                </div>
            </div>
            <div class="trackDetail_row">
                <div class="detailTitle">Outer Radius</div>
                <div class="detailContent">
                    <t-input-number style="color:red" theme="column" width="100px" v-model="innerRadius" size="small"
                        :max="15" :min="-2" :format="numberFormat1" auto-width></t-input-number>
                </div>
            </div>
            <div class="trackDetail_row">
                <div class="detailTitle">Gap</div>
                <div class="detailContent">
                    <t-input-number style="color:red" theme="column" width="100px" v-model="innerRadius" size="small"
                        :max="15" :min="-2" :format="numberFormat1" auto-width></t-input-number>
                </div>
            </div>
            <div class="trackDetail_row">
                <div class="detailTitle">Fill Color</div>
                <div class="detailContent">
                    <t-color-picker borderless="false" format="HEX" size="small" class="colorPicker" v-model="fillColor"
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
                <t-button style="margin-top: 5px;">
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
                <t-button theme="primary" variant="text" size="small">
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
    // width: 100%;
    height: 100%;

    #trackName {
        font-size: 1.3rem;
        font-weight: bold;
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