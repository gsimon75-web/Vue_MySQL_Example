<template>
    <div id="aktive_entitaeten">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-row>
                    <el-col span=12>Aktive Kunde</el-col>
                    <el-col span=3>
                        <el-tooltip placement="bottom" content="Klären">
                            <el-button type="info" size="mini" circle @click="kunde_klaeren" icon="el-icon-document-delete"></el-button>
                        </el-tooltip>
                    </el-col>
                    <el-col span=3>
                        <el-tooltip placement="bottom" content="Registrieren">
                            <el-button type="primary" size="mini" circle @click="neue_kunde" icon="el-icon-document-add"></el-button>
                        </el-tooltip>
                    </el-col>
                    <el-col span=3>
                        <el-tooltip placement="bottom" content="Ändern">
                            <el-button type="primary" size="mini" circle @click="kunde_aendern" icon="el-icon-edit"></el-button>
                        </el-tooltip>
                    </el-col>
                    <el-col span=3>
                        <el-tooltip placement="bottom" content="Löschen">
                            <el-button type="danger" size="mini" circle @click="kunde_loeschen" icon="el-icon-document-remove"></el-button>
                        </el-tooltip>
                    </el-col>
                </el-row>
            </div>
            <el-row>
                <el-col span="8">Name</el-col>
                <el-col span="16"><el-input v-model="aktive_kunde.Name" placeholder="N/A"></el-input></el-col>
            </el-row>
            <el-row>
                <el-col span="8">Adresse</el-col>
                <el-col span="16"><el-input v-model="aktive_kunde.Adresse" placeholder="N/A"></el-input></el-col>
            </el-row>
            <el-row>
                <el-col span="8">Telefon</el-col>
                <el-col span="16"><el-input v-model="aktive_kunde.Telefonnr" placeholder="N/A"></el-input></el-col>
            </el-row>
        </el-card>

        <!-- divider></divider -->
        <el-row>
            <el-col span="2" offset="6"><div class="grid-content"><i class="el-icon-bottom">&nbsp;</i></div></el-col>
        </el-row>
        <el-row>
            <el-col span="2"><div class="grid-content"><i class="el-icon-back">&nbsp;</i></div></el-col>
            <el-col span="10"><el-button type="primary" @click="neues_angebot">Angebot<br>geben</el-button></el-col>
            <el-col span="2"><div class="grid-content"><i class="el-icon-back">&nbsp;</i></div></el-col>
            <el-col span="10"><el-input v-model="neues_angebot_preis"></el-input></el-col>
        </el-row>
        <el-row>
            <el-col span="2" offset="6"><div class="grid-content"><i class="el-icon-top">&nbsp;</i></div></el-col>
        </el-row>

        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-row>
                    <el-col span=12>Aktive Wohnung</el-col>
                    <el-col span=3>
                        <el-tooltip placement="bottom" content="Klären">
                            <el-button type="info" size="mini" circle @click="wohnung_klaeren" icon="el-icon-document-delete"></el-button>
                        </el-tooltip>
                    </el-col>
                    <el-col span=3>
                        <el-tooltip placement="bottom" content="Registrieren">
                            <el-button type="primary" size="mini" circle @click="neue_wohnung" icon="el-icon-document-add"></el-button>
                        </el-tooltip>
                    </el-col>
                    <el-col span=3>
                        <el-tooltip placement="bottom" content="Ändern">
                            <el-button type="primary" size="mini" circle @click="wohnung_aendern" icon="el-icon-edit"></el-button>
                        </el-tooltip>
                    </el-col>
                    <el-col span=3>
                        <el-tooltip placement="bottom" content="Löschen">
                            <el-button type="danger" size="mini" circle @click="wohnung_loeschen" icon="el-icon-document-remove"></el-button>
                        </el-tooltip>
                    </el-col>
                </el-row>
            </div>
            <el-row>
                <el-col span="8">Adresse</el-col>
                <el-col span="16"><el-input v-model="aktive_wohnung.Adresse" placeholder="N/A"></el-input></el-col>
            </el-row>
            <el-row>
                <el-col span="8">Größe</el-col>
                <el-col span="16"><el-input v-model="aktive_wohnung.Größe" placeholder="N/A"></el-input></el-col>
            </el-row>
            <el-row>
                <el-col span="8">Zimmer #</el-col>
                <el-col span="16"><el-input v-model="aktive_wohnung.Zimmeranzahl" placeholder="N/A"></el-input></el-col>
            </el-row>
            <el-row>
                <el-col span="8">Mietpreis</el-col>
                <el-col span="16"><el-input v-model="aktive_wohnung.Mietpreis" placeholder="N/A"></el-input></el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
import Vue from 'vue'
import {
    Row, Col,
    Card, Input, Button, ButtonGroup, Tooltip, Divider,
    Notification,
} from 'element-ui'

import { EventBus } from '../event-bus.js';

Vue.use(Row)
Vue.use(Col)
Vue.use(Card)
Vue.use(Input)
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(Tooltip)
Vue.use(Divider)

