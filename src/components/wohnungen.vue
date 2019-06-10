<template>
    <div id="wohnungen">
        <el-row style="text-align: center;height: 40px;">
            <el-col span=8>&nbsp;</el-col>
            <el-col span=8>&nbsp;</el-col>
            <el-col span=8><el-button size="mini" icon="el-icon-refresh" circle @click="aktualisieren"></el-button></el-col>
        </el-row>
        <el-table :data="wohnungen" style="width: 100%" show-header border @row-click="attributen_zeigen">
            <template slot="empty">No results</template>
            <el-table-column prop="Adresse" label="Adresse"></el-table-column>
            <el-table-column prop="Größe" label="Größe"></el-table-column>
        </el-table>
    </div>
</template>

<script>
import Vue from 'vue'
import {
    Row, Col,
    Button, Icon,
    Table, TableColumn,
} from 'element-ui'

import { EventBus } from '../event-bus.js';

Vue.use(Row)
Vue.use(Col)
Vue.use(Button)
Vue.use(Icon)
Vue.use(Table)
Vue.use(TableColumn)

export default {

    // name of the component
    name: 'Wohnungen',

    // other components we require
    components: {
        Row, Col,
        Button, Icon,
        Table, TableColumn,
    },

    // the data of the component instances
    data: function () {
        return {
            wohnungen: [],
        };
    },

    // the methods of the component
    methods: {

        // refresh the customers' list
        aktualisieren: function () {
            // NOTE: This runs on client-side, so it just sends a request to `rest.js`
            // on the server-side, and that'll actually talk with the DB.
            this.$http.get("/rest/wohnung").then(response => {
                if (!response || !response.data)
                    this.wohnungen = [];
                else
                    this.wohnungen = response.data;
            });
            EventBus.$emit('wohnung-gewaehlt', { WNR: -1, Adresse: null, Mietpreis: null, Größe: null, Zimmeranzahl: null });
        },

        // show the details of a flat on the side panel
        attributen_zeigen: function(row, column, event) {
            EventBus.$emit('wohnung-gewaehlt', row);
        },
    },

    // lifecycle hook that's invoked when the component is instantiated
    created: function () {
        this.aktualisieren();
        EventBus.$on('wohnung-veraendert', () => { this.aktualisieren(); });
    },
}
</script>

<style lang="scss" scoped>
@charset "UTF-8";
</style>

<!-- vim: set sw=4 ts=4 et: -->
