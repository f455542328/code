import Axios from 'axios'
let myaxios = {}
myaxios.install = function(vue) {
  var instance = Axios.create({
    baseURL: 'http://localhost:8888/api/private/v1/'
  })
  vue.prototype.$http = instance
}
export default myaxios
