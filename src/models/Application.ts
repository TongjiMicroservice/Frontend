export default class Application{
    userId:number
    name:string
    requestTime:Date
    status:number

    constructor(userId:number,name:string,requestTime:Date,status:number){
        this.userId = userId
        this.name = name
        this.requestTime = requestTime
        this.status = status
    }
}