import { default as globals } from './globals'
import { default as session } from './session'
import { default as streams } from './streams'
import { default as chat } from './chat'

const actions = Object.assign({}, globals, session, streams, chat)
export default actions
