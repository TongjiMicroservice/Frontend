/*
 * @Author: fengye7 zcj2518529668@163.com
 * @Date: 2023-12-30 11:06:12
 * @LastEditors: fengye7 zcj2518529668@163.com
 * @LastEditTime: 2023-12-30 11:07:21
 * @FilePath: \Frontend\src\store\store.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
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