<template>
    <div id="app" class="main-body">
        <el-container>
            <el-header height="auto">
                <el-row>
                    <el-col span=12><h1>Maklerbüro "TT"</h1></el-col>
                    <el-col span=12 style="padding-top: 12px; text-align: right;"><h2>Tel.: 1-234-5678</h2></el-col>
                </el-row>
            </el-header>

            <el-main>

                <el-container>
                    <el-main>
                        <el-tabs v-model="aktive_tab" type="border-card" stretch="false" @tab-click="handleClick">
                            <el-tab-pane name="Kunden">
                                <div slot="label"><i class="fa fa-user"></i><br>Kunden</div>
                                <kunden></kunden>
                            </el-tab-pane>
                            <el-tab-pane name="Wohnungen">
                                <div slot="label"><i class="fa fa-home"></i><br>Wohnungen</div>
                                <wohnungen></wohnungen>
                            </el-tab-pane>
                            <el-tab-pane name="Ansehen">
                                <div slot="label"><i class="fa fa-binoculars"></i><br>Ansehen</div>
                                <ansehen></ansehen>
                            </el-tab-pane>
                        </el-tabs>
                    </el-main>

                    <el-aside>
                        <br>
                        <aktive-entitaeten></aktive-entitaeten>
                    </el-aside>
                </el-container>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import Vue from 'vue'
Vue.config.devtools = true

import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

import {
    Container, Header, Main, Aside,
    Row, Col,
    Card, Input, Button, ButtonGroup, Tooltip,
    Tabs, TabPane,
} from 'element-ui'

Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Row)
Vue.use(Col)
Vue.use(Card)
Vue.use(Input)
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(Tooltip)
Vue.use(Tabs)
Vue.use(TabPane)

import Kunden from './components/kunden.vue'
import Wohnungen from './components/wohnungen.vue'
import Ansehen from './components/ansehen.vue'
import AktiveEntitaeten from './components/aktive-entitaeten.vue'

export default {
    name: 'MaklerBuro',
    components: {
        Container, Header, Main, Aside,
        Row, Col,
        Card, Input, Button, ButtonGroup, Tooltip,
        Tabs, TabPane,
        Kunden, Wohnungen, Ansehen,
        AktiveEntitaeten,
    },
    data () {
        return {
            aktive_tab: 'Kunden',
        };
    },
    methods: {
    }
}
</script>


<style lang="scss">
@charset "UTF-8";
@import "el-theme/common/var.scss";

#app {
    font-family: "Proxima Nova Lt", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #fcfcff;
    color: $--color-text-regular;
}

.el-header {
    background: #0890a0;
    color: #ffffc0;
}

.el-card, .el-tabs__content {
    background-image: linear-gradient(#ffffff, #e8e8ff);
}

h1 {
    font-family: "Proxima Nova Bl", Helvetica, Arial, sans-serif;
    font-size: 24pt;
    font-weight: bold;
    text-align: left;
}

.main-body .el-tabs__item span, .main-body .el-tabs__item {
    font-size: 8pt;
}

.main-body .el-tabs__item {
    padding-top: 6pt;
    height: 48pt;
}

.main-body .el-tabs__item div {
    text-align: center;
}

.main-body .el-tabs__item i { 
    font-size: 16pt;
}

.el-button-group {
    display: flex;
}

.el-button-group .el-button {
    flex: 1;
}

.just-centered {
    display: flex;
    justify-content: center;
    align-items: center;
}

</style>

<!-- vim: set ts=4 sw=4 et: -->
