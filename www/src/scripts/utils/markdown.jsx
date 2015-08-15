import MarkdownIt from 'markdown-it'
import emoji from 'markdown-it-emoji'
import twemoji from 'twemoji'


export default class MarkdownRenderer {
    constructor() {
        this.md = new MarkdownIt()
        this.md.use(emoji, {})
        this.md.renderer.rules.emoji = (token, idx) => {
            return twemoji.parse(token[idx].content)
        }
    }

    render(data) {
        return this.md.render(data)
    }
}
