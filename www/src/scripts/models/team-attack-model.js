export default class TeamAttackModel {
    constructor(props) {
        this.id = props.id
        this.occuredAt = new Date(props.occured_at)
        this.teamId = props.team_id
    }
}
