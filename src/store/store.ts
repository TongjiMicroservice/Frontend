import {createStore} from 'vuex'
import User from '@/models/User'
import Project from '@/models/Project'

export default createStore({
    state(){
        return {
            currentUser:new User(-1,'anonymous','','/default_avatar.png'),
            isLogged:false,
            currentProjectId:-1,
            projects:[] as Project[],
            role:'member',
            hasProject:false
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
        setProjects(state, projects:Project[]){
            console.log('setProjects', projects)
            state.projects = projects
        },
        setRole(state, role:string){
            state.role = role
        },
        setHasProject(state, hasProject:boolean){
            state.hasProject = hasProject
        }
    },
})