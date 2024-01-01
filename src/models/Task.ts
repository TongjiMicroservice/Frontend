export default class Task{
    taskId:number
    name:string
    description:string
    leader:number
    deadline:Date
    status:number

    constructor(id:number, name:string, description:string, leader:number, deadline:Date ,status:number){
        this.taskId = id
        this.name = name
        this.description = description
        this.leader = leader
        this.deadline = deadline
        this.status = status
    }
}