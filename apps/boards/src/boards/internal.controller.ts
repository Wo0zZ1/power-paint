import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'

import { AccessService } from '../access/access.service'

import { BoardRepository } from './board.repository'

// Внутренний эндпоинт для collab: на апгрейде до WebSocket он спрашивает,
// что этому пользователю можно на этом холсте. Инвариант доступа остаётся
// здесь, а не расползается по шлюзу и realtime-сервису.
@ApiExcludeController()
@Controller('internal/boards')
export class InternalBoardsController {
	constructor(
		private readonly boards: BoardRepository,
		private readonly access: AccessService,
	) {}

	@Get(':id/access')
	async getAccess(@Param('id') id: string, @Query('userId') userId?: string) {
		const board = await this.boards.findById(id)
		if (!board) throw new NotFoundException('Board not found')

		return { accessRole: await this.access.toBoard(board, userId) }
	}
}
