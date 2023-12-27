import {createStore} from 'vuex'
import User from '@/models/User'

export default createStore({
    state(){
        return {
            currentUser:new User(-1,'anonymous','','/default_avatar.png'),
            isLogged:false,
            currentProjectId:-1,
            projects:[],
            role:'member'
        }
    },
    mutations:{
        login(state, user:User){
            state.currentUser = user
            state.isLogged = true
        },
        logout(state){
            state.currentUser = new User(-1,'anonymous','','/default_avatar.png')
            state.isLogged = false
        },
        setCurrentProjectId(state, projectId:number){
            state.currentProjectId = projectId
        },
        setProjects(state, projects:[]){
            state.projects = projects
        },
        setRole(state, role:string){
            state.role = role
        }
    },
})