<template>
    <div id="ansehen">
        <el-row style="text-align: center;height: 40px;">
            <el-col span=8><el-checkbox v-model="filtern_bei_Kunde">Filtern bei Kunde</el-checkbox></el-col>
            <el-col span=8><el-checkbox v-model="filtern_bei_Wohnung">Filtern be Wohnung</el-checkbox></el-col>
            <el-col span=8><el-button size="mini" icon="el-icon-refresh" circle @click="aktualisieren"></el-button></el-col>
        </el-row>
        <el-table :data="ansehen" style="width: 100%" show-header border @row-click="attributen_zeigen">
            <template slot="empty">No results</template>
            <el-table-column prop="Name" label="Name"></el-table-column>
            <el-table-column prop="WohnungAdresse" label="Wohnung"></el-table-column>
            <el-table-column prop="Angebot" label="Angebot"></el-table-column>
        </el-table>
    </div>
</template>

<script>
import Vue from 'vue'
import {
    Row, Col,
    Checkbox, Button, Icon,
    Table, TableColumn,
} from 'element-ui'

import { EventBus } from '../event-bus.js';

Vue.use(Row)
Vue.use(Col)
Vue.use(Checkbox)
Vue.use(Button)
Vue.use(Icon)
Vue.use(Table)
Vue.use(TableColumn)

export default {

    // name of the component
    name: 'Ansehen',

    // other components we require
    components: {
        Row, Col,
        Checkbox, Button,Icon,
        Table, TableColumn,
    },

    // the data of the component instances
    data: function () {
        return {
            ansehen: [],
            aktive_KNR: -1,
            aktive_WNR: -1,
            filtern_bei_Kunde: false,
            filtern_bei_Wohnung: false,
        };
    },

    // the methods of the component
    methods: {
        aktualisieren: function(old_value, new_value) {
            var self = this;
            var filter_url_part;
            if (this.filtern_bei_Kunde || this.filtern_bei_Wohnung) 
                filter_url_part = "/" + (this.filtern_bei_Kunde ? this.aktive_KNR : -1) +
                                  "/" + (this.filtern_bei_Wohnung ? this.aktive_WNR : -1);
            else
                filter_url_part = "";

            this.$http.get("/rest/ansehen" + filter_url_part).then(response => {
                if (!response || !response.data)
                    self.ansehen = [];
                else
                    self.ansehen = response.data;
            });
        },

        attributen_zeigen: function(row, column, event) {
            EventBus.$emit('kunde-gewaehlt', { KNR: row.KNR, Name: row.Name, Adresse: row.KundeAdresse, Telefonnr: row.Telefonnr});
            EventBus.$emit('wohnung-gewaehlt', { WNR: row.WNR, Adresse: row.WohnungAdresse, Größe: row.Größe, Zimmeranzahl: row.Zimmeranzahl, Mietpreis: row.Mietpreis });
        },
    },

    created: function() {
        this.$watch(
            function () { 
                var dep = [ this.filtern_bei_Kunde, this.filtern_bei_Wohnung ];
                if (this.filtern_bei_Kunde) {
                    dep.push('K');
                    dep.push(this.aktive_KNR);
                }
                if (this.filtern_bei_Wohnung) {
                    dep.push('W');
                    dep.push(this.aktive_WNR);
                }
                return dep;
            },
            this.aktualisieren,
            {
                immediate: true,
            }
        );
        EventBus.$on('kunde-veraendert', () => {
            this.aktualisieren();
        });
        EventBus.$on('wohnung-veraendert', () => {
            this.aktualisieren();
        });
        EventBus.$on('kunde-gewaehlt', (row) => {
            this.aktive_KNR = row.KNR;
        });
        EventBus.$on('wohnung-gewaehlt', (row) => {
            this.aktive_WNR = row.WNR;
        });
    },


}
</script>

<style lang="scss" scoped>
@charset "UTF-8";
</style>

<!-- vim: set sw=4 ts=4 et: -->
