const permifySchema = `

entity user {}

entity organization {
    relation admin @user
    relation owner @user
    relation member @user

    action delete = admin
    action read = admin or owner or member
}

entity team {
    relation parent @organization

    relation technical @user @organization#member

    action create = technical or parent.admin
    action update = technical or parent.admin or parent.member
    action delete = parent.admin
}
`
export default permifySchema;