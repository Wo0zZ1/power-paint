import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { AccessRole } from '@power-paint/contracts'

import { AccessService } from '../access/access.service'

import { BoardRepository } from './board.repository'
import type { SavePreviewDto } from './board.dto'
import { PREVIEW_PLACEHOLDER } from './preview.placeholder'

interface PreviewImage {
	contentType: string
	body: Buffer
}

@Injectable()
export class PreviewService {
	constructor(
		private readonly boards: BoardRepository,
		private readonly access: AccessService,
	) {}

	async get(id: string, theme: string | undefined): Promise<PreviewImage> {
		const board = await this.boards.findPreviews(id)
		if (!board) throw new NotFoundException('Board not found')

		// Если снимка для запрошенной темы нет, отдаём тот, что есть:
		// показать доску в чужой теме лучше, чем не показать вовсе.
		const dataUrl =
			theme === 'dark'
				? (board.darkPreview ?? board.lightPreview)
				: (board.lightPreview ?? board.darkPreview)

		// Снимка ещё нет, пока доску не открыли в редакторе. Заглушку отдаёт сервер,
		// чтобы у карточки всегда была картинка, а в консоли не копились 404.
		if (!dataUrl) return PREVIEW_PLACEHOLDER

		const matched = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/)
		if (!matched) throw new NotFoundException('Invalid board preview format')

		const [, contentType, base64Data] = matched

		return { contentType, body: Buffer.from(base64Data, 'base64') }
	}

	// В исходной версии эндпоинт не проверял права вообще - превью мог перезаписать
	// любой, кто знает id доски. Снимок обновляет тот, кто может рисовать.
	async save(id: string, data: SavePreviewDto, userId: string) {
		const board = await this.boards.findById(id)
		if (!board) throw new NotFoundException('Board not found')

		const accessRole = await this.access.toBoard(board, userId)

		if (AccessRole[accessRole] < AccessRole.EDITOR)
			throw new ForbiddenException()

		await this.boards.savePreview(id, data.theme, data.previewDataUrl)

		return { ok: true }
	}
}
