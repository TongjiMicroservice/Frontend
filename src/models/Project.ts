export default class Project {
  id: number
  name: string
  description: string
  scale: number
  leader:number

  constructor(id: number, name: string, description: string, scale: number, leader:number) {
    this.description = description
    this.id = id
    this.name = name
    this.scale = scale
    this.leader = leader
  }
}