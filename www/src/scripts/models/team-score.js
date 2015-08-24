export default class TeamScore {
    constructor(props) {
        this.id = props.id
        this.teamId = props.team_id
        this.defencePoints = props.defence_points
        this.attackPoints = props.attack_points
    }

    get totalPoints() {
        return this.defencePoints + this.attackPoints
    }
}