const keine_kunde = {
    KNR: -1,
    Name: null,
    Adresse: null,
    Telefonnr: null,
};

const keine_wohnung = {
    WNR: -1,
    Adresse: null,
    Größe: null,
    Zimmeranzahl: null,
    Mietpreis: null,
};

export default {

    // name of the component
    name: 'AktiveEntitaeten',

    // other components we require
    components: {
        Row, Col,
        Card, Input, Button, ButtonGroup, Tooltip, Divider,
        Notification,
    },

    // the data of the component instances
    data: function () {
        return {
            aktive_kunde: keine_kunde,
            aktive_wohnung: keine_wohnung,
            neues_angebot_preis: 0,
        };
    },

    // the methods of the component
    methods: {

        kunde_klaeren: function () {
            this.aktive_kunde = keine_kunde;
        },

        neue_kunde: function () {
            this.$http.post("/rest/kunde", this.aktive_kunde).then(response => {
                if (!response || !response.data)
                    throw {response: {data: {sqlMessage: "No response"}, status: 500 }};
                this.aktive_kunde.KNR = response.data.KNR;
                EventBus.$emit('kunde-veraendert');
            }).catch(error => {
                Notification({
                    title: 'Fehler' ,
                    message: error.response.data.sqlMessage,
                    type: 'error',
                    duration: 3000
                });
            });
        },

        kunde_aendern: function () {
            this.$http.patch("/rest/kunde/" + this.aktive_kunde.KNR, this.aktive_kunde).then(response => {
                if (!response)
                    throw {response: {data: {sqlMessage: "No response"}, status: 500 }};
                EventBus.$emit('kunde-veraendert');
            }).catch(error => {
                Notification({
                    title: 'Fehler' ,
                    message: error.response.data.sqlMessage,
                    type: 'error',
                    duration: 3000
                });
            });
        },

        kunde_loeschen: function () {
            this.$http.delete("/rest/kunde/" + this.aktive_kunde.KNR).then(response => {
                if (!response)
                    throw {response: {data: {sqlMessage: "No response"}, status: 500 }};
                EventBus.$emit('kunde-veraendert');
            }).catch(error => {
                Notification({
                    title: 'Fehler' ,
                    message: error.response.data.sqlMessage,
                    type: 'error',
                    duration: 3000
                });
            });
        },

        wohnung_klaeren: function() {
            this.aktive_wohnung = keine_wohnung;
        },

        neue_wohnung: function() {
            this.$http.post("/rest/wohnung", this.aktive_wohnung).then(response => {
                if (!response || !response.data)
                    throw {response: {data: {sqlMessage: "No response"}, status: 500 }};
                this.aktive_wohnung.WNR = response.data.WNR;
                EventBus.$emit('wohnung-veraendert');
            }).catch(error => {
                Notification({
                    title: 'Fehler' ,
                    message: error.response.data.sqlMessage,
                    type: 'error',
                    duration: 3000
                });
            });
        },

        wohnung_aendern: function() {
            this.$http.patch("/rest/wohnung/" + this.aktive_wohnung.WNR, this.aktive_wohnung).then(response => {
                if (!response)
                    throw {response: {data: {sqlMessage: "No response"}, status: 500 }};
                EventBus.$emit('wohnung-veraendert');
            }).catch(error => {
                Notification({
                    title: 'Fehler' ,
                    message: error.response.data.sqlMessage,
                    type: 'error',
                    duration: 3000
                });
            });
        },

        wohnung_loeschen: function() {
            this.$http.delete("/rest/wohnung/" + this.aktive_wohnung.WNR).then(response => {
                if (!response)
                    throw {response: {data: {sqlMessage: "No response"}, status: 500 }};
                EventBus.$emit('wohnung-veraendert');
            }).catch(error => {
                Notification({
                    title: 'Fehler' ,
                    message: error.response.data.sqlMessage,
                    type: 'error',
                    duration: 3000
                });
            });
        },

        neues_angebot: function() {
            this.$http.post("/rest/ansehen/" + this.aktive_kunde.KNR + "/" + this.aktive_wohnung.WNR, { Angebot: this.neues_angebot_preis }).then(response => {
                if (!response)
                    throw {response: {data: {sqlMessage: "No response"}, status: 500 }};
                EventBus.$emit('wohnung-veraendert');
            }).catch(error => {
                Notification({
                    title: 'Fehler' ,
                    message: error.response.data.sqlMessage,
                    type: 'error',
                    duration: 3000
                });
            });
        },
    },

    // lifecycle hook that's invoked when the component is instantiated
    created: function () {
        EventBus.$on('kunde-gewaehlt', (row) => {
            this.aktive_kunde = Object.assign({}, row);
            this.neues_angebot_preis = null;
        });
        EventBus.$on('wohnung-gewaehlt', (row) => {
            this.aktive_wohnung = Object.assign({}, row);
            this.neues_angebot_preis = null;
        });
    }

}
</script>

<style lang="scss" scoped>
@charset "UTF-8";
.grid-content {
    min-height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>

<!-- vim: set sw=4 ts=4 et: -->
