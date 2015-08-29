export default class LogModel {
    constructor(props) {
        this.type = props.type
        this.params = props.params
        this.updatedAt = new Date()
    }
}
