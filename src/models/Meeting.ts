export default class Meeting {
    id:string
    projectId:number
    title:string
    description:string
    startTime:Date
    duration:number
    url:string
    bookId:string
  
    constructor(id:string,projectId:number,title:string,description:string,startTime:Date,duration:number,url:string,bookId:string) {
      this.id = id
      this.projectId = projectId
      this.title = title
      this.description = description
      this.startTime = startTime
      this.duration= duration
      this.url = url
      this.bookId= bookId
    }
  }