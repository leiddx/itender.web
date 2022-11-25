import Mitt from 'mitt'

type KeyUpEvent = {
	esc?: null

}

export const keyup = Mitt<KeyUpEvent>()


export type MenuEvent = {
	'P.A.CirclePlus': void

	onSubMenuRefresh: string
	onSubMenuOperate: string
	onSubMenuSearch: string
}

export const menu = Mitt<MenuEvent>()
