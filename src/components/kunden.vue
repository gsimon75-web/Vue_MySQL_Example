<template>
    <div id="kunden">
        <el-row style="text-align: center;height: 40px;">
            <el-col span=8>&nbsp;</el-col>
            <el-col span=8>&nbsp;</el-col>
            <el-col span=8><el-button size="mini" icon="el-icon-refresh" circle @click="aktualisieren"></el-button></el-col>
        </el-row>
        <el-table :data="kunden" style="width: 100%" show-header border @row-click="attributen_zeigen">
            <template slot="empty">No results</template>
            <el-table-column prop="Name" label="Name"></el-table-column>
            <el-table-column prop="Telefonnr" label="Telefonnr"></el-table-column>
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
    name: 'Kunden',

    // other components we require
    components: {
        Row, Col,
        Button, Icon,
        Table, TableColumn,
    },

    // the data of the component instances
    data: function () {
        return {
            kunden: [],
        };
    },

    // the methods of the component
    methods: {

        // refresh the customers' list
        aktualisieren: function () {
            // NOTE: This runs on client-side, so it just sends a request to `rest.js`
            // on the server-side, and that'll actually talk with the DB.
            this.$http.get("/rest/kunde").then(response => {
                if (!response || !response.data)
                    this.kunden = [];
                else
                    this.kunden = response.data;
            });
            EventBus.$emit('kunde-gewaehlt', {KNR: -1, Name: null, Adresse: null, Telefonnr: null});
        },

        // show the details of a customer on the side panel
        attributen_zeigen: function(row, column, event) {
            EventBus.$emit('kunde-gewaehlt', row);
        },
    },

    // lifecycle hook that's invoked when the component is instantiated
    created: function () {
        this.aktualisieren();
        EventBus.$on('kunde-veraendert', () => { this.aktualisieren(); });
    },

}
</script>

<style lang="scss" scoped>
@charset "UTF-8";
</style>

<!-- vim: set sw=4 ts=4 et: -->
