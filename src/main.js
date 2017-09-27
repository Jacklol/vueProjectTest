import Vue from 'vue'
import ApolloClient, {createBatchingNetworkInterface } from 'apollo-client'
import VueApollo from 'vue-apollo'
import moment from 'moment'

Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('MM/DD/YYYY hh:mm')
  }
})
// Create the apollo client
const apolloClient = new ApolloClient({
  networkInterface: createBatchingNetworkInterface({
    uri: 'https://api.github.com/graphql',
    opts: {
      headers:{
        Authorization: "Bearer 8d76e598b8b5ed6cd803f1a9acd8266bad0d5cac"
      }
    }
  }),
  connectToDevTools: true
})

// Install the vue plugin
Vue.use(VueApollo)

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

import App from './App.vue'

new Vue({
  el: '#app',
  apolloProvider,
  render: h => h(App)
})
