const permifySchema = `
entity user {}

entity project {
    relation creator @user
    relation manager @user
    relation contributor @user
    relation viewer @user

    action delete = creator or manager
    action update = creator or manager
    action read = creator or manager or contributor or viewer
}

entity task {
    relation assignedTo @user
    relation project @project

    action create = assignedTo or project.creator or project.manager
    action update = assignedTo or project.manager
    action delete = assignedTo or project.manager
}
`;

export default permifySchema;
