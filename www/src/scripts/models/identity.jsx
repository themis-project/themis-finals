export default class Identity {
    constructor(props) {
        this.id = props.id
        this.name = props.name
    }

    isTeam() {
        return this.name === 'team'
    }

    isInternal() {
        return this.name === 'internal'
    }

    isGuest() {
        return this.name === 'guest'
    }
}
