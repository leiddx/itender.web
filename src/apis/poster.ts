import Axios from 'axios'

import * as Model from '@/model.js'


export type CreateParams = Omit<Model.Poster, 'id' | 'created'>

export function Create(params: CreateParams) {
	return Axios.post<Model.Poster>('/poster', params)

}

export function Read(id: string) {
	return Axios.get<Model.Poster>(`/poster/${id}`)

}




export type PagingReadParams = {
	skip?: number

	limit?: number

	// 名称
	name?: string

	// 发布单位
	release?: string

	// 分类
	category?: Array<string>


}


/**
 * 分页读取
 */
export function PagingRead(params: PagingReadParams = {}) {
	return Axios.get<Model.Poster[]>('/poster', { params })

}


export type UpdateParams = CreateParams


export function Update(id: string, params: UpdateParams) {
	return Axios.put<Model.Poster>(`/poster/${id}`, params)

}

export function Delete(id: string) {
	return Axios.delete(`/poster/${id}`)

}