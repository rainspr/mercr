import riot from 'riot'
import route from 'riot-route'
import './app.tag.pug'
import './pray.tag.pug'
import './gp.tag.pug'

riot.compile(function() {
  riot.mount('*')
  route.start(true)
})
