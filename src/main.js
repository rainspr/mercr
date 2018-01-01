import riot from 'riot'
import './tags' //riotのコンパイラで出力されたtags.js
import observe from './observe.js'

riot.mixin(observe)
riot.mount('*')
