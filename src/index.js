import Vue from 'vue'
import "font-awesome/scss/font-awesome.scss"; 
import "font-proxima-nova-scss/font-proxima-nova-scss.scss"; 
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
locale.use(lang)

import App from './App.vue'

new Vue({
    el: '#app',
    render: h => h(App),
    //template: '<App/>',
    //components: { App }
    data: function () {
        return {
        };
    },
})
// vim: set ts=4 sw=4 et:
