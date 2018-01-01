import riot from "riot"

var mixin = {
  obs: riot.observable()
}
/*
mixin.obs.on('*', (event, args) => {
  console.log('Emit: `' + event + '` ', args || null)
})
*/
module.exports = mixin