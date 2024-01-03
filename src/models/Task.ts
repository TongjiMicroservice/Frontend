export default class Task{
    taskId:number
    name:string
    description:string
    leader:number
    leaderName:string
    deadline:Date
    status:number //0:发布后，1：已提交，2：已完成
    finishedTime:Date
    file:string
    fileName:string
    priority:number

    constructor(id:number, name:string, description:string, leader:number, deadline:Date ,status:number,finishedTime:Date,file:string,leaderName:string,fileName:string,priority:number){
        this.taskId = id
        this.name = name
        this.description = description
        this.leader = leader
        this.leaderName = leaderName
        this.fileName = fileName
        this.deadline = deadline
        this.status = status
        this.finishedTime = finishedTime
        this.file = file
        this.priority = priority
    }
}